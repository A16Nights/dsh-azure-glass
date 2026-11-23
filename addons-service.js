import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODULES_DIR = path.join(__dirname, 'modules');

const CLIENT_BUNDLE_MAP = {
  'drag-and-drop': path.join(MODULES_DIR, 'drag-and-drop', 'client.js'),
  'chat-link-actions': path.join(MODULES_DIR, 'chat-link-actions', 'client.js'),
  'conversation-search': path.join(MODULES_DIR, 'conversation-search', 'client.js')
};

const STANDALONE_PKG_MAP = {
  cookieGuard: 'dsh-cookie-guard',
  dragAndDrop: '@omdsh-dev/dsh-drag-and-drop',
  chatLinkActions: 'dsh-chat-link-actions',
  conversationSearch: 'dsh-conversation-search'
};

function isStandalonePluginActive(ctx, key) {
  try {
    if (key === 'conversationSearch' && ctx.get && ctx.get('conversationSearch')) {
      return true;
    }
    const pkgName = STANDALONE_PKG_MAP[key];
    if (!pkgName) return false;
    // Check Cordis runtime registry for standalone plugin already loaded
    const registry = ctx?.root?.registry;
    if (registry && typeof registry.values === 'function') {
      for (const state of registry.values()) {
        const name = state?.plugin?.name || state?.runtime?.name || '';
        if (name === pkgName || (pkgName.includes('/') && name === pkgName.split('/').pop())) {
          return true;
        }
      }
    }
  } catch {}
  return false;
}

export function createAddonsManager(ctx, getConfig) {
  const forks = {
    cookieGuard: null,
    dragAndDrop: null,
    chatLinkActions: null,
    conversationSearch: null
  };

  const status = {
    cookieGuard: { state: 'idle', message: '' },
    dragAndDrop: { state: 'idle', message: '' },
    chatLinkActions: { state: 'idle', message: '' },
    conversationSearch: { state: 'idle', message: '' }
  };

  let loadedMods = null;

  async function ensureModulesLoaded() {
    if (loadedMods) return loadedMods;
    const [cookieGuard, dragAndDrop, chatLinkActions, conversationSearch] = await Promise.all([
      import('./modules/cookie-guard/index.js').catch((e) => ({ __loadError: e })),
      import('./modules/drag-and-drop/index.js').catch((e) => ({ __loadError: e })),
      import('./modules/chat-link-actions/index.js').catch((e) => ({ __loadError: e })),
      import('./modules/conversation-search/index.js').catch((e) => ({ __loadError: e }))
    ]);
    loadedMods = { cookieGuard, dragAndDrop, chatLinkActions, conversationSearch };
    return loadedMods;
  }

  function disposeFork(key) {
    const f = forks[key];
    forks[key] = null;
    if (f && typeof f.dispose === 'function') {
      try { f.dispose(); } catch {}
    }
  }

  async function syncModule(key, enabled, mod, pluginConfig) {
    if (!enabled) {
      disposeFork(key);
      status[key] = { state: 'disabled', message: '已在工坊中关闭' };
      return;
    }

    if (mod?.__loadError) {
      disposeFork(key);
      status[key] = { state: 'error', message: String(mod.__loadError?.message || mod.__loadError) };
      return;
    }

    // If we already hold an active fork for this module, keep it (unless cookieGuard config changed)
    if (forks[key]) {
      status[key] = { state: 'active', message: '由苍蓝琉璃内置运行中' };
      return;
    }

    // Check if standalone plugin is already active to avoid double-registration conflicts
    if (isStandalonePluginActive(ctx, key)) {
      status[key] = { state: 'yielded', message: '检测到独立原版插件运行中，已自动让位防冲突' };
      return;
    }

    try {
      const pluginObj = {
        name: `dsh-azure-glass:${key}`,
        inject: mod.inject || [],
        apply: mod.apply
      };
      forks[key] = ctx.plugin(pluginObj, pluginConfig);
      status[key] = { state: 'active', message: '由苍蓝琉璃内置运行中' };
    } catch (err) {
      disposeFork(key);
      status[key] = { state: 'error', message: String(err?.message || err) };
    }
  }

  let lastCookieCfgKey = '';

  async function syncAll() {
    const cfg = getConfig();
    const mods = await ensureModulesLoaded();

    const cookieCfg = {
      maxHeaderBytes: Number(cfg.cookieGuardMaxHeaderBytes) || 262144,
      keepOtherCookies: Number.isFinite(Number(cfg.cookieGuardKeepOtherCookies)) ? Number(cfg.cookieGuardKeepOtherCookies) : 3,
      cookieBudgetBytes: Number(cfg.cookieGuardCookieBudgetBytes) || 4096
    };
    const nextCookieCfgKey = JSON.stringify(cookieCfg);
    if (forks.cookieGuard && nextCookieCfgKey !== lastCookieCfgKey) {
      disposeFork('cookieGuard');
    }
    lastCookieCfgKey = nextCookieCfgKey;

    await syncModule('cookieGuard', cfg.cookieGuardEnabled !== false, mods.cookieGuard, cookieCfg);
    await syncModule('dragAndDrop', cfg.dragAndDropEnabled !== false, mods.dragAndDrop, {});
    await syncModule('chatLinkActions', cfg.chatLinkActionsEnabled !== false, mods.chatLinkActions, {});
    await syncModule('conversationSearch', cfg.conversationSearchEnabled !== false, mods.conversationSearch, {});
  }

  function disposeAll() {
    for (const key of Object.keys(forks)) {
      disposeFork(key);
    }
  }

  function getStatus() {
    return {
      cookieGuard: { ...status.cookieGuard },
      dragAndDrop: { ...status.dragAndDrop },
      chatLinkActions: { ...status.chatLinkActions },
      conversationSearch: { ...status.conversationSearch }
    };
  }

  return {
    syncAll,
    disposeAll,
    getStatus
  };
}

export function serveAddonClientBundle(name, res) {
  const filePath = CLIENT_BUNDLE_MAP[String(name || '')];
  if (!filePath || !fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: false, error: 'Addon client bundle not found' }));
    return;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  res.writeHead(200, {
    'Content-Type': 'application/javascript; charset=utf-8',
    'Cache-Control': 'no-cache'
  });
  res.end(content);
}
