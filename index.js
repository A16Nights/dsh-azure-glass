/**
 * dsh-azure-glass — host half.
 *
 * Persists plugin settings, presets & custom wallpaper files under:
 *   $DSH_HOME/plugins/dsh-azure-glass/  (or ~/.dsh/plugins/dsh-azure-glass/)
 *
 * HTTP routes:
 *   GET  /api/azure-glass/config            -> normalized config JSON
 *   POST /api/azure-glass/config            <- partial config JSON
 *   POST /api/azure-glass/wallpaper/upload  <- { dataUrl: "data:image/...;base64,..." }
 *   GET  /api/azure-glass/wallpaper/current -> raw image binary with cache headers
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const name = 'dsh-azure-glass';
export const inject = ['webServer'];

const PLUGIN_ID = 'dsh-azure-glass';
const PLUGIN_DIR = path.dirname(fileURLToPath(import.meta.url));
function readPluginVersion() {
  try {
    const raw = fs.readFileSync(path.join(PLUGIN_DIR, 'package.json'), 'utf-8');
    const parsed = JSON.parse(raw);
    if (typeof parsed?.version === 'string' && parsed.version.trim()) return parsed.version.trim();
  } catch {}
  return '0.1.0';
}
const GITHUB_REPO = 'A16Nights/dsh-azure-glass';
const GITHUB_RELEASES_URL = `https://github.com/${GITHUB_REPO}/releases`;
let versionCheckCache = { at: 0, data: null };

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
const MAX_CONFIG_BYTES = 2 * 1024 * 1024;
const MAX_WALLPAPER_BYTES = 80 * 1024 * 1024;

const DEFAULT_CONFIG = Object.freeze({
  // 1. 性能与虚拟化
  virtualizeEnabled: true,
  overscanViewports: 1.8,
  keepTailItems: 8,
  lazyImages: true,
  pauseWhenHidden: true,
  fixGhostGap: true,
  fixSettingsScroll: true,
  dynamicDegradeOnScroll: false,
  turboMode: false,
  sessionKeepAliveEnabled: true,
  sessionKeepAliveMax: 6,
  sessionWarmupCount: 0,
  sessionHoverPrefetch: false,
  rightSidebarBoostEnabled: true,

  // 2. 壁纸、视频壁纸、程序化背景与 3D 视差（合并 WE + ColorLab + Skin-Center）
  wallpaperEnabled: true,
  wallpaperSource: 'uploaded', // 'uploaded' | 'url' | 'none'
  wallpaperUrl: '',
  wallpaperFit: 'cover', // 'cover' | 'contain' | 'auto'
  wallpaperPosX: 50,
  wallpaperPosY: 50,
  wallpaperScale: 100,
  wallpaperOpacity: 0.38,
  wallpaperBrightness: 100,
  wallpaperSaturate: 105,
  wallpaperBlurPx: 0,
  wallpaperBlurEmptyPx: 0,
  wallpaperBlurContentPx: 0,
  wallpaperScrim: 0.36,
  wallpaperVersion: 0,
  wallpaperVideoMuted: true,
  wallpaperVideoVolume: 0.3,
  bgEffectMode: 'none', // 'none' | 'glow' | 'topo'
  glowColorA: '#38bdf8',
  glowColorB: '#a855f7',
  glowOpacity: 0.28,
  glowAngle: 135,
  topoColor: '#38bdf8',
  topoOpacity: 0.18,
  topoDensity: 10,
  topoSpeed: 1,
  parallaxEnabled: false,
  parallaxTravelPct: 2.5,
  parallaxUiFollow: false,

  // 3. 玻璃与质感（独立面控 + 气泡 + 实心保护）
  glassEnabled: true,
  glassBlurPx: 12,
  glassSurfaceOpacity: 0.62,
  glassChatBgOpacity: 0.45,
  glassRightSidebarOpacity: 0.58,
  glassComposerBlurPx: 14,
  glassComposerOpacity: 0.72,
  glassSidechatComposerBlurPx: 14,
  glassSidechatComposerOpacity: 0.72,
  sidechatComposerRightGapPx: 136,
  glassModalBlurPx: 16,
  glassBubbleOpacity: 0.84,
  glassBubbleBlurPx: 0,
  glassOverlayOpacity: 0.88,
  glassOverlayBlurPx: 16,
  glassDiffOpacity: 0.90,
  glassDiffBlurPx: 0,
  solidOverlay: false,
  solidDiff: false,
  glassSaturate: 118,
  glassBorderAlpha: 0.12,
  glassRadiusPx: 12,
  minimalScrollbar: true,
  transparentHeader: true,
  glassHeaderOpacity: 0.85,
  glassHeaderBlurPx: 12,

  // 4. 色彩、过程行高亮与排版（完整还原 ColorLab + WE-Fonts）
  colorPreset: 'default',
  uiColors: {},
  proseColors: {},
  proseBoost: 'off', // 'off' | 'soft' | 'strong'
  rowHighlightEnabled: false,
  toolRowColor: '#7EE787',
  summaryRowColor: '#FAC863',
  fileCardColor: '#6699CC',
  caretColor: '',
  fontFamily: '',
  monoFontFamily: '',
  fontSizePx: 14,
  lineHeight: 1.65,
  codeFontSizePx: 13,
  savedPresets: [],

  // 5. Antigravity布局、合并式锚点轨道与秒切跳转
  antigravityLayout: true,
  chatMaxWidthPx: 0, // 0 = 不限制
  compactCodeEnabled: true,
  compactMaxHeightPx: 320,
  chapterOutlineEnabled: true,
  anchorRailEnabled: true,
  anchorRailPosition: 'right',
  anchorRecentDots: 14,
  anchorMergeChunk: 20,
  smoothScrollFollow: true,
  composerAutoFold: false,
  composerIslandEnabled: true,

  // 6. 点击/拖尾特效与自定义会话头像（合并 WE-FX + WE-Mascot-Avatar）
  fxClickEnabled: false,
  fxClickStyle: 'both', // 'both' | 'ripple' | 'sparkle' | 'starburst' | 'petal' | 'heart'
  fxTrailEnabled: false,
  fxTrailStyle: 'comet', // 'comet' | 'dust'
  fxColorMode: 'accent', // 'accent' | 'rainbow' | 'custom'
  fxColor: '#38bdf8',
  fxSize: 1,
  fxGlow: 65,
  fxOpacity: 0.9,
  fxBlend: 'screen', // 'screen' | 'normal' | 'lighten' | 'overlay'
  userAvatarUrl: '',
  assistantAvatarUrl: '',
  savedUserAvatars: [],
  savedAssistantAvatars: [],

  // 7. 自定义 CSS（整合 dsh-plugin-custom-css）
  customCssEnabled: false,
  customCss: '',

  // 8. 苍蓝琉璃自身 UI 主题色调中心（2 套官方预设 + A/B 双色自定义 + 4 个预设栏位）
  studioUiTheme: {
    activeId: 'official-azure',
    customDraft: { primary: '#3b82f6', secondary: '#7c3aed' },
    slots: [null, null, null, null]
  }
});

function resolveStoreDir() {
  let home = '';
  try {
    const fromEnv = typeof process.env.DSH_HOME === 'string' ? process.env.DSH_HOME.trim() : '';
    home = fromEnv.length > 0 ? fromEnv : path.join(os.homedir(), '.dsh');
  } catch {
    home = '';
  }
  return path.join(home.length > 0 ? home : os.tmpdir(), 'plugins', PLUGIN_ID);
}

const STORE_DIR = resolveStoreDir();
const CONFIG_FILE = path.join(STORE_DIR, 'config.json');
const WALLPAPER_META_FILE = path.join(STORE_DIR, 'wallpaper.meta.json');
const WALLPAPERS_DIR = path.join(STORE_DIR, 'wallpapers');
const WALLPAPERS_INDEX_FILE = path.join(STORE_DIR, 'wallpapers.json');
const MAX_SAVED_WALLPAPERS = 12;

function clamp(n, min, max, fallback) {
  const num = Number(n);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

function cleanColor(val) {
  if (typeof val !== 'string') return '';
  const s = val.trim();
  return /^#[0-9a-fA-F]{3,8}$/.test(s) ? s : '';
}

function cleanStr(val, maxLen = 200) {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

function cleanColorMap(obj) {
  const out = {};
  if (!obj || typeof obj !== 'object') return out;
  for (const [k, v] of Object.entries(obj)) {
    const c = cleanColor(v);
    if (c) out[k] = c;
  }
  return out;
}

function normalizeConfig(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  return {
    virtualizeEnabled: src.virtualizeEnabled !== false,
    overscanViewports: clamp(src.overscanViewports, 0.8, 5, DEFAULT_CONFIG.overscanViewports),
    keepTailItems: Math.round(clamp(src.keepTailItems, 4, 30, DEFAULT_CONFIG.keepTailItems)),
    lazyImages: src.lazyImages !== false,
    pauseWhenHidden: src.pauseWhenHidden !== false,
    fixGhostGap: src.fixGhostGap !== false,
    fixSettingsScroll: src.fixSettingsScroll !== false,
    dynamicDegradeOnScroll: src.dynamicDegradeOnScroll !== false,
    turboMode: src.turboMode === true,
    sessionKeepAliveEnabled: src.sessionKeepAliveEnabled !== false,
    sessionKeepAliveMax: Math.round(clamp(src.sessionKeepAliveMax, 0, 20, DEFAULT_CONFIG.sessionKeepAliveMax)),
    sessionWarmupCount: Math.round(clamp(src.sessionWarmupCount, 0, 12, DEFAULT_CONFIG.sessionWarmupCount)),
    sessionHoverPrefetch: src.sessionHoverPrefetch !== false,
    rightSidebarBoostEnabled: src.rightSidebarBoostEnabled !== false,

    wallpaperEnabled: src.wallpaperEnabled !== false,
    wallpaperSource: ['uploaded', 'url', 'none'].includes(src.wallpaperSource)
      ? src.wallpaperSource
      : DEFAULT_CONFIG.wallpaperSource,
    wallpaperUrl: cleanStr(src.wallpaperUrl, 1000),
    wallpaperFit: ['cover', 'contain', 'auto'].includes(src.wallpaperFit) ? src.wallpaperFit : 'cover',
    wallpaperPosX: Math.round(clamp(src.wallpaperPosX, 0, 100, DEFAULT_CONFIG.wallpaperPosX)),
    wallpaperPosY: Math.round(clamp(src.wallpaperPosY, 0, 100, DEFAULT_CONFIG.wallpaperPosY)),
    wallpaperScale: Math.round(clamp(src.wallpaperScale, 100, 160, DEFAULT_CONFIG.wallpaperScale)),
    wallpaperOpacity: clamp(src.wallpaperOpacity, 0.05, 1, DEFAULT_CONFIG.wallpaperOpacity),
    wallpaperBrightness: Math.round(clamp(src.wallpaperBrightness, 30, 150, DEFAULT_CONFIG.wallpaperBrightness)),
    wallpaperSaturate: Math.round(clamp(src.wallpaperSaturate, 0, 200, DEFAULT_CONFIG.wallpaperSaturate)),
    wallpaperBlurPx: Math.round(clamp(src.wallpaperBlurPx, 0, 24, DEFAULT_CONFIG.wallpaperBlurPx)),
    wallpaperBlurEmptyPx: Math.round(clamp(src.wallpaperBlurEmptyPx, 0, 24, DEFAULT_CONFIG.wallpaperBlurEmptyPx)),
    wallpaperBlurContentPx: Math.round(clamp(src.wallpaperBlurContentPx, 0, 24, DEFAULT_CONFIG.wallpaperBlurContentPx)),
    wallpaperScrim: clamp(src.wallpaperScrim, 0, 0.9, DEFAULT_CONFIG.wallpaperScrim),
    wallpaperVersion: Math.max(0, Math.floor(Number(src.wallpaperVersion) || 0)),
    wallpaperVideoMuted: src.wallpaperVideoMuted !== false,
    wallpaperVideoVolume: clamp(src.wallpaperVideoVolume, 0, 1, DEFAULT_CONFIG.wallpaperVideoVolume),
    bgEffectMode: ['none', 'glow', 'topo'].includes(src.bgEffectMode) ? src.bgEffectMode : 'none',
    glowColorA: cleanColor(src.glowColorA) || DEFAULT_CONFIG.glowColorA,
    glowColorB: cleanColor(src.glowColorB) || DEFAULT_CONFIG.glowColorB,
    glowOpacity: clamp(src.glowOpacity, 0, 0.9, DEFAULT_CONFIG.glowOpacity),
    glowAngle: Math.round(clamp(src.glowAngle, 0, 360, DEFAULT_CONFIG.glowAngle)),
    topoColor: cleanColor(src.topoColor) || DEFAULT_CONFIG.topoColor,
    topoOpacity: clamp(src.topoOpacity, 0, 0.8, DEFAULT_CONFIG.topoOpacity),
    topoDensity: Math.round(clamp(src.topoDensity, 4, 24, DEFAULT_CONFIG.topoDensity)),
    topoSpeed: clamp(src.topoSpeed, 0, 3, DEFAULT_CONFIG.topoSpeed),
    parallaxEnabled: src.parallaxEnabled === true,
    parallaxTravelPct: clamp(src.parallaxTravelPct, 0, 8, DEFAULT_CONFIG.parallaxTravelPct),
    parallaxUiFollow: src.parallaxUiFollow === true,

    glassEnabled: src.glassEnabled !== false,
    glassBlurPx: Math.round(clamp(src.glassBlurPx, 0, 32, DEFAULT_CONFIG.glassBlurPx)),
    glassSurfaceOpacity: clamp(src.glassSurfaceOpacity, 0, 0.98, DEFAULT_CONFIG.glassSurfaceOpacity),
    glassChatBgOpacity: clamp(src.glassChatBgOpacity, 0, 0.98, DEFAULT_CONFIG.glassChatBgOpacity),
    glassRightSidebarOpacity: clamp(src.glassRightSidebarOpacity, 0, 0.98, DEFAULT_CONFIG.glassRightSidebarOpacity),
    glassComposerBlurPx: Math.round(clamp(src.glassComposerBlurPx, 0, 32, DEFAULT_CONFIG.glassComposerBlurPx)),
    glassComposerOpacity: clamp(src.glassComposerOpacity, 0.05, 0.98, DEFAULT_CONFIG.glassComposerOpacity),
    glassSidechatComposerBlurPx: Math.round(clamp(src.glassSidechatComposerBlurPx, 0, 32, DEFAULT_CONFIG.glassSidechatComposerBlurPx)),
    glassSidechatComposerOpacity: clamp(src.glassSidechatComposerOpacity, 0.05, 1, DEFAULT_CONFIG.glassSidechatComposerOpacity),
    sidechatComposerRightGapPx: Math.round(clamp(src.sidechatComposerRightGapPx, 0, 260, DEFAULT_CONFIG.sidechatComposerRightGapPx)),
    glassModalBlurPx: Math.round(clamp(src.glassModalBlurPx, 0, 32, DEFAULT_CONFIG.glassModalBlurPx)),
    glassBubbleOpacity: clamp(src.glassBubbleOpacity, 0.1, 1, DEFAULT_CONFIG.glassBubbleOpacity),
    glassBubbleBlurPx: Math.round(clamp(src.glassBubbleBlurPx, 0, 24, DEFAULT_CONFIG.glassBubbleBlurPx)),
    glassOverlayOpacity: clamp(src.glassOverlayOpacity, 0.2, 1, src.solidOverlay === true ? 1 : DEFAULT_CONFIG.glassOverlayOpacity),
    glassOverlayBlurPx: Math.round(clamp(src.glassOverlayBlurPx, 0, 32, src.glassModalBlurPx ?? DEFAULT_CONFIG.glassOverlayBlurPx)),
    glassDiffOpacity: clamp(src.glassDiffOpacity, 0.2, 1, src.solidDiff === true ? 1 : DEFAULT_CONFIG.glassDiffOpacity),
    glassDiffBlurPx: Math.round(clamp(src.glassDiffBlurPx, 0, 32, DEFAULT_CONFIG.glassDiffBlurPx)),
    solidOverlay: src.solidOverlay === true,
    solidDiff: src.solidDiff === true,
    glassSaturate: Math.round(clamp(src.glassSaturate, 80, 200, DEFAULT_CONFIG.glassSaturate)),
    glassBorderAlpha: clamp(src.glassBorderAlpha, 0, 0.4, DEFAULT_CONFIG.glassBorderAlpha),
    glassRadiusPx: Math.round(clamp(src.glassRadiusPx, 0, 24, DEFAULT_CONFIG.glassRadiusPx)),
    minimalScrollbar: src.minimalScrollbar !== false,
    transparentHeader: src.transparentHeader !== false,
    glassHeaderOpacity: clamp(src.glassHeaderOpacity, 0, 1, DEFAULT_CONFIG.glassHeaderOpacity),
    glassHeaderBlurPx: Math.round(clamp(src.glassHeaderBlurPx, 0, 32, DEFAULT_CONFIG.glassHeaderBlurPx)),

    colorPreset: cleanStr(src.colorPreset, 40) || 'default',
    uiColors: cleanColorMap(src.uiColors),
    proseColors: cleanColorMap(src.proseColors),
    proseBoost: ['off', 'soft', 'strong'].includes(src.proseBoost) ? src.proseBoost : 'off',
    rowHighlightEnabled: src.rowHighlightEnabled === true,
    toolRowColor: cleanColor(src.toolRowColor) || DEFAULT_CONFIG.toolRowColor,
    summaryRowColor: cleanColor(src.summaryRowColor) || DEFAULT_CONFIG.summaryRowColor,
    fileCardColor: cleanColor(src.fileCardColor) || DEFAULT_CONFIG.fileCardColor,
    caretColor: cleanColor(src.caretColor),
    fontFamily: cleanStr(src.fontFamily, 180),
    monoFontFamily: cleanStr(src.monoFontFamily, 180),
    fontSizePx: Math.round(clamp(src.fontSizePx, 12, 20, DEFAULT_CONFIG.fontSizePx)),
    lineHeight: Number(clamp(src.lineHeight, 1.3, 2.2, DEFAULT_CONFIG.lineHeight).toFixed(2)),
    codeFontSizePx: Math.round(clamp(src.codeFontSizePx, 11, 18, DEFAULT_CONFIG.codeFontSizePx)),
    savedPresets: Array.isArray(src.savedPresets) ? src.savedPresets.slice(0, 50) : [],

    antigravityLayout: src.antigravityLayout !== false,
    chatMaxWidthPx: Math.round(clamp(src.chatMaxWidthPx, 0, 1600, DEFAULT_CONFIG.chatMaxWidthPx)),
    compactCodeEnabled: src.compactCodeEnabled !== false,
    compactMaxHeightPx: Math.round(clamp(src.compactMaxHeightPx, 160, 900, DEFAULT_CONFIG.compactMaxHeightPx)),
    chapterOutlineEnabled: src.chapterOutlineEnabled !== false,
    anchorRailEnabled: src.anchorRailEnabled !== false,
    anchorRailPosition: src.anchorRailPosition === 'left' ? 'left' : 'right',
    anchorRecentDots: Math.round(clamp(src.anchorRecentDots, 6, 30, DEFAULT_CONFIG.anchorRecentDots)),
    anchorMergeChunk: Math.round(clamp(src.anchorMergeChunk, 10, 50, DEFAULT_CONFIG.anchorMergeChunk)),
    smoothScrollFollow: src.smoothScrollFollow !== false,
    composerAutoFold: src.composerAutoFold === true,
    composerIslandEnabled: src.composerIslandEnabled !== false,

    fxClickEnabled: src.fxClickEnabled === true,
    fxClickStyle: ['both', 'ripple', 'sparkle', 'starburst', 'petal', 'heart'].includes(src.fxClickStyle) ? src.fxClickStyle : 'both',
    fxTrailEnabled: src.fxTrailEnabled === true,
    fxTrailStyle: ['comet', 'dust'].includes(src.fxTrailStyle) ? src.fxTrailStyle : 'comet',
    fxColorMode: ['accent', 'rainbow', 'custom'].includes(src.fxColorMode) ? src.fxColorMode : 'accent',
    fxColor: cleanColor(src.fxColor) || DEFAULT_CONFIG.fxColor,
    fxSize: clamp(src.fxSize, 0.5, 2.5, DEFAULT_CONFIG.fxSize),
    fxGlow: Math.round(clamp(src.fxGlow, 0, 100, DEFAULT_CONFIG.fxGlow)),
    fxOpacity: clamp(src.fxOpacity, 0.2, 1, DEFAULT_CONFIG.fxOpacity),
    fxBlend: ['screen', 'normal', 'lighten', 'overlay'].includes(src.fxBlend) ? src.fxBlend : 'screen',
    userAvatarUrl: cleanStr(src.userAvatarUrl, 400000),
    assistantAvatarUrl: cleanStr(src.assistantAvatarUrl, 400000),
    savedUserAvatars: cleanAvatarList(src.savedUserAvatars),
    savedAssistantAvatars: cleanAvatarList(src.savedAssistantAvatars),

    customCssEnabled: src.customCssEnabled === true,
    customCss: typeof src.customCss === 'string' ? src.customCss.slice(0, 200000) : '',

    studioUiTheme: normalizeStudioUiTheme(src.studioUiTheme)
  };
}

function cleanAvatarList(list) {
  if (!Array.isArray(list)) return [];
  const out = [];
  const seen = new Set();
  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    const url = cleanStr(item.url, 400000);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    const id = cleanStr(item.id, 64) || `av_${out.length}_${Date.now().toString(36)}`;
    const name = cleanStr(item.name, 40) || `头像 ${out.length + 1}`;
    out.push({ id, name, url });
    if (out.length >= 8) break;
  }
  return out;
}

function normalizeStudioUiTheme(raw) {
  const def = {
    activeId: 'official-azure',
    customDraft: { primary: '#3b82f6', secondary: '#7c3aed' },
    slots: [null, null, null, null]
  };
  if (!raw || typeof raw !== 'object') return def;
  const normHex = (val, fb) => {
    if (typeof val !== 'string') return fb;
    const s = val.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(s)) return s.toLowerCase();
    if (/^[0-9a-fA-F]{6}$/.test(s)) return `#${s.toLowerCase()}`;
    return fb;
  };
  const slots = Array.from({ length: 4 }, (_, i) => {
    const item = Array.isArray(raw.slots) ? raw.slots[i] : null;
    if (!item || typeof item !== 'object') return null;
    const primary = normHex(item.primary, '');
    const secondary = normHex(item.secondary, '');
    if (!primary || !secondary) return null;
    const name = String(item.name || `自定义 ${i + 1}`).trim().slice(0, 18) || `自定义 ${i + 1}`;
    return { id: `slot-${i}`, name, primary, secondary };
  });
  const customDraft = {
    primary: normHex(raw.customDraft?.primary, def.customDraft.primary),
    secondary: normHex(raw.customDraft?.secondary, def.customDraft.secondary)
  };
  let activeId = typeof raw.activeId === 'string' ? raw.activeId.trim() : def.activeId;
  const isOfficial = activeId === 'official-azure' || activeId === 'official-violet';
  const sm = /^slot-([0-3])$/.exec(activeId);
  const isValidSlot = sm ? Boolean(slots[Number(sm[1])]) : false;
  if (!isOfficial && !isValidSlot && activeId !== 'custom') {
    activeId = def.activeId;
  }
  return { activeId, customDraft, slots };
}

function readConfigFile() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return { ...DEFAULT_CONFIG };
    return normalizeConfig(JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')));
  } catch (err) {
    console.warn('[dsh-azure-glass] Failed to read config:', err?.message ?? err);
    return { ...DEFAULT_CONFIG };
  }
}

let currentConfig = readConfigFile();

function writeConfigFile() {
  try {
    fs.mkdirSync(STORE_DIR, { recursive: true });
    const tmp = `${CONFIG_FILE}.tmp-${process.pid}`;
    fs.writeFileSync(tmp, `${JSON.stringify(currentConfig, null, 2)}\n`, 'utf-8');
    fs.renameSync(tmp, CONFIG_FILE);
    return true;
  } catch (err) {
    console.warn('[dsh-azure-glass] Failed to write config:', err?.message ?? err);
    return false;
  }
}

function setCors(req, res, contentType = 'application/json; charset=utf-8') {
  if (contentType) res.setHeader('Content-Type', contentType);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

function readJsonBody(req, maxBytes) {
  return new Promise((resolve) => {
    let size = 0;
    const chunks = [];
    let settled = false;
    const done = (val) => {
      if (settled) return;
      settled = true;
      resolve(val);
    };
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        done({ __tooLarge: true });
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const text = Buffer.concat(chunks).toString('utf-8');
        done(JSON.parse(text || '{}'));
      } catch {
        done({});
      }
    });
    req.on('error', () => done({}));
  });
}

function resolveWallpaperFilePath(fileName) {
  const safe = path.basename(String(fileName || ''));
  if (!safe) return '';
  const inLib = path.join(WALLPAPERS_DIR, safe);
  if (fs.existsSync(inLib)) return inLib;
  const inRoot = path.join(STORE_DIR, safe);
  if (fs.existsSync(inRoot)) return inRoot;
  return '';
}

function getWallpaperMeta() {
  try {
    if (!fs.existsSync(WALLPAPER_META_FILE)) return null;
    const meta = JSON.parse(fs.readFileSync(WALLPAPER_META_FILE, 'utf-8'));
    if (meta && typeof meta.file === 'string' && typeof meta.mime === 'string') {
      const fullPath = resolveWallpaperFilePath(meta.file);
      if (fullPath) return { ...meta, fullPath };
    }
  } catch {}
  return null;
}

function readWallpaperLibrary() {
  let lib = { activeId: '', items: [] };
  try {
    if (fs.existsSync(WALLPAPERS_INDEX_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(WALLPAPERS_INDEX_FILE, 'utf-8'));
      if (parsed && Array.isArray(parsed.items)) {
        const cleanItems = [];
        for (const it of parsed.items) {
          if (!it || typeof it !== 'object' || !it.id || !it.file || !it.mime) continue;
          const fullPath = resolveWallpaperFilePath(it.file);
          if (!fullPath) continue;
          cleanItems.push({
            id: String(it.id),
            name: String(it.name || it.file).slice(0, 60),
            file: path.basename(String(it.file)),
            mime: String(it.mime),
            bytes: Number(it.bytes) || 0,
            createdAt: Number(it.createdAt) || Date.now()
          });
        }
        lib = {
          activeId: typeof parsed.activeId === 'string' ? parsed.activeId : '',
          items: cleanItems.slice(0, MAX_SAVED_WALLPAPERS)
        };
      }
    }
  } catch {}

  // 平滑迁移旧版单张壁纸进壁纸库，避免丢失当前壁纸
  if (lib.items.length === 0) {
    const legacy = getWallpaperMeta();
    if (legacy && legacy.fullPath) {
      const legacyId = legacy.id || 'wp_legacy';
      const item = {
        id: legacyId,
        name: legacy.name || '当前壁纸',
        file: path.basename(legacy.file),
        mime: legacy.mime,
        bytes: Number(legacy.bytes) || 0,
        createdAt: Date.now()
      };
      lib = { activeId: legacyId, items: [item] };
      writeWallpaperLibrary(lib);
    }
  }
  if (lib.activeId && !lib.items.some((x) => x.id === lib.activeId)) {
    lib.activeId = lib.items[0]?.id || '';
  }
  return lib;
}

function writeWallpaperLibrary(lib) {
  try {
    fs.mkdirSync(STORE_DIR, { recursive: true });
    fs.writeFileSync(WALLPAPERS_INDEX_FILE, JSON.stringify(lib, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[dsh-azure-glass] Failed to write wallpaper index:', err?.message ?? err);
  }
}

function hasUploadedWallpaper() {
  return getWallpaperMeta() !== null;
}

async function handleConfig(req, res) {
  if (setCors(req, res)) return;
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    const meta = getWallpaperMeta();
    res.statusCode = 200;
    res.end(JSON.stringify({ ...currentConfig, hasUploadedWallpaper: meta !== null, wallpaperMime: meta?.mime || '' }));
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'method not allowed' }));
    return;
  }

  const payload = await readJsonBody(req, MAX_CONFIG_BYTES);
  if (payload?.__tooLarge) {
    res.statusCode = 413;
    res.end(JSON.stringify({ error: 'payload too large' }));
    return;
  }

  currentConfig = normalizeConfig({ ...currentConfig, ...payload });
  const saved = writeConfigFile();
  const meta = getWallpaperMeta();
  res.statusCode = 200;
  res.end(JSON.stringify({ ...currentConfig, hasUploadedWallpaper: meta !== null, wallpaperMime: meta?.mime || '', saved }));
}

const MIME_EXT = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
  'video/mp4': '.mp4',
  'video/webm': '.webm'
};

async function handleWallpaperUpload(req, res) {
  if (setCors(req, res)) return;
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'method not allowed' }));
    return;
  }

  const payload = await readJsonBody(req, MAX_WALLPAPER_BYTES);
  if (payload?.__tooLarge) {
    res.statusCode = 413;
    res.end(JSON.stringify({ error: 'wallpaper too large (max 80MB)' }));
    return;
  }

  const dataUrl = typeof payload?.dataUrl === 'string' ? payload.dataUrl : '';
  const match = dataUrl.match(/^data:((?:image|video)\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'invalid image/video dataUrl' }));
    return;
  }

  const mime = match[1].toLowerCase();
  const ext = MIME_EXT[mime] || '.img';
  const buf = Buffer.from(match[2], 'base64');

  try {
    fs.mkdirSync(WALLPAPERS_DIR, { recursive: true });
    const lib = readWallpaperLibrary();
    if (lib.items.length >= MAX_SAVED_WALLPAPERS) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: `壁纸库最多保存 ${MAX_SAVED_WALLPAPERS} 个，请先删除不需要的壁纸` }));
      return;
    }

    const id = `wp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const rawName = typeof payload?.name === 'string' ? payload.name.trim() : '';
    const displayName = (rawName ? rawName.replace(/\.[^./\\]+$/, '') : `壁纸 ${lib.items.length + 1}`).slice(0, 40) || `壁纸 ${lib.items.length + 1}`;
    const fileName = `${id}${ext}`;
    const fullPath = path.join(WALLPAPERS_DIR, fileName);
    fs.writeFileSync(fullPath, buf);

    const newItem = { id, name: displayName, file: fileName, mime, bytes: buf.length, createdAt: Date.now() };
    lib.items.unshift(newItem);
    lib.activeId = id;
    writeWallpaperLibrary(lib);

    fs.writeFileSync(WALLPAPER_META_FILE, JSON.stringify({ id, name: displayName, file: fileName, mime, bytes: buf.length }), 'utf-8');

    currentConfig = normalizeConfig({
      ...currentConfig,
      wallpaperEnabled: true,
      wallpaperSource: 'uploaded',
      wallpaperVersion: Date.now()
    });
    writeConfigFile();

    res.statusCode = 200;
    res.end(JSON.stringify({
      ok: true,
      id,
      item: newItem,
      bytes: buf.length,
      mime,
      wallpaperVersion: currentConfig.wallpaperVersion,
      library: { activeId: lib.activeId, items: lib.items }
    }));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err?.message || 'write failed' }));
  }
}

function handleWallpaperList(req, res) {
  if (setCors(req, res)) return;
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'method not allowed' }));
    return;
  }
  const lib = readWallpaperLibrary();
  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true, max: MAX_SAVED_WALLPAPERS, activeId: lib.activeId, items: lib.items }));
}

async function handleWallpaperSelect(req, res) {
  if (setCors(req, res)) return;
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'method not allowed' }));
    return;
  }
  const payload = await readJsonBody(req, 16384);
  const id = typeof payload?.id === 'string' ? payload.id.trim() : '';
  const lib = readWallpaperLibrary();
  const item = lib.items.find((x) => x.id === id);
  if (!item) {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'wallpaper not found' }));
    return;
  }
  const fullPath = resolveWallpaperFilePath(item.file);
  if (!fullPath) {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'wallpaper file missing' }));
    return;
  }
  lib.activeId = item.id;
  writeWallpaperLibrary(lib);
  fs.writeFileSync(WALLPAPER_META_FILE, JSON.stringify({ id: item.id, name: item.name, file: item.file, mime: item.mime, bytes: item.bytes }), 'utf-8');
  currentConfig = normalizeConfig({
    ...currentConfig,
    wallpaperEnabled: true,
    wallpaperSource: 'uploaded',
    wallpaperVersion: Date.now()
  });
  writeConfigFile();
  res.statusCode = 200;
  res.end(JSON.stringify({
    ok: true,
    id: item.id,
    mime: item.mime,
    wallpaperVersion: currentConfig.wallpaperVersion,
    library: { activeId: lib.activeId, items: lib.items }
  }));
}

async function handleWallpaperDelete(req, res) {
  if (setCors(req, res)) return;
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'method not allowed' }));
    return;
  }
  const payload = await readJsonBody(req, 16384);
  const id = typeof payload?.id === 'string' ? payload.id.trim() : '';
  const lib = readWallpaperLibrary();
  const idx = lib.items.findIndex((x) => x.id === id);
  if (idx < 0) {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'wallpaper not found' }));
    return;
  }
  const [removed] = lib.items.splice(idx, 1);
  const fp = resolveWallpaperFilePath(removed.file);
  if (fp && fs.existsSync(fp)) {
    try { fs.unlinkSync(fp); } catch {}
  }

  let nextVersion = currentConfig.wallpaperVersion;
  let nextMime = '';
  let hasUploaded = lib.items.length > 0;
  if (lib.activeId === removed.id) {
    const fallback = lib.items[0] || null;
    if (fallback) {
      lib.activeId = fallback.id;
      nextMime = fallback.mime;
      nextVersion = Date.now();
      fs.writeFileSync(WALLPAPER_META_FILE, JSON.stringify({ id: fallback.id, name: fallback.name, file: fallback.file, mime: fallback.mime, bytes: fallback.bytes }), 'utf-8');
      currentConfig = normalizeConfig({ ...currentConfig, wallpaperVersion: nextVersion });
      writeConfigFile();
    } else {
      lib.activeId = '';
      if (fs.existsSync(WALLPAPER_META_FILE)) {
        try { fs.unlinkSync(WALLPAPER_META_FILE); } catch {}
      }
      nextVersion = Date.now();
      currentConfig = normalizeConfig({ ...currentConfig, wallpaperVersion: nextVersion });
      writeConfigFile();
    }
  } else {
    const curMeta = getWallpaperMeta();
    nextMime = curMeta?.mime || '';
  }
  writeWallpaperLibrary(lib);
  res.statusCode = 200;
  res.end(JSON.stringify({
    ok: true,
    hasUploadedWallpaper: hasUploaded,
    wallpaperMime: nextMime,
    wallpaperVersion: nextVersion,
    library: { activeId: lib.activeId, items: lib.items }
  }));
}

function handleWallpaperItem(req, res) {
  if (setCors(req, res, '')) return;
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end('method not allowed');
    return;
  }
  let id = '';
  try {
    const u = new URL(req.url || '/', 'http://127.0.0.1');
    id = (u.searchParams.get('id') || '').trim();
  } catch {}
  const lib = readWallpaperLibrary();
  const item = lib.items.find((x) => x.id === id);
  const fp = item ? resolveWallpaperFilePath(item.file) : '';
  if (!item || !fp) {
    res.statusCode = 404;
    res.end('not found');
    return;
  }
  res.statusCode = 200;
  res.setHeader('Content-Type', item.mime);
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  fs.createReadStream(fp).pipe(res);
}

function handleWallpaperCurrent(req, res) {
  if (setCors(req, res, '')) return;
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end('method not allowed');
    return;
  }

  const meta = getWallpaperMeta();
  if (!meta) {
    res.statusCode = 404;
    res.end('no wallpaper uploaded');
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', meta.mime);
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  fs.createReadStream(meta.fullPath).pipe(res);
}

// ---------------------------------------------------------------------------
// Antigravity-Style Large File Line-Offset Index + Random-Access Slice Reader
// ---------------------------------------------------------------------------
const fileIndexCache = new Map(); // normalizedPath -> { size, mtimeMs, offsets: number[], isBinary: boolean }
const MAX_INDEXED_FILES = 8;

function resolveReadableFile(rawPath) {
  if (typeof rawPath !== 'string') return { error: '文件路径不能为空' };
  const cleaned = rawPath.trim().replace(/^["']|["']$/g, '');
  if (!cleaned || cleaned.includes('\0')) return { error: '无效路径' };
  const fullPath = path.resolve(cleaned);
  let st;
  try {
    st = fs.statSync(fullPath);
  } catch {
    return { error: '文件不存在或无权读取' };
  }
  if (!st.isFile()) return { error: '目标不是普通文件' };
  return { fullPath, size: st.size, mtimeMs: st.mtimeMs };
}

function getOrBuildLineIndex(fullPath, size, mtimeMs) {
  const cached = fileIndexCache.get(fullPath);
  if (cached && cached.size === size && cached.mtimeMs === mtimeMs) {
    fileIndexCache.delete(fullPath);
    fileIndexCache.set(fullPath, cached);
    return cached;
  }

  const fd = fs.openSync(fullPath, 'r');
  const offsets = [0];
  let isBinary = false;
  const CHUNK = 256 * 1024;
  const buf = Buffer.allocUnsafe(CHUNK);
  let pos = 0;
  try {
    while (pos < size) {
      const n = fs.readSync(fd, buf, 0, Math.min(CHUNK, size - pos), pos);
      if (n <= 0) break;
      if (pos === 0) {
        const probe = Math.min(n, 4096);
        for (let i = 0; i < probe; i++) {
          if (buf[i] === 0) { isBinary = true; break; }
        }
      }
      for (let i = 0; i < n; i++) {
        if (buf[i] === 10) offsets.push(pos + i + 1);
      }
      pos += n;
    }
  } finally {
    fs.closeSync(fd);
  }

  // 如果文件末尾刚好是换行符，去掉末尾空偏移
  if (offsets.length > 1 && offsets[offsets.length - 1] >= size) {
    offsets.pop();
  }

  const entry = { size, mtimeMs, offsets, isBinary };
  fileIndexCache.set(fullPath, entry);
  if (fileIndexCache.size > MAX_INDEXED_FILES) {
    const oldest = fileIndexCache.keys().next().value;
    fileIndexCache.delete(oldest);
  }
  return entry;
}

async function handleFileMeta(req, res) {
  if (setCors(req, res)) return;
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.statusCode = 405; res.end(JSON.stringify({ error: 'method not allowed' })); return; }
  const payload = await readJsonBody(req, 64 * 1024);
  const info = resolveReadableFile(payload?.path);
  if (info.error) { res.statusCode = 400; res.end(JSON.stringify({ ok: false, error: info.error })); return; }
  try {
    const idx = getOrBuildLineIndex(info.fullPath, info.size, info.mtimeMs);
    res.statusCode = 200;
    res.end(JSON.stringify({
      ok: true,
      path: info.fullPath,
      name: path.basename(info.fullPath),
      size: info.size,
      mtimeMs: info.mtimeMs,
      totalLines: idx.offsets.length,
      isBinary: idx.isBinary
    }));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, error: err?.message || 'index failed' }));
  }
}

async function handleFileSlice(req, res) {
  if (setCors(req, res)) return;
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.statusCode = 405; res.end(JSON.stringify({ error: 'method not allowed' })); return; }
  const payload = await readJsonBody(req, 64 * 1024);
  const info = resolveReadableFile(payload?.path);
  if (info.error) { res.statusCode = 400; res.end(JSON.stringify({ ok: false, error: info.error })); return; }
  try {
    const idx = getOrBuildLineIndex(info.fullPath, info.size, info.mtimeMs);
    const total = idx.offsets.length;
    const startLine = Math.max(0, Math.min(total - 1, Math.floor(Number(payload?.startLine) || 0)));
    const count = Math.max(1, Math.min(300, Math.floor(Number(payload?.count) || 120)));
    const endLine = Math.min(total, startLine + count);
    const byteStart = idx.offsets[startLine] ?? 0;
    const byteEnd = endLine < total ? idx.offsets[endLine] : info.size;
    // 单次切片保护上限 2MB，防止单行超长 minified 文件撑爆前端
    const readLen = Math.max(0, Math.min(byteEnd - byteStart, 2 * 1024 * 1024));
    const buf = Buffer.allocUnsafe(readLen);
    const fd = fs.openSync(info.fullPath, 'r');
    let actual = 0;
    try {
      if (readLen > 0) actual = fs.readSync(fd, buf, 0, readLen, byteStart);
    } finally {
      fs.closeSync(fd);
    }
    const text = buf.subarray(0, actual).toString('utf-8');
    const rawLines = text.split(/\r?\n/);
    // 若以换行结尾会产生一个尾部空串
    if (rawLines.length > (endLine - startLine) && rawLines[rawLines.length - 1] === '') rawLines.pop();
    const lines = rawLines.map((l) => (l.length > 4000 ? `${l.slice(0, 4000)}… [行过长已截断]` : l));
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true, startLine, totalLines: total, lines }));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, error: err?.message || 'slice failed' }));
  }
}

async function handleFileSearch(req, res) {
  if (setCors(req, res)) return;
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.statusCode = 405; res.end(JSON.stringify({ error: 'method not allowed' })); return; }
  const payload = await readJsonBody(req, 64 * 1024);
  const info = resolveReadableFile(payload?.path);
  const query = typeof payload?.query === 'string' ? payload.query.trim() : '';
  if (info.error) { res.statusCode = 400; res.end(JSON.stringify({ ok: false, error: info.error })); return; }
  if (!query) { res.statusCode = 200; res.end(JSON.stringify({ ok: true, hits: [], truncated: false })); return; }
  try {
    const idx = getOrBuildLineIndex(info.fullPath, info.size, info.mtimeMs);
    const qLower = query.toLowerCase();
    const maxHits = Math.max(10, Math.min(300, Math.floor(Number(payload?.maxHits) || 150)));
    const hits = [];
    let truncated = false;
    const fd = fs.openSync(info.fullPath, 'r');
    const CHUNK = 256 * 1024;
    const buf = Buffer.allocUnsafe(CHUNK);
    let pos = 0;
    let lineNo = 0;
    let carry = '';
    try {
      while (pos < info.size) {
        const n = fs.readSync(fd, buf, 0, Math.min(CHUNK, info.size - pos), pos);
        if (n <= 0) break;
        pos += n;
        const text = carry + buf.subarray(0, n).toString('utf-8');
        const parts = text.split(/\r?\n/);
        carry = pos < info.size ? (parts.pop() || '') : '';
        for (const line of parts) {
          if (line.toLowerCase().includes(qLower)) {
            hits.push({ line: lineNo, preview: line.trim().slice(0, 140) });
            if (hits.length >= maxHits) { truncated = true; break; }
          }
          lineNo++;
        }
        if (truncated) break;
      }
      if (!truncated && carry && carry.toLowerCase().includes(qLower)) {
        hits.push({ line: lineNo, preview: carry.trim().slice(0, 140) });
      }
    } finally {
      fs.closeSync(fd);
    }
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true, totalLines: idx.offsets.length, hits, truncated }));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, error: err?.message || 'search failed' }));
  }
}

// ---------------------------------------------------------------------------
// Integrated Side-Session (/side-chat command, migrated from dsh-side-session)
// ---------------------------------------------------------------------------
const SIDE_CHAT_OPENING_PROMPT = [
  '这是一个新的旁会话。请用一两句话确认你已经就绪，并等待我输入第一个问题。',
  'This is a new side session. Confirm in a sentence or two that you are ready, then wait for my first question.'
].join('\n');

function sideChatLabel(now) {
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `旁会话 ${hh}:${mm}`;
}

async function handleVersion(req, res) {
  const currentVersion = readPluginVersion();
  const urlObj = new URL(req.url || '/api/azure-glass/version', 'http://localhost');
  const wantCheck = urlObj.searchParams.get('check') === '1';
  const forceCheck = urlObj.searchParams.get('force') === '1';
  const basePayload = {
    ok: true,
    name: PLUGIN_ID,
    currentVersion,
    repo: GITHUB_REPO,
    releaseUrl: GITHUB_RELEASES_URL
  };
  if (!wantCheck) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(basePayload));
    return;
  }
  const now = Date.now();
  if (!forceCheck && versionCheckCache.data && (now - versionCheckCache.at) < 180000) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ ...basePayload, ...versionCheckCache.data, currentVersion }));
    return;
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const ghRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=1`, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': `${PLUGIN_ID}/${currentVersion}`
      },
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!ghRes.ok) throw new Error(`HTTP ${ghRes.status}`);
    const list = await ghRes.json();
    const latest = Array.isArray(list) && list.length > 0 ? list[0] : null;
    if (!latest || !latest.tag_name) {
      const result = { checked: true, hasUpdate: false, latestVersion: currentVersion, prerelease: true, releaseUrl: GITHUB_RELEASES_URL };
      versionCheckCache = { at: now, data: result };
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ ...basePayload, ...result }));
      return;
    }
    const latestVersion = String(latest.tag_name).replace(/^v/i, '').trim();
    const hasUpdate = compareSemver(latestVersion, currentVersion) > 0;
    const result = {
      checked: true,
      hasUpdate,
      latestVersion,
      prerelease: latest.prerelease === true,
      releaseUrl: typeof latest.html_url === 'string' && latest.html_url ? latest.html_url : GITHUB_RELEASES_URL
    };
    versionCheckCache = { at: now, data: result };
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ ...basePayload, ...result }));
  } catch (err) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({
      ...basePayload,
      checked: false,
      hasUpdate: false,
      error: err?.message || 'network_error'
    }));
  }
}

export function apply(ctx) {
  ctx.logger?.info?.(`[dsh-azure-glass] store dir: ${STORE_DIR}`);
  ctx.webServer.register({ kind: 'exact', path: '/api/azure-glass/config', handler: handleConfig });
  ctx.webServer.register({ kind: 'exact', path: '/api/azure-glass/version', handler: handleVersion });
  ctx.webServer.register({ kind: 'exact', path: '/api/azure-glass/wallpaper/upload', handler: handleWallpaperUpload });
  ctx.webServer.register({ kind: 'exact', path: '/api/azure-glass/wallpaper/current', handler: handleWallpaperCurrent });
  ctx.webServer.register({ kind: 'exact', path: '/api/azure-glass/wallpaper/list', handler: handleWallpaperList });
  ctx.webServer.register({ kind: 'exact', path: '/api/azure-glass/wallpaper/select', handler: handleWallpaperSelect });
  ctx.webServer.register({ kind: 'exact', path: '/api/azure-glass/wallpaper/delete', handler: handleWallpaperDelete });
  ctx.webServer.register({ kind: 'exact', path: '/api/azure-glass/wallpaper/item', handler: handleWallpaperItem });
  ctx.webServer.register({ kind: 'exact', path: '/api/azure-glass/file/meta', handler: handleFileMeta });
  ctx.webServer.register({ kind: 'exact', path: '/api/azure-glass/file/slice', handler: handleFileSlice });
  ctx.webServer.register({ kind: 'exact', path: '/api/azure-glass/file/search', handler: handleFileSearch });

  // 安全注入 /side-chat 命令（整合自已归档的 dsh-side-session）
  if (typeof ctx.inject === 'function') {
    try {
      ctx.inject(['commands', 'subagents'], (subCtx) => {
        const commands = typeof subCtx.get === 'function' ? subCtx.get('commands') : subCtx.commands;
        if (!commands || typeof commands.register !== 'function') return;
        subCtx.effect(() => commands.register({
          name: 'side-chat',
          description: '新建一个独立的旁会话（可继续对话的子代理），不影响当前会话',
          handler: async ({ agent, signal }) => {
            try {
              const subagents = typeof subCtx.get === 'function' ? subCtx.get('subagents') : subCtx.subagents;
              if (!subagents || typeof subagents.startContinuable !== 'function') {
                return { kind: 'error', text: '旁会话服务未就绪' };
              }
              await subagents.startContinuable({
                provider: 'spawn',
                label: sideChatLabel(new Date()),
                request: {
                  parent: agent,
                  prompt: [{ type: 'text', text: SIDE_CHAT_OPENING_PROMPT }]
                },
                signal
              });
              return { kind: 'success', text: '已创建旁会话' };
            } catch {
              return { kind: 'error', text: '创建旁会话失败' };
            }
          }
        }), 'dsh-azure-glass: /side-chat command');
      });
    } catch (err) {
      ctx.logger?.warn?.(`[dsh-azure-glass] /side-chat registration skipped: ${err?.message || err}`);
    }
  }
}

export { STORE_DIR, CONFIG_FILE, DEFAULT_CONFIG };
