/**
 * dsh-azure-glass — Plugin Update Manager & Mermaid Runtime backend service.
 *
 * Features:
 *  - Lists installed third-party plugins in the active DSH profile (excluding @deepseek-ai/*)
 *  - Concurrent update check via npm registry & raw.githubusercontent.com (no GitHub API rate-limit hit)
 *  - Enable / disable plugins via host pluginManager or safe cordis.patch.yml fallback
 *  - Update plugins via host pluginManager or official `dsh plugin` CLI fallback
 *  - On-demand Mermaid runtime serving with local disk cache (works offline after first fetch)
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const SAFE_PKG_NAME_RE = /^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+$/i;
const UPDATE_CACHE_TTL_MS = 3 * 60 * 1000;
let updateCheckCache = { at: 0, results: {} };

function resolveDshHome() {
  try {
    const envHome = typeof process.env.DSH_HOME === 'string' ? process.env.DSH_HOME.trim() : '';
    if (envHome) return envHome;
  } catch {}
  return path.join(os.homedir(), '.dsh');
}

export function resolveProfileContext(pluginDir) {
  const candidates = [];
  // 1. Walk up from pluginDir (e.g. ~/.dsh/profiles/desktop/node_modules/dsh-azure-glass)
  if (pluginDir) {
    let cur = path.resolve(pluginDir);
    for (let i = 0; i < 6; i++) {
      const parent = path.dirname(cur);
      if (path.basename(cur) === 'node_modules' && fs.existsSync(path.join(parent, 'package.json'))) {
        candidates.push(parent);
        break;
      }
      if (parent === cur) break;
      cur = parent;
    }
  }
  const dshHome = resolveDshHome();
  candidates.push(path.join(dshHome, 'profiles', 'desktop'));
  candidates.push(path.join(dshHome, 'profiles', 'web'));

  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, 'package.json'))) {
      return {
        profileDir: dir,
        profileName: path.basename(dir),
        pkgPath: path.join(dir, 'package.json'),
        patchPath: path.join(dir, 'cordis.patch.yml'),
        nodeModulesDir: path.join(dir, 'node_modules')
      };
    }
  }
  return null;
}

function compareSemver(a, b) {
  const pa = String(a || '').replace(/^v/i, '').split('-')[0].split('.').map((n) => Number.parseInt(n, 10) || 0);
  const pb = String(b || '').replace(/^v/i, '').split('-')[0].split('.').map((n) => Number.parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length, 3); i++) {
    const da = pa[i] || 0;
    const db = pb[i] || 0;
    if (da !== db) return da > db ? 1 : -1;
  }
  return 0;
}

function parsePatchDisabledMap(patchPath) {
  const byId = new Map();
  const byName = new Map();
  if (!fs.existsSync(patchPath)) return { byId, byName };
  try {
    const lines = fs.readFileSync(patchPath, 'utf-8').split(/\r?\n/);
    let curId = '';
    let curName = '';
    let curDisabled = undefined;
    const flush = () => {
      if (curId && curDisabled !== undefined) byId.set(curId, curDisabled);
      if (curName && curDisabled !== undefined) byName.set(curName, curDisabled);
    };
    for (const line of lines) {
      const mId = line.match(/^- id:\s*['"]?([^'"\s]+)['"]?\s*$/);
      if (mId) {
        flush();
        curId = mId[1];
        curName = '';
        curDisabled = undefined;
        continue;
      }
      if (!curId) continue;
      const mName = line.match(/^  name:\s*['"]?([^'"\s]+)['"]?\s*$/);
      if (mName) curName = mName[1];
      const mDis = line.match(/^  disabled:\s*(true|false)\s*$/);
      if (mDis) curDisabled = (mDis[1] === 'true');
    }
    flush();
  } catch {}
  return { byId, byName };
}

function resolvePluginRowIds(nodeModulesDir, pkgName) {
  const ids = [];
  try {
    const pkgDir = path.join(nodeModulesDir, ...pkgName.split('/'));
    const patchFile = path.join(pkgDir, 'cordis.patch.yml');
    if (fs.existsSync(patchFile)) {
      const txt = fs.readFileSync(patchFile, 'utf-8');
      const re = /- id:\s*['"]?([^'"\s]+)['"]?/g;
      let m;
      while ((m = re.exec(txt)) !== null) {
        if (!ids.includes(m[1])) ids.push(m[1]);
      }
    }
  } catch {}
  return ids;
}

function classifySource(spec) {
  const s = String(spec || '').trim();
  if (s.startsWith('link:')) return { kind: 'local-link', spec: s };
  if (s.startsWith('file:')) return { kind: 'local-file', spec: s };
  const ghMatch = s.match(/^(?:github:|git\+https:\/\/github\.com\/)([^/#]+)\/([^/#.]+?)(?:\.git)?(?:#(.+))?$/i);
  if (ghMatch) {
    return { kind: 'github', owner: ghMatch[1], repo: ghMatch[2], ref: ghMatch[3] || '', spec: s };
  }
  return { kind: 'npm', spec: s };
}

function normalizeRepoUrl(raw) {
  if (!raw) return '';
  let s = typeof raw === 'string' ? raw.trim() : (typeof raw?.url === 'string' ? raw.url.trim() : '');
  if (!s) return '';
  s = s.replace(/^git\+/, '');
  if (/^github:/i.test(s)) {
    s = `https://github.com/${s.replace(/^github:/i, '').replace(/^\/+/, '')}`;
  } else if (/^git@github\.com:/i.test(s)) {
    s = `https://github.com/${s.replace(/^git@github\.com:/i, '')}`;
  } else if (/^ssh:\/\/git@github\.com\//i.test(s)) {
    s = `https://github.com/${s.replace(/^ssh:\/\/git@github\.com\//i, '')}`;
  } else if (/^git:\/\//i.test(s)) {
    s = `https://${s.slice(6)}`;
  } else if (/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(s)) {
    s = `https://github.com/${s}`;
  }
  s = s.replace(/\.git$/i, '').replace(/#.*$/, '');
  if (/^https?:\/\//i.test(s)) return s;
  return '';
}

function resolvePluginRepoUrl(pkgMeta, src, pkgName) {
  const fromRepo = normalizeRepoUrl(pkgMeta?.repository);
  if (fromRepo) return fromRepo;
  const fromHome = normalizeRepoUrl(pkgMeta?.homepage);
  if (fromHome) return fromHome;
  if (src?.kind === 'github' && src.owner && src.repo) {
    return `https://github.com/${src.owner}/${src.repo}`;
  }
  if (src?.kind === 'npm' && pkgName) {
    return `https://www.npmjs.com/package/${encodeURIComponent(pkgName).replace(/%2F/gi, '/')}`;
  }
  return '';
}

export function listInstalledPlugins(pluginDir) {
  const prof = resolveProfileContext(pluginDir);
  if (!prof) return { ok: false, error: 'DSH profile directory not found', plugins: [] };

  let pkgJson = {};
  try {
    pkgJson = JSON.parse(fs.readFileSync(prof.pkgPath, 'utf-8'));
  } catch (err) {
    return { ok: false, error: err?.message || 'failed to read profile package.json', plugins: [] };
  }

  const deps = pkgJson.dependencies && typeof pkgJson.dependencies === 'object' ? pkgJson.dependencies : {};
  const disabledMap = parsePatchDisabledMap(prof.patchPath);
  const plugins = [];

  for (const [pkgName, spec] of Object.entries(deps)) {
    if (pkgName.startsWith('@deepseek-ai/')) continue;
    const pkgDir = path.join(prof.nodeModulesDir, ...pkgName.split('/'));
    let installedVersion = '';
    let description = '';
    let requiresDsh = '';
    let pkgMeta = null;
    try {
      const p = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf-8'));
      pkgMeta = p;
      installedVersion = typeof p.version === 'string' ? p.version : '';
      description = typeof p.description === 'string' ? p.description.slice(0, 140) : '';
      requiresDsh = p?.dsh?.engines?.dsh || p?.engines?.dsh || '';
    } catch {}

    const src = classifySource(spec);
    const repoUrl = resolvePluginRepoUrl(pkgMeta, src, pkgName);
    const rowIds = resolvePluginRowIds(prof.nodeModulesDir, pkgName);
    let enabled = true;
    if (disabledMap.byName.has(pkgName)) {
      enabled = !disabledMap.byName.get(pkgName);
    } else if (rowIds.length > 0) {
      const anyExplicitlyEnabled = rowIds.some((id) => disabledMap.byId.get(id) === false);
      const allDisabled = rowIds.every((id) => disabledMap.byId.get(id) === true);
      if (allDisabled) enabled = false;
      else if (anyExplicitlyEnabled) enabled = true;
    }

    const cached = updateCheckCache.results[pkgName] || null;
    plugins.push({
      name: pkgName,
      spec: String(spec),
      sourceKind: src.kind,
      githubRepo: src.kind === 'github' ? `${src.owner}/${src.repo}` : '',
      repoUrl,
      installedVersion: installedVersion || String(spec).replace(/^[\^~]/, ''),
      description,
      requiresDsh,
      rowIds,
      enabled,
      isSelf: pkgName === 'dsh-azure-glass',
      updateInfo: cached
    });
  }

  plugins.sort((a, b) => {
    if (a.isSelf !== b.isSelf) return a.isSelf ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return {
    ok: true,
    profileName: prof.profileName,
    count: plugins.length,
    checkedAt: updateCheckCache.at,
    plugins
  };
}

async function fetchLatestForPlugin(item) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);
  try {
    if (item.sourceKind === 'npm') {
      const r = await fetch(`https://registry.npmjs.org/${encodeURIComponent(item.name)}/latest`, {
        headers: { Accept: 'application/json', 'User-Agent': 'dsh-azure-glass' },
        signal: controller.signal
      });
      if (!r.ok) return { checked: false, error: `HTTP ${r.status}` };
      const j = await r.json();
      const latestVersion = typeof j.version === 'string' ? j.version.trim() : '';
      const requiresDsh = j?.dsh?.engines?.dsh || j?.engines?.dsh || '';
      const hasUpdate = Boolean(latestVersion && compareSemver(latestVersion, item.installedVersion) > 0);
      return { checked: true, latestVersion, hasUpdate, requiresDsh, url: `https://www.npmjs.com/package/${item.name}` };
    }

    if (item.sourceKind === 'github' && item.githubRepo) {
      const r = await fetch(`https://raw.githubusercontent.com/${item.githubRepo}/HEAD/package.json`, {
        headers: { 'User-Agent': 'dsh-azure-glass' },
        signal: controller.signal
      });
      if (!r.ok) return { checked: false, error: `HTTP ${r.status}` };
      const j = await r.json();
      const latestVersion = typeof j.version === 'string' ? j.version.trim() : '';
      const requiresDsh = j?.dsh?.engines?.dsh || j?.engines?.dsh || '';
      const hasUpdate = Boolean(latestVersion && compareSemver(latestVersion, item.installedVersion) > 0);
      return { checked: true, latestVersion, hasUpdate, requiresDsh, url: `https://github.com/${item.githubRepo}` };
    }

    return { checked: true, localOnly: true, hasUpdate: false, latestVersion: item.installedVersion };
  } catch (err) {
    return { checked: false, error: err?.name === 'AbortError' ? 'timeout' : (err?.message || 'network error') };
  } finally {
    clearTimeout(timer);
  }
}

export async function checkAllPluginUpdates(pluginDir, { force = false } = {}) {
  const listed = listInstalledPlugins(pluginDir);
  if (!listed.ok) return listed;

  const now = Date.now();
  if (!force && updateCheckCache.at && (now - updateCheckCache.at) < UPDATE_CACHE_TTL_MS) {
    return listed;
  }

  const queue = [...listed.plugins];
  const results = {};
  const concurrency = 6;
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      results[item.name] = await fetchLatestForPlugin(item);
    }
  });
  await Promise.all(workers);

  updateCheckCache = { at: Date.now(), results };
  return listInstalledPlugins(pluginDir);
}

export async function togglePluginEnabled(ctx, pluginDir, pkgName, enabled) {
  if (!SAFE_PKG_NAME_RE.test(String(pkgName || ''))) {
    return { ok: false, error: 'invalid package name' };
  }
  if (pkgName === 'dsh-azure-glass') {
    return { ok: false, error: '不能在此处停用苍蓝琉璃自身' };
  }

  const prof = resolveProfileContext(pluginDir);
  if (!prof) return { ok: false, error: 'profile not found' };

  const rowIds = resolvePluginRowIds(prof.nodeModulesDir, pkgName);
  const targetIds = rowIds.length > 0 ? rowIds : [pkgName];

  // Try official host pluginManager first if available
  try {
    const pm = typeof ctx?.get === 'function' ? ctx.get('pluginManager') : null;
    if (pm && typeof pm.setPluginEnabled === 'function') {
      for (const id of targetIds) {
        await pm.setPluginEnabled(id, Boolean(enabled));
      }
      return { ok: true, pkgName, enabled: Boolean(enabled), via: 'pluginManager', needsRestart: false };
    }
  } catch {}

  // Fallback: safely update cordis.patch.yml
  try {
    const patchPath = prof.patchPath;
    if (fs.existsSync(patchPath)) {
      const bakPath = `${patchPath}.bak-azure-glass`;
      if (!fs.existsSync(bakPath)) fs.copyFileSync(patchPath, bakPath);
    }
    const raw = fs.existsSync(patchPath) ? fs.readFileSync(patchPath, 'utf-8') : '';
    const eol = raw.includes('\r\n') ? '\r\n' : '\n';
    const lines = raw ? raw.split(/\r?\n/) : [];
    const disStr = enabled ? 'false' : 'true';
    const handled = new Set();

    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^- id:\s*['"]?([^'"\s]+)['"]?\s*$/);
      if (!m || !targetIds.includes(m[1])) continue;
      handled.add(m[1]);
      let j = i + 1;
      let disIdx = -1;
      while (j < lines.length && !lines[j].startsWith('- ')) {
        if (/^  disabled:\s*(true|false)\s*$/.test(lines[j])) disIdx = j;
        j++;
      }
      if (disIdx >= 0) lines[disIdx] = `  disabled: ${disStr}`;
      else lines.splice(i + 1, 0, `  disabled: ${disStr}`);
    }

    for (const id of targetIds) {
      if (handled.has(id)) continue;
      lines.push(`- id: ${id}`);
      lines.push(`  disabled: ${disStr}`);
    }

    fs.writeFileSync(patchPath, lines.join(eol), 'utf-8');
    return { ok: true, pkgName, enabled: Boolean(enabled), via: 'cordis.patch.yml', needsRestart: true };
  } catch (err) {
    return { ok: false, error: err?.message || 'failed to update cordis.patch.yml' };
  }
}

function resolveBundledPnpmScript() {
  const dshHome = resolveDshHome();
  const execDir = path.dirname(process.execPath || '');
  const candidates = [
    path.join(dshHome, 'dsh-runtimes', 'dsh-primary-runtime', 'dependencies', 'pnpm', 'bin', 'pnpm.cjs'),
    path.join(dshHome, 'dsh-runtimes', 'dsh-primary-runtime', 'dependencies', 'pnpm', 'bin', 'pnpm.mjs'),
    execDir ? path.resolve(execDir, '..', '..', 'pnpm', 'bin', 'pnpm.cjs') : '',
    execDir ? path.resolve(execDir, '..', '..', 'pnpm', 'bin', 'pnpm.mjs') : ''
  ].filter(Boolean);
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {}
  }
  return '';
}

export async function updateInstalledPlugin(ctx, pluginDir, pkgName) {
  if (!SAFE_PKG_NAME_RE.test(String(pkgName || ''))) {
    return { ok: false, error: 'invalid package name' };
  }
  const listed = listInstalledPlugins(pluginDir);
  if (!listed.ok) return { ok: false, error: listed.error };
  const item = listed.plugins.find((p) => p.name === pkgName);
  if (!item) return { ok: false, error: 'plugin not found in profile' };
  if (item.sourceKind !== 'npm' && item.sourceKind !== 'github') {
    return { ok: false, error: '本地链接/离线包不支持自动在线更新' };
  }

  const targetSpec = item.sourceKind === 'npm'
    ? `${item.name}@latest`
    : `github:${item.githubRepo}`;

  // 1. Try host pluginManager if available
  try {
    const pm = typeof ctx?.get === 'function' ? ctx.get('pluginManager') : null;
    if (pm && typeof pm.install === 'function') {
      await pm.install(targetSpec);
      delete updateCheckCache.results[pkgName];
      return { ok: true, pkgName, spec: targetSpec, via: 'pluginManager', needsRestart: true };
    }
  } catch {}

  const prof = resolveProfileContext(pluginDir);
  if (!prof) return { ok: false, error: 'profile not found' };

  const execDir = path.dirname(process.execPath || '');
  const childEnv = {
    ...process.env,
    PATH: execDir ? `${execDir}${path.delimiter}${process.env.PATH || ''}` : (process.env.PATH || '')
  };

  // 2. Prefer DSH bundled pnpm.cjs via process.execPath (cross-platform, avoids Windows .cmd EINVAL & PATH issues)
  const pnpmScript = resolveBundledPnpmScript();
  if (pnpmScript) {
    try {
      const { stdout, stderr } = await execFileAsync(process.execPath, [pnpmScript, 'add', targetSpec], {
        cwd: prof.profileDir,
        env: childEnv,
        timeout: 120000,
        windowsHide: true
      });
      delete updateCheckCache.results[pkgName];
      return {
        ok: true,
        pkgName,
        spec: targetSpec,
        via: 'bundled-pnpm',
        needsRestart: true,
        output: String(stdout || stderr || '').slice(-400)
      };
    } catch (err) {
      return {
        ok: false,
        error: err?.stderr ? String(err.stderr).slice(-320) : (err?.message || 'bundled pnpm update failed')
      };
    }
  }

  // 3. Fallback to `dsh plugin` or system `pnpm` (with shell: true on Windows for .cmd shims)
  const fallbacks = [
    {
      via: 'dsh-cli',
      bin: process.platform === 'win32' ? 'dsh.cmd' : 'dsh',
      args: ['plugin', '--profile', prof.profileName, 'add', targetSpec],
      cwd: prof.profileDir
    },
    {
      via: 'system-pnpm',
      bin: process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
      args: ['add', targetSpec],
      cwd: prof.profileDir
    }
  ];

  let lastErr = '未找到可用的 DSH/pnpm 更新程序';
  for (const fb of fallbacks) {
    try {
      const { stdout, stderr } = await execFileAsync(fb.bin, fb.args, {
        cwd: fb.cwd,
        env: childEnv,
        timeout: 120000,
        windowsHide: true,
        shell: process.platform === 'win32'
      });
      delete updateCheckCache.results[pkgName];
      return {
        ok: true,
        pkgName,
        spec: targetSpec,
        via: fb.via,
        needsRestart: true,
        output: String(stdout || stderr || '').slice(-400)
      };
    } catch (err) {
      lastErr = err?.stderr ? String(err.stderr).slice(-320) : (err?.message || lastErr);
    }
  }

  return { ok: false, error: lastErr };
}

// ---------------------------------------------------------------------------
// On-demand Mermaid runtime server (local cache + CDN auto-fetch)
// ---------------------------------------------------------------------------
const MERMAID_CDN_URLS = [
  'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js',
  'https://unpkg.com/mermaid@11/dist/mermaid.min.js'
];

export async function serveMermaidBundle(req, res, storeDir) {
  const vendorDir = path.join(storeDir, 'vendor');
  const cacheFile = path.join(vendorDir, 'mermaid.min.js');

  const sendFile = (filePath) => {
    const stat = fs.statSync(filePath);
    res.writeHead(200, {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Content-Length': stat.size,
      'Cache-Control': 'public, max-age=86400'
    });
    fs.createReadStream(filePath).pipe(res);
  };

  if (fs.existsSync(cacheFile) && fs.statSync(cacheFile).size > 50000) {
    sendFile(cacheFile);
    return;
  }

  // Try fetching from public CDN once and caching locally
  for (const url of MERMAID_CDN_URLS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'dsh-azure-glass' }, signal: controller.signal });
      clearTimeout(timer);
      if (!r.ok) continue;
      const text = await r.text();
      if (text.length < 50000) continue;
      fs.mkdirSync(vendorDir, { recursive: true });
      const tmp = `${cacheFile}.tmp-${process.pid}`;
      fs.writeFileSync(tmp, text, 'utf-8');
      fs.renameSync(tmp, cacheFile);
      sendFile(cacheFile);
      return;
    } catch {
      clearTimeout(timer);
    }
  }

  res.statusCode = 502;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ error: 'mermaid runtime unavailable' }));
}
