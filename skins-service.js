/**
 * dsh-azure-glass — Skin Workshop backend service.
 *
 * Manages:
 *  - Local v2 skins under $DSH_HOME/skins/<id>/ (compatible with dsh-market.com v2 format)
 *  - Built-in curated theme catalog (installable with one click, zero external rate limit)
 *  - Safe CSS sanitization, relative asset URL rewriting, and Wallpaper Engine background stripping
 *  - Safe ZIP skin import (Zip Slip protection, hooks.mjs ignored for safety)
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const MAX_ZIP_BYTES = 40 * 1024 * 1024;
const ALLOWED_ASSET_MIME = Object.freeze({
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
});

export function resolveDshHome() {
  try {
    const envHome = typeof process.env.DSH_HOME === 'string' ? process.env.DSH_HOME.trim() : '';
    if (envHome) return envHome;
  } catch {}
  return path.join(os.homedir(), '.dsh');
}

export function resolveSkinsRoot() {
  return path.join(resolveDshHome(), 'skins');
}

function isSafeSkinId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/.test(id) && !id.includes('..');
}

function isPathInside(targetPath, rootPath) {
  const rel = path.relative(rootPath, targetPath);
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
}

// ---------------------------------------------------------------------------
// Curated community theme catalog (pure --dsw-* CSS token themes, zero JS)
// ---------------------------------------------------------------------------
function hexToRgba(hex, alpha) {
  const s = String(hex || '').trim().replace(/^#/, '');
  if (s.length !== 6) return hex;
  const r = parseInt(s.slice(0, 2), 16);
  const g = parseInt(s.slice(2, 4), 16);
  const b = parseInt(s.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return hex;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildTokenSkinCss({ dark, light }, { stripBg = false } = {}) {
  const mkVars = (t, translucent) => {
    const bgBase = translucent ? hexToRgba(t.bg, 0.58) : t.bg;
    const l1 = translucent ? hexToRgba(t.l1, 0.72) : t.l1;
    const l2 = translucent ? hexToRgba(t.l2, 0.80) : t.l2;
    const l3 = translucent ? hexToRgba(t.l3, 0.86) : t.l3;
    const sidebar = translucent ? hexToRgba(t.sidebar, 0.76) : t.sidebar;
    const overlay = translucent ? hexToRgba(t.bg, 0.92) : t.overlay;
    return [
      `  color: ${t.text};`,
      `  background-color: ${bgBase} !important;`,
      `  --dsw-alias-bg-base: ${bgBase} !important;`,
      `  --dsw-alias-bg-layer-1: ${l1} !important;`,
      `  --dsw-alias-bg-layer-2: ${l2} !important;`,
      `  --dsw-alias-bg-layer-3: ${l3} !important;`,
      `  --dsw-alias-bg-module-platform: ${l2} !important;`,
      `  --dsw-alias-bg-overlay: ${overlay} !important;`,
      `  --dsw-menu-surface-fill: ${overlay} !important;`,
      `  --dsw-specific-sidebar-fill: ${sidebar} !important;`,
      `  --dsw-alias-brand-primary: ${t.accent} !important;`,
      `  --dsw-alias-brand-text: ${t.accentText || t.accent} !important;`,
      `  --dsw-alias-button-contrast-fill: ${t.accent} !important;`,
      `  --dsw-alias-label-primary: ${t.text} !important;`,
      `  --dsw-alias-label-secondary: ${t.text2} !important;`,
      `  --dsw-alias-label-tertiary: ${t.text3} !important;`,
      `  --dsw-alias-border-l1: ${t.border} !important;`,
      `  --dsw-alias-border-l2: ${t.border} !important;`,
      `  --dsw-alias-interactive-bg-hover: ${t.hover} !important;`,
      `  --dsw-alias-interactive-bg-selected: ${t.selected} !important;`,
      `  --dsw-specific-bubble-user-fill: ${t.bubble} !important;`,
      `  --dsw-alias-markdown-code-block-bg: ${t.codeBg} !important;`
    ].join('\n');
  };

  const mkSurfaceRules = (scope, t, translucent) => {
    const bgBase = translucent ? hexToRgba(t.bg, 0.56) : t.bg;
    const sidebar = translucent ? hexToRgba(t.sidebar, 0.78) : t.sidebar;
    const header = translucent ? hexToRgba(t.l1, 0.78) : t.l1;
    const composer = translucent ? hexToRgba(t.l2, 0.86) : t.l2;
    const rightPane = translucent ? hexToRgba(t.l1, 0.80) : t.l1;
    return `
${scope} [class*="_frame"],
${scope} [data-dsh-frame],
${scope} main,
${scope} [class*="conversationColumn"],
${scope} [class*="chatArea"] {
  background-color: ${bgBase} !important;
}
${scope} aside,
${scope} nav[class*="sidebar"],
${scope} [class*="sidebarLeft"],
${scope} [data-pane="sidebar-left"] {
  background-color: ${sidebar} !important;
  border-color: ${t.border} !important;
}
${scope} [class*="sidebarRight"],
${scope} [data-pane="sidebar-right"] {
  background-color: ${rightPane} !important;
  border-color: ${t.border} !important;
}
${scope} header,
${scope} [class*="titleBar"],
${scope} [class*="sessionHeader"] {
  background: ${header} !important;
  border-color: ${t.border} !important;
}
${scope.replace('html[data-dsh-skin]', 'html[data-dsh-skin]:not([data-dsh-sg-composer-we="1"])')} [class*="composerSeat"] > div,
${scope.replace('html[data-dsh-skin]', 'html[data-dsh-skin]:not([data-dsh-sg-composer-we="1"])')} [class*="composerBox"],
${scope.replace('html[data-dsh-skin]', 'html[data-dsh-skin]:not([data-dsh-sg-composer-we="1"])')} [class*="composerContainer"] {
  background-color: ${composer} !important;
  border-color: ${t.border} !important;
}
${scope} a {
  color: ${t.accent} !important;
}`;
  };

  const lightPalette = light || dark;
  const darkPalette = dark;
  return [
    `html[data-dsh-skin], html[data-dsh-skin] body:not([data-ds-dark-theme]), html[data-dsh-skin] [data-theme="light"] {\n${mkVars(lightPalette, stripBg)}\n}`,
    `html[data-dsh-skin] body[data-ds-dark-theme], html[data-dsh-skin] [data-theme="dark"] {\n${mkVars(darkPalette, stripBg)}\n}`,
    mkSurfaceRules('html[data-dsh-skin] body:not([data-ds-dark-theme])', lightPalette, stripBg),
    mkSurfaceRules('html[data-dsh-skin] body[data-ds-dark-theme]', darkPalette, stripBg)
  ].join('\n\n');
}

export const CURATED_SKIN_CATALOG = [
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha · 摩卡暖夜',
    nameEn: 'Catppuccin Mocha',
    author: 'Catppuccin · Community',
    tagline: '柔和暖调暗夜紫灰 / 薰衣草奶紫浅色 · 舒适护眼',
    tags: ['classic', 'dark', 'pastel'],
    accent: '#cba6f7',
    swatches: ['#1e1e2e', '#eee6fa', '#cba6f7', '#89b4fa'],
    palette: {
      dark: { bg: '#1e1e2e', l1: '#181825', l2: '#313244', l3: '#45475a', overlay: '#1e1e2ef2', sidebar: '#11111b', accent: '#cba6f7', text: '#cdd6f4', text2: '#bac2de', text3: '#a6adc8', border: '#45475a88', hover: '#313244cc', selected: '#cba6f728', bubble: '#313244e6', codeBg: '#181825e6' },
      light: { bg: '#eee6fa', l1: '#e4d8f6', l2: '#f5effd', l3: '#d8c8f0', overlay: '#eee6faf5', sidebar: '#e0d2f5', accent: '#7c3aed', text: '#352a4d', text2: '#524470', text3: '#6f618f', border: '#b39ddb99', hover: '#d9caf2cc', selected: '#7c3aed26', bubble: '#ddd0f7', codeBg: '#e4d8f6' }
    }
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night · 东京夜幕',
    nameEn: 'Tokyo Night',
    author: 'Tokyo Night · Community',
    tagline: '深邃午夜蓝底 / 清透雾靛蓝浅色 · 霓虹星紫点缀',
    tags: ['classic', 'dark', 'neon'],
    accent: '#7aa2f7',
    swatches: ['#1a1b26', '#e0e9fa', '#7aa2f7', '#bb9af7'],
    palette: {
      dark: { bg: '#1a1b26', l1: '#16161e', l2: '#24283b', l3: '#2f3549', overlay: '#1a1b26f2', sidebar: '#16161e', accent: '#7aa2f7', text: '#c0caf5', text2: '#a9b1d6', text3: '#737aa2', border: '#3b426188', hover: '#292e42cc', selected: '#7aa2f728', bubble: '#24283be6', codeBg: '#16161ee6' },
      light: { bg: '#e0e9fa', l1: '#d2dff5', l2: '#edf3fc', l3: '#c2d3f0', overlay: '#e0e9faf5', sidebar: '#ccdcf5', accent: '#2b50a1', text: '#1f2b4a', text2: '#39486d', text3: '#59698f', border: '#8fa9d999', hover: '#c7d7f2cc', selected: '#2b50a124', bubble: '#cdddf8', codeBg: '#d2dff5' }
    }
  },
  {
    id: 'nord-frost',
    name: 'Nord · 北欧冰霜',
    nameEn: 'Nord Frost',
    author: 'Nord · Community',
    tagline: '极地冰川灰蓝 / 清冷北欧冰雾浅色 · 克制极简',
    tags: ['classic', 'dark', 'minimal'],
    accent: '#88c0d0',
    swatches: ['#2e3440', '#dfecf2', '#88c0d0', '#5e81ac'],
    palette: {
      dark: { bg: '#2e3440', l1: '#272c36', l2: '#3b4252', l3: '#434c5e', overlay: '#2e3440f2', sidebar: '#242933', accent: '#88c0d0', text: '#eceff4', text2: '#d8dee9', text3: '#9aa5b8', border: '#4c566a88', hover: '#3b4252cc', selected: '#88c0d028', bubble: '#3b4252e6', codeBg: '#242933e6' },
      light: { bg: '#dfecf2', l1: '#d1e3ec', l2: '#ebf4f8', l3: '#c2d9e4', overlay: '#dfecf2f5', sidebar: '#cadfe9', accent: '#3d6b99', text: '#22303c', text2: '#384c5c', text3: '#566d7e', border: '#88aec299', hover: '#c4dce8cc', selected: '#3d6b9924', bubble: '#cce2ed', codeBg: '#d1e3ec' }
    }
  },
  {
    id: 'rose-pine',
    name: 'Rosé Pine · 玫瑰松针',
    nameEn: 'Rose Pine',
    author: 'Rosé Pine · Community',
    tagline: '雾玫瑰粉与松木紫夜 / 暖玫瑰奶油浅色 · 优雅艺术风',
    tags: ['classic', 'dark', 'soft'],
    accent: '#ebbcba',
    swatches: ['#191724', '#f8eae5', '#ebbcba', '#c96965'],
    palette: {
      dark: { bg: '#191724', l1: '#1f1d2e', l2: '#26233a', l3: '#312e48', overlay: '#1f1d2ef2', sidebar: '#151320', accent: '#ebbcba', text: '#e0def4', text2: '#b8b4d0', text3: '#908caa', border: '#403d5288', hover: '#26233acc', selected: '#ebbcba26', bubble: '#26233ae6', codeBg: '#1f1d2ee6' },
      light: { bg: '#f8eae5', l1: '#f2ddd6', l2: '#fcf3f0', l3: '#e9cdc4', overlay: '#f8eae5f5', sidebar: '#efd7cf', accent: '#b85350', text: '#423347', text2: '#635069', text3: '#87728c', border: '#d4a69e99', hover: '#ebd0c7cc', selected: '#b8535022', bubble: '#efd4cb', codeBg: '#f2ddd6' }
    }
  },
  {
    id: 'dracula-velvet',
    name: 'Dracula · 暗夜伯爵',
    nameEn: 'Dracula Velvet',
    author: 'Dracula · Community',
    tagline: '高对比魅紫荧光 / 轻魅丁香紫浅色 · 经典程序员风',
    tags: ['classic', 'dark', 'vivid'],
    accent: '#bd93f9',
    swatches: ['#282a36', '#efe8fb', '#bd93f9', '#ff79c6'],
    palette: {
      dark: { bg: '#282a36', l1: '#21222c', l2: '#343746', l3: '#44475a', overlay: '#282a36f2', sidebar: '#1e1f29', accent: '#bd93f9', text: '#f8f8f2', text2: '#d6d8e5', text3: '#9aa2c4', border: '#6272a466', hover: '#44475acc', selected: '#bd93f928', bubble: '#343746e6', codeBg: '#21222ce6' },
      light: { bg: '#efe8fb', l1: '#e4d8f7', l2: '#f7f2fe', l3: '#d8c7f2', overlay: '#efe8fbf5', sidebar: '#dfd0f6', accent: '#7c3aed', text: '#28233d', text2: '#463f63', text3: '#68608a', border: '#a78bfa88', hover: '#d9c8f4cc', selected: '#7c3aed24', bubble: '#e0d2f8', codeBg: '#e4d8f7' }
    }
  },
  {
    id: 'kanagawa-wave',
    name: 'Kanagawa · 神奈川浮世绘',
    nameEn: 'Kanagawa Wave',
    author: 'Kanagawa · Community',
    tagline: '墨青暖金暗色 / 和纸暖米金浅色 · 浮世绘名画质感',
    tags: ['art', 'dark', 'warm'],
    accent: '#7e9cd8',
    swatches: ['#1f1f28', '#f3ead0', '#7e9cd8', '#dca561'],
    palette: {
      dark: { bg: '#1f1f28', l1: '#1a1a22', l2: '#2a2a37', l3: '#363646', overlay: '#1f1f28f2', sidebar: '#16161d', accent: '#7e9cd8', text: '#dcd7ba', text2: '#c8c093', text3: '#938aa9', border: '#54546d77', hover: '#2a2a37cc', selected: '#7e9cd828', bubble: '#2a2a37e6', codeBg: '#16161de6' },
      light: { bg: '#f3ead0', l1: '#eadcb8', l2: '#f8f2e0', l3: '#dfd0a5', overlay: '#f3ead0f5', sidebar: '#e6d6ae', accent: '#3d5c94', text: '#3a3730', text2: '#575246', text3: '#756e5f', border: '#b8a67d99', hover: '#e2d2a8cc', selected: '#3d5c9424', bubble: '#e8d9b2', codeBg: '#eadcb8' }
    }
  },
  {
    id: 'everforest-mist',
    name: 'Everforest · 常青森林',
    nameEn: 'Everforest Mist',
    author: 'Everforest · Community',
    tagline: '护眼森系苔绿 / 羊皮纸嫩绿浅色 · 舒缓不刺眼',
    tags: ['eye-care', 'dark', 'nature'],
    accent: '#a7c080',
    swatches: ['#2d353b', '#ebf2df', '#a7c080', '#5e8a3c'],
    palette: {
      dark: { bg: '#2d353b', l1: '#272e33', l2: '#343f44', l3: '#3d484d', overlay: '#2d353bf2', sidebar: '#232a2e', accent: '#a7c080', text: '#d3c6aa', text2: '#b8ae96', text3: '#859289', border: '#4f585e88', hover: '#343f44cc', selected: '#a7c08026', bubble: '#343f44e6', codeBg: '#232a2ee6' },
      light: { bg: '#ebf2df', l1: '#dfebd0', l2: '#f4f8ec', l3: '#d2e2be', overlay: '#ebf2dff5', sidebar: '#d9e6c7', accent: '#4d7c2b', text: '#2e3b2e', text2: '#495c49', text3: '#687d68', border: '#9ab38299', hover: '#d2e1becc', selected: '#4d7c2b22', bubble: '#dae7c8', codeBg: '#dfebd0' }
    }
  },
  {
    id: 'sakura-blossom',
    name: 'Sakura · 樱落柔光',
    nameEn: 'Sakura Blossom',
    author: 'Azure Glass Community',
    tagline: '夜樱粉紫暗色 / 樱花粉云浅色 · 甜美柔和二次元风',
    tags: ['anime', 'pink', 'soft'],
    accent: '#f472b6',
    swatches: ['#1d1726', '#fce7f1', '#f472b6', '#db2777'],
    palette: {
      dark: { bg: '#1d1726', l1: '#231b2e', l2: '#2d223b', l3: '#3a2c4b', overlay: '#1d1726f2', sidebar: '#171220', accent: '#f472b6', text: '#f7eaf4', text2: '#d8c3d8', text3: '#a892b0', border: '#f472b633', hover: '#332542cc', selected: '#f472b629', bubble: '#2d223be6', codeBg: '#171220e6' },
      light: { bg: '#fce7f1', l1: '#f8d6e7', l2: '#fef1f7', l3: '#f4c4dc', overlay: '#fce7f1f5', sidebar: '#f6cfe2', accent: '#db2777', text: '#3d1e32', text2: '#6b3a58', text3: '#945d7f', border: '#e592bb99', hover: '#f4c6dccc', selected: '#db277722', bubble: '#f7cfe3', codeBg: '#f8d6e7' }
    }
  }
];

export const COMMUNITY_SKIN_SITES = [
  {
    id: 'dsh-market',
    name: 'DSH 创意工坊（dsh-market.com）',
    url: 'https://dsh-market.com/',
    desc: '主流 DSH 皮肤与视觉主题分享站，支持下载标准 v2 皮肤包后直接导入苍蓝琉璃使用。'
  },
  {
    id: 'dsh-so',
    name: 'DSH Plugin Market（dsh.so）',
    url: 'https://dsh.so/',
    desc: '全网 DSH 社区插件与 UI / Skins 主题聚合索引目录。'
  },
  {
    id: 'math-lrz-theme-pack',
    name: 'dsh-theme-pack（GitHub）',
    url: 'https://github.com/math-lrz/dsh-theme-pack',
    desc: '16 套经典语义变量主题（Catppuccin、Tokyo Night、Nord、Dracula 等）。'
  },
  {
    id: 'whyihaveyou-themes',
    name: 'dsh-themes（GitHub）',
    url: 'https://github.com/whyihaveyou/dsh-themes',
    desc: '百余款昼夜一体主题，涵盖大量二次元角色与复古美学风格。'
  }
];

// ---------------------------------------------------------------------------
// Local skins scanning & reading ($DSH_HOME/skins/<id>/)
// ---------------------------------------------------------------------------
export function listLocalSkins() {
  const root = resolveSkinsRoot();
  if (!fs.existsSync(root)) return [];
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const list = [];
  for (const ent of entries) {
    if (!ent.isDirectory() || !isSafeSkinId(ent.name)) continue;
    const dir = path.join(root, ent.name);
    const jsonPath = path.join(dir, 'skin.json');
    const cssPath = path.join(dir, 'skin.css');
    if (!fs.existsSync(jsonPath) && !fs.existsSync(cssPath)) continue;
    let meta = {};
    try {
      if (fs.existsSync(jsonPath)) {
        meta = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      }
    } catch {
      continue; // fail-closed on malformed skin.json
    }
    const id = ent.name;
    const previewLight = typeof meta?.preview?.light === 'string' ? meta.preview.light : '';
    const previewDark = typeof meta?.preview?.dark === 'string' ? meta.preview.dark : '';
    const hasLight = previewLight && fs.existsSync(path.join(dir, previewLight));
    const hasDark = previewDark && fs.existsSync(path.join(dir, previewDark));
    list.push({
      id,
      name: typeof meta.name === 'string' ? meta.name : (meta?.name?.zh || meta?.name?.en || id),
      nameEn: typeof meta.nameEn === 'string' ? meta.nameEn : (meta?.name?.en || ''),
      author: typeof meta.author === 'string' ? meta.author : 'Local Skin',
      tagline: typeof meta.tagline === 'string' ? meta.tagline : (meta?.tagline?.zh || meta?.tagline?.en || ''),
      description: typeof meta.description === 'string' ? meta.description : '',
      tags: Array.isArray(meta.tags) ? meta.tags.slice(0, 8).map(String) : [],
      accent: typeof meta.accent === 'string' ? meta.accent : (typeof meta.accentColor === 'string' ? meta.accentColor : '#38bdf8'),
      version: typeof meta.version === 'string' ? meta.version : '1.0.0',
      hasPatches: fs.existsSync(path.join(dir, 'patches.css')),
      hasHooksIgnored: fs.existsSync(path.join(dir, 'hooks.mjs')),
      previewLight: hasLight ? `/api/azure-glass/skins/asset?id=${encodeURIComponent(id)}&file=${encodeURIComponent(previewLight)}` : '',
      previewDark: hasDark ? `/api/azure-glass/skins/asset?id=${encodeURIComponent(id)}&file=${encodeURIComponent(previewDark)}` : '',
      source: 'local'
    });
  }
  return list.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));
}

function sanitizeAndRewriteSkinCss(rawCss, skinId, { stripBg = false } = {}) {
  if (typeof rawCss !== 'string' || !rawCss.trim()) return '';
  // 1. Strip dangerous constructs (@import, expression, javascript:)
  let css = rawCss
    .replace(/@import\s+[^;]+;/gi, '/* blocked @import */')
    .replace(/expression\s*\([^)]*\)/gi, 'none')
    .replace(/url\(\s*(['"]?)\s*javascript:[^)]*\)/gi, 'none');

  // 2. Rewrite relative asset urls to our guarded asset route; block remote/protocol-relative urls
  css = css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (full, _q, rawUrl) => {
    const u = String(rawUrl || '').trim();
    if (!u || u.startsWith('data:image/')) return full;
    if (/^(?:https?:|file:|\/\/)/i.test(u) || u.includes('..')) {
      return 'none';
    }
    const cleanRel = u.replace(/^\.?\//, '').replace(/\\/g, '/');
    if (stripBg) {
      // When Wallpaper Engine is active, strip image/video background URLs so WE wallpaper shines through
      if (/\.(png|jpe?g|webp|gif|avif|mp4|webm|svg)(?:\?.*)?$/i.test(cleanRel)) {
        return 'none';
      }
    }
    return `url("/api/azure-glass/skins/asset?id=${encodeURIComponent(skinId)}&file=${encodeURIComponent(cleanRel)}")`;
  });

  if (stripBg) {
    // Also neutralize inline data:image background-image declarations when WE wallpaper is active
    css = css.replace(/background-image\s*:\s*url\(\s*['"]?data:image\/[^)]+\)\s*(!important)?\s*;/gi, 'background-image: none;');
  }
  return css;
}

export function getSkinStyleBundle(skinId, { stripBg = false } = {}) {
  if (!isSafeSkinId(skinId)) return { ok: false, error: 'invalid skin id' };
  const root = resolveSkinsRoot();
  const dir = path.join(root, skinId);
  if (!fs.existsSync(dir)) {
    // Fallback: allow previewing/applying curated built-in skin directly without installing first
    const curated = CURATED_SKIN_CATALOG.find((x) => x.id === skinId);
    if (curated) {
      return {
        ok: true,
        id: curated.id,
        name: curated.name,
        css: buildTokenSkinCss(curated.palette, { stripBg }),
        strippedBg: Boolean(stripBg)
      };
    }
    return { ok: false, error: 'skin not found' };
  }

  let realRoot, realDir;
  try {
    realRoot = fs.realpathSync(root);
    realDir = fs.realpathSync(dir);
  } catch {
    return { ok: false, error: 'skin directory inaccessible' };
  }
  if (!isPathInside(realDir, realRoot)) {
    return { ok: false, error: 'skin path outside root' };
  }

  let cssParts = [];
  const mainCss = path.join(realDir, 'skin.css');
  const patchCss = path.join(realDir, 'patches.css');
  if (fs.existsSync(mainCss)) {
    cssParts.push(sanitizeAndRewriteSkinCss(fs.readFileSync(mainCss, 'utf-8'), skinId, { stripBg }));
  }
  if (fs.existsSync(patchCss)) {
    cssParts.push(sanitizeAndRewriteSkinCss(fs.readFileSync(patchCss, 'utf-8'), skinId, { stripBg }));
  }

  if (stripBg) {
    // Ensure Wallpaper Engine layer stays completely unobstructed while keeping skin palette
    cssParts.push(`
/* Wallpaper Engine active — yield skin background layers */
html, body, #root, [class*="_frame"] {
  background-image: none !important;
}
body::before, body::after, #root::before, #root::after {
  background-image: none !important;
}
`);
  }

  return {
    ok: true,
    id: skinId,
    css: cssParts.join('\n\n'),
    strippedBg: Boolean(stripBg)
  };
}

export function deleteLocalSkin(skinId) {
  if (!isSafeSkinId(skinId)) return { ok: false, error: 'invalid skin id' };
  const root = resolveSkinsRoot();
  const dir = path.join(root, skinId);
  if (!fs.existsSync(dir)) return { ok: false, error: 'skin not found' };
  const realRoot = fs.realpathSync(root);
  const realDir = fs.realpathSync(dir);
  if (!isPathInside(realDir, realRoot)) return { ok: false, error: 'forbidden path' };
  fs.rmSync(realDir, { recursive: true, force: true });
  return { ok: true, id: skinId };
}

function copySkinFilesSafe(srcDir, dstDir) {
  fs.mkdirSync(dstDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const ent of entries) {
    if (ent.name === 'hooks.mjs' || ent.name === 'hooks.js' || ent.name.startsWith('.')) continue;
    const srcPath = path.join(srcDir, ent.name);
    const dstPath = path.join(dstDir, ent.name);
    if (ent.isSymbolicLink()) continue;
    if (ent.isDirectory()) {
      copySkinFilesSafe(srcPath, dstPath);
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase();
      if (ext === '.json' || ext === '.css' || ext === '.md' || ext === '.txt' || ALLOWED_ASSET_MIME[ext]) {
        fs.copyFileSync(srcPath, dstPath);
      }
    }
  }
}

export async function importSkinZip(base64Data, rawFileName = '') {
  const b64 = String(base64Data || '').replace(/^data:[^;]+;base64,/, '').trim();
  if (!b64) return { ok: false, error: 'empty zip payload' };
  const buf = Buffer.from(b64, 'base64');
  if (buf.length > MAX_ZIP_BYTES) return { ok: false, error: 'zip file too large (max 40MB)' };

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-ag-skin-'));
  const zipPath = path.join(tmpDir, 'upload.zip');
  const extractDir = path.join(tmpDir, 'extracted');
  try {
    fs.writeFileSync(zipPath, buf);
    fs.mkdirSync(extractDir, { recursive: true });
    if (process.platform === 'win32') {
      await execFileAsync('powershell.exe', [
        '-NoProfile', '-NonInteractive', '-Command',
        `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${extractDir.replace(/'/g, "''")}' -Force`
      ], { timeout: 25000 });
    } else {
      await execFileAsync('unzip', ['-o', '-q', zipPath, '-d', extractDir], { timeout: 25000 });
    }

    // Locate skin root (either extractDir itself or single nested directory)
    let skinSrc = extractDir;
    const topEntries = fs.readdirSync(extractDir, { withFileTypes: true }).filter((e) => !e.name.startsWith('__MACOSX'));
    if (!fs.existsSync(path.join(skinSrc, 'skin.json')) && !fs.existsSync(path.join(skinSrc, 'skin.css'))) {
      const subDir = topEntries.find((e) => e.isDirectory());
      if (subDir) skinSrc = path.join(extractDir, subDir.name);
    }

    const hasJson = fs.existsSync(path.join(skinSrc, 'skin.json'));
    const hasCss = fs.existsSync(path.join(skinSrc, 'skin.css'));
    if (!hasJson && !hasCss) {
      return { ok: false, error: '压缩包内未找到 skin.json 或 skin.css（请导入标准 DSH v2 皮肤包）' };
    }

    let meta = {};
    if (hasJson) {
      try {
        meta = JSON.parse(fs.readFileSync(path.join(skinSrc, 'skin.json'), 'utf-8'));
      } catch {
        return { ok: false, error: 'skin.json 格式解析失败' };
      }
    }

    const fallbackId = String(rawFileName || `skin-${Date.now().toString(36)}`)
      .replace(/\.zip$/i, '')
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || `skin-${Date.now().toString(36)}`;
    const skinId = isSafeSkinId(meta.id) ? meta.id : fallbackId;
    if (!isSafeSkinId(skinId)) return { ok: false, error: '皮肤 ID 不合法' };

    const skinsRoot = resolveSkinsRoot();
    fs.mkdirSync(skinsRoot, { recursive: true });
    const targetDir = path.join(skinsRoot, skinId);
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    copySkinFilesSafe(skinSrc, targetDir);

    if (!fs.existsSync(path.join(targetDir, 'skin.json'))) {
      fs.writeFileSync(path.join(targetDir, 'skin.json'), JSON.stringify({
        skinManifestVersion: 2,
        id: skinId,
        name: skinId,
        author: 'Imported',
        version: '1.0.0'
      }, null, 2), 'utf-8');
    }

    return { ok: true, id: skinId, name: meta.name || skinId };
  } catch (err) {
    return { ok: false, error: err?.message || 'zip import failed' };
  } finally {
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }
}

export function serveSkinAsset(req, res) {
  const urlObj = new URL(req.url || '/', 'http://localhost');
  const skinId = urlObj.searchParams.get('id') || '';
  const relFile = urlObj.searchParams.get('file') || '';
  if (!isSafeSkinId(skinId) || !relFile || relFile.includes('..') || path.isAbsolute(relFile)) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'invalid asset request' }));
    return;
  }
  const root = resolveSkinsRoot();
  const skinDir = path.join(root, skinId);
  const candidate = path.join(skinDir, relFile);
  let realSkinDir, realFile;
  try {
    realSkinDir = fs.realpathSync(skinDir);
    realFile = fs.realpathSync(candidate);
  } catch {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'asset not found' }));
    return;
  }
  if (!isPathInside(realFile, realSkinDir)) {
    res.statusCode = 403;
    res.end(JSON.stringify({ error: 'forbidden asset path' }));
    return;
  }
  const ext = path.extname(realFile).toLowerCase();
  const mime = ALLOWED_ASSET_MIME[ext];
  if (!mime) {
    res.statusCode = 403;
    res.end(JSON.stringify({ error: 'unsupported asset type' }));
    return;
  }
  const stat = fs.statSync(realFile);
  res.writeHead(200, {
    'Content-Type': mime,
    'Content-Length': stat.size,
    'Cache-Control': 'public, max-age=600'
  });
  fs.createReadStream(realFile).pipe(res);
}
