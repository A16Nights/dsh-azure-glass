/**
 * dsh-azure-glass — browser half (苍蓝琉璃工坊 v2).
 *
 * 5-Tab Studio UI (Settings + Right Sidebar):
 *  1. ⚡ 性能引擎: Viewport DOM Virtualizer, Instant Windowed Jump, Lazy Images, Visibility Pause, 0.2.2 Ghost Gap & Settings Scroll Fix
 *  2. 🖼️ 壁纸引擎: True --dsw-alias-bg-* transparency passthrough, Upload/URL, Fit, Pos X/Y, Scale, Opacity, Brightness, Saturate, Blur, Scrim
 *  3. 🪟 玻璃质感: Adaptive Light/Dark Glass, Chat/Sidebar/RightSidebar/Composer/Modal Blur & Opacity, Border, Radius, Minimal Scrollbar
 *  4. 🎨 色彩排版: Full ColorLab parity (18 UI Slots + 9 Markdown Prose Roles + WCAG Contrast Badge + Random Accent + Fonts + Saved Presets)
 *  5. 📑 Antigravity布局: Merged Turn Anchor Rail (Antigravity-style pill + dots + popover), Instant Jump, Compact Code Folding, Smooth Scroll, Auto-Fold
 */

window.__ModuleLoader__.load({
  id: 'dsh-azure-glass',
  factory: (require) => {
    const module = { exports: {} };
    const exports = module.exports;

    const React = require('react');
    const jsxRuntime = require('react/jsx-runtime');
    const jsx = jsxRuntime.jsx;
    const jsxs = jsxRuntime.jsxs;

    const NS = 'dsh-azure-glass';
    const PLUGIN_VERSION = '0.1.0';
    const SECTION_SLOT = 'settings.section';
    const STYLE_ID = 'dsh-azure-glass-style';
    const CACHE_KEY = 'dsh_azure_glass_config_v3';
    const API_BASE = '/api/azure-glass';

    const UI_COLOR_SLOTS = [
      { key: 'bgBase', label: '主画布背景', token: '--dsw-alias-bg-base', fallback: '#141720' },
      { key: 'bgLayer1', label: '一级表面背景', token: '--dsw-alias-bg-layer-1', fallback: '#1b1f2b' },
      { key: 'bgLayer2', label: '二级卡片背景', token: '--dsw-alias-bg-layer-2', fallback: '#222736' },
      { key: 'bgLayer3', label: '三级浮层背景', token: '--dsw-alias-bg-layer-3', fallback: '#2a3042' },
      { key: 'sidebarFill', label: '左侧栏底色', token: '--dsw-specific-sidebar-fill', fallback: '#161a24' },
      { key: 'menuFill', label: '菜单/弹窗底色', token: '--dsw-menu-surface-fill', fallback: '#1f2433' },
      { key: 'brandPrimary', label: '主强调色 (Accent)', token: '--dsw-alias-brand-primary', fallback: '#38bdf8' },
      { key: 'brandText', label: '强调文字色', token: '--dsw-alias-brand-text', fallback: '#7dd3fc' },
      { key: 'labelPrimary', label: '主文字色', token: '--dsw-alias-label-primary', fallback: '#e2e8f0' },
      { key: 'labelSecondary', label: '次级文字色', token: '--dsw-alias-label-secondary', fallback: '#94a3b8' },
      { key: 'labelTertiary', label: '三级/说明文字色', token: '--dsw-alias-label-tertiary', fallback: '#64748b' },
      { key: 'link', label: '超链接颜色', token: '--dsw-alias-link', fallback: '#38bdf8' },
      { key: 'borderL1', label: '一级边框色', token: '--dsw-alias-border-l1', fallback: '#2e3648' },
      { key: 'borderL2', label: '二级边框色', token: '--dsw-alias-border-l2', fallback: '#3b455c' },
      { key: 'hoverBg', label: '悬停高亮底色', token: '--dsw-alias-interactive-bg-hover', fallback: '#263044' },
      { key: 'activeBg', label: '选中激活底色', token: '--dsw-alias-interactive-bg-active', fallback: '#2f3d57' },
      { key: 'userBubbleBg', label: '用户消息气泡底色', token: null, fallback: '#1e293b' },
      { key: 'codeBlockBg', label: '代码块背景底色', token: null, fallback: '#0f172a' }
    ];

    const PROSE_COLOR_SLOTS = [
      { key: 'heading', label: '标题 / 表头', fallback: '#7dd3fc' },
      { key: 'strong', label: '加粗文字', fallback: '#f8fafc' },
      { key: 'em', label: '斜体文字', fallback: '#cbd5e1' },
      { key: 'code', label: '行内代码', fallback: '#38bdf8' },
      { key: 'marker', label: '列表标记', fallback: '#38bdf8' },
      { key: 'quote', label: '引用文字', fallback: '#94a3b8' },
      { key: 'quoteBorder', label: '引用竖线', fallback: '#38bdf8' },
      { key: 'link', label: '正文链接', fallback: '#38bdf8' },
      { key: 'del', label: '删除线文字', fallback: '#64748b' }
    ];

    const DEFAULT_CONFIG = {
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

      wallpaperEnabled: true,
      wallpaperSource: 'uploaded',
      wallpaperUrl: '',
      wallpaperFit: 'cover',
      wallpaperPosX: 50,
      wallpaperPosY: 50,
      wallpaperScale: 100,
      wallpaperOpacity: 0.45,
      wallpaperBrightness: 100,
      wallpaperSaturate: 105,
      wallpaperBlurPx: 0,
      wallpaperBlurEmptyPx: 0,
      wallpaperBlurContentPx: 0,
      wallpaperScrim: 0.28,
      wallpaperVersion: 0,
      wallpaperMime: '',
      wallpaperVideoMuted: true,
      wallpaperVideoVolume: 0.3,
      hasUploadedWallpaper: false,
      bgEffectMode: 'none',
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

      glassEnabled: true,
      glassBlurPx: 12,
      glassSurfaceOpacity: 0.60,
      glassChatBgOpacity: 0.42,
      glassRightSidebarOpacity: 0.56,
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

      colorPreset: 'default',
      uiColors: {},
      proseColors: {},
      proseBoost: 'off',
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

      antigravityLayout: true,
      chatMaxWidthPx: 0,
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

      fxClickEnabled: false,
      fxClickStyle: 'both',
      fxTrailEnabled: false,
      fxTrailStyle: 'comet',
      fxColorMode: 'accent',
      fxColor: '#38bdf8',
      fxSize: 1,
      fxGlow: 65,
      fxOpacity: 0.9,
      fxBlend: 'screen',
      userAvatarUrl: '',
      assistantAvatarUrl: '',
      savedUserAvatars: [],
      savedAssistantAvatars: [],

      customCssEnabled: false,
      customCss: '',

      studioUiTheme: {
        activeId: 'official-azure',
        customDraft: { primary: '#3b82f6', secondary: '#7c3aed' },
        slots: [null, null, null, null]
      },

      weControlGlass: true,
      weControlComposer: true,
      weControlColor: true,
      weControlAvatar: true,

      mermaidEnabled: true,
      activeSkinId: '',
      skinRespectWe: true,
      pluginUpdaterPlacement: 'both',

      cookieGuardEnabled: true,
      cookieGuardMaxHeaderBytes: 262144,
      cookieGuardKeepOtherCookies: 3,
      cookieGuardCookieBudgetBytes: 4096,
      dragAndDropEnabled: true,
      chatLinkActionsEnabled: true,
      conversationSearchEnabled: true,
      observerEnabled: true,
      observerShowBalance: true,
      observerModalOpacity: 0.86,
      observerModalBlurPx: 22,
      observerModalBgColor: '#1a1d29'
    };

    const STUDIO_UI_OFFICIAL_THEMES = [
      {
        id: 'official-azure',
        name: '苍蓝星辉',
        desc: '默认官方 · 苍蓝主体 + 柔紫尾韵',
        primary: '#3b82f6',
        secondary: '#7c3aed',
        badge: '默认'
      },
      {
        id: 'official-violet',
        name: '星雾黑紫',
        desc: '官方经典 · 星紫主体 + 苍蓝尾韵',
        primary: '#8b5cf6',
        secondary: '#3b82f6',
        badge: '官方'
      }
    ];
    const STUDIO_UI_SWATCHES = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#ec4899', '#f59e0b', '#f43f5e', '#6366f1'];
    let studioThemePreview = null;
    let dshThemeService = null;
    const dshThemeListeners = new Set();

    function notifyDshThemeListeners() {
      const cur = detectTheme();
      for (const fn of dshThemeListeners) {
        try { fn(cur); } catch {}
      }
    }

    function toggleDshThemeMode() {
      const next = detectTheme() === 'dark' ? 'light' : 'dark';
      if (dshThemeService && typeof dshThemeService.setTheme === 'function') {
        try {
          dshThemeService.setTheme(next);
          setTimeout(() => {
            applyVisualStyles();
            notifyDshThemeListeners();
          }, 0);
          return next;
        } catch (err) {
          console.warn('[dsh-azure-glass] theme.setTheme failed:', err);
        }
      }
      if (document.body) {
        if (next === 'dark') document.body.setAttribute('data-ds-dark-theme', '');
        else document.body.removeAttribute('data-ds-dark-theme');
      }
      applyVisualStyles();
      notifyDshThemeListeners();
      return next;
    }

    function normalizeHex6(val, fallback) {
      const s = String(val || '').trim();
      if (/^#[0-9a-fA-F]{6}$/.test(s)) return s.toLowerCase();
      if (/^[0-9a-fA-F]{6}$/.test(s)) return `#${s.toLowerCase()}`;
      return fallback;
    }

    function parseHexRgb6(hex) {
      const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
      if (!m) return [59, 130, 246];
      const n = parseInt(m[1], 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    function rgbToHex6(r, g, b) {
      const cl = (v) => Math.max(0, Math.min(255, Math.round(v)));
      return '#' + [cl(r), cl(g), cl(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
    }

    function mixHexColor(h1, h2, w2) {
      const a = parseHexRgb6(h1);
      const b = parseHexRgb6(h2);
      const w1 = 1 - w2;
      return rgbToHex6(a[0] * w1 + b[0] * w2, a[1] * w1 + b[1] * w2, a[2] * w1 + b[2] * w2);
    }

    function hexRgba(hex, alpha) {
      const c = parseHexRgb6(hex);
      return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`;
    }

    function sanitizeStudioUiTheme(raw) {
      const def = {
        activeId: 'official-azure',
        customDraft: { primary: '#3b82f6', secondary: '#7c3aed' },
        slots: [null, null, null, null]
      };
      if (!raw || typeof raw !== 'object') return def;
      const slots = Array.from({ length: 4 }, (_, i) => {
        const it = Array.isArray(raw.slots) ? raw.slots[i] : null;
        if (!it || typeof it !== 'object') return null;
        const p = normalizeHex6(it.primary, '');
        const s = normalizeHex6(it.secondary, '');
        if (!p || !s) return null;
        const name = String(it.name || `自定义 ${i + 1}`).trim().slice(0, 18) || `自定义 ${i + 1}`;
        return { id: `slot-${i}`, name, primary: p, secondary: s };
      });
      const customDraft = {
        primary: normalizeHex6(raw.customDraft?.primary, def.customDraft.primary),
        secondary: normalizeHex6(raw.customDraft?.secondary, def.customDraft.secondary)
      };
      let activeId = typeof raw.activeId === 'string' ? raw.activeId.trim() : def.activeId;
      const isOff = STUDIO_UI_OFFICIAL_THEMES.some((x) => x.id === activeId);
      const sm = /^slot-([0-3])$/.exec(activeId);
      const isSlot = sm ? Boolean(slots[Number(sm[1])]) : false;
      if (!isOff && !isSlot && activeId !== 'custom') activeId = def.activeId;
      return { activeId, customDraft, slots };
    }

    function resolveStudioUiTheme(raw) {
      const tc = sanitizeStudioUiTheme(raw);
      const off = STUDIO_UI_OFFICIAL_THEMES.find((x) => x.id === tc.activeId);
      if (off) return { id: off.id, name: off.name, primary: off.primary, secondary: off.secondary, config: tc };
      const sm = /^slot-([0-3])$/.exec(tc.activeId);
      if (sm && tc.slots[Number(sm[1])]) {
        const sl = tc.slots[Number(sm[1])];
        return { id: sl.id, name: sl.name, primary: sl.primary, secondary: sl.secondary, config: tc };
      }
      return { id: 'custom', name: '自定义', primary: tc.customDraft.primary, secondary: tc.customDraft.secondary, config: tc };
    }

    function makeStudioThemeGrad(p, s, mid = 58) {
      const pDark = mixHexColor(p, '#0f172a', 0.18);
      return `linear-gradient(135deg, ${pDark} 0%, ${p} ${mid}%, ${s} 100%)`;
    }

    function computeStudioUiPalette(primaryHex, secondaryHex, isLight) {
      const p = normalizeHex6(primaryHex, '#3b82f6');
      const s = normalizeHex6(secondaryHex, '#7c3aed');
      const pDark = mixHexColor(p, '#0f172a', 0.18);
      const pDeep = mixHexColor(p, '#0f172a', 0.30);
      const pLight = mixHexColor(p, '#ffffff', 0.68);
      const pBorder = mixHexColor(p, '#ffffff', 0.32);
      const darkCard = mixHexColor('#141928', p, 0.07);
      const darkSolid = mixHexColor('#161c2c', p, 0.08);
      const darkInput = mixHexColor('#0e1320', p, 0.06);
      const darkHover = mixHexColor('#1a2136', p, 0.12);
      const lightCard = mixHexColor('#f9faff', p, 0.03);
      const lightHover = mixHexColor('#f4f7ff', p, 0.08);
      const titleLight = mixHexColor('#0f172a', p, 0.22);
      return {
        p, s, pDark, pDeep, pLight, pBorder,
        grad: `linear-gradient(135deg, ${pDark} 0%, ${p} 58%, ${s} 100%)`,
        switchGrad: `linear-gradient(135deg, ${pDark} 0%, ${p} 68%, ${s} 100%)`,
        cardBg: isLight ? hexRgba(lightCard, 0.94) : hexRgba(darkCard, 0.89),
        popBg: isLight ? hexRgba(lightCard, 0.97) : hexRgba(darkSolid, 0.95),
        menuBg: isLight ? hexRgba(lightCard, 0.98) : hexRgba(darkSolid, 0.97),
        inputBg: isLight ? 'rgba(255, 255, 255, 0.92)' : hexRgba(darkInput, 0.86),
        triggerHoverBg: isLight ? hexRgba(lightHover, 0.98) : hexRgba(darkHover, 0.94),
        tabsBg: isLight ? hexRgba(p, 0.06) : hexRgba(darkInput, 0.74),
        borderSoft: isLight ? hexRgba(p, 0.16) : hexRgba(pBorder, 0.22),
        borderCard: isLight ? hexRgba(p, 0.22) : hexRgba(pBorder, 0.32),
        borderPop: isLight ? hexRgba(p, 0.28) : hexRgba(pBorder, 0.38),
        borderSubtle: isLight ? hexRgba(p, 0.12) : hexRgba(pBorder, 0.16),
        hoverBg: isLight ? hexRgba(p, 0.08) : hexRgba(p, 0.15),
        hoverRowBg: isLight ? hexRgba(p, 0.05) : hexRgba(p, 0.09),
        hoverBorder: isLight ? hexRgba(pDark, 0.56) : hexRgba(p, 0.68),
        focusRing: hexRgba(p, 0.26),
        glowShadow: hexRgba(pDark, 0.34),
        glowShadowStrong: hexRgba(p, 0.44),
        badgeBg: isLight ? hexRgba(p, 0.12) : hexRgba(p, 0.18),
        badgeBorder: isLight ? hexRgba(p, 0.32) : hexRgba(pBorder, 0.40),
        badgeText: isLight ? pDeep : pLight,
        accentText: isLight ? pDeep : pLight,
        titleText: isLight ? titleLight : '#f8fafc',
        headingText: isLight ? titleLight : '#e2e8f0',
        btnText: isLight ? titleLight : '#e2e8f0',
        scrollHover: isLight ? hexRgba(pDark, 0.48) : hexRgba(p, 0.58),
        scrollActive: isLight ? hexRgba(pDark, 0.72) : hexRgba(p, 0.82),
        glowA: hexRgba(p, 0.16),
        glowB: hexRgba(s, 0.10)
      };
    }

    function setStudioThemePreview(primaryHex, secondaryHex) {
      if (!primaryHex || !secondaryHex) {
        studioThemePreview = null;
      } else {
        studioThemePreview = {
          primary: normalizeHex6(primaryHex, '#3b82f6'),
          secondary: normalizeHex6(secondaryHex, '#7c3aed')
        };
      }
      applyVisualStyles();
    }

    const BUILTIN_PALETTES = {
      default: { label: '跟随系统默认', uiColors: {}, proseColors: {}, caretColor: '' },
      azure: {
        label: '苍蓝幻境（Azure）',
        uiColors: { brandPrimary: '#38bdf8', brandText: '#7dd3fc', link: '#38bdf8' },
        proseColors: { heading: '#7dd3fc', code: '#38bdf8', marker: '#38bdf8', quoteBorder: '#38bdf8', link: '#38bdf8' },
        caretColor: '#38bdf8'
      },
      mariana: {
        label: 'Mariana 深海',
        uiColors: { bgBase: '#303841', bgLayer1: '#343d46', bgLayer2: '#3d4651', sidebarFill: '#293038', brandPrimary: '#5fb3b3', brandText: '#5fb3b3', labelPrimary: '#d8dee9', labelSecondary: '#a6acb9', link: '#6699cc' },
        proseColors: { heading: '#c594c5', strong: '#f9ae58', em: '#ec5f67', code: '#99c794', marker: '#5fb3b3', quote: '#a6acb9', quoteBorder: '#5fb3b3', link: '#6699cc', del: '#86909c' },
        caretColor: '#f9ae58'
      },
      sakura: {
        label: '樱粉柔光',
        uiColors: { brandPrimary: '#f472b6', brandText: '#f9a8d4', link: '#ec4899' },
        proseColors: { heading: '#f472b6', code: '#ec4899', marker: '#f472b6', quoteBorder: '#f9a8d4', link: '#ec4899' },
        caretColor: '#f472b6'
      },
      midnight: {
        label: '极夜紫金',
        uiColors: { brandPrimary: '#a78bfa', brandText: '#c4b5fd', link: '#c4b5fd' },
        proseColors: { heading: '#fbbf24', strong: '#f8fafc', code: '#a78bfa', marker: '#a78bfa', quoteBorder: '#8b5cf6', link: '#c4b5fd' },
        caretColor: '#fbbf24'
      }
    };

    const zh = { nav: '苍蓝琉璃', heading: '苍蓝琉璃工坊' };
    const en = { nav: 'Azure Glass', heading: 'Azure Glass Studio' };

    // -----------------------------------------------------------------------
    // WCAG Contrast & Color Helpers (ColorLab parity)
    // -----------------------------------------------------------------------
    function hexToRgb(hex) {
      if (typeof hex !== 'string') return null;
      let s = hex.trim().replace(/^#/, '');
      if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
      if (s.length !== 6) return null;
      const n = parseInt(s, 16);
      if (Number.isNaN(n)) return null;
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    function relLuminance(rgb) {
      const toLin = (c) => {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * toLin(rgb[0]) + 0.7152 * toLin(rgb[1]) + 0.0722 * toLin(rgb[2]);
    }

    function contrastRatio(hex1, hex2) {
      const r1 = hexToRgb(hex1);
      const r2 = hexToRgb(hex2);
      if (!r1 || !r2) return null;
      const l1 = relLuminance(r1);
      const l2 = relLuminance(r2);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }

    function randomAccentHex() {
      const h = Math.floor(Math.random() * 360);
      const s = 68;
      const l = 60;
      const c = (1 - Math.abs(2 * (l / 100) - 1)) * (s / 100);
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l / 100 - c / 2;
      const rgb = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
      return '#' + rgb.map((v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('');
    }

    // -----------------------------------------------------------------------
    // Store
    // -----------------------------------------------------------------------
    let config = { ...DEFAULT_CONFIG };
    let stats = { totalItems: 0, parkedItems: 0, activeItems: 0, collapsedCodes: 0, cachedSessions: 0 };
    const listeners = new Set();
    let saveTimer = null;

    function notify() {
      for (const fn of [...listeners]) { try { fn(); } catch {} }
    }

    function subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    }

    function useStore() {
      const [, force] = React.useReducer((n) => n + 1, 0);
      React.useEffect(() => subscribe(force), []);
      return { config, stats };
    }

    function readCache() {
      try {
        const raw = window.localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
      } catch { return null; }
    }

    function writeCache() {
      try { window.localStorage.setItem(CACHE_KEY, JSON.stringify(config)); } catch {}
    }

    function updateConfig(patch, immediateSave = false) {
      config = { ...config, ...patch };
      writeCache();
      applyAll();
      notify();

      if (saveTimer) clearTimeout(saveTimer);
      const doSave = async () => {
        try {
          const res = await fetch(`${API_BASE}/config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
          });
          if (res.ok) {
            const data = await res.json();
            config = { ...config, ...data };
            writeCache();
            notify();
          }
        } catch {}
      };
      if (immediateSave) void doSave();
      else saveTimer = setTimeout(doSave, 280);
    }

    async function loadFromHost() {
      try {
        const res = await fetch(`${API_BASE}/config`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        config = { ...DEFAULT_CONFIG, ...data };
        writeCache();
        applyAll();
        notify();
      } catch {}
    }

    // -----------------------------------------------------------------------
    // Visual Engine (True --dsw-alias-bg-* passthrough + Full ColorLab)
    // -----------------------------------------------------------------------
    function detectTheme() {
      try {
        const html = document.documentElement;
        const body = document.body;
        // DSH 原生暗色主题权威标记：body[data-ds-dark-theme]
        if (body && body.hasAttribute('data-ds-dark-theme')) return 'dark';
        if (html && html.hasAttribute('data-ds-dark-theme')) return 'dark';
        const attr = (html.getAttribute('data-theme') || html.getAttribute('data-color-mode') || body?.getAttribute('data-theme') || '').toLowerCase();
        if (attr.includes('dark')) return 'dark';
        if (attr.includes('light')) return 'light';
        const cls = `${html.className || ''} ${body?.className || ''}`.toLowerCase();
        if (/\bdark\b/.test(cls)) return 'dark';
        if (/\blight\b/.test(cls)) return 'light';
        // DSH 浅色模式下 body 无 data-ds-dark-theme 属性，直接视为 light
        if (body) return 'light';
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      } catch {}
      return 'light';
    }

    // -----------------------------------------------------------------------
    // Wallpaper Engine 插件共存兼容引擎（自动壁纸让位 + 重叠模块按需接管/屏蔽）
    // -----------------------------------------------------------------------
    let weCompatState = { installed: false, wallpaperActive: false };
    const weCompatListeners = new Set();
    let weCompatBodyObs = null;
    let weCompatHeadObs = null;
    let weCompatSyncQueued = false;

    function detectWeCompatState() {
      try {
        const body = document.body;
        const hasStyleOrNode = Boolean(
          document.querySelector(
            'style[data-plugin-css^="dsh-wallpaper-engine/"], style[data-plugin="dsh-wallpaper-engine"], #dsh-wallpaper-engine-layer, #we-font-scope, #we-caret-patch'
          )
        );
        const wallpaperActive = Boolean(
          body && body.hasAttribute('data-we-wallpaper')
        );
        const installed = Boolean(
          hasStyleOrNode || wallpaperActive || (body && body.hasAttribute('data-we-adapter'))
        );
        return { installed, wallpaperActive };
      } catch {
        return { installed: false, wallpaperActive: false };
      }
    }

    function isAzureGlassOwner() {
      return !weCompatState.installed || config.weControlGlass !== false;
    }

    function isComposerOwnedByAzure() {
      return !weCompatState.installed || config.weControlComposer !== false;
    }

    function isAzureColorOwner() {
      return !weCompatState.installed || config.weControlColor !== false;
    }

    function isAzureAvatarOwner() {
      return !weCompatState.installed || config.weControlAvatar !== false;
    }

    function syncWeCompatExternalStyles() {
      try {
        const installed = weCompatState.installed;
        const blockWeGlass = installed && config.weControlGlass !== false;
        const blockWeColor = installed && config.weControlColor !== false;

        // 1. 屏蔽/恢复 Wallpaper Engine 的额外玻璃层（绝不禁用 styles-v3，保证对方壁纸层正常透出）
        const extraGlassTag = document.querySelector('style[data-plugin-css="dsh-wallpaper-engine/extra-glass"]');
        if (extraGlassTag) {
          extraGlassTag.disabled = blockWeGlass;
        }

        // 2. 屏蔽/恢复 Wallpaper Engine 的字体/文本改色与光标改色样式表
        const fontTag = document.getElementById('we-font-scope');
        if (fontTag && fontTag.tagName === 'STYLE') {
          fontTag.disabled = blockWeColor;
        }
        const caretTag = document.getElementById('we-caret-patch');
        if (caretTag && caretTag.tagName === 'STYLE') {
          caretTag.disabled = blockWeColor;
        }

        // 3. 当由苍蓝琉璃接管玻璃或色彩时，确保苍蓝琉璃主样式表位于 head 末尾以保持最高级联优先级
        if (installed && (blockWeGlass || blockWeColor)) {
          const ownStyle = document.getElementById(STYLE_ID);
          if (ownStyle && ownStyle.parentElement === document.head && document.head.lastElementChild !== ownStyle) {
            document.head.appendChild(ownStyle);
          }
        }
      } catch {}
    }

    function notifyWeCompatListeners() {
      for (const fn of weCompatListeners) {
        try { fn(); } catch {}
      }
    }

    function refreshWeCompatState(reapply = true) {
      const next = detectWeCompatState();
      const changed = next.installed !== weCompatState.installed || next.wallpaperActive !== weCompatState.wallpaperActive;
      if (changed) {
        weCompatState = next;
        notifyWeCompatListeners();
      }
      syncWeCompatExternalStyles();
      if (changed && reapply) {
        try { applyVisualStyles(); } catch {}
        try { ensureWallpaperLayer(); } catch {}
        try { syncAvatarLayer(); } catch {}
        try { void applyActiveSkin(); } catch {}
      }
    }

    function scheduleWeCompatSync() {
      if (weCompatSyncQueued) return;
      weCompatSyncQueued = true;
      queueMicrotask(() => {
        weCompatSyncQueued = false;
        refreshWeCompatState(true);
      });
    }

    function startWeCompatObserver() {
      refreshWeCompatState(false);
      if (typeof MutationObserver !== 'function') return;
      try {
        if (!weCompatBodyObs && document.body) {
          weCompatBodyObs = new MutationObserver(() => scheduleWeCompatSync());
          weCompatBodyObs.observe(document.body, {
            attributes: true,
            attributeFilter: [
              'data-we-wallpaper',
              'data-we-adapter',
              'data-we-glass-page',
              'data-we-glass-chat',
              'data-we-sidebar-glass',
              'data-we-titlebar-glass',
              'data-we-avatar'
            ]
          });
        }
        if (!weCompatHeadObs && document.head) {
          weCompatHeadObs = new MutationObserver((mutations) => {
            for (const m of mutations) {
              for (const n of m.addedNodes) {
                if (n && n.nodeType === 1 && n.tagName === 'STYLE') {
                  const id = n.id || '';
                  const pcss = n.dataset?.pluginCss || '';
                  if (id === 'we-font-scope' || id === 'we-caret-patch' || pcss.startsWith('dsh-wallpaper-engine/')) {
                    scheduleWeCompatSync();
                    return;
                  }
                }
              }
            }
          });
          weCompatHeadObs.observe(document.head, { childList: true });
        }
      } catch {}
    }

    const weCompatStore = {
      subscribe(fn) {
        weCompatListeners.add(fn);
        return () => weCompatListeners.delete(fn);
      },
      getSnapshot() {
        return weCompatState;
      }
    };

    function getActiveWallpaperUrl() {
      if (!config.wallpaperEnabled || config.turboMode || config.wallpaperSource === 'none') return '';
      if (config.wallpaperSource === 'uploaded' && config.hasUploadedWallpaper) {
        return `${API_BASE}/wallpaper/current?v=${config.wallpaperVersion || 1}`;
      }
      if (config.wallpaperSource === 'url' && config.wallpaperUrl) {
        return config.wallpaperUrl;
      }
      return '';
    }

    function isVideoWallpaper(url) {
      if (!url) return false;
      if (config.wallpaperSource === 'uploaded' && String(config.wallpaperMime || '').startsWith('video/')) return true;
      return /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);
    }

    function hasConversationContent() {
      const sc = document.querySelector('[data-conversation-scroll]');
      return Boolean(sc && sc.querySelector('[data-chat-anchor-key], [data-chat-flow-kind], [class*="flowItem"], [data-dsh-part="message-row"]'));
    }

    function getEffectiveWallpaperBlurPx() {
      const hasContent = hasConversationContent();
      if (hasContent && config.wallpaperBlurContentPx > 0) return config.wallpaperBlurContentPx;
      if (!hasContent && config.wallpaperBlurEmptyPx > 0) return config.wallpaperBlurEmptyPx;
      return config.wallpaperBlurPx || 0;
    }

    function ensureWallpaperLayer() {
      if (!document.body) return;
      let wp = document.getElementById('dsh-sg-wallpaper');
      let wpVid = document.getElementById('dsh-sg-wallpaper-video');
      let fxBg = document.getElementById('dsh-sg-bg-effect');
      let scrim = document.getElementById('dsh-sg-scrim');
      if (!wp) {
        wp = document.createElement('div');
        wp.id = 'dsh-sg-wallpaper';
        document.body.prepend(wp);
      }
      if (!wpVid) {
        wpVid = document.createElement('video');
        wpVid.id = 'dsh-sg-wallpaper-video';
        wpVid.autoplay = true;
        wpVid.loop = true;
        wpVid.playsInline = true;
        wp.after(wpVid);
      }
      if (!fxBg) {
        fxBg = document.createElement('canvas');
        fxBg.id = 'dsh-sg-bg-effect';
        wpVid.after(fxBg);
      }
      if (!scrim) {
        scrim = document.createElement('div');
        scrim.id = 'dsh-sg-scrim';
        fxBg.after(scrim);
      }

      const weWpActive = weCompatState.wallpaperActive;
      const useAzureGlass = isAzureGlassOwner();
      const url = weWpActive ? '' : getActiveWallpaperUrl();
      const bgMode = (!config.turboMode && !weWpActive) ? (config.bgEffectMode || 'none') : 'none';
      const hasBackdrop = Boolean(url) || bgMode !== 'none';
      const isLight = detectTheme() === 'light';
      // 当 WE 壁纸运行且毛玻璃由苍蓝琉璃控制时，保持根画布透明以透出 WE 壁纸；若毛玻璃交由 WE 控制则不干预
      document.documentElement.setAttribute('data-dsh-sg-wp', (useAzureGlass && (hasBackdrop || weWpActive)) ? '1' : '0');

      const blurPx = getEffectiveWallpaperBlurPx();
      const extraScale = config.parallaxEnabled ? (1 + (Number(config.parallaxTravelPct) || 0) / 100) : 1;
      const scale = ((config.wallpaperScale || 100) / 100) * extraScale;
      const filterStr = `brightness(${config.wallpaperBrightness}%) saturate(${config.wallpaperSaturate}%)${blurPx > 0 ? ` blur(${blurPx}px)` : ''}`;

      if (url && isVideoWallpaper(url)) {
        wp.style.display = 'none';
        wp.style.backgroundImage = 'none';
        wpVid.style.display = 'block';
        if (wpVid.dataset.src !== url) {
          wpVid.dataset.src = url;
          wpVid.src = url;
        }
        wpVid.muted = config.wallpaperVideoMuted !== false;
        wpVid.volume = Math.min(1, Math.max(0, Number(config.wallpaperVideoVolume) || 0.3));
        wpVid.style.objectFit = config.wallpaperFit === 'auto' ? 'none' : (config.wallpaperFit || 'cover');
        wpVid.style.objectPosition = `${config.wallpaperPosX}% ${config.wallpaperPosY}%`;
        wpVid.style.opacity = String(config.wallpaperOpacity);
        wpVid.style.transform = `translate3d(var(--dsh-sg-px, 0px), var(--dsh-sg-py, 0px), 0) scale(${scale.toFixed(3)})`;
        wpVid.style.filter = filterStr;
        if (!document.hidden && wpVid.paused) { try { wpVid.play().catch(() => {}); } catch {} }
      } else if (url) {
        if (!wpVid.paused) { try { wpVid.pause(); } catch {} }
        wpVid.style.display = 'none';
        wp.style.display = 'block';
        wp.style.backgroundImage = `url("${url.replace(/"/g, '\\"')}")`;
        wp.style.backgroundSize = config.wallpaperFit || 'cover';
        wp.style.backgroundPosition = `${config.wallpaperPosX}% ${config.wallpaperPosY}%`;
        wp.style.opacity = String(config.wallpaperOpacity);
        wp.style.transform = `translate3d(var(--dsh-sg-px, 0px), var(--dsh-sg-py, 0px), 0) scale(${scale.toFixed(3)})`;
        wp.style.filter = filterStr;
      } else {
        if (!wpVid.paused) { try { wpVid.pause(); } catch {} }
        wpVid.style.display = 'none';
        wp.style.display = 'none';
        wp.style.backgroundImage = 'none';
      }

      if (hasBackdrop) {
        scrim.style.display = 'block';
        scrim.style.backgroundColor = isLight
          ? `rgba(255, 255, 255, ${config.wallpaperScrim})`
          : `rgba(10, 12, 18, ${config.wallpaperScrim})`;
      } else {
        scrim.style.display = 'none';
      }

      syncBgEffectLayer();
      syncParallaxEngine();
      syncPointerFxEngine();
      syncAvatarLayer();
    }

    // ColorLab 风格程序化动态背景（光晕渐变 / 流动等高线地形）
    let topoRaf = 0;
    let topoPhase = 0;
    function syncBgEffectLayer() {
      const canvas = document.getElementById('dsh-sg-bg-effect');
      if (!canvas) return;
      if (topoRaf) { cancelAnimationFrame(topoRaf); topoRaf = 0; }
      const mode = (config.turboMode || weCompatState.wallpaperActive) ? 'none' : (config.bgEffectMode || 'none');
      if (mode === 'none') {
        canvas.style.display = 'none';
        canvas.style.background = 'none';
        return;
      }
      canvas.style.display = 'block';
      if (mode === 'glow') {
        const ctx2d = canvas.getContext('2d');
        if (ctx2d) ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.opacity = String(config.glowOpacity ?? 0.28);
        canvas.style.background = `linear-gradient(${config.glowAngle || 135}deg, ${config.glowColorA || '#38bdf8'} 0%, transparent 52%, ${config.glowColorB || '#a855f7'} 100%)`;
        return;
      }
      // topo: 轻量流动等高线（隐藏或滚动时自动暂停）
      canvas.style.background = 'none';
      canvas.style.opacity = String(config.topoOpacity ?? 0.18);
      const drawTopo = () => {
        if (config.turboMode || config.bgEffectMode !== 'topo') { topoRaf = 0; return; }
        if (!document.hidden && document.documentElement.getAttribute('data-dsh-sg-scrolling') !== '1') {
          const w = (canvas.width = Math.max(320, Math.floor(window.innerWidth * 0.5)));
          const h = (canvas.height = Math.max(200, Math.floor(window.innerHeight * 0.5)));
          const c = canvas.getContext('2d');
          if (c) {
            c.clearRect(0, 0, w, h);
            c.strokeStyle = config.topoColor || '#38bdf8';
            c.lineWidth = 1;
            const lines = Math.max(4, Math.min(24, Number(config.topoDensity) || 10));
            topoPhase += 0.006 * (Number(config.topoSpeed) || 1);
            for (let i = 0; i < lines; i++) {
              const baseY = ((i + 0.5) / lines) * h;
              c.beginPath();
              for (let x = 0; x <= w; x += 18) {
                const wave = Math.sin(x * 0.008 + topoPhase + i * 0.55) * 18 + Math.cos(x * 0.015 - topoPhase * 0.7 + i) * 9;
                if (x === 0) c.moveTo(x, baseY + wave);
                else c.lineTo(x, baseY + wave);
              }
              c.stroke();
            }
          }
        }
        topoRaf = requestAnimationFrame(drawTopo);
      };
      topoRaf = requestAnimationFrame(drawTopo);
    }

    // WE-Parallax 3D 鼠标视差纵深
    let parallaxBound = false;
    function syncParallaxEngine() {
      const root = document.documentElement;
      if (!config.parallaxEnabled || config.turboMode || weCompatState.wallpaperActive) {
        root.style.setProperty('--dsh-sg-px', '0px');
        root.style.setProperty('--dsh-sg-py', '0px');
        root.style.setProperty('--dsh-sg-ui-px', '0px');
        root.style.setProperty('--dsh-sg-ui-py', '0px');
        root.setAttribute('data-dsh-sg-parallax-ui', '0');
        return;
      }
      root.setAttribute('data-dsh-sg-parallax-ui', config.parallaxUiFollow ? '1' : '0');
      if (parallaxBound) return;
      parallaxBound = true;
      let pxRaf = 0;
      let lastX = 0.5, lastY = 0.5;
      window.addEventListener('pointermove', (ev) => {
        if (!config.parallaxEnabled || config.turboMode || weCompatState.wallpaperActive) return;
        lastX = ev.clientX / Math.max(1, window.innerWidth);
        lastY = ev.clientY / Math.max(1, window.innerHeight);
        if (pxRaf) return;
        pxRaf = requestAnimationFrame(() => {
          pxRaf = 0;
          const diag = Math.hypot(window.innerWidth, window.innerHeight);
          const maxShift = diag * ((Number(config.parallaxTravelPct) || 2.5) / 100) * 0.5;
          const dx = (0.5 - lastX) * maxShift;
          const dy = (0.5 - lastY) * maxShift;
          document.documentElement.style.setProperty('--dsh-sg-px', `${dx.toFixed(1)}px`);
          document.documentElement.style.setProperty('--dsh-sg-py', `${dy.toFixed(1)}px`);
          document.documentElement.style.setProperty('--dsh-sg-ui-px', `${(dx * 0.28).toFixed(1)}px`);
          document.documentElement.style.setProperty('--dsh-sg-ui-py', `${(dy * 0.28).toFixed(1)}px`);
        });
      }, { passive: true });
    }

    // WE-FX 进阶霓虹点击光效（双环涟漪/流光星火/双效叠加/星芒烟花/樱落花瓣/微光爱心）与彗尾/星尘拖尾
    let fxBound = false;
    let fxRaf = 0;
    let fxHueCursor = 205;
    let fxLastMoveX = -9999;
    let fxLastMoveY = -9999;
    const fxParticles = [];
    const fxTrail = [];

    function hslToRgbArr(h, s, l) {
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const hp = (((h % 360) + 360) % 360) / 60;
      const x = c * (1 - Math.abs((hp % 2) - 1));
      let r = 0, g = 0, b = 0;
      if (hp < 1) [r, g, b] = [c, x, 0];
      else if (hp < 2) [r, g, b] = [x, c, 0];
      else if (hp < 3) [r, g, b] = [0, c, x];
      else if (hp < 4) [r, g, b] = [0, x, c];
      else if (hp < 5) [r, g, b] = [x, 0, c];
      else [r, g, b] = [c, 0, x];
      const m = l - c / 2;
      return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
    }

    function pickFxColorRgb(useAlt = false, hueShift = 0) {
      const mode = config.fxColorMode || 'accent';
      if (mode === 'rainbow') {
        fxHueCursor = (fxHueCursor + 23) % 360;
        const isLight = detectTheme() === 'light';
        return hslToRgbArr(fxHueCursor + hueShift, 0.92, isLight ? 0.52 : 0.66);
      }
      if (mode === 'custom') {
        return hexToRgb(config.fxColor || '#38bdf8') || [56, 189, 248];
      }
      const st = studioThemePreview || resolveStudioUiTheme(config.studioUiTheme);
      const hex = useAlt ? (st.secondary || '#7c3aed') : (st.primary || '#3b82f6');
      return hexToRgb(hex) || [59, 130, 246];
    }

    function drawFourPointStar(c, x, y, outerR, innerR, rot) {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.beginPath();
      for (let i = 0; i < 8; i++) {
        const rad = i % 2 === 0 ? outerR : innerR;
        const a = (Math.PI * i) / 4;
        if (i === 0) c.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
        else c.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      c.closePath();
      c.fill();
      c.restore();
    }

    function drawHeartShape(c, x, y, size, rot) {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.scale(size / 14, size / 14);
      c.beginPath();
      c.moveTo(0, 4);
      c.bezierCurveTo(-1, -1, -9, -3, -9, 3);
      c.bezierCurveTo(-9, 8, -3, 11, 0, 14);
      c.bezierCurveTo(3, 11, 9, 8, 9, 3);
      c.bezierCurveTo(9, -3, 1, -1, 0, 4);
      c.closePath();
      c.fill();
      c.restore();
    }

    function drawPetalShape(c, x, y, len, wid, rot) {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.beginPath();
      c.moveTo(0, -len);
      c.bezierCurveTo(wid, -len * 0.45, wid * 0.85, len * 0.65, 0, len);
      c.bezierCurveTo(-wid * 0.85, len * 0.65, -wid, -len * 0.45, 0, -len);
      c.closePath();
      c.fill();
      c.restore();
    }

    function syncPointerFxEngine() {
      let cvs = document.getElementById('dsh-sg-fx-canvas');
      const active = !config.turboMode && (config.fxClickEnabled || config.fxTrailEnabled);
      if (!active) {
        if (cvs) cvs.style.display = 'none';
        if (fxRaf) { cancelAnimationFrame(fxRaf); fxRaf = 0; }
        fxParticles.length = 0;
        fxTrail.length = 0;
        return;
      }
      if (!cvs && document.body) {
        cvs = document.createElement('canvas');
        cvs.id = 'dsh-sg-fx-canvas';
        document.body.appendChild(cvs);
      }
      if (!cvs) return;
      cvs.style.display = 'block';
      const isLight = detectTheme() === 'light';
      const blendMode = config.fxBlend || 'screen';
      cvs.style.mixBlendMode = (isLight && blendMode === 'screen') ? 'normal' : blendMode;

      const startLoop = () => {
        if (fxRaf) return;
        const tick = () => {
          if (config.turboMode || (!config.fxClickEnabled && !config.fxTrailEnabled)) {
            fxRaf = 0; return;
          }
          if (!document.hidden) {
            if (cvs.width !== window.innerWidth || cvs.height !== window.innerHeight) {
              cvs.width = window.innerWidth;
              cvs.height = window.innerHeight;
            }
            const c = cvs.getContext('2d');
            if (c) {
              c.clearRect(0, 0, cvs.width, cvs.height);
              const masterOp = Number.isFinite(Number(config.fxOpacity)) ? Math.min(1, Math.max(0.2, Number(config.fxOpacity))) : 0.9;
              const glowPct = Number.isFinite(Number(config.fxGlow)) ? Math.min(100, Math.max(0, Number(config.fxGlow))) : 65;
              const sz = Number(config.fxSize) || 1;

              // 1. 发光彗尾拖尾（平滑渐隐光带）
              if (fxTrail.length > 0) {
                for (let i = fxTrail.length - 1; i >= 0; i--) {
                  fxTrail[i].life -= 0.048;
                  if (fxTrail[i].life <= 0) fxTrail.splice(i, 1);
                }
                if (fxTrail.length >= 2) {
                  c.save();
                  c.lineCap = 'round';
                  c.lineJoin = 'round';
                  for (let i = 1; i < fxTrail.length; i++) {
                    const prev = fxTrail[i - 1];
                    const cur = fxTrail[i];
                    const dx = cur.x - prev.x;
                    const dy = cur.y - prev.y;
                    if (dx * dx + dy * dy > 16000) continue;
                    const ratio = i / fxTrail.length;
                    const a = Math.min(1, cur.life * ratio) * masterOp * 0.85;
                    const rgb = cur.rgb;
                    const w = Math.max(1, (1.4 + ratio * 4.2) * cur.life * sz);
                    c.beginPath();
                    c.moveTo(prev.x, prev.y);
                    c.lineTo(cur.x, cur.y);
                    c.strokeStyle = `rgba(${rgb}, ${a.toFixed(3)})`;
                    c.lineWidth = w;
                    if (glowPct > 0) {
                      c.shadowColor = `rgba(${rgb}, ${(a * 0.95).toFixed(3)})`;
                      c.shadowBlur = (glowPct / 100) * 16 * sz;
                    } else {
                      c.shadowBlur = 0;
                    }
                    c.stroke();
                  }
                  // 彗尾头部亮核
                  const head = fxTrail[fxTrail.length - 1];
                  if (head && head.life > 0.25) {
                    const ha = head.life * masterOp * 0.9;
                    c.beginPath();
                    c.arc(head.x, head.y, Math.max(1.5, 2.4 * head.life * sz), 0, Math.PI * 2);
                    c.fillStyle = `rgba(255, 255, 255, ${(ha * 0.85).toFixed(3)})`;
                    c.shadowColor = `rgba(${head.rgb}, ${ha.toFixed(3)})`;
                    c.shadowBlur = (glowPct / 100) * 18 * sz;
                    c.fill();
                  }
                  c.restore();
                }
              }

              // 2. 点击光效与星尘粒子
              for (let i = fxParticles.length - 1; i >= 0; i--) {
                const p = fxParticles[i];
                if (p.delay && p.delay > 0) { p.delay -= 1; continue; }
                p.life -= p.decay;
                if (p.life <= 0) { fxParticles.splice(i, 1); continue; }
                const t = 1 - p.life;
                const ease = 1 - Math.pow(1 - t, 3);
                const rgb = p.rgb;
                const alpha = Math.max(0, Math.min(1, p.life)) * masterOp;

                c.save();
                if (glowPct > 0) {
                  c.shadowColor = `rgba(${rgb}, ${(alpha * 0.95).toFixed(3)})`;
                  c.shadowBlur = (glowPct / 100) * (p.glowScale || 16) * sz;
                }

                if (p.kind === 'flash') {
                  const rad = p.maxR * (0.35 + 0.65 * ease);
                  const grad = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
                  grad.addColorStop(0, `rgba(255, 255, 255, ${(alpha * 0.85).toFixed(3)})`);
                  grad.addColorStop(0.35, `rgba(${rgb}, ${(alpha * 0.52).toFixed(3)})`);
                  grad.addColorStop(1, `rgba(${rgb}, 0)`);
                  c.fillStyle = grad;
                  c.beginPath();
                  c.arc(p.x, p.y, rad, 0, Math.PI * 2);
                  c.fill();
                } else if (p.kind === 'ripple') {
                  const curR = p.startR + (p.maxR - p.startR) * ease;
                  c.beginPath();
                  c.arc(p.x, p.y, curR, 0, Math.PI * 2);
                  c.strokeStyle = `rgba(${rgb}, ${(alpha * p.alphaScale).toFixed(3)})`;
                  c.lineWidth = Math.max(0.8, p.lineWidth * (0.35 + 0.65 * p.life));
                  c.stroke();
                } else if (p.kind === 'spark') {
                  const px = p.x;
                  const py = p.y;
                  p.vx *= p.drag;
                  p.vy = p.vy * p.drag + (p.gravity || 0);
                  p.x += p.vx;
                  p.y += p.vy;
                  // 流光尾迹
                  c.beginPath();
                  c.moveTo(px - p.vx * 1.6, py - p.vy * 1.6);
                  c.lineTo(p.x, p.y);
                  c.strokeStyle = `rgba(${rgb}, ${(alpha * 0.85).toFixed(3)})`;
                  c.lineWidth = Math.max(1, p.r * p.life * 0.85);
                  c.lineCap = 'round';
                  c.stroke();
                  // 亮心
                  c.beginPath();
                  c.arc(p.x, p.y, Math.max(0.8, p.r * p.life * 0.65), 0, Math.PI * 2);
                  c.fillStyle = `rgba(255, 255, 255, ${(alpha * 0.92).toFixed(3)})`;
                  c.fill();
                } else if (p.kind === 'star') {
                  p.vx *= p.drag;
                  p.vy = p.vy * p.drag + (p.gravity || 0);
                  p.x += p.vx;
                  p.y += p.vy;
                  p.rot += p.vrot;
                  const twinkle = 0.72 + 0.28 * Math.sin(t * 18 + (p.phase || 0));
                  const outerR = Math.max(1.2, p.r * (0.3 + 0.7 * p.life) * twinkle);
                  c.fillStyle = `rgba(${rgb}, ${(alpha * 0.92).toFixed(3)})`;
                  drawFourPointStar(c, p.x, p.y, outerR, outerR * 0.30, p.rot);
                  c.fillStyle = `rgba(255, 255, 255, ${(alpha * 0.75).toFixed(3)})`;
                  drawFourPointStar(c, p.x, p.y, outerR * 0.52, outerR * 0.16, p.rot);
                } else if (p.kind === 'petal') {
                  p.vx *= 0.965;
                  p.vy = p.vy * 0.965 + 0.055;
                  p.x += p.vx + Math.sin(t * 9 + p.phase) * 0.55;
                  p.y += p.vy;
                  p.rot += p.vrot;
                  c.fillStyle = `rgba(${rgb}, ${(alpha * 0.86).toFixed(3)})`;
                  drawPetalShape(c, p.x, p.y, p.r * (0.65 + 0.35 * p.life), p.r * 0.55, p.rot);
                } else if (p.kind === 'heart') {
                  p.vx *= 0.94;
                  p.vy = p.vy * 0.94 - 0.045;
                  p.x += p.vx + Math.sin(t * 7 + p.phase) * 0.35;
                  p.y += p.vy;
                  p.rot += p.vrot;
                  const scaleSz = p.r * (0.75 + 0.45 * ease);
                  c.fillStyle = `rgba(${rgb}, ${(alpha * 0.88).toFixed(3)})`;
                  drawHeartShape(c, p.x, p.y, scaleSz, p.rot);
                } else if (p.kind === 'dust') {
                  p.x += p.vx;
                  p.y += p.vy;
                  const twinkle = 0.65 + 0.35 * Math.sin(t * 16 + p.phase);
                  const rad = Math.max(0.9, p.r * p.life * twinkle);
                  c.fillStyle = `rgba(${rgb}, ${(alpha * 0.88).toFixed(3)})`;
                  drawFourPointStar(c, p.x, p.y, rad * 1.9, rad * 0.55, p.rot);
                }
                c.restore();
              }
            }
          }
          if (fxParticles.length > 0 || fxTrail.length > 0) {
            fxRaf = requestAnimationFrame(tick);
          } else {
            fxRaf = 0;
          }
        };
        fxRaf = requestAnimationFrame(tick);
      };

      const spawnRippleRings = (x, y, sz, mainRgb, altRgb) => {
        fxParticles.push({ kind: 'flash', x, y, maxR: 34 * sz, rgb: mainRgb, life: 1, decay: 0.065, glowScale: 24 });
        fxParticles.push({ kind: 'ripple', x, y, startR: 6 * sz, maxR: 68 * sz, lineWidth: 2.8 * sz, alphaScale: 0.92, rgb: mainRgb, life: 1, decay: 0.028, glowScale: 20 });
        fxParticles.push({ kind: 'ripple', x, y, startR: 4 * sz, maxR: 92 * sz, lineWidth: 1.6 * sz, alphaScale: 0.62, rgb: altRgb, life: 1, decay: 0.023, delay: 4, glowScale: 16 });
      };

      const spawnSparks = (x, y, sz, mainRgb, altRgb, count = 18) => {
        for (let i = 0; i < count; i++) {
          const ang = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.38;
          const spd = (2.6 + Math.random() * 4.4) * sz;
          const rgb = i % 3 === 0 ? altRgb : mainRgb;
          fxParticles.push({
            kind: 'spark', x, y,
            vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
            drag: 0.925, gravity: 0.035,
            r: (2.2 + Math.random() * 2.2) * sz,
            rgb, life: 1, decay: 0.024 + Math.random() * 0.014, glowScale: 16
          });
        }
      };

      if (!fxBound) {
        fxBound = true;
        window.addEventListener('pointerdown', (ev) => {
          if (config.turboMode || !config.fxClickEnabled) return;
          const sz = Number(config.fxSize) || 1;
          const style = config.fxClickStyle || 'both';
          const x = ev.clientX;
          const y = ev.clientY;
          const mainRgb = pickFxColorRgb(false, 0).join(',');
          const altRgb = pickFxColorRgb(true, 48).join(',');

          if (style === 'ripple') {
            spawnRippleRings(x, y, sz, mainRgb, altRgb);
          } else if (style === 'sparkle') {
            fxParticles.push({ kind: 'flash', x, y, maxR: 30 * sz, rgb: mainRgb, life: 1, decay: 0.07, glowScale: 22 });
            spawnSparks(x, y, sz, mainRgb, altRgb, 22);
          } else if (style === 'starburst') {
            fxParticles.push({ kind: 'flash', x, y, maxR: 38 * sz, rgb: mainRgb, life: 1, decay: 0.06, glowScale: 26 });
            fxParticles.push({ kind: 'star', x, y, vx: 0, vy: 0, drag: 1, r: 22 * sz, rot: Math.random(), vrot: 0.07, phase: 0, rgb: mainRgb, life: 1, decay: 0.038, glowScale: 24 });
            for (let i = 0; i < 14; i++) {
              const ang = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.3;
              const spd = (2.2 + Math.random() * 3.8) * sz;
              fxParticles.push({
                kind: 'star', x, y,
                vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
                drag: 0.93, gravity: 0.015,
                r: (5 + Math.random() * 5.5) * sz,
                rot: Math.random() * Math.PI, vrot: (Math.random() - 0.5) * 0.16,
                phase: Math.random() * 6,
                rgb: i % 2 === 0 ? mainRgb : altRgb,
                life: 1, decay: 0.022 + Math.random() * 0.012, glowScale: 18
              });
            }
          } else if (style === 'petal') {
            fxParticles.push({ kind: 'flash', x, y, maxR: 26 * sz, rgb: mainRgb, life: 1, decay: 0.07, glowScale: 18 });
            for (let i = 0; i < 12; i++) {
              const ang = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.5;
              const spd = (1.6 + Math.random() * 2.8) * sz;
              fxParticles.push({
                kind: 'petal', x, y,
                vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 0.8 * sz,
                r: (5.5 + Math.random() * 4.5) * sz,
                rot: Math.random() * Math.PI * 2, vrot: (Math.random() - 0.5) * 0.12,
                phase: Math.random() * 6,
                rgb: i % 3 === 0 ? altRgb : mainRgb,
                life: 1, decay: 0.016 + Math.random() * 0.008, glowScale: 14
              });
            }
          } else if (style === 'heart') {
            fxParticles.push({ kind: 'flash', x, y, maxR: 26 * sz, rgb: mainRgb, life: 1, decay: 0.07, glowScale: 18 });
            for (let i = 0; i < 9; i++) {
              const ang = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
              const spd = (1.5 + Math.random() * 2.6) * sz;
              fxParticles.push({
                kind: 'heart', x, y,
                vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 0.6 * sz,
                r: (6.5 + Math.random() * 4.5) * sz,
                rot: (Math.random() - 0.5) * 0.5, vrot: (Math.random() - 0.5) * 0.03,
                phase: Math.random() * 6,
                rgb: i % 2 === 0 ? mainRgb : altRgb,
                life: 1, decay: 0.017 + Math.random() * 0.008, glowScale: 16
              });
            }
          } else {
            // 'both' — WE 经典同款：双环霓虹涟漪 + 爆裂流光星火
            spawnRippleRings(x, y, sz, mainRgb, altRgb);
            spawnSparks(x, y, sz, mainRgb, altRgb, 18);
          }
          if (fxParticles.length > 260) fxParticles.splice(0, fxParticles.length - 260);
          startLoop();
        }, { passive: true });

        window.addEventListener('pointermove', (ev) => {
          if (config.turboMode || !config.fxTrailEnabled) return;
          const x = ev.clientX;
          const y = ev.clientY;
          const dx = x - fxLastMoveX;
          const dy = y - fxLastMoveY;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 16) return;
          fxLastMoveX = x;
          fxLastMoveY = y;
          const sz = Number(config.fxSize) || 1;
          const tStyle = config.fxTrailStyle || 'comet';
          const rgb = pickFxColorRgb(false, 0).join(',');
          if (tStyle === 'dust') {
            fxParticles.push({
              kind: 'dust',
              x: x + (Math.random() - 0.5) * 8 * sz,
              y: y + (Math.random() - 0.5) * 8 * sz,
              vx: (Math.random() - 0.5) * 0.5,
              vy: (Math.random() - 0.5) * 0.5 + 0.15,
              r: (2.2 + Math.random() * 2.0) * sz,
              rot: Math.random() * Math.PI,
              phase: Math.random() * 6,
              rgb, life: 1, decay: 0.032 + Math.random() * 0.016, glowScale: 14
            });
            if (fxParticles.length > 260) fxParticles.splice(0, fxParticles.length - 260);
          } else {
            fxTrail.push({ x, y, life: 1, rgb });
            if (fxTrail.length > 30) fxTrail.shift();
          }
          startLoop();
        }, { passive: true });
      }
    }

    // 自定义会话头像 DOM 装饰层（按 DSH 真实 data-chat-flow-kind 给消息行注入头像节点）
    const AVATAR_FLOW_SIDES = { user: 'user', steering: 'user', 'assistant-step': 'ai' };
    const AVATAR_ROW_SELECTOR = '[data-chat-flow-kind="user"], [data-chat-flow-kind="steering"], [data-chat-flow-kind="assistant-step"]';
    const AVATAR_FLOW_ROW_SELECTOR = '[data-chat-flow-kind]';
    const AVATAR_ROW_ATTR = 'data-ag-avatar-row';
    const AVATAR_NODE_CLASS = 'dsh-ag-avatar';
    const AVATAR_NODE_ATTR = 'data-ag-avatar-node';
    const AVATAR_CONT_CLASS = 'dsh-ag-avatar--cont';
    const AVATAR_BODY_ATTR = 'data-ag-avatar';
    const AVATAR_IMG_FAILED = 'data-ag-avatar-imgfail';
    const AVATAR_FOLD_ATTR = 'data-turn-process-hidden';
    const AVATAR_TURN_ATTR = 'data-chat-turn';
    const AVATAR_AI_REPEAT_ROWS = 6;

    let avatarObserver = null;
    let avatarActive = false;
    let avatarGroupRaf = 0;

    function getAvatarUrlForSide(side) {
      return String(side === 'user' ? (config.userAvatarUrl || '') : (config.assistantAvatarUrl || '')).trim();
    }

    function avatarGlyphSvg(side) {
      if (side === 'ai') {
        return '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2.2l1.35 3.9a1.6 1.6 0 0 0 1 1l3.9 1.35-3.9 1.35a1.6 1.6 0 0 0-1 1L8 14.7l-1.35-3.9a1.6 1.6 0 0 0-1-1L1.75 8.45l3.9-1.35a1.6 1.6 0 0 0 1-1z"/></svg>';
      }
      return '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="5.6" r="2.5"/><path d="M3.4 13.2c0-2.3 2.1-3.8 4.6-3.8s4.6 1.5 4.6 3.8"/></svg>';
    }

    function avatarFillNode(node, side) {
      const url = getAvatarUrlForSide(side);
      const failed = url && node.getAttribute(AVATAR_IMG_FAILED) === url;
      const want = url && !failed ? 'img' : 'glyph';
      if (node.getAttribute('data-ag-avatar-kind') === want) {
        if (want === 'img') {
          const img = node.firstElementChild;
          if (img && img.getAttribute('src') !== url) {
            try { img.setAttribute('src', url); } catch {}
          }
        }
        return;
      }
      node.setAttribute('data-ag-avatar-kind', want);
      try { node.textContent = ''; } catch {}
      if (want === 'img') {
        const img = document.createElement('img');
        img.className = `${AVATAR_NODE_CLASS}__img`;
        img.setAttribute('alt', '');
        img.setAttribute('draggable', 'false');
        img.onerror = () => {
          try { node.setAttribute(AVATAR_IMG_FAILED, url); } catch {}
          avatarFillNode(node, side);
        };
        img.setAttribute('src', url);
        node.appendChild(img);
      } else {
        const glyph = document.createElement('span');
        glyph.className = `${AVATAR_NODE_CLASS}__glyph`;
        glyph.innerHTML = avatarGlyphSvg(side);
        node.appendChild(glyph);
      }
    }

    function avatarRemoveFromRow(row) {
      if (!row || typeof row.getAttribute !== 'function') return;
      const first = row.firstElementChild;
      if (first && first.classList && first.classList.contains(AVATAR_NODE_CLASS)) {
        try { first.remove(); } catch {}
      }
      row.removeAttribute(AVATAR_ROW_ATTR);
    }

    function avatarDecorateRow(row) {
      if (!row || typeof row.getAttribute !== 'function') return false;
      const side = AVATAR_FLOW_SIDES[row.getAttribute('data-chat-flow-kind')];
      if (!side) return false;
      const url = getAvatarUrlForSide(side);
      if (!url) {
        if (row.hasAttribute(AVATAR_ROW_ATTR)) avatarRemoveFromRow(row);
        return false;
      }
      const marked = row.getAttribute(AVATAR_ROW_ATTR);
      if (marked === side) {
        const node = row.firstElementChild;
        if (node && node.classList && node.classList.contains(AVATAR_NODE_CLASS)) {
          avatarFillNode(node, side);
          return false;
        }
        row.removeAttribute(AVATAR_ROW_ATTR);
      } else if (marked) {
        avatarRemoveFromRow(row);
      }
      const node = document.createElement('div');
      node.className = `${AVATAR_NODE_CLASS} ${AVATAR_NODE_CLASS}--${side}`;
      node.setAttribute(AVATAR_NODE_ATTR, side);
      node.setAttribute('aria-hidden', 'true');
      avatarFillNode(node, side);
      row.setAttribute(AVATAR_ROW_ATTR, side);
      try { row.insertBefore(node, row.firstChild); } catch {}
      return true;
    }

    function avatarRowHidden(row) {
      if (!row || typeof row.getAttribute !== 'function') return false;
      if (row.hasAttribute && row.hasAttribute('hidden')) return true;
      if (row.getAttribute(AVATAR_FOLD_ATTR) !== null) return true;
      try {
        return !!(row.closest && row.closest('[data-step-process-body][hidden]'));
      } catch {
        return false;
      }
    }

    function avatarApplyGrouping() {
      if (!avatarActive || typeof document.querySelectorAll !== 'function') return;
      let rows;
      try { rows = document.querySelectorAll(AVATAR_FLOW_ROW_SELECTOR); } catch { return; }
      let prevSide = '';
      let turn;
      let aiFacePending = true;
      let aiSince = 0;
      for (const row of rows) {
        const turnAttr = row.getAttribute(AVATAR_TURN_ATTR);
        if (turnAttr !== null && turnAttr !== turn) {
          turn = turnAttr;
          aiFacePending = true;
          aiSince = 0;
        }
        const side = AVATAR_FLOW_SIDES[row.getAttribute('data-chat-flow-kind')];
        const hidden = avatarRowHidden(row);
        if (!side) {
          prevSide = '';
          if (!hidden) aiSince++;
          continue;
        }
        let cont = false;
        if (side === 'ai') {
          const show = !hidden && (aiFacePending || aiSince >= AVATAR_AI_REPEAT_ROWS);
          cont = !show;
          if (!hidden) {
            if (show) { aiFacePending = false; aiSince = 0; }
            else aiSince++;
          }
          prevSide = 'ai';
        } else {
          cont = prevSide === 'user';
          prevSide = 'user';
          aiFacePending = true;
          aiSince = 0;
        }
        const node = row.firstElementChild;
        if (node && node.classList && node.classList.contains(AVATAR_NODE_CLASS)) {
          try { node.classList.toggle(AVATAR_CONT_CLASS, cont); } catch {}
        }
      }
    }

    function avatarScheduleGrouping() {
      if (avatarGroupRaf) return;
      if (typeof requestAnimationFrame !== 'function') { avatarApplyGrouping(); return; }
      avatarGroupRaf = requestAnimationFrame(() => {
        avatarGroupRaf = 0;
        avatarApplyGrouping();
      });
    }

    function avatarSweep() {
      if (typeof document.querySelectorAll !== 'function') return;
      let rows;
      try { rows = document.querySelectorAll(AVATAR_ROW_SELECTOR); } catch { return; }
      for (const row of rows) avatarDecorateRow(row);
      avatarApplyGrouping();
    }

    function avatarOnMutations(records) {
      if (!avatarActive) return;
      let decorated = false;
      let regroup = false;
      for (const r of records) {
        if (r.type === 'attributes') { regroup = true; continue; }
        const added = r.addedNodes;
        if (!added || !added.length) continue;
        for (const n of added) {
          if (!n || n.nodeType !== 1) continue;
          try {
            if (n.matches && n.matches(AVATAR_ROW_SELECTOR)) {
              if (avatarDecorateRow(n)) decorated = true;
              continue;
            }
            if (n.closest && n.closest(`[${AVATAR_ROW_ATTR}]`)) continue;
          } catch { continue; }
          let inner = [];
          try { inner = n.querySelectorAll ? n.querySelectorAll(AVATAR_ROW_SELECTOR) : []; } catch {}
          for (const row of inner) {
            if (avatarDecorateRow(row)) decorated = true;
          }
        }
      }
      if (decorated || regroup) avatarScheduleGrouping();
    }

    function stopAvatarLayer() {
      avatarActive = false;
      if (avatarObserver) {
        try { avatarObserver.disconnect(); } catch {}
        avatarObserver = null;
      }
      if (avatarGroupRaf) {
        try { cancelAnimationFrame(avatarGroupRaf); } catch {}
        avatarGroupRaf = 0;
      }
      if (typeof document === 'undefined' || !document) return;
      if (document.body) {
        document.body.removeAttribute(AVATAR_BODY_ATTR);
      }
      try {
        document.querySelectorAll(`[${AVATAR_NODE_ATTR}]`).forEach((n) => { try { n.remove(); } catch {} });
        document.querySelectorAll(`[${AVATAR_ROW_ATTR}]`).forEach((row) => { try { row.removeAttribute(AVATAR_ROW_ATTR); } catch {} });
      } catch {}
    }

    function syncAvatarLayer() {
      const hasAny = isAzureAvatarOwner() && !!(getAvatarUrlForSide('user') || getAvatarUrlForSide('ai'));
      const body = document.body;
      if (!hasAny || !body || typeof MutationObserver !== 'function') {
        if (avatarActive || avatarObserver) stopAvatarLayer();
        else if (body) body.removeAttribute(AVATAR_BODY_ATTR);
        return;
      }
      body.setAttribute(AVATAR_BODY_ATTR, 'on');
      if (!avatarObserver) {
        try {
          avatarObserver = new MutationObserver(avatarOnMutations);
          avatarObserver.observe(body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['hidden', AVATAR_FOLD_ATTR, AVATAR_TURN_ATTR, 'data-chat-flow-kind']
          });
        } catch {
          avatarObserver = null;
        }
      }
      avatarActive = true;
      avatarSweep();
    }

    // -----------------------------------------------------------------------
    // 输入灵动岛（整合自 dsh-composer-dynamic-island，修复毛玻璃/transform 包含块坐标偏移问题）
    // -----------------------------------------------------------------------
    const ISLAND_SURFACE_ATTR = 'data-dsh-island-surface';
    const ISLAND_TRIGGER_ATTR = 'data-dsh-island-trigger';
    const ISLAND_PANEL_ATTR = 'data-dsh-island-panel';
    const ISLAND_ITEM_ATTR = 'data-dsh-island-item';
    const ISLAND_LEFT_SLOT = 'conversation.input.left';
    const ISLAND_RIGHT_SLOT = 'conversation.input.right';
    const ISLAND_MODEL_SLOT = 'conversation.input.model';
    const ISLAND_STORE_KEY = 'dsh-azure-glass-composer-island-v1';
    const ISLAND_MAX_PANEL_WIDTH = 520;
    const ISLAND_BTN_SELECTOR = 'button,[role="button"],input[type="button"],input[type="submit"],input[type="reset"]';
    const ISLAND_INTERACTIVE_SELECTOR = `${ISLAND_BTN_SELECTOR},select,input:not([type="hidden"])`;
    const ISLAND_TEXT_SELECTOR = 'textarea,[contenteditable=true],[role=textbox],input:not([type]),input[type="text"],input[type="search"],input[type="email"],input[type="password"],input[type="url"],input[type="tel"],input[type="number"]';
    const ISLAND_PLUGIN_MARKER = '[data-plugin],[data-plugin-id],[data-extension],[data-extension-id],[data-contribution]';
    const ISLAND_SLOT_RE = /^(?:conversation\.)?(?:input|composer)(?:\.|$)/i;
    const ISLAND_ZONE_LABELS = {
      native: '原生输入控件',
      left: '左侧插件',
      team: '团队模式',
      extension: '输入区插件',
      right: '右侧插件',
      model: '模型控件',
      action: '发送操作'
    };
    const ISLAND_ZONE_ORDER = ['native', 'left', 'team', 'extension', 'right', 'model', 'action'];

    let islandPanelSeq = 0;
    let islandObserver = null;
    let islandScanFrame = 0;
    const islandStates = new Map();
    const islandCatalog = new Map();
    const islandAvailableIds = new Set();
    const islandIdByNode = new WeakMap();
    const islandStoreListeners = new Set();
    let islandStoreSnapshot = null;

    function islandLoadStored() {
      try {
        const parsed = JSON.parse(window.localStorage.getItem(ISLAND_STORE_KEY) || 'null');
        if (parsed && typeof parsed === 'object') {
          return {
            configured: parsed.configured === true,
            selected: Array.isArray(parsed.selected) ? parsed.selected.filter((x) => typeof x === 'string') : []
          };
        }
      } catch {}
      return { configured: false, selected: [] };
    }
    const islandInitStored = islandLoadStored();
    let islandConfigured = islandInitStored.configured;
    const islandSelectedIds = new Set(islandInitStored.selected);

    function islandHashText(value) {
      let hash = 2166136261;
      for (let i = 0; i < value.length; i += 1) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
      }
      return (hash >>> 0).toString(36);
    }

    function islandNormalizeLabel(value) {
      return String(value ?? '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/[，,]\s*(?:当前|current)[:：]?.*$/iu, '')
        .replace(/[:：]\s*(?:开|关|开启|关闭|允许|禁止|on|off|enabled|disabled)(?:\b|$).*$/iu, '')
        .trim();
    }

    function islandInteractiveOf(node) {
      if (!(node instanceof HTMLElement)) return null;
      if (node.matches(ISLAND_INTERACTIVE_SELECTOR)) return node;
      return node.querySelector(ISLAND_INTERACTIVE_SELECTOR);
    }

    function islandButtonOf(node) {
      if (!(node instanceof HTMLElement)) return null;
      if (node.matches(ISLAND_BTN_SELECTOR)) return node;
      return node.querySelector(ISLAND_BTN_SELECTOR);
    }

    function islandLabelOf(node, fallback) {
      const control = islandInteractiveOf(node) ?? node;
      const selectedText = control instanceof HTMLSelectElement ? control.selectedOptions[0]?.textContent : '';
      const raw = control.getAttribute('aria-label')
        || control.getAttribute('title')
        || node.getAttribute('aria-label')
        || node.getAttribute('title')
        || selectedText
        || control.textContent
        || node.textContent
        || fallback;
      return islandNormalizeLabel(raw) || fallback;
    }

    function islandStableClassOf(node) {
      const control = islandInteractiveOf(node);
      const tokens = [...node.classList, ...(control === null ? [] : [...control.classList])]
        .filter((t, i, all) => all.indexOf(t) === i)
        .filter((t) => !/(?:^|[-_])(active|open|closed|enabled|disabled|on|off)$/i.test(t))
        .sort();
      return tokens.slice(0, 3).join('.');
    }

    function islandIdentityOf(node, zone, label) {
      const control = islandInteractiveOf(node);
      const stable = node.id
        || node.getAttribute('data-plugin')
        || node.getAttribute('data-plugin-id')
        || node.getAttribute('data-extension')
        || node.getAttribute('data-extension-id')
        || node.getAttribute('data-contribution')
        || node.getAttribute('data-slot')
        || islandStableClassOf(node)
        || control?.id
        || control?.getAttribute('name')
        || islandNormalizeLabel(control?.getAttribute('aria-label'))
        || islandNormalizeLabel(label);
      return `${zone}|${node.tagName}|${stable}`;
    }

    function islandBaseId(node, zone, label) {
      return `${zone}-${islandHashText(islandIdentityOf(node, zone, label))}`;
    }

    function islandDescribeCandidate(node, zone, occurrence) {
      const fallback = `未命名控件 ${occurrence + 1}`;
      const label = islandLabelOf(node, fallback);
      const baseId = islandBaseId(node, zone, label);
      let id = islandIdByNode.get(node);
      if (id === undefined) {
        id = occurrence === 0 ? baseId : `${baseId}-${islandHashText(label)}-${occurrence + 1}`;
        islandIdByNode.set(node, id);
      }
      return {
        id,
        label,
        zone,
        zoneLabel: ISLAND_ZONE_LABELS[zone],
        defaultCollapsed: zone === 'left' || zone === 'right' || zone === 'team' || zone === 'extension',
        node
      };
    }

    function islandRebuildSnapshot() {
      const items = [...islandAvailableIds]
        .map((id) => islandCatalog.get(id))
        .filter((item) => item !== undefined)
        .sort((a, b) => {
          const zd = ISLAND_ZONE_ORDER.indexOf(a.zone) - ISLAND_ZONE_ORDER.indexOf(b.zone);
          return zd !== 0 ? zd : a.label.localeCompare(b.label, 'zh-CN');
        });
      islandStoreSnapshot = {
        configured: islandConfigured,
        selected: [...islandSelectedIds],
        items
      };
    }

    function islandPersistStore() {
      try {
        window.localStorage.setItem(ISLAND_STORE_KEY, JSON.stringify({
          configured: islandConfigured,
          selected: [...islandSelectedIds]
        }));
      } catch {}
    }

    function islandEmitStore() {
      islandRebuildSnapshot();
      for (const listener of islandStoreListeners) {
        try { listener(); } catch {}
      }
    }

    function islandRegisterCandidates(candidates) {
      if (candidates.length === 0) return;
      let changed = false;
      const currentIds = new Set();
      for (const c of candidates) {
        currentIds.add(c.id);
        const prev = islandCatalog.get(c.id);
        const next = {
          id: c.id,
          label: c.label,
          zone: c.zone,
          zoneLabel: c.zoneLabel,
          defaultCollapsed: c.defaultCollapsed
        };
        if (!prev || prev.label !== next.label || prev.zone !== next.zone || prev.defaultCollapsed !== next.defaultCollapsed) {
          islandCatalog.set(c.id, next);
          changed = true;
        }
      }
      if ([...islandAvailableIds].some((id) => !currentIds.has(id)) || [...currentIds].some((id) => !islandAvailableIds.has(id))) {
        changed = true;
      }
      islandAvailableIds.clear();
      for (const id of currentIds) islandAvailableIds.add(id);
      const hasStaleOnly = islandConfigured && islandSelectedIds.size > 0 && ![...islandSelectedIds].some((id) => currentIds.has(id));
      if (!islandConfigured || hasStaleOnly) {
        for (const id of [...islandSelectedIds]) {
          if (!currentIds.has(id)) islandSelectedIds.delete(id);
        }
        for (const c of candidates) {
          if (c.defaultCollapsed) islandSelectedIds.add(c.id);
          else islandSelectedIds.delete(c.id);
        }
        if (hasStaleOnly) changed = true;
      }
      if (!changed && islandConfigured) return;
      islandPersistStore();
      islandEmitStore();
    }

    function islandRefreshAll() {
      for (const st of islandStates.values()) st.cleanup();
      islandStates.clear();
      islandScheduleScan();
      setTimeout(() => { if (config.composerIslandEnabled !== false) islandScheduleScan(); }, 600);
      setTimeout(() => { if (config.composerIslandEnabled !== false) islandScheduleScan(); }, 1800);
    }

    function islandSetSelected(id, selected) {
      islandConfigured = true;
      if (selected) islandSelectedIds.add(id);
      else islandSelectedIds.delete(id);
      islandPersistStore();
      islandEmitStore();
      islandRefreshAll();
    }

    function islandResetSelection() {
      islandConfigured = false;
      islandSelectedIds.clear();
      for (const id of islandAvailableIds) {
        const item = islandCatalog.get(id);
        if (item?.defaultCollapsed) islandSelectedIds.add(id);
      }
      islandPersistStore();
      islandEmitStore();
      islandRefreshAll();
    }

    islandRebuildSnapshot();
    const composerIslandStore = {
      subscribe(listener) {
        islandStoreListeners.add(listener);
        return () => islandStoreListeners.delete(listener);
      },
      getSnapshot() {
        return islandStoreSnapshot;
      },
      setSelected: islandSetSelected,
      reset: islandResetSelection,
      rescan: () => islandRefreshAll()
    };

    function islandDirectChildren(node) {
      return Array.from(node.children).filter((c) => c instanceof HTMLElement);
    }

    function islandDirectChildContaining(container, node) {
      let cur = node;
      while (cur instanceof HTMLElement && cur.parentElement !== container) cur = cur.parentElement;
      return cur instanceof HTMLElement && cur.parentElement === container ? cur : null;
    }

    function islandSlotZone(slotName) {
      if (slotName === ISLAND_LEFT_SLOT) return 'left';
      if (slotName === ISLAND_RIGHT_SLOT) return 'right';
      if (slotName === ISLAND_MODEL_SLOT) return 'model';
      return 'extension';
    }

    function islandFindComposerParts(card) {
      if (card.querySelector(':scope > [data-input-scroll],[data-input-scroll],textarea,[contenteditable=true],[role=textbox]') === null) return null;
      let row = null;
      let tools = null;
      let trailing = null;

      // 优先策略 1：直接通过宿主真实的 trailing / tools 类名定位底部工具行（兼容多层包装）
      const trailingByClass = card.querySelector('[class*="trailing"]');
      if (trailingByClass instanceof HTMLElement && trailingByClass.parentElement && card.contains(trailingByClass.parentElement)) {
        const candidateRow = trailingByClass.parentElement;
        const rowChildren = islandDirectChildren(candidateRow);
        if (rowChildren.length >= 2) {
          row = candidateRow;
          trailing = trailingByClass;
          tools = rowChildren.find((ch) => ch !== trailingByClass && /tools/i.test(ch.className))
            || rowChildren.find((ch) => ch !== trailingByClass)
            || rowChildren[0];
        }
      }

      // 优先策略 2：通过 conversation.input.* 槽位向上查找工具行
      if (!row) {
        const anySlot = card.querySelector('[data-slot="conversation.input.left"], [data-slot="conversation.input.right"], [data-slot="conversation.input.model"]');
        if (anySlot instanceof HTMLElement) {
          let cur = anySlot.parentElement;
          while (cur instanceof HTMLElement && cur !== card) {
            const kids = islandDirectChildren(cur);
            if (kids.length >= 2 && cur.querySelector('[data-slot="conversation.input.left"], [data-slot="conversation.input.right"]')) {
              row = cur;
              tools = kids[0];
              trailing = kids.at(-1);
              break;
            }
            cur = cur.parentElement;
          }
        }
      }

      // 兜底策略 3：沿用原直接子元素启发式查找
      if (!row) {
        const rows = islandDirectChildren(card).filter((cand) => {
          const children = islandDirectChildren(cand);
          return children.length >= 2 && children.some((ch) => ch.querySelector(ISLAND_INTERACTIVE_SELECTOR) !== null || ch.matches(ISLAND_INTERACTIVE_SELECTOR));
        });
        row = rows.at(-1) ?? null;
        if (row !== null) {
          const groups = islandDirectChildren(row);
          if (groups.length >= 2) {
            tools = groups[0];
            trailing = groups.at(-1);
          }
        }
      }

      if (!row || !tools || !trailing) return null;
      const inputSlots = [...row.querySelectorAll('[data-slot]')]
        .filter((slot) => slot instanceof HTMLElement && ISLAND_SLOT_RE.test(slot.getAttribute('data-slot') ?? ''));
      const leftSlot = inputSlots.find((s) => s.getAttribute('data-slot') === ISLAND_LEFT_SLOT) ?? null;
      const rightSlot = inputSlots.find((s) => s.getAttribute('data-slot') === ISLAND_RIGHT_SLOT) ?? null;
      const modelSlot = inputSlots.find((s) => s.getAttribute('data-slot') === ISLAND_MODEL_SLOT) ?? null;
      const modes = islandDirectChildren(tools).find((child) => child !== leftSlot
        && child.getAttribute('data-slot') === null
        && !child.matches(ISLAND_PLUGIN_MARKER)
        && child.querySelector(ISLAND_PLUGIN_MARKER) === null
        && islandButtonOf(child) === null
        && /(?:^|[-_])(mode|modes)(?:[-_]|$)/i.test(child.className)) ?? null;
      return { card, row, tools, trailing, modes, leftSlot, rightSlot, modelSlot, inputSlots };
    }

    // 精确计算 position: fixed 的真实包含块原点（兼容祖先 backdrop-filter / transform / contain）
    function getFixedContainingBlockOrigin(node) {
      for (let parent = node?.parentElement; parent && parent !== document.body && parent !== document.documentElement; parent = parent.parentElement) {
        const cs = window.getComputedStyle(parent);
        const hasFixedCB = (cs.transform && cs.transform !== 'none')
          || (cs.filter && cs.filter !== 'none')
          || (cs.backdropFilter && cs.backdropFilter !== 'none')
          || (cs.webkitBackdropFilter && cs.webkitBackdropFilter !== 'none')
          || (cs.perspective && cs.perspective !== 'none')
          || /\b(?:paint|layout|strict|content)\b/.test(cs.contain || '')
          || /\b(?:transform|filter|backdrop-filter|perspective)\b/.test(cs.willChange || '');
        if (hasFixedCB) {
          const r = parent.getBoundingClientRect();
          return { x: r.left + (parent.clientLeft || 0), y: r.top + (parent.clientTop || 0) };
        }
      }
      return { x: 0, y: 0 };
    }

    function islandDiscoverCandidates(parts) {
      const candidates = [];
      const occurrences = new Map();
      const seenNodes = new Set();
      const add = (node, zone, buttonOnly = false) => {
        if (!(node instanceof HTMLElement)
          || seenNodes.has(node)
          || node.matches(ISLAND_TEXT_SELECTOR)
          || node.querySelector(ISLAND_TEXT_SELECTOR) !== null
          || (buttonOnly ? islandButtonOf(node) === null : islandInteractiveOf(node) === null)
          || node.hasAttribute(ISLAND_TRIGGER_ATTR)
          || node.hasAttribute(ISLAND_SURFACE_ATTR)
          || node.querySelector(`[${ISLAND_SURFACE_ATTR}]`) !== null) return;
        seenNodes.add(node);
        const label = islandLabelOf(node, '未命名控件');
        const baseId = islandBaseId(node, zone, label);
        const count = occurrences.get(baseId) ?? 0;
        occurrences.set(baseId, count + 1);
        candidates.push(islandDescribeCandidate(node, zone, count));
      };

      for (const slot of parts.inputSlots) {
        const slotName = slot.getAttribute('data-slot') ?? '';
        const zone = islandSlotZone(slotName);
        const expandSlotKids = (container) => {
          for (const child of islandDirectChildren(container)) {
            if (child.hasAttribute(ISLAND_SURFACE_ATTR) || child.querySelector(`[${ISLAND_SURFACE_ATTR}]`) !== null) continue;
            const cs = window.getComputedStyle(child);
            if (cs && cs.display === 'contents' && islandDirectChildren(child).length > 0) {
              expandSlotKids(child);
              continue;
            }
            const resolvedZone = child.classList.contains('team-seat') ? 'team' : zone;
            add(child, resolvedZone, zone === 'extension');
          }
        };
        expandSlotKids(slot);
      }
      for (const child of islandDirectChildren(parts.tools)) {
        if (parts.inputSlots.some((s) => child === s || child.contains(s))
          || child === parts.modes
          || child.matches(ISLAND_PLUGIN_MARKER)
          || child.querySelector(ISLAND_PLUGIN_MARKER) !== null) continue;
        add(child, 'native');
      }
      if (parts.modes !== null) {
        for (const child of islandDirectChildren(parts.modes)) add(child, 'native');
      }
      for (const child of islandDirectChildren(parts.trailing)) {
        if (parts.inputSlots.some((s) => child === s || child.contains(s))
          || child.matches(ISLAND_PLUGIN_MARKER)
          || child.querySelector(ISLAND_PLUGIN_MARKER) !== null) continue;
        add(child, 'action');
      }
      for (const marker of parts.row.querySelectorAll(ISLAND_PLUGIN_MARKER)) {
        if (!(marker instanceof HTMLElement)
          || marker.closest('[data-slot]') !== null
          || marker.parentElement?.closest(ISLAND_PLUGIN_MARKER) !== null) continue;
        add(marker, 'extension', true);
      }
      for (const control of parts.row.querySelectorAll(ISLAND_BTN_SELECTOR)) {
        if (!(control instanceof HTMLElement)
          || control.closest('[data-slot]') !== null
          || control.closest(ISLAND_PLUGIN_MARKER) !== null
          || control.closest(`[${ISLAND_SURFACE_ATTR}]`) !== null) continue;
        const group = parts.tools.contains(control) ? parts.tools : parts.trailing.contains(control) ? parts.trailing : null;
        if (group === null) continue;
        const root = islandDirectChildContaining(group, control) ?? control;
        add(root, group === parts.tools ? 'native' : 'action', true);
      }
      return candidates;
    }

    function ComposerIslandSurface() {
      const panelId = React.useMemo(() => `dsh-ag-composer-island-${++islandPanelSeq}`, []);
      React.useEffect(() => {
        islandScheduleScan();
      }, []);
      return jsxs('span', {
        [ISLAND_SURFACE_ATTR]: '',
        children: [
          jsx('button', {
            key: 'trigger',
            type: 'button',
            [ISLAND_TRIGGER_ATTR]: '',
            'aria-label': '更多输入功能（琉璃收纳匣）',
            'aria-expanded': 'false',
            'aria-controls': panelId,
            title: '更多输入功能（琉璃收纳匣）',
            children: jsxs('svg', {
              'data-dsh-island-icon': '',
              width: 16,
              height: 16,
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: 1.8,
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              'aria-hidden': 'true',
              children: [
                jsx('rect', { x: 3.5, y: 3.5, width: 7, height: 7, rx: 2 }),
                jsx('rect', { x: 3.5, y: 13.5, width: 7, height: 7, rx: 2 }),
                jsx('rect', { x: 13.5, y: 13.5, width: 7, height: 7, rx: 2 }),
                jsx('rect', { className: 'dsh-island-spark', x: 14, y: 4, width: 6, height: 6, rx: 1.8 })
              ]
            })
          }),
          jsx('section', {
            key: 'panel',
            id: panelId,
            [ISLAND_PANEL_ATTR]: '',
            role: 'group',
            'aria-label': '扩展输入功能'
          })
        ]
      });
    }

    function islandMeasureCandidate(candidate) {
      const rect = candidate.node.getBoundingClientRect();
      return {
        candidate,
        node: candidate.node,
        width: Math.max(24, Math.ceil(rect.width || candidate.node.offsetWidth || 28)),
        height: Math.max(24, Math.ceil(rect.height || candidate.node.offsetHeight || 28))
      };
    }

    function islandPackItems(items, rowRect, triggerRect) {
      const padding = 10;
      const gapX = 10;
      const gapY = 8;
      const maxWidth = Math.max(120, Math.min(ISLAND_MAX_PANEL_WIDTH, rowRect.width - 16, window.innerWidth - 16));
      const spaceAbove = Math.max(48, triggerRect.top - 16);
      const spaceBelow = Math.max(48, window.innerHeight - triggerRect.bottom - 16);
      const opensUp = spaceAbove >= Math.min(160, spaceBelow);
      const maxHeight = Math.max(48, opensUp ? spaceAbove : spaceBelow);
      let x = padding;
      let y = padding;
      let rowHeight = 0;
      let contentRight = 0;
      const placed = [];
      for (const item of items) {
        const width = Math.min(item.width, maxWidth - padding * 2);
        if (x > padding && x + width > maxWidth - padding) {
          x = padding;
          y += rowHeight + gapY;
          rowHeight = 0;
        }
        if (y + item.height + padding > maxHeight) continue;
        placed.push({ item, x, y, width });
        contentRight = Math.max(contentRight, x + width);
        rowHeight = Math.max(rowHeight, item.height);
        x += width + gapX;
      }
      const panelWidth = Math.max(58, Math.min(maxWidth, contentRight + padding));
      const panelHeight = Math.max(48, Math.min(maxHeight, y + rowHeight + padding));
      const anchorCenter = triggerRect.left + triggerRect.width / 2;
      const left = Math.max(8, Math.min(anchorCenter - panelWidth / 2, window.innerWidth - panelWidth - 8));
      const top = opensUp
        ? Math.max(8, triggerRect.top - panelHeight - 8)
        : Math.min(window.innerHeight - panelHeight - 8, triggerRect.bottom + 8);
      return { placed, left, top, panelWidth, panelHeight, direction: opensUp ? 'up' : 'down' };
    }

    function islandStateIsCurrent(state, candidates) {
      const { card, row, tools, trailing, surface, panel, trigger, items } = state;
      if (!card.isConnected || !row.isConnected || !card.contains(row)) return false;
      if (!surface.isConnected || !card.contains(surface) || !surface.contains(trigger) || !surface.contains(panel)) return false;
      if (!tools.isConnected || !trailing.isConnected || !row.contains(tools) || !row.contains(trailing)) return false;
      if (candidates.length !== items.length) return false;
      const selectedNow = new Map(candidates.map((c) => [c.id, c]));
      for (const item of items) {
        if (!item.node.isConnected || selectedNow.get(item.candidate.id)?.node !== item.node) return false;
      }
      return true;
    }

    function islandCreateFallbackSurface(trailing) {
      const panelId = `dsh-ag-composer-island-${++islandPanelSeq}`;
      const surface = document.createElement('span');
      surface.setAttribute(ISLAND_SURFACE_ATTR, '');
      surface.setAttribute('data-ag-island-dom', '1');
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.setAttribute(ISLAND_TRIGGER_ATTR, '');
      trigger.setAttribute('aria-label', '更多输入功能（琉璃收纳匣）');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', panelId);
      trigger.title = '更多输入功能（琉璃收纳匣）';
      trigger.innerHTML = '<svg data-dsh-island-icon="" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/><rect class="dsh-island-spark" x="14" y="4" width="6" height="6" rx="1.8"/></svg>';
      const panel = document.createElement('section');
      panel.id = panelId;
      panel.setAttribute(ISLAND_PANEL_ATTR, '');
      panel.setAttribute('role', 'group');
      panel.setAttribute('aria-label', '扩展输入功能');
      surface.appendChild(trigger);
      surface.appendChild(panel);
      try {
        trailing.insertBefore(surface, trailing.firstChild);
      } catch {
        try { trailing.appendChild(surface); } catch {}
      }
      return surface;
    }

    function islandDecorateCard(record) {
      const { card, parts, candidates } = record;
      if (islandStates.has(card) || candidates.length === 0) return;
      let surface = card.querySelector(`[${ISLAND_SURFACE_ATTR}]`);
      let createdFallback = false;
      if (!(surface instanceof HTMLElement)) {
        surface = islandCreateFallbackSurface(parts.trailing);
        createdFallback = true;
      }
      if (!(surface instanceof HTMLElement)) return;
      const trigger = surface.querySelector(`[${ISLAND_TRIGGER_ATTR}]`);
      const panel = surface.querySelector(`[${ISLAND_PANEL_ATTR}]`);
      if (!(trigger instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) return;
      const items = candidates.map(islandMeasureCandidate);
      const { row, tools, trailing } = parts;
      card.dataset.dshIslandReady = 'true';
      row.setAttribute('data-dsh-island-row', '');
      row.dataset.dshIslandOpen = 'false';
      tools.setAttribute('data-dsh-island-tools', '');
      trailing.setAttribute('data-dsh-island-trailing', '');

      let pinned = false;
      let closeTimer = 0;
      const pointerInside = () => panel.matches(':hover')
        || trigger.matches(':hover')
        || items.some((it) => it.node.hasAttribute(ISLAND_ITEM_ATTR) && it.node.matches(':hover'));
      const setOpen = (open) => {
        window.clearTimeout(closeTimer);
        row.dataset.dshIslandOpen = open ? 'true' : 'false';
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      const open = () => {
        layout();
        setOpen(true);
      };
      const schedulePointerClose = () => {
        window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(() => {
          if (pointerInside()) return;
          pinned = false;
          setOpen(false);
        }, 140);
      };
      const scheduleFocusClose = () => {
        window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(() => {
          if (!row.matches(':focus-within') && !pointerInside()) setOpen(false);
        }, 0);
      };
      const toggle = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        pinned = row.dataset.dshIslandOpen !== 'true';
        if (pinned) layout();
        setOpen(pinned);
      };
      const onKeyDown = (ev) => {
        if (ev.defaultPrevented || ev.key !== 'Escape' || row.dataset.dshIslandOpen !== 'true') return;
        pinned = false;
        setOpen(false);
        trigger.focus();
      };
      const onDocPointerDown = (ev) => {
        if (!pinned || row.contains(ev.target)) return;
        pinned = false;
        setOpen(false);
      };
      const layout = () => {
        if (!row.isConnected) return;
        for (const it of items) {
          it.node.removeAttribute(ISLAND_ITEM_ATTR);
          it.node.removeAttribute('data-dshi-menu-align');
          it.node.removeAttribute('data-dshi-menu-direction');
          it.node.style.removeProperty('--dshi-item-left');
          it.node.style.removeProperty('--dshi-item-top');
        }
        const selectedItems = items.filter((it) => islandSelectedIds.has(it.candidate.id));
        if (selectedItems.length === 0) {
          delete card.dataset.dshIslandReady;
          setOpen(false);
          return;
        }
        card.dataset.dshIslandReady = 'true';
        const measuredItems = selectedItems.map((it) => islandMeasureCandidate(it.candidate));
        const packed = islandPackItems(measuredItems, row.getBoundingClientRect(), trigger.getBoundingClientRect());
        const placedNodes = new Set(packed.placed.map((p) => p.item.node));
        for (const it of selectedItems) {
          if (placedNodes.has(it.node)) it.node.setAttribute(ISLAND_ITEM_ATTR, it.candidate.id);
          else it.node.removeAttribute(ISLAND_ITEM_ATTR);
        }
        const panelOrigin = getFixedContainingBlockOrigin(panel);
        panel.style.setProperty('--dshi-panel-left', `${packed.left - panelOrigin.x}px`);
        panel.style.setProperty('--dshi-panel-top', `${packed.top - panelOrigin.y}px`);
        panel.style.setProperty('--dshi-panel-width', `${packed.panelWidth}px`);
        panel.style.setProperty('--dshi-panel-height', `${packed.panelHeight}px`);
        panel.dataset.dshiDirection = packed.direction;
        for (const placement of packed.placed) {
          const { item, x, y } = placement;
          const itemOrigin = getFixedContainingBlockOrigin(item.node);
          const vpLeft = packed.left + x;
          const vpTop = packed.top + y;
          item.node.style.setProperty('--dshi-item-left', `${vpLeft - itemOrigin.x}px`);
          item.node.style.setProperty('--dshi-item-top', `${vpTop - itemOrigin.y}px`);
          if (item.node.classList.contains('team-seat')) {
            const menu = item.node.querySelector('.team-pop');
            const menuWidth = menu instanceof HTMLElement ? Math.max(1, menu.offsetWidth) : 330;
            const menuHeight = menu instanceof HTMLElement ? Math.max(1, menu.offsetHeight) : 140;
            item.node.dataset.dshiMenuAlign = vpLeft + menuWidth <= window.innerWidth - 8 ? 'left' : 'right';
            item.node.dataset.dshiMenuDirection = vpTop - menuHeight - 18 >= 8 ? 'up' : 'down';
          }
        }
      };
      const scheduleItemLayout = () => window.requestAnimationFrame(layout);

      trigger.addEventListener('pointerenter', open);
      trigger.addEventListener('pointerleave', schedulePointerClose);
      trigger.addEventListener('focus', open);
      trigger.addEventListener('click', toggle);
      panel.addEventListener('pointerenter', open);
      panel.addEventListener('pointerleave', schedulePointerClose);
      for (const it of items) {
        const onItemEnter = () => { if (it.node.hasAttribute(ISLAND_ITEM_ATTR)) open(); };
        const onItemLeave = () => { if (it.node.hasAttribute(ISLAND_ITEM_ATTR)) schedulePointerClose(); };
        it.onEnter = onItemEnter;
        it.onLeave = onItemLeave;
        it.node.addEventListener('pointerenter', onItemEnter);
        it.node.addEventListener('pointerleave', onItemLeave);
        it.node.addEventListener('focusin', onItemEnter);
        it.node.addEventListener('click', scheduleItemLayout);
      }
      row.addEventListener('focusout', scheduleFocusClose);
      row.addEventListener('keydown', onKeyDown);
      document.addEventListener('pointerdown', onDocPointerDown, true);
      window.addEventListener('resize', layout);
      const resizeObserver = new ResizeObserver(layout);
      resizeObserver.observe(card);
      for (const it of items) resizeObserver.observe(it.node);
      window.requestAnimationFrame(layout);

      islandStates.set(card, {
        card, row, tools, trailing, surface, panel, trigger, items, layout,
        cleanup() {
          window.clearTimeout(closeTimer);
          resizeObserver.disconnect();
          window.removeEventListener('resize', layout);
          trigger.removeEventListener('pointerenter', open);
          trigger.removeEventListener('pointerleave', schedulePointerClose);
          trigger.removeEventListener('focus', open);
          trigger.removeEventListener('click', toggle);
          panel.removeEventListener('pointerenter', open);
          panel.removeEventListener('pointerleave', schedulePointerClose);
          for (const it of items) {
            it.node.removeEventListener('pointerenter', it.onEnter);
            it.node.removeEventListener('pointerleave', it.onLeave);
            it.node.removeEventListener('focusin', it.onEnter);
            it.node.removeEventListener('click', scheduleItemLayout);
            it.node.removeAttribute(ISLAND_ITEM_ATTR);
            it.node.removeAttribute('data-dshi-menu-align');
            it.node.removeAttribute('data-dshi-menu-direction');
            it.node.style.removeProperty('--dshi-item-left');
            it.node.style.removeProperty('--dshi-item-top');
          }
          panel.removeAttribute('data-dshi-direction');
          panel.style.removeProperty('--dshi-panel-left');
          panel.style.removeProperty('--dshi-panel-top');
          panel.style.removeProperty('--dshi-panel-width');
          panel.style.removeProperty('--dshi-panel-height');
          row.removeEventListener('focusout', scheduleFocusClose);
          row.removeEventListener('keydown', onKeyDown);
          document.removeEventListener('pointerdown', onDocPointerDown, true);
          delete card.dataset.dshIslandReady;
          row.removeAttribute('data-dsh-island-row');
          row.removeAttribute('data-dsh-island-open');
          tools.removeAttribute('data-dsh-island-tools');
          trailing.removeAttribute('data-dsh-island-trailing');
          if (createdFallback && surface.getAttribute('data-ag-island-dom') === '1') {
            try { surface.remove(); } catch {}
          }
        }
      });
    }

    function islandDiscoverRecords() {
      const cards = new Set([...document.querySelectorAll('[data-composer-card]')].filter((n) => n instanceof HTMLElement));
      for (const surface of document.querySelectorAll(`[${ISLAND_SURFACE_ATTR}]`)) {
        let container = surface.parentElement;
        while (container instanceof HTMLElement && container !== document.body) {
          if (islandFindComposerParts(container) !== null) {
            cards.add(container);
            break;
          }
          container = container.parentElement;
        }
      }
      return [...cards]
        .map((card) => {
          const parts = islandFindComposerParts(card);
          return parts === null ? null : { card, parts, candidates: islandDiscoverCandidates(parts) };
        })
        .filter((r) => r !== null);
    }

    function islandMutationTouchesComposer(mutation) {
      const sel = `[data-composer-card],[data-input-scroll],[data-slot],${ISLAND_PLUGIN_MARKER},${ISLAND_BTN_SELECTOR},.team-seat`;
      const target = mutation.target;
      if (target instanceof Element && (target.matches(sel) || target.closest('[data-composer-card]') !== null)) return true;
      for (const node of [...mutation.addedNodes, ...mutation.removedNodes]) {
        if (!(node instanceof Element)) continue;
        if (node.matches(sel) || node.querySelector(sel) !== null) return true;
      }
      return false;
    }

    function islandScan() {
      islandScanFrame = 0;
      if (config.composerIslandEnabled === false) return;
      const records = islandDiscoverRecords();
      islandRegisterCandidates(records.flatMap((r) => r.candidates));
      const recordByCard = new Map(records.map((r) => [r.card, r]));
      for (const [card, st] of islandStates) {
        const rec = recordByCard.get(card);
        if (rec === undefined || !islandStateIsCurrent(st, rec.candidates)) {
          st.cleanup();
          islandStates.delete(card);
        }
      }
      for (const rec of records) islandDecorateCard(rec);
      for (const st of islandStates.values()) st.layout();
    }

    function islandScheduleScan() {
      if (config.composerIslandEnabled === false) return;
      if (islandScanFrame !== 0) return;
      islandScanFrame = window.requestAnimationFrame(islandScan);
    }

    function stopComposerIsland() {
      if (islandObserver) {
        try { islandObserver.disconnect(); } catch {}
        islandObserver = null;
      }
      if (islandScanFrame !== 0) {
        window.cancelAnimationFrame(islandScanFrame);
        islandScanFrame = 0;
      }
      for (const st of islandStates.values()) st.cleanup();
      islandStates.clear();
    }

    function syncComposerIsland() {
      if (config.composerIslandEnabled === false || !document.body) {
        stopComposerIsland();
        return;
      }
      if (!islandObserver && typeof MutationObserver === 'function') {
        try {
          islandObserver = new MutationObserver((mutations) => {
            if (mutations.some(islandMutationTouchesComposer)) islandScheduleScan();
          });
          islandObserver.observe(document.body, { childList: true, subtree: true });
        } catch {
          islandObserver = null;
        }
      }
      islandScheduleScan();
      setTimeout(() => { if (config.composerIslandEnabled !== false) islandScheduleScan(); }, 600);
      setTimeout(() => { if (config.composerIslandEnabled !== false) islandScheduleScan(); }, 1800);
    }

    function applyVisualStyles() {
      let style = document.getElementById(STYLE_ID);
      if (!style) {
        style = document.createElement('style');
        style.id = STYLE_ID;
        document.head.appendChild(style);
      }

      const useAzureGlass = isAzureGlassOwner();
      const useAzureColor = isAzureColorOwner();
      const useAzureAvatar = isAzureAvatarOwner();
      const glassActive = useAzureGlass && config.glassEnabled && !config.turboMode;
      const weWpActive = weCompatState.wallpaperActive;
      const ownWpActive = !weWpActive && (Boolean(getActiveWallpaperUrl()) || (!config.turboMode && (config.bgEffectMode || 'none') !== 'none'));
      const wpActive = useAzureGlass && (ownWpActive || weWpActive);
      const blur = glassActive ? `${config.glassBlurPx}px` : '0px';
      const compBlur = glassActive ? `${config.glassComposerBlurPx}px` : '0px';
      const sidechatCompBlurNum = Number.isFinite(Number(config.glassSidechatComposerBlurPx))
        ? Number(config.glassSidechatComposerBlurPx)
        : DEFAULT_CONFIG.glassSidechatComposerBlurPx;
      const sidechatCompBlur = glassActive && sidechatCompBlurNum > 0 ? `${sidechatCompBlurNum}px` : '0px';
      const sidechatCompOp = Number.isFinite(Number(config.glassSidechatComposerOpacity))
        ? Number(config.glassSidechatComposerOpacity)
        : DEFAULT_CONFIG.glassSidechatComposerOpacity;
      const sidechatRightGap = Number.isFinite(Number(config.sidechatComposerRightGapPx))
        ? Math.max(0, Math.round(Number(config.sidechatComposerRightGapPx)))
        : DEFAULT_CONFIG.sidechatComposerRightGapPx;
      const headerOp = Number.isFinite(Number(config.glassHeaderOpacity))
        ? Math.min(1, Math.max(0, Number(config.glassHeaderOpacity)))
        : DEFAULT_CONFIG.glassHeaderOpacity;
      const headerBlurNum = Number.isFinite(Number(config.glassHeaderBlurPx))
        ? Math.max(0, Math.round(Number(config.glassHeaderBlurPx)))
        : DEFAULT_CONFIG.glassHeaderBlurPx;
      const headerBlur = glassActive && headerBlurNum > 0 ? `${headerBlurNum}px` : '0px';
      const modalBlur = glassActive ? `${config.glassModalBlurPx}px` : '0px';
      const bubbleBlur = glassActive && config.glassBubbleBlurPx > 0 ? `${config.glassBubbleBlurPx}px` : '0px';
      const theme = detectTheme();
      const isLight = theme === 'light';
      const ui = config.uiColors || {};
      const prose = config.proseColors || {};

      const baseRgbArr = hexToRgb(ui.bgBase) || (isLight ? [255, 255, 255] : [18, 22, 32]);
      const surfaceRgb = baseRgbArr.join(', ');
      const borderRgb = isLight ? '15, 23, 42' : '255, 255, 255';
      const borderCol = `rgba(${borderRgb}, ${config.glassBorderAlpha})`;
      const fabBg = isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(18, 24, 38, 0.84)';
      const fabHover = isLight ? 'rgba(241, 245, 249, 0.96)' : 'rgba(30, 41, 59, 0.96)';
      const fabText = isLight ? '#1e293b' : '#e2e8f0';
      const panelBg = isLight ? 'rgba(255, 255, 255, 0.96)' : 'rgba(24, 28, 38, 0.95)';
      const itemText = isLight ? '#334155' : '#cbd5e1';
      const accent = ui.brandPrimary || '#38bdf8';
      const activeStudioTheme = studioThemePreview || resolveStudioUiTheme(config.studioUiTheme);
      const stUi = computeStudioUiPalette(activeStudioTheme.primary, activeStudioTheme.secondary, isLight);

      // 生成 18 个 UI 槽位的 --dsw-* 变量覆盖（仅在由苍蓝琉璃控制色彩时输出）
      const uiTokenLines = [];
      if (useAzureColor) {
        for (const slot of UI_COLOR_SLOTS) {
          if (!slot.token) continue;
          if (ui[slot.key]) {
            if (wpActive && (slot.key === 'bgBase' || slot.key === 'bgLayer1' || slot.key === 'bgLayer2' || slot.key === 'bgLayer3' || slot.key === 'sidebarFill' || slot.key === 'menuFill')) {
              const rgb = hexToRgb(ui[slot.key]);
              if (rgb) {
                const a = slot.key === 'bgBase' ? 0
                  : slot.key === 'sidebarFill' ? config.glassSurfaceOpacity
                  : slot.key === 'bgLayer1' ? config.glassChatBgOpacity
                  : slot.key === 'menuFill' ? (config.solidOverlay ? 1 : Math.min(0.96, config.glassComposerOpacity + 0.14))
                  : config.glassComposerOpacity;
                uiTokenLines.push(`${slot.token}: rgba(${rgb.join(',')}, ${a}) !important;`);
                continue;
              }
            }
            uiTokenLines.push(`${slot.token}: ${ui[slot.key]} !important;`);
          }
        }
      }

      const overlayAlpha = config.glassOverlayOpacity ?? (config.solidOverlay ? 1 : 0.88);
      const overlayBlur = glassActive ? `${config.glassOverlayBlurPx ?? config.glassModalBlurPx ?? 16}px` : '0px';
      const diffAlpha = config.glassDiffOpacity ?? (config.solidDiff ? 1 : 0.90);
      const diffBlur = glassActive ? `${config.glassDiffBlurPx ?? 0}px` : '0px';
      const userBubbleRgb = (ui.userBubbleBg && hexToRgb(ui.userBubbleBg)) ? hexToRgb(ui.userBubbleBg).join(', ') : surfaceRgb;
      const wpPassthroughVars = wpActive ? `
        --dsw-alias-bg-base: transparent !important;
        --dsw-alias-bg-layer-1: rgba(${surfaceRgb}, ${config.glassChatBgOpacity}) !important;
        --dsw-alias-bg-layer-2: rgba(${surfaceRgb}, ${Math.min(0.95, config.glassChatBgOpacity + 0.12)}) !important;
        --dsw-alias-bg-layer-3: rgba(${surfaceRgb}, ${overlayAlpha}) !important;
        --dsw-specific-sidebar-fill: transparent !important;
        --dsw-alias-bg-module-platform: rgba(${surfaceRgb}, ${config.glassRightSidebarOpacity}) !important;
        --dsw-menu-surface-fill: rgba(${surfaceRgb}, ${overlayAlpha}) !important;
      ` : '';

      const proseFilter = config.proseBoost === 'strong' ? 'brightness(1.18) saturate(1.14)'
        : config.proseBoost === 'soft' ? 'brightness(1.08) saturate(1.06)' : '';

      const composerOwnedByAzure = isComposerOwnedByAzure();
      document.documentElement.setAttribute('data-dsh-sg-glass', glassActive ? '1' : '0');
      document.documentElement.setAttribute('data-dsh-sg-composer-we', composerOwnedByAzure ? '0' : '1');
      document.documentElement.setAttribute('data-dsh-sg-turbo', config.turboMode ? '1' : '0');
      document.documentElement.setAttribute('data-dsh-sg-theme', theme);

      style.textContent = `
        :root, html, body, body[data-ds-dark-theme], [data-theme] {
          --dsh-sg-blur: ${blur};
          --dsh-sg-comp-blur: ${compBlur};
          --dsh-windows-content-radius: ${config.glassRadiusPx}px !important;
          --dsw-radius-lg: ${config.glassRadiusPx}px !important;
          --dsw-radius-md: ${Math.max(4, config.glassRadiusPx - 3)}px !important;
          ${config.minimalScrollbar ? `
          --dsh-scrollbar-thumb: rgba(${borderRgb}, 0.24) !important;
          --dsh-scrollbar-thumb-hover: rgba(${borderRgb}, 0.44) !important;` : ''}
          ${wpPassthroughVars}
          ${uiTokenLines.join('\n          ')}
        }

        ${config.fixGhostGap ? `
        [data-phase="active"] [class*="composerSeat"],
        [class*="composerSeat"] { will-change: auto !important; }` : ''}

        ${config.fixSettingsScroll ? `
        [role="dialog"] [class*="content"],
        [role="dialog"] [class*="Content"],
        [role="dialog"] [class*="body"],
        [role="dialog"] [class*="Body"] { min-height: 0; overscroll-behavior: contain; }` : ''}

        html[data-dsh-sg-hidden="1"] * {
          animation-play-state: paused !important;
          transition: none !important;
        }

        /* 独立 GPU 壁纸/视频/动态背景/特效层（锁定合成层，防止 Windows Electron 下冲刷前景 backdrop 缓存） */
        #dsh-sg-wallpaper, #dsh-sg-wallpaper-video, #dsh-sg-bg-effect, #dsh-sg-scrim {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          contain: strict;
          backface-visibility: hidden;
        }
        #dsh-sg-wallpaper {
          background-repeat: no-repeat;
          transform: translate3d(0, 0, 0);
          will-change: transform;
        }
        #dsh-sg-wallpaper-video {
          width: 100%;
          height: 100%;
          transform: translate3d(0, 0, 0);
          will-change: transform;
        }
        #dsh-sg-bg-effect {
          width: 100%;
          height: 100%;
          transform: translate3d(0, 0, 0);
        }
        #dsh-sg-scrim { transform: translate3d(0, 0, 0); }
        #dsh-sg-fx-canvas {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9998;
          pointer-events: none;
        }
        #root, #app, [data-dsh-root] {
          position: relative;
          z-index: 1;
        }

        /* 3D 视差：界面元素可选跟随 */
        html[data-dsh-sg-parallax-ui="1"] [class*="_centerCol"],
        html[data-dsh-sg-parallax-ui="1"] [class*="_sidebarCol"],
        html[data-dsh-sg-parallax-ui="1"] [data-composer-card] {
          transform: translate3d(var(--dsh-sg-ui-px, 0px), var(--dsh-sg-ui-py, 0px), 0);
        }

        /* 窗口外框透明化 + 顶部标题栏独立控制（仅在由苍蓝琉璃控制玻璃质感时输出） */
        ${useAzureGlass ? `
        html[data-dsh-sg-wp="1"],
        html[data-dsh-sg-wp="1"] body,
        html[data-dsh-sg-wp="1"] #root,
        html[data-dsh-sg-wp="1"] #app,
        html[data-dsh-sg-wp="1"] [data-windows-titlebar] [class*="_frame"],
        html[data-dsh-sg-wp="1"] [class*="_frame"] {
          background-color: transparent !important;
          background-image: none !important;
        }
        [data-windows-titlebar] [class*="_frame"]:before {
          background: ${headerOp <= 0 ? 'transparent' : `rgba(${surfaceRgb}, ${headerOp})`} !important;
          ${headerBlur !== '0px'
            ? `backdrop-filter: blur(${headerBlur}) saturate(${config.glassSaturate}%) !important;
          -webkit-backdrop-filter: blur(${headerBlur}) saturate(${config.glassSaturate}%) !important;`
            : `backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;`}
        }

        /* 四大区域独立不透明度（左侧栏 / 聊天主区 / 右侧栏 / 输入框），互不干扰！ */
        html[data-dsh-sg-wp="1"] [class*="_sidebarCol"],
        html[data-dsh-sg-wp="1"] aside {
          background-color: rgba(${surfaceRgb}, ${config.glassSurfaceOpacity}) !important;
        }
        html[data-dsh-sg-wp="1"] [class*="_centerCol"] {
          background-color: rgba(${surfaceRgb}, ${config.glassChatBgOpacity}) !important;
          border-top-left-radius: ${config.glassRadiusPx}px !important;
        }
        html[data-dsh-sg-wp="1"] [data-sidebar-right-panel][data-sidebar-right-open],
        html[data-dsh-sg-wp="1"] [class*="_rightbarCol"] {
          background-color: rgba(${surfaceRgb}, ${config.glassRightSidebarOpacity}) !important;
          border-radius: ${config.glassRadiusPx}px !important;
        }
        [data-sidebar-right-panel]:not([data-sidebar-right-open]) {
          background: transparent !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          border-color: transparent !important;
          box-shadow: none !important;
        }
        ${composerOwnedByAzure ? `
        [data-composer-card] {
          ${(wpActive || weCompatState.installed) ? `background-color: rgba(${surfaceRgb}, ${config.glassComposerOpacity}) !important;` : ''}
          border-radius: ${config.glassRadiusPx}px !important;
          border-color: ${borderCol} !important;
        }
        ${weCompatState.installed ? `
        body[data-we-glass-page] [data-composer-card],
        body[data-we-wallpaper] [data-composer-card] {
          background-image: none !important;
          box-shadow: none !important;
          border-color: ${borderCol} !important;
        }
        body[data-we-ui-color] [data-composer-seat] {
          --dsw-alias-button-info-fill: var(--dsw-alias-brand-primary) !important;
          --dsw-alias-button-info-hover: var(--dsw-alias-brand-primary) !important;
        }` : ''}` : ''}
        /* 侧边对话输入框：独立不透明度 / 模糊半径 + 右侧留白 */
        [class*="sidechatComposer"]:not([class*="sidechatComposerInput"]):not([class*="sidechatComposerBar"]):not([class*="sidechatComposerTools"]):not([class*="sidechatComposerSpacer"]) {
          background: rgba(${surfaceRgb}, ${sidechatCompOp}) !important;
          border-radius: ${config.glassRadiusPx}px !important;
          border-color: ${borderCol} !important;
          margin-right: ${sidechatRightGap}px !important;
          ${sidechatCompBlur !== '0px'
            ? `backdrop-filter: blur(${sidechatCompBlur}) saturate(${config.glassSaturate}%) !important;
          -webkit-backdrop-filter: blur(${sidechatCompBlur}) saturate(${config.glassSaturate}%) !important;
          isolation: isolate;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;`
            : `backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;`}
        }

        /* 窗口玻璃模糊（精准作用于真实 DSH 节点；右侧栏仅展开态生效；锁定独立 GPU 合成层防 Windows 闪烁） */
        html[data-dsh-sg-glass="1"] [class*="_sidebarCol"],
        html[data-dsh-sg-glass="1"] aside,
        html[data-dsh-sg-glass="1"] [data-sidebar-right-panel][data-sidebar-right-open] {
          backdrop-filter: blur(${blur}) saturate(${config.glassSaturate}%) !important;
          -webkit-backdrop-filter: blur(${blur}) saturate(${config.glassSaturate}%) !important;
          isolation: isolate;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }
        ${composerOwnedByAzure ? `
        html[data-dsh-sg-glass="1"] [data-composer-card] {
          backdrop-filter: blur(${compBlur}) saturate(${config.glassSaturate}%) !important;
          -webkit-backdrop-filter: blur(${compBlur}) saturate(${config.glassSaturate}%) !important;
          isolation: isolate;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }` : ''}
        html[data-dsh-sg-glass="1"] [role="dialog"],
        html[data-dsh-sg-glass="1"] [role="alertdialog"],
        html[data-dsh-sg-glass="1"] dialog[open] {
          border-radius: ${config.glassRadiusPx}px !important;
        }
        ${config.dynamicDegradeOnScroll ? `
        html[data-dsh-sg-scrolling="1"] [class*="_sidebarCol"],
        html[data-dsh-sg-scrolling="1"] [data-sidebar-right-panel][data-sidebar-right-open],
        html[data-dsh-sg-scrolling="1"] [data-composer-card] {
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }` : ''}` : ''}

        /* 方案 A：右侧栏大文档/长列表视口跳过渲染加速（零冲突） */
        ${config.rightSidebarBoostEnabled ? `
        [data-sidebar-right-panel][data-sidebar-right-open] pre,
        [data-sidebar-right-panel][data-sidebar-right-open] tr,
        [data-sidebar-right-panel][data-sidebar-right-open] [class*="markdown"] > *,
        [data-sidebar-right-panel][data-sidebar-right-open] [class*="Markdown"] > *,
        [data-sidebar-right-panel][data-sidebar-right-open] [class*="preview"] > div {
          content-visibility: auto;
          contain-intrinsic-size: auto 44px;
        }` : ''}

        ${useAzureGlass ? `
        /* 用户消息气泡不透明度与模糊（精准命中 DSH 真实气泡节点 [data-message-bubble]） */
        [data-message-bubble],
        [data-conversation-scroll] [data-message-bubble] {
          background-color: rgba(${userBubbleRgb}, ${config.glassBubbleOpacity}) !important;
          ${bubbleBlur !== '0px' ? `backdrop-filter: blur(${bubbleBlur}) saturate(${config.glassSaturate}%) !important; -webkit-backdrop-filter: blur(${bubbleBlur}) saturate(${config.glassSaturate}%) !important; isolation: isolate;` : ''}
          border-radius: ${config.glassRadiusPx}px !important;
        }

        /* 浮层 / 菜单 / 弹窗独立不透明度与模糊（统一由 glassOverlayOpacity / glassOverlayBlurPx 控制） */
        html[data-dsh-sg-glass="1"] [role="dialog"],
        html[data-dsh-sg-glass="1"] [role="alertdialog"],
        html[data-dsh-sg-glass="1"] dialog[open],
        html[data-dsh-sg-glass="1"] [role="menu"],
        html[data-dsh-sg-glass="1"] [role="listbox"],
        html[data-dsh-sg-glass="1"] [data-radix-popper-content-wrapper] > *,
        html[data-dsh-sg-glass="1"] [data-floating-ui-portal] > *,
        html[data-dsh-sg-glass="1"] [class*="popover"],
        html[data-dsh-sg-glass="1"] [class*="Popover"],
        html[data-dsh-sg-glass="1"] [class*="dropdown"],
        html[data-dsh-sg-glass="1"] [class*="Dropdown"],
        html[data-dsh-sg-glass="1"] #dsh-sg-rail-hover,
        html[data-dsh-sg-glass="1"] #dsh-sg-rail-popover,
        html[data-dsh-sg-glass="1"] .dsh-sg-outline-pop,
        [role="dialog"], [role="alertdialog"], dialog[open], [role="menu"], [role="listbox"],
        [data-radix-popper-content-wrapper] > *, [data-floating-ui-portal] > *,
        [class*="popover"], [class*="Popover"], [class*="dropdown"], [class*="Dropdown"] {
          background-color: rgba(${surfaceRgb}, ${overlayAlpha}) !important;
          ${overlayBlur !== '0px' ? `backdrop-filter: blur(${overlayBlur}) saturate(${config.glassSaturate}%) !important; -webkit-backdrop-filter: blur(${overlayBlur}) saturate(${config.glassSaturate}%) !important; isolation: isolate;` : 'backdrop-filter: none !important; -webkit-backdrop-filter: none !important;'}
        }

        /* 代码 Diff 区域独立不透明度与模糊 */
        [class*="diff"], [class*="Diff"], [data-diff], [data-code-lang="diff"] {
          background-color: rgba(${surfaceRgb}, ${diffAlpha}) !important;
          ${diffBlur !== '0px' ? `backdrop-filter: blur(${diffBlur}) saturate(${config.glassSaturate}%) !important; -webkit-backdrop-filter: blur(${diffBlur}) saturate(${config.glassSaturate}%) !important; isolation: isolate;` : ''}
        }` : ''}

        /* 极简 Neko Glass 细圆角滚动条（绝不用 scrollbar-width: thin 屏蔽 WebKit 自定义样式，也不复活原生隐藏条） */
        ${config.minimalScrollbar ? `
        :root { color-scheme: ${isLight ? 'light' : 'dark'}; }
        ::-webkit-scrollbar { width: 7px !important; height: 7px !important; }
        ::-webkit-scrollbar-track { background: transparent !important; }
        ::-webkit-scrollbar-corner { background: transparent !important; }
        ::-webkit-scrollbar-button { display: none !important; width: 0 !important; height: 0 !important; }
        ::-webkit-scrollbar-thumb {
          background: ${isLight ? 'rgba(100, 116, 139, 0.26)' : 'rgba(148, 163, 184, 0.24)'} !important;
          border-radius: 999px !important;
          border: 2px solid transparent !important;
          background-clip: content-box !important;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${stUi.scrollHover} !important;
          border: 1px solid transparent !important;
          background-clip: content-box !important;
        }
        ::-webkit-scrollbar-thumb:active {
          background: ${stUi.scrollActive} !important;
          border: 1px solid transparent !important;
          background-clip: content-box !important;
        }` : ''}

        ${useAzureColor ? `
        /* 9 个 Markdown Prose 角色 + 正文提亮档位（ColorLab 完整还原） */
        ${proseFilter ? `[data-conversation-scroll] [data-chat-flow-kind] { filter: ${proseFilter}; }` : ''}
        ${prose.heading ? `[data-conversation-scroll] h1, [data-conversation-scroll] h2, [data-conversation-scroll] h3, [data-conversation-scroll] h4, [data-conversation-scroll] th { color: ${prose.heading} !important; }` : ''}
        ${prose.strong ? `[data-conversation-scroll] strong, [data-conversation-scroll] b { color: ${prose.strong} !important; }` : ''}
        ${prose.em ? `[data-conversation-scroll] em, [data-conversation-scroll] i { color: ${prose.em} !important; }` : ''}
        ${prose.code ? `[data-conversation-scroll] :not(pre) > code { color: ${prose.code} !important; }` : ''}
        ${prose.marker ? `[data-conversation-scroll] li::marker { color: ${prose.marker} !important; }` : ''}
        ${prose.quote ? `[data-conversation-scroll] blockquote { color: ${prose.quote} !important; }` : ''}
        ${prose.quoteBorder ? `[data-conversation-scroll] blockquote { border-left-color: ${prose.quoteBorder} !important; }` : ''}
        ${prose.link ? `[data-conversation-scroll] a { color: ${prose.link} !important; }` : ''}
        ${prose.del ? `[data-conversation-scroll] del, [data-conversation-scroll] s { color: ${prose.del} !important; }` : ''}

        /* ColorLab 过程行高亮：工具行 / 汇总行 / 文件卡片 */
        ${config.rowHighlightEnabled ? `
        [data-conversation-scroll] [class*="tool"] [class*="title"],
        [data-conversation-scroll] [class*="Tool"] [class*="label"],
        [data-conversation-scroll] [data-chat-flow-kind*="tool"] summary { color: ${config.toolRowColor} !important; }
        [data-conversation-scroll] [class*="compactionButton"],
        [data-conversation-scroll] [class*="summary"] summary { color: ${config.summaryRowColor} !important; }
        [data-conversation-scroll] [class*="fileCard"],
        [data-conversation-scroll] [class*="FileCard"] { border-color: ${config.fileCardColor} !important; color: ${config.fileCardColor} !important; }` : ''}` : ''}

        ${(weCompatState.installed && useAzureAvatar) ? `
        /* 苍蓝琉璃接管会话头像时，屏蔽 Wallpaper Engine 的头像节点防止重复显示 */
        [data-we-avatar-node] { display: none !important; }` : ''}

        /* 自定义会话头像（DOM 装饰层配套样式，兼容宿主 display:contents 槽出口锚点） */
        body[data-ag-avatar="on"] [data-ag-avatar-row] {
          display: flex !important;
          align-items: flex-start !important;
          gap: 10px !important;
        }
        body[data-ag-avatar="on"] [data-ag-avatar-row="user"] {
          flex-direction: row-reverse !important;
        }
        body[data-ag-avatar="on"] [data-ag-avatar-row] > :not(.dsh-ag-avatar),
        body[data-ag-avatar="on"] [data-ag-avatar-row] > [data-slot] > :not(.dsh-ag-avatar) {
          flex: 1 1 auto !important;
          min-width: 0 !important;
        }
        .dsh-ag-avatar {
          box-sizing: border-box !important;
          flex: 0 0 auto !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: var(--dsh-ag-avatar-size, 40px) !important;
          height: var(--dsh-ag-avatar-size, 40px) !important;
          border-radius: 50% !important;
          overflow: hidden !important;
          margin-top: 2px !important;
          background: rgba(128, 128, 128, 0.14) !important;
          border: 1.5px solid ${stUi.accentBorder} !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18) !important;
          color: ${stUi.accentLight} !important;
          user-select: none !important;
        }
        .dsh-ag-avatar__img {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
        .dsh-ag-avatar__glyph {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          height: 100% !important;
        }
        .dsh-ag-avatar__glyph svg {
          width: 60% !important;
          height: 60% !important;
        }
        .dsh-ag-avatar--cont {
          visibility: hidden !important;
        }

        /* 输入灵动岛（整合自 dsh-composer-dynamic-island，接入苍蓝琉璃动态主题与包含块防裁切） */
        [data-composer-card][data-dsh-island-ready] {
          overflow: visible !important;
        }
        [data-dsh-island-row] {
          position: relative !important;
          flex-wrap: nowrap !important;
          gap: 8px !important;
          min-height: 36px !important;
          isolation: isolate;
        }
        [data-dsh-island-surface] {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 30px;
          width: 30px;
          min-width: 30px;
          height: 30px;
          overflow: visible;
        }
        [data-composer-card]:not([data-dsh-island-ready]) [data-dsh-island-surface] {
          display: none !important;
        }
        [data-dsh-island-panel] {
          position: fixed !important;
          z-index: 40 !important;
          box-sizing: border-box !important;
          left: var(--dshi-panel-left) !important;
          top: var(--dshi-panel-top) !important;
          width: var(--dshi-panel-width) !important;
          height: var(--dshi-panel-height) !important;
          display: block !important;
          overflow: visible !important;
          border: 1px solid ${stUi.accentBorder} !important;
          border-radius: 16px !important;
          background: ${isLight ? 'rgba(255, 255, 255, 0.90)' : 'rgba(18, 22, 34, 0.90)'} !important;
          box-shadow: 0 12px 32px rgba(0, 0, 0, ${isLight ? '0.14' : '0.36'}), 0 0 0 1px ${stUi.accentBg} !important;
          backdrop-filter: blur(18px) saturate(1.2) !important;
          -webkit-backdrop-filter: blur(18px) saturate(1.2) !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          transform: translateY(14px) scale(0.96) !important;
          transform-origin: left bottom !important;
          transition: opacity 0.18s ease, transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), visibility 0s linear 0.22s !important;
        }
        [data-dsh-island-row][data-dsh-island-open="true"] [data-dsh-island-panel] {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          transform: translateY(0) scale(1) !important;
          transition-delay: 0s !important;
        }
        [data-dsh-island-panel]::after {
          content: '';
          position: absolute;
          right: 0;
          bottom: -10px;
          left: 0;
          height: 10px;
        }
        [data-dsh-island-panel][data-dshi-direction="down"] {
          transform-origin: left top !important;
        }
        [data-dsh-island-item] {
          position: fixed !important;
          z-index: 41 !important;
          box-sizing: border-box !important;
          left: var(--dshi-item-left) !important;
          top: var(--dshi-item-top) !important;
          margin: 0 !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          transform: translateY(12px) scale(0.96) !important;
          transform-origin: left bottom !important;
          transition: opacity 0.16s ease, transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), visibility 0s linear 0.2s !important;
        }
        [data-dsh-island-row][data-dsh-island-open="true"] [data-dsh-island-item] {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          transform: translateY(0) scale(1) !important;
          transition-delay: 0s !important;
        }
        [data-dsh-island-item] select {
          max-width: min(260px, 70vw) !important;
        }
        [data-dsh-island-item].team-seat {
          position: fixed !important;
        }
        [data-dsh-island-item].team-seat .team-pop {
          right: 0 !important;
          left: auto !important;
          bottom: calc(100% + 18px) !important;
          z-index: 60 !important;
          max-height: min(420px, calc(100vh - 120px)) !important;
        }
        [data-dsh-island-item].team-seat[data-dshi-menu-align="left"] .team-pop {
          right: auto !important;
          left: 0 !important;
        }
        [data-dsh-island-item].team-seat[data-dshi-menu-direction="down"] .team-pop {
          top: calc(100% + 18px) !important;
          bottom: auto !important;
          transform-origin: 100% 0 !important;
        }
        [data-dsh-island-item].team-seat .team-pop::before {
          bottom: -18px !important;
          height: 18px !important;
        }
        [data-dsh-island-item].team-seat[data-dshi-menu-direction="down"] .team-pop::before {
          top: -18px !important;
          bottom: auto !important;
        }
        [data-dsh-island-trigger] {
          position: relative !important;
          z-index: 2 !important;
          box-sizing: border-box !important;
          width: 30px !important;
          height: 30px !important;
          flex: 0 0 30px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 !important;
          border: 1px solid transparent !important;
          border-radius: 50% !important;
          color: var(--dsw-alias-label-secondary, ${isLight ? 'rgba(15, 23, 42, 0.65)' : 'rgba(226, 232, 240, 0.72)'}) !important;
          background: transparent !important;
          cursor: pointer !important;
          box-shadow: none !important;
          transition: background-color 0.16s ease, border-color 0.16s ease, color 0.16s ease, transform 0.16s ease !important;
        }
        [data-dsh-island-trigger]:hover,
        [data-dsh-island-trigger]:focus-visible {
          color: ${isLight ? '#0f172a' : '#f8fafc'} !important;
          border-color: ${isLight ? 'rgba(15, 23, 42, 0.10)' : 'rgba(255, 255, 255, 0.12)'} !important;
          background: ${isLight ? 'rgba(15, 23, 42, 0.06)' : 'rgba(255, 255, 255, 0.08)'} !important;
          outline: none !important;
        }
        [data-dsh-island-row][data-dsh-island-open="true"] [data-dsh-island-trigger] {
          color: ${stUi.accentLight} !important;
          border-color: ${stUi.accentBorder} !important;
          background: ${stUi.accentBg} !important;
          outline: none !important;
        }
        [data-dsh-island-trigger]:active {
          transform: scale(0.92) !important;
        }
        [data-dsh-island-icon] {
          display: block;
          pointer-events: none;
          transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        [data-dsh-island-icon] .dsh-island-spark {
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        [data-dsh-island-row][data-dsh-island-open="true"] [data-dsh-island-icon] .dsh-island-spark {
          transform: rotate(45deg) scale(0.92);
        }
        [data-dsh-island-tools] {
          flex: 0 1 auto !important;
          min-width: 0 !important;
          gap: 12px !important;
          white-space: nowrap !important;
        }
        [data-dsh-island-trailing] {
          flex: 0 1 auto !important;
          min-width: 0 !important;
          margin-left: auto !important;
          gap: 8px !important;
          white-space: nowrap !important;
        }

        ${useAzureColor ? `
        ${ui.userBubbleBg ? `[data-conversation-scroll] [data-role="user"], [data-conversation-scroll] [class*="userMessage"] { background-color: ${ui.userBubbleBg} !important; border-radius: ${config.glassRadiusPx}px; }` : ''}
        ${ui.codeBlockBg ? `[data-conversation-scroll] pre { background-color: ${ui.codeBlockBg} !important; }` : ''}
        ${config.fontFamily ? `body, [data-conversation-scroll] { font-family: ${config.fontFamily} !important; }` : ''}
        ${config.monoFontFamily ? `code, pre, kbd { font-family: ${config.monoFontFamily} !important; }` : ''}
        ${config.caretColor ? `textarea, input, [contenteditable="true"] { caret-color: ${config.caretColor} !important; }` : ''}` : ''}

        ${config.antigravityLayout ? `
        [data-conversation-scroll] [class*="flowItem"] {
          ${useAzureColor ? `font-size: ${config.fontSizePx}px;
          line-height: ${config.lineHeight};` : ''}
          letter-spacing: 0.01em;
          ${config.chatMaxWidthPx > 0 ? `max-width: ${config.chatMaxWidthPx}px; margin-left: auto; margin-right: auto;` : ''}
        }
        [data-conversation-scroll] pre {
          ${useAzureColor ? `font-size: ${config.codeFontSizePx}px;` : ''}
          border-radius: ${Math.max(6, config.glassRadiusPx - 2)}px !important;
          border: 1px solid ${borderCol} !important;
        }` : ''}

        ${config.composerAutoFold ? `
        [class*="composerSeat"] textarea:not(:focus) {
          max-height: 44px !important;
          overflow: hidden !important;
          transition: max-height 0.18s ease;
        }` : ''}

        [data-sg-parked="1"] {
          contain: strict !important;
          content-visibility: hidden !important;
          pointer-events: none !important;
        }
        [class*="flowItem"]:not([data-sg-parked="1"]) { contain: layout style; }

        .dsh-sg-code-collapsed {
          position: relative;
          max-height: ${config.compactMaxHeightPx}px !important;
          overflow: hidden !important;
          cursor: pointer;
          mask-image: linear-gradient(to bottom, #000 74%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, #000 74%, transparent 100%);
        }
        .dsh-sg-code-collapsed::after {
          content: '点击展开完整代码块';
          position: absolute;
          left: 50%;
          bottom: 6px;
          transform: translateX(-50%);
          padding: 2px 10px;
          font-size: 11px;
          color: ${accent};
          background: ${isLight ? 'rgba(224,242,254,0.92)' : 'rgba(15,23,42,0.92)'};
          border: 1px solid ${borderCol};
          border-radius: 999px;
          pointer-events: none;
        }

        /* 会话顶栏官方插槽内的快捷按钮（conversation.session.header.utilities，随布局自动排列） */
        .dsh-sg-hdr-group { display: inline-flex; align-items: center; gap: 2px; flex-shrink: 0; }
        .dsh-sg-hdr-btn {
          width: 28px; height: 28px; padding: 0; border: 0; border-radius: var(--dsw-radius-sm, 6px);
          background: transparent; color: var(--dsw-alias-label-tertiary, ${fabText});
          display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .dsh-sg-hdr-btn:hover { background: var(--dsw-alias-interactive-bg-hover, ${fabHover}); color: var(--dsw-alias-label-primary, ${fabText}); }
        .dsh-sg-hdr-btn[data-active="1"] { color: ${accent}; }

        #dsh-sg-outline-panel {
          position: fixed; right: var(--dsh-sg-outline-right, 126px); top: var(--dsh-sg-outline-top, 78px); width: 300px; max-height: 62vh;
          overflow-y: auto; z-index: 9991; border-radius: 12px; border: 1px solid ${borderCol};
          background: ${panelBg}; color: ${fabText}; padding: 10px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35); font-size: 12px;
        }
        .dsh-sg-outline-item {
          padding: 6px 8px; border-radius: 8px; cursor: pointer;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${itemText};
        }
        .dsh-sg-outline-item:hover { background: rgba(56, 189, 248, 0.16); color: ${isLight ? '#0f172a' : '#fff'}; }

        /* 合并式锚点轨道（无背景无边框，垂直居中，悬停显示Antigravity风格预览卡片） */
        [data-sg-native-rail-hidden="1"] {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
        #dsh-sg-anchor-rail {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 6px 4px;
          background: transparent;
          border: none;
          box-shadow: none;
          scrollbar-width: none;
        }
        #dsh-sg-anchor-rail::-webkit-scrollbar { display: none !important; width: 0 !important; }
        @keyframes dsh-sg-rail-busy {
          0%, 100% { opacity: 0.45; transform: scale(1.1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        .dsh-sg-rail-pill {
          width: 4px;
          height: 18px;
          border-radius: 999px;
          background: ${isLight ? 'rgba(100,116,139,0.5)' : 'rgba(148,163,184,0.48)'};
          cursor: pointer;
          transition: transform 0.15s, background 0.15s;
        }
        .dsh-sg-rail-pill[data-current="1"] {
          background: ${isLight ? '#0f172a' : '#ffffff'};
          transform: scaleX(1.35);
        }
        .dsh-sg-rail-pill:hover, .dsh-sg-rail-pill[data-active="1"] {
          background: ${accent};
          transform: scaleX(1.5);
        }
        .dsh-sg-rail-pill[data-busy="1"] {
          background: ${accent};
          animation: dsh-sg-rail-busy 0.95s ease-in-out infinite;
        }
        .dsh-sg-rail-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${isLight ? 'rgba(100,116,139,0.42)' : 'rgba(148,163,184,0.42)'};
          cursor: pointer;
          transition: transform 0.15s, background 0.15s;
        }
        .dsh-sg-rail-dot:hover { background: ${accent}; transform: scale(1.45); }
        .dsh-sg-rail-dot[data-current="1"] { background: ${isLight ? '#0f172a' : '#ffffff'}; transform: scale(1.35); }
        .dsh-sg-rail-dot[data-busy="1"] {
          background: ${accent};
          animation: dsh-sg-rail-busy 0.95s ease-in-out infinite;
        }

        #dsh-sg-rail-hover {
          position: fixed;
          width: 356px;
          box-sizing: border-box;
          padding: 11px 12px;
          z-index: 26;
          border-radius: 14px;
          border: 1px solid ${stUi.borderPop};
          background: ${stUi.popBg};
          color: ${fabText};
          box-shadow: ${isLight ? '0 14px 36px rgba(15, 23, 42, 0.16)' : '0 18px 44px rgba(0, 0, 0, 0.48)'};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          pointer-events: auto;
          cursor: pointer;
          font-size: 12px;
          max-height: 62vh;
          overflow-y: auto;
          overscroll-behavior: contain;
          color-scheme: ${isLight ? 'light' : 'dark'};
          transition: border-color 0.14s ease, box-shadow 0.14s ease;
        }
        #dsh-sg-rail-hover:hover {
          border-color: ${stUi.hoverBorder} !important;
          box-shadow: ${isLight ? `0 16px 40px ${stUi.glowShadow}` : `0 18px 44px rgba(0, 0, 0, 0.56), 0 0 0 1px ${stUi.badgeBorder}`} !important;
        }
        #dsh-sg-rail-hover::-webkit-scrollbar { width: 7px; height: 7px; }
        #dsh-sg-rail-hover::-webkit-scrollbar-button { display: none !important; width: 0; height: 0; }
        #dsh-sg-rail-hover::-webkit-scrollbar-track { background: transparent; }
        #dsh-sg-rail-hover::-webkit-scrollbar-corner { background: transparent; }
        #dsh-sg-rail-hover::-webkit-scrollbar-thumb {
          background: ${isLight ? 'rgba(100, 116, 139, 0.26)' : 'rgba(148, 163, 184, 0.24)'};
          border-radius: 999px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        #dsh-sg-rail-hover::-webkit-scrollbar-thumb:hover {
          background: ${stUi.scrollHover};
          border: 1px solid transparent;
          background-clip: content-box;
        }
        #dsh-sg-rail-hover::-webkit-scrollbar-thumb:active {
          background: ${stUi.scrollActive};
          border: 1px solid transparent;
          background-clip: content-box;
        }
        .dsh-sg-hover-top {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 4px;
          color: ${isLight ? '#0f172a' : '#f1f5f9'};
        }
        .dsh-sg-hover-idx {
          font-size: 12px;
          font-weight: 700;
          color: ${accent};
          font-variant-numeric: tabular-nums;
        }
        .dsh-sg-hover-title-lg {
          flex: 1;
          min-width: 0;
          font-size: 13.5px;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dsh-sg-hover-count {
          font-size: 11px;
          color: ${isLight ? '#64748b' : 'rgba(148,163,184,0.8)'};
          font-variant-numeric: tabular-nums;
          flex-shrink: 0;
        }
        .dsh-sg-hover-range {
          font-size: 11px;
          color: ${isLight ? '#64748b' : 'rgba(148,163,184,0.85)'};
          margin: 0 0 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid ${borderCol};
          font-variant-numeric: tabular-nums;
        }
        /* Antigravity风格单轮悬停卡片 */
        .dsh-sg-turn-user {
          font-size: 13px;
          line-height: 1.5;
          color: ${isLight ? '#0f172a' : '#f8fafc'};
          font-weight: 500;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word;
          padding: 4px 6px;
          margin: -4px -6px;
          border-radius: 7px;
          transition: background 0.12s;
        }
        #dsh-sg-rail-hover:hover .dsh-sg-turn-user { background: ${isLight ? 'rgba(15,23,42,0.06)' : 'rgba(148,163,184,0.14)'}; }
        .dsh-sg-turn-assistant {
          margin-top: 8px;
          font-size: 12.5px;
          line-height: 1.5;
          color: ${isLight ? '#475569' : 'rgba(226,232,240,0.82)'};
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word;
        }
        .dsh-sg-turn-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          font-size: 11px;
          color: ${isLight ? '#94a3b8' : 'rgba(148,163,184,0.65)'};
          font-variant-numeric: tabular-nums;
        }
        .dsh-sg-hover-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 6px;
          margin: 0 -6px;
          border-radius: 7px;
          cursor: pointer;
          transition: background 0.14s, box-shadow 0.14s;
        }
        .dsh-sg-hover-row:hover { background: rgba(56, 189, 248, 0.16); }
        .dsh-sg-hover-row[data-current="1"] {
          background: ${isLight ? 'rgba(14, 165, 233, 0.14)' : 'rgba(56, 189, 248, 0.20)'};
          box-shadow: inset 3px 0 0 ${accent};
        }
        .dsh-sg-hover-row[data-current="1"]:hover {
          background: ${isLight ? 'rgba(14, 165, 233, 0.20)' : 'rgba(56, 189, 248, 0.26)'};
        }
        .dsh-sg-hover-row[data-current="1"] .dsh-sg-hover-row-text {
          color: ${isLight ? '#0f172a' : '#ffffff'};
          font-weight: 600;
        }
        .dsh-sg-hover-row[data-current="1"] .dsh-sg-hover-row-role {
          color: ${isLight ? '#0369a1' : '#e0f2fe'};
          background: ${isLight ? 'rgba(14, 165, 233, 0.20)' : 'rgba(56, 189, 248, 0.30)'};
        }
        .dsh-sg-hover-row-time {
          font-size: 10.5px;
          color: ${isLight ? '#64748b' : 'rgba(148,163,184,0.75)'};
          font-variant-numeric: tabular-nums;
          min-width: 40px;
          flex-shrink: 0;
        }
        .dsh-sg-hover-row-role {
          font-size: 10px;
          padding: 0 6px;
          border-radius: 999px;
          color: ${isLight ? '#334155' : '#94a3b8'};
          background: ${isLight ? 'rgba(15,23,42,0.06)' : 'rgba(148,163,184,0.14)'};
          flex-shrink: 0;
        }
        .dsh-sg-hover-row-text {
          flex: 1;
          min-width: 0;
          font-size: 12px;
          line-height: 1.45;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dsh-sg-hover-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 6px;
          font-size: 10.5px;
          opacity: 0.6;
        }

        #dsh-sg-rail-popover {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          width: 372px;
          box-sizing: border-box;
          max-height: 56vh;
          overflow-y: auto;
          z-index: 25;
          border-radius: 14px;
          border: 1px solid ${stUi.borderPop};
          background: ${stUi.popBg};
          color: ${fabText};
          padding: 12px 14px;
          box-shadow: ${isLight ? '0 16px 40px rgba(15, 23, 42, 0.16)' : '0 18px 44px rgba(0, 0, 0, 0.48)'};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          font-size: 12.5px;
          color-scheme: ${isLight ? 'light' : 'dark'};
        }
        #dsh-sg-rail-popover::-webkit-scrollbar { width: 7px; height: 7px; }
        #dsh-sg-rail-popover::-webkit-scrollbar-button { display: none !important; width: 0; height: 0; }
        #dsh-sg-rail-popover::-webkit-scrollbar-track { background: transparent; }
        #dsh-sg-rail-popover::-webkit-scrollbar-corner { background: transparent; }
        #dsh-sg-rail-popover::-webkit-scrollbar-thumb {
          background: ${isLight ? 'rgba(100, 116, 139, 0.26)' : 'rgba(148, 163, 184, 0.24)'};
          border-radius: 999px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        #dsh-sg-rail-popover::-webkit-scrollbar-thumb:hover {
          background: ${stUi.scrollHover};
          border: 1px solid transparent;
          background-clip: content-box;
        }
        #dsh-sg-rail-popover::-webkit-scrollbar-thumb:active {
          background: ${stUi.scrollActive};
          border: 1px solid transparent;
          background-clip: content-box;
        }
        .dsh-sg-pop-head {
          display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
          padding-bottom: 8px; border-bottom: 1px solid ${stUi.borderSubtle};
        }
        .dsh-sg-pop-title { font-size: 13px; font-weight: 700; }
        .dsh-sg-pop-count {
          font-size: 11px; padding: 1px 8px; border-radius: 999px; font-weight: 600;
          color: ${stUi.badgeText};
          background: ${stUi.badgeBg};
          border: 1px solid ${stUi.badgeBorder};
        }
        .dsh-sg-pop-row {
          display: flex; align-items: center; gap: 10px;
          padding: 6px 8px; border-radius: 8px; cursor: pointer; color: ${itemText};
          transition: background 0.14s, box-shadow 0.14s;
        }
        .dsh-sg-pop-row:hover { background: ${stUi.hoverBg}; color: ${isLight ? '#0f172a' : '#fff'}; }
        .dsh-sg-pop-row[data-current="1"] {
          background: ${stUi.badgeBg};
          box-shadow: inset 3px 0 0 ${stUi.p};
          color: ${isLight ? '#0f172a' : '#ffffff'};
          font-weight: 600;
        }
        .dsh-sg-pop-row[data-current="1"]:hover {
          background: ${hexRgba(stUi.p, isLight ? 0.20 : 0.26)};
        }
        .dsh-sg-pop-idx {
          font-size: 11px; min-width: 30px; text-align: right;
          color: ${stUi.accentText}; font-variant-numeric: tabular-nums; font-weight: 700;
        }
        .dsh-sg-pop-txt { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dsh-sg-pop-time {
          font-size: 10.5px; opacity: 0.55; flex-shrink: 0;
          font-variant-numeric: tabular-nums;
        }

        /* 工坊面板样式（苍蓝系列 Neko Glass 动态双色主题体系） */
        .dsh-sg-panel-scroll {
          color-scheme: ${isLight ? 'light' : 'dark'};
        }
        .dsh-sg-panel-scroll::-webkit-scrollbar { width: 7px; height: 7px; }
        .dsh-sg-panel-scroll::-webkit-scrollbar-button { display: none !important; width: 0; height: 0; }
        .dsh-sg-panel-scroll::-webkit-scrollbar-track { background: transparent; }
        .dsh-sg-panel-scroll::-webkit-scrollbar-corner { background: transparent; }
        .dsh-sg-panel-scroll::-webkit-scrollbar-thumb {
          background: ${isLight ? 'rgba(100, 116, 139, 0.26)' : 'rgba(148, 163, 184, 0.24)'};
          border-radius: 999px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .dsh-sg-panel-scroll::-webkit-scrollbar-thumb:hover {
          background: ${stUi.scrollHover};
          border: 1px solid transparent;
          background-clip: content-box;
        }
        .dsh-sg-panel-scroll::-webkit-scrollbar-thumb:active {
          background: ${stUi.scrollActive};
          border: 1px solid transparent;
          background-clip: content-box;
        }
        /* Neko Glass 自定义毛玻璃下拉栏（替代系统硬画 <select>） */
        .dsh-sg-nselect-wrap {
          position: relative; display: inline-block; flex-shrink: 0;
        }
        .dsh-sg-card:has(.dsh-sg-nselect-trigger[data-open="1"]) {
          position: relative; z-index: 40;
        }
        .dsh-sg-nselect-trigger {
          display: inline-flex; align-items: center; justify-content: space-between; gap: 10px;
          min-width: 156px; max-width: 240px; padding: 5px 10px; border-radius: 10px;
          border: 1px solid ${stUi.borderCard};
          background: ${stUi.inputBg};
          color: ${fabText}; font-size: 12px; font-weight: 600; cursor: pointer; outline: none;
          transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
        }
        .dsh-sg-nselect-trigger:hover,
        .dsh-sg-nselect-trigger[data-open="1"] {
          border-color: ${stUi.p};
          background: ${stUi.triggerHoverBg};
          box-shadow: 0 0 0 2px ${stUi.focusRing};
        }
        .dsh-sg-nselect-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .dsh-sg-nselect-arrow {
          width: 14px; height: 14px; flex-shrink: 0; opacity: 0.78;
          transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .dsh-sg-nselect-trigger[data-open="1"] .dsh-sg-nselect-arrow { transform: rotate(180deg); opacity: 1; }
        .dsh-sg-nselect-menu {
          position: absolute; right: 0; top: calc(100% + 6px);
          z-index: 60; min-width: 100%; width: max-content; max-width: 260px; max-height: 240px; overflow-y: auto;
          padding: 5px; border-radius: 12px; box-sizing: border-box;
          border: 1px solid ${stUi.borderPop};
          background: ${stUi.menuBg};
          color: ${fabText};
          box-shadow: ${isLight ? '0 14px 36px rgba(15, 23, 42, 0.16)' : `0 18px 44px rgba(0, 0, 0, 0.56), 0 0 0 1px ${hexRgba(stUi.p, 0.14)}`};
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          color-scheme: ${isLight ? 'light' : 'dark'};
        }
        .dsh-sg-nselect-menu[data-up="1"] {
          top: auto; bottom: calc(100% + 6px);
        }
        .dsh-sg-nselect-menu::-webkit-scrollbar { width: 7px; height: 7px; }
        .dsh-sg-nselect-menu::-webkit-scrollbar-button { display: none !important; width: 0; height: 0; }
        .dsh-sg-nselect-menu::-webkit-scrollbar-track { background: transparent; }
        .dsh-sg-nselect-menu::-webkit-scrollbar-thumb {
          background: ${isLight ? 'rgba(100, 116, 139, 0.26)' : 'rgba(148, 163, 184, 0.24)'};
          border-radius: 999px; border: 2px solid transparent; background-clip: content-box;
        }
        .dsh-sg-nselect-menu::-webkit-scrollbar-thumb:hover {
          background: ${stUi.scrollHover};
          border: 1px solid transparent; background-clip: content-box;
        }
        .dsh-sg-nselect-opt {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
          padding: 6px 10px; border-radius: 8px; font-size: 12px; font-weight: 500;
          cursor: pointer; user-select: none; transition: background 0.12s ease, color 0.12s ease;
        }
        .dsh-sg-nselect-opt:hover,
        .dsh-sg-nselect-opt[data-focus="1"] {
          background: ${stUi.hoverBg};
          color: ${isLight ? stUi.titleText : '#ffffff'};
        }
        .dsh-sg-nselect-opt[data-selected="1"] {
          background: ${stUi.grad};
          color: #ffffff; font-weight: 600;
          box-shadow: 0 3px 10px ${stUi.glowShadow};
        }
        .dsh-sg-nselect-check { font-size: 12px; font-weight: 700; flex-shrink: 0; }
        .dsh-sg-studio-head {
          display: flex; align-items: center; gap: 8px;
          padding-bottom: 10px; margin-bottom: 10px;
          border-bottom: 1px solid ${stUi.borderSubtle};
        }
        .dsh-sg-studio-title {
          font-size: 15.5px; font-weight: 800; margin: 0; letter-spacing: 0.01em;
          color: ${stUi.titleText};
        }
        .dsh-sg-badge {
          padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 700;
          background: ${stUi.badgeBg};
          color: ${stUi.badgeText};
          border: 1px solid ${stUi.badgeBorder};
          white-space: nowrap;
        }
        .dsh-sg-head-actions {
          margin-left: auto;
          display: inline-flex; align-items: center; gap: 6px;
          flex-shrink: 0;
        }
        .dsh-sg-theme-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          height: 28px; min-height: 28px; box-sizing: border-box;
          padding: 0 10px; border-radius: 999px;
          border: 1px solid ${stUi.borderCard};
          background: ${stUi.badgeBg};
          color: ${stUi.btnText};
          font-size: 11.5px; font-weight: 700; cursor: pointer; white-space: nowrap;
          flex-shrink: 0;
          transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
        }
        .dsh-sg-theme-btn:hover {
          border-color: ${stUi.p};
          background: ${stUi.hoverBg};
          color: ${isLight ? stUi.titleText : '#ffffff'};
          box-shadow: 0 0 0 2px ${stUi.focusRing};
        }
        .dsh-sg-theme-btn[data-active="1"] {
          background: ${stUi.grad};
          border-color: transparent;
          color: #ffffff;
          box-shadow: 0 4px 14px ${stUi.glowShadow};
        }
        .dsh-sg-mode-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 4px;
          height: 28px; min-height: 28px; box-sizing: border-box;
          padding: 0 9px; border-radius: 999px;
          border: 1px solid ${stUi.borderCard};
          background: ${isLight ? hexRgba(stUi.p, 0.08) : 'rgba(255, 255, 255, 0.06)'};
          color: ${stUi.btnText};
          font-size: 11.5px; font-weight: 700; cursor: pointer; white-space: nowrap; flex-shrink: 0;
          transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
        }
        .dsh-sg-mode-btn:hover {
          border-color: ${stUi.p};
          background: ${stUi.hoverBg};
          color: ${isLight ? stUi.titleText : '#ffffff'};
          box-shadow: 0 0 0 2px ${stUi.focusRing};
        }
        .dsh-sg-ver-btn {
          display: inline-flex; align-items: center; justify-content: center;
          height: 28px; min-height: 28px; box-sizing: border-box;
          padding: 0 10px; border-radius: 999px;
          border: 1px solid ${stUi.borderCard};
          background: ${isLight ? hexRgba(stUi.p, 0.08) : 'rgba(255, 255, 255, 0.06)'};
          color: ${stUi.btnText};
          font-size: 11.5px; font-weight: 700;
          font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
          cursor: pointer; white-space: nowrap; flex-shrink: 0;
          transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
        }
        .dsh-sg-ver-btn:hover {
          border-color: ${stUi.p};
          background: ${stUi.hoverBg};
          color: ${isLight ? stUi.titleText : '#ffffff'};
          box-shadow: 0 0 0 2px ${stUi.focusRing};
        }
        .dsh-sg-ver-toast {
          margin-bottom: 10px;
          padding: 6px 11px;
          border-radius: 10px;
          font-size: 11.5px;
          font-weight: 600;
          color: ${stUi.badgeText};
          background: ${stUi.badgeBg};
          border: 1px solid ${stUi.badgeBorder};
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
        }
        .dsh-sg-theme-dot {
          width: 10px; height: 10px; border-radius: 999px; flex-shrink: 0;
          background: ${stUi.grad};
          box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.55);
        }
        .dsh-sg-theme-center {
          border: 1px solid ${stUi.borderPop};
          border-radius: 14px; padding: 12px 14px; margin-bottom: 12px;
          background: ${stUi.popBg};
          background-image: radial-gradient(420px 180px at 90% -20%, ${stUi.glowA}, transparent 65%), radial-gradient(320px 160px at 10% -15%, ${stUi.glowB}, transparent 62%);
          box-shadow: ${isLight ? '0 10px 28px rgba(15, 23, 42, 0.10)' : '0 14px 36px rgba(0, 0, 0, 0.42)'};
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          color: ${fabText};
        }
        .dsh-sg-tc-head {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          padding-bottom: 8px; margin-bottom: 10px;
          border-bottom: 1px solid ${stUi.borderSubtle};
        }
        .dsh-sg-tc-title {
          display: flex; align-items: center; gap: 7px;
          font-size: 13px; font-weight: 800; color: ${stUi.titleText};
        }
        .dsh-sg-tc-sec { margin-bottom: 11px; }
        .dsh-sg-tc-sec:last-child { margin-bottom: 0; }
        .dsh-sg-tc-sec-hd {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 11px; font-weight: 700; color: ${isLight ? '#475569' : '#94a3b8'};
          margin-bottom: 6px;
        }
        .dsh-sg-tc-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
        .dsh-sg-tc-card {
          position: relative; text-align: left; padding: 8px 9px; border-radius: 10px;
          border: 1px solid ${stUi.borderSoft};
          background: ${isLight ? 'rgba(255, 255, 255, 0.72)' : 'rgba(255, 255, 255, 0.035)'};
          color: ${fabText}; cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
        }
        .dsh-sg-tc-card:hover {
          border-color: ${stUi.hoverBorder};
          background: ${stUi.hoverRowBg};
          transform: translateY(-1px);
        }
        .dsh-sg-tc-card[data-active="1"] {
          border-color: ${stUi.p};
          background: ${stUi.badgeBg};
          box-shadow: 0 0 0 1px ${stUi.p}, 0 6px 16px ${stUi.glowShadow};
        }
        .dsh-sg-tc-card.empty {
          display: flex; align-items: center; justify-content: center; min-height: 62px;
          border-style: dashed; font-size: 11.5px; font-weight: 600;
          color: ${isLight ? '#64748b' : '#94a3b8'};
        }
        .dsh-sg-tc-card.empty:hover { color: ${stUi.accentText}; border-color: ${stUi.p}; }
        .dsh-sg-tc-bar { height: 7px; border-radius: 999px; margin-bottom: 6px; }
        .dsh-sg-tc-card-top { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
        .dsh-sg-tc-name { font-size: 12px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .dsh-sg-tc-pill {
          font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 999px; flex-shrink: 0;
          background: ${stUi.badgeBg}; color: ${stUi.badgeText}; border: 1px solid ${stUi.badgeBorder};
        }
        .dsh-sg-tc-desc { font-size: 10.5px; color: ${isLight ? '#64748b' : '#94a3b8'}; margin-top: 3px; }
        .dsh-sg-tc-slot-acts { display: flex; gap: 5px; margin-top: 6px; }
        .dsh-sg-tc-slot-act {
          flex: 1; padding: 2px 6px; border-radius: 6px; font-size: 10.5px; font-weight: 600; cursor: pointer;
          border: 1px solid ${stUi.borderSoft}; background: ${stUi.inputBg}; color: ${stUi.btnText};
          transition: border-color 0.14s, background 0.14s, color 0.14s;
        }
        .dsh-sg-tc-slot-act:hover { border-color: ${stUi.p}; background: ${stUi.hoverBg}; }
        .dsh-sg-tc-slot-act.del:hover { border-color: #f43f5e; background: rgba(244, 63, 94, 0.16); color: #fb7185; }
        .dsh-sg-tc-custom {
          padding: 9px 10px; border-radius: 10px;
          border: 1px solid ${stUi.borderSoft};
          background: ${isLight ? 'rgba(255, 255, 255, 0.65)' : 'rgba(12, 16, 28, 0.56)'};
        }
        .dsh-sg-tc-color-row { display: flex; align-items: center; gap: 8px; }
        .dsh-sg-tc-color-col { flex: 1; min-width: 0; }
        .dsh-sg-tc-lbl { display: block; font-size: 11px; font-weight: 700; margin-bottom: 4px; color: ${stUi.headingText}; }
        .dsh-sg-tc-input-wrap { display: flex; align-items: center; gap: 6px; }
        .dsh-sg-tc-picker {
          width: 30px; height: 26px; padding: 2px; border-radius: 7px; cursor: pointer; flex-shrink: 0;
          border: 1px solid ${stUi.borderCard}; background: ${stUi.inputBg};
        }
        .dsh-sg-tc-hex {
          flex: 1; min-width: 0; padding: 4px 7px; border-radius: 7px; font-size: 11.5px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          border: 1px solid ${stUi.borderCard}; background: ${stUi.inputBg}; color: ${fabText}; outline: none;
        }
        .dsh-sg-tc-hex:focus { border-color: ${stUi.p}; box-shadow: 0 0 0 2px ${stUi.focusRing}; }
        .dsh-sg-tc-swatches { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
        .dsh-sg-tc-swatch {
          width: 16px; height: 16px; border-radius: 999px; border: 1.5px solid rgba(255, 255, 255, 0.45);
          cursor: pointer; padding: 0; transition: transform 0.14s ease, box-shadow 0.14s ease;
        }
        .dsh-sg-tc-swatch:hover { transform: scale(1.18); box-shadow: 0 0 0 2px ${stUi.focusRing}; }
        .dsh-sg-tc-swap {
          width: 30px; height: 30px; border-radius: 999px; flex-shrink: 0;
          display: inline-flex; align-items: center; justify-content: center;
          border: 1px solid ${stUi.borderCard}; background: ${stUi.badgeBg}; color: ${stUi.badgeText};
          font-size: 14px; font-weight: 700; cursor: pointer;
          transition: transform 0.16s ease, border-color 0.14s ease, background 0.14s ease;
        }
        .dsh-sg-tc-swap:hover { border-color: ${stUi.p}; background: ${stUi.hoverBg}; transform: rotate(180deg); }
        .dsh-sg-tc-apply-row { display: flex; align-items: center; gap: 8px; margin-top: 9px; }
        .dsh-sg-tabs {
          display: flex; flex-wrap: wrap; gap: 5px;
          padding: 5px; margin-bottom: 12px; border-radius: 12px;
          background: ${stUi.tabsBg};
          border: 1px solid ${stUi.borderSoft};
        }
        .dsh-sg-tab {
          padding: 5px 10px; font-size: 12px; font-weight: 600;
          background: transparent; border: 1px solid transparent; border-radius: 8px;
          color: ${isLight ? '#475569' : '#cbd5e1'}; cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
        }
        .dsh-sg-tab:hover {
          color: ${isLight ? stUi.titleText : '#ffffff'};
          border-color: ${stUi.badgeBorder};
          background: ${stUi.hoverBg};
        }
        .dsh-sg-tab[data-active="1"] {
          color: #ffffff;
          border-color: transparent;
          background: ${stUi.grad};
          box-shadow: 0 4px 14px ${stUi.glowShadow};
        }
        .dsh-sg-card {
          border: 1px solid ${stUi.borderCard};
          border-radius: 14px; padding: 12px 14px; margin-bottom: 12px;
          background: ${stUi.cardBg};
          box-shadow: ${isLight ? '0 8px 24px rgba(15, 23, 42, 0.06)' : '0 12px 32px rgba(0, 0, 0, 0.34)'};
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          color: ${fabText};
        }
        .dsh-sg-card h4 {
          margin: 0 0 9px 0; font-size: 12.5px; font-weight: 700;
          color: ${stUi.headingText};
          padding-bottom: 6px;
          border-bottom: 1px solid ${stUi.borderSubtle};
        }
        .dsh-sg-row {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 6px 6px; margin: 0 -6px; border-radius: 8px;
          border-top: 1px solid ${isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.05)'};
          transition: background 0.14s ease;
        }
        .dsh-sg-row:hover {
          background: ${stUi.hoverRowBg};
        }
        .dsh-sg-card h4 + .dsh-sg-row,
        .dsh-sg-row:first-child { border-top: none; }
        .dsh-sg-row label { font-size: 12.5px; font-weight: 600; }
        /* 思语/猫娘同款药丸滑动开关（告别方框打勾） */
        .dsh-sg-switch {
          position: relative; display: inline-flex; align-items: center; flex-shrink: 0;
          width: 40px; height: 22px; padding: 2px; border-radius: 999px; box-sizing: border-box;
          border: 1px solid ${stUi.borderCard};
          background: ${isLight ? 'rgba(148, 163, 184, 0.30)' : 'rgba(255, 255, 255, 0.10)'};
          cursor: pointer; outline: none;
          transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .dsh-sg-switch:hover {
          border-color: ${stUi.p};
          box-shadow: 0 0 0 3px ${stUi.focusRing};
        }
        .dsh-sg-switch[aria-checked="true"] {
          background: ${stUi.switchGrad};
          border-color: transparent;
          box-shadow: 0 2px 10px ${stUi.glowShadow};
        }
        .dsh-sg-switch[aria-checked="true"]:hover {
          filter: brightness(1.08);
          box-shadow: 0 2px 14px ${stUi.glowShadowStrong}, 0 0 0 3px ${stUi.focusRing};
        }
        .dsh-sg-switch-thumb {
          width: 16px; height: 16px; border-radius: 999px;
          background: #ffffff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.32);
          transform: translateX(0);
          transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        .dsh-sg-switch[aria-checked="true"] .dsh-sg-switch-thumb {
          transform: translateX(18px);
        }
        .dsh-sg-row input[type="color"] {
          width: 32px; height: 24px; padding: 2px; border-radius: 6px; cursor: pointer;
          border: 1px solid ${stUi.borderCard};
          background: ${stUi.inputBg};
          transition: border-color 0.14s ease, box-shadow 0.14s ease, transform 0.14s ease;
        }
        .dsh-sg-row input[type="color"]:hover {
          border-color: ${stUi.p}; box-shadow: 0 0 0 2px ${stUi.focusRing}; transform: scale(1.05);
        }
        .dsh-sg-range-ctrl { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .dsh-sg-range-ctrl input[type="range"] {
          width: 118px; accent-color: ${stUi.p}; cursor: pointer;
          transition: filter 0.14s ease;
        }
        .dsh-sg-range-ctrl input[type="range"]:hover { filter: brightness(1.12); }
        .dsh-sg-num-input {
          width: 62px; padding: 3px 6px; border-radius: 8px; font-size: 12px;
          font-variant-numeric: tabular-nums; text-align: right;
          border: 1px solid ${stUi.borderCard};
          background: ${stUi.inputBg};
          color: ${fabText}; outline: none; transition: border-color 0.14s, box-shadow 0.14s;
        }
        .dsh-sg-num-input:hover { border-color: ${stUi.hoverBorder}; }
        .dsh-sg-num-input:focus { border-color: ${stUi.p}; box-shadow: 0 0 0 2px ${stUi.focusRing}; }
        .dsh-sg-num-unit { font-size: 11px; opacity: 0.72; min-width: 18px; }
        .dsh-sg-sub { font-size: 11px; color: ${isLight ? '#64748b' : '#94a3b8'}; }
        .dsh-sg-stat-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-bottom: 12px; }
        .dsh-sg-stat-box {
          padding: 8px 6px; border-radius: 10px; text-align: center;
          background: ${isLight ? hexRgba(stUi.p, 0.06) : 'rgba(255, 255, 255, 0.045)'};
          border: 1px solid ${stUi.borderSoft};
          transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
        }
        .dsh-sg-stat-box:hover {
          border-color: ${stUi.hoverBorder};
          background: ${stUi.hoverBg};
          transform: translateY(-1px);
        }
        .dsh-sg-stat-num {
          font-size: 15px; font-weight: 800; font-variant-numeric: tabular-nums;
          color: ${stUi.accentText};
        }
        .dsh-sg-input, .dsh-sg-select {
          padding: 5px 8px; border-radius: 8px;
          border: 1px solid ${stUi.borderCard};
          background: ${stUi.inputBg};
          color: ${fabText}; font-size: 12px; outline: none;
          transition: border-color 0.14s, box-shadow 0.14s;
        }
        .dsh-sg-input:hover, .dsh-sg-select:hover { border-color: ${stUi.hoverBorder}; }
        .dsh-sg-input:focus, .dsh-sg-select:focus {
          border-color: ${stUi.p}; box-shadow: 0 0 0 2px ${stUi.focusRing};
        }
        .dsh-sg-btn {
          padding: 5px 10px; border-radius: 8px;
          border: 1px solid ${isLight ? stUi.borderCard : 'rgba(255, 255, 255, 0.16)'};
          background: ${isLight ? hexRgba(stUi.p, 0.08) : 'rgba(255, 255, 255, 0.06)'};
          color: ${stUi.btnText};
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: border-color 0.14s ease, background 0.14s ease, filter 0.14s ease, box-shadow 0.14s ease;
        }
        .dsh-sg-btn:hover {
          border-color: ${stUi.p};
          background: ${stUi.hoverBg};
          color: ${isLight ? stUi.titleText : '#ffffff'};
        }
        .dsh-sg-power-btn {
          padding: 5px 7px;
          min-width: 30px;
          height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.12s ease;
        }
        .dsh-sg-power-btn[data-enabled="1"] {
          border-color: rgba(34,197,94,0.45);
          background: rgba(34,197,94,0.14);
          color: ${isLight ? '#16a34a' : '#4ade80'};
        }
        .dsh-sg-power-btn[data-enabled="1"]:hover:not(:disabled) {
          border-color: rgba(248,113,113,0.62);
          background: rgba(239,68,68,0.18);
          color: ${isLight ? '#dc2626' : '#f87171'};
          box-shadow: 0 0 10px rgba(239,68,68,0.28);
          transform: translateY(-1px);
        }
        .dsh-sg-power-btn[data-enabled="0"] {
          border-color: rgba(148,163,184,0.28);
          background: rgba(148,163,184,0.08);
          color: ${isLight ? '#64748b' : '#94a3b8'};
        }
        .dsh-sg-power-btn[data-enabled="0"]:hover:not(:disabled) {
          border-color: rgba(34,197,94,0.62);
          background: rgba(34,197,94,0.2);
          color: ${isLight ? '#16a34a' : '#4ade80'};
          box-shadow: 0 0 10px rgba(34,197,94,0.28);
          transform: translateY(-1px);
        }
        .dsh-sg-power-btn:active:not(:disabled) {
          transform: scale(0.94);
        }
        .dsh-sg-btn[data-active="1"],
        .dsh-sg-btn-primary {
          background: ${stUi.grad};
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 4px 12px ${stUi.glowShadow};
        }
        .dsh-sg-btn[data-active="1"]:hover,
        .dsh-sg-btn-primary:hover {
          filter: brightness(1.08);
          border-color: transparent;
          background: ${stUi.grad};
          color: #ffffff;
          box-shadow: 0 6px 18px ${stUi.glowShadowStrong};
        }
        .dsh-sg-file-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          white-space: nowrap;
          flex-shrink: 0;
          user-select: none;
        }
        .dsh-sg-file-btn:focus-within {
          border-color: ${stUi.p};
          box-shadow: 0 0 0 2px ${stUi.focusRing};
        }
        .dsh-sg-file-input {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .dsh-sg-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
        .dsh-sg-wp-lib-wrap {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid ${stUi.borderSubtle};
        }
        .dsh-sg-wp-lib-head {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 11.5px; font-weight: 700; color: ${stUi.headingText};
          margin-bottom: 7px;
        }
        .dsh-sg-wp-lib-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }
        .dsh-sg-wp-card {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          aspect-ratio: 16 / 10;
          border: 1.5px solid ${stUi.borderSoft};
          background: ${stUi.inputBg};
          cursor: pointer;
          transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
        }
        .dsh-sg-wp-card:hover {
          border-color: ${stUi.hoverBorder};
          transform: translateY(-1px);
          box-shadow: 0 6px 16px ${stUi.glowShadow};
        }
        .dsh-sg-wp-card[data-active="1"] {
          border-color: ${stUi.p};
          box-shadow: 0 0 0 1.5px ${stUi.p}, 0 6px 18px ${stUi.glowShadow};
        }
        .dsh-sg-wp-thumb {
          width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none;
        }
        .dsh-sg-wp-label {
          position: absolute; left: 0; right: 0; bottom: 0;
          padding: 3px 6px;
          font-size: 10.5px; font-weight: 600; color: #f8fafc;
          background: linear-gradient(180deg, transparent 0%, rgba(8, 12, 24, 0.84) 100%);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .dsh-sg-wp-tag {
          position: absolute; left: 5px; top: 5px;
          padding: 1px 6px; border-radius: 999px;
          font-size: 9.5px; font-weight: 700; color: #ffffff;
          background: ${stUi.grad};
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
        }
        .dsh-sg-wp-del {
          position: absolute; right: 5px; top: 5px;
          width: 20px; height: 20px; border-radius: 999px; border: 0;
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(10, 14, 24, 0.72); color: #e2e8f0;
          font-size: 12px; font-weight: 700; cursor: pointer;
          opacity: 0.78; transition: background 0.14s ease, opacity 0.14s ease, transform 0.14s ease;
        }
        .dsh-sg-wp-del:hover {
          opacity: 1; background: rgba(244, 63, 94, 0.90); color: #ffffff; transform: scale(1.08);
        }
        .dsh-sg-av-lib {
          display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
          padding: 6px 2px 4px;
        }
        .dsh-sg-av-chip {
          position: relative;
          width: 40px; height: 40px;
          border-radius: 999px;
          border: 2px solid ${stUi.borderSoft};
          background: ${stUi.inputBg};
          padding: 0; cursor: pointer; overflow: visible;
          transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
        }
        .dsh-sg-av-chip:hover {
          border-color: ${stUi.hoverBorder};
          transform: translateY(-1px) scale(1.05);
        }
        .dsh-sg-av-chip[data-active="1"] {
          border-color: ${stUi.p};
          box-shadow: 0 0 0 2px ${stUi.focusRing}, 0 4px 12px ${stUi.glowShadow};
        }
        .dsh-sg-av-img {
          width: 100%; height: 100%; border-radius: 999px; object-fit: cover; display: block;
        }
        .dsh-sg-av-del {
          position: absolute; right: -4px; top: -4px;
          width: 16px; height: 16px; border-radius: 999px; border: 0;
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(15, 23, 42, 0.86); color: #e2e8f0;
          font-size: 10px; font-weight: 700; cursor: pointer;
          opacity: 0.85; transition: background 0.14s ease, transform 0.14s ease;
        }
        .dsh-sg-av-del:hover {
          background: rgba(244, 63, 94, 0.92); color: #ffffff; transform: scale(1.1);
        }
        .dsh-sg-crop-box {
          margin: 10px 0 8px;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid ${stUi.borderPop};
          background: ${isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(12, 16, 28, 0.82)'};
          box-shadow: 0 8px 24px ${stUi.glowShadow};
        }
        .dsh-sg-crop-head {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          margin-bottom: 10px;
          font-size: 12px; font-weight: 700; color: ${stUi.titleText};
        }
        .dsh-sg-crop-body {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
        }
        .dsh-sg-crop-stage {
          position: relative;
          width: 220px; height: 220px;
          border-radius: 12px;
          overflow: hidden;
          background: #0b0f1a;
          border: 1.5px solid ${stUi.borderCard};
          cursor: grab;
          touch-action: none;
          user-select: none;
        }
        .dsh-sg-crop-stage:active { cursor: grabbing; }
        .dsh-sg-crop-img {
          position: absolute;
          left: 50%; top: 50%;
          max-width: none !important;
          max-height: none !important;
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
        }
        .dsh-sg-crop-mask {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 999px;
          box-shadow: 0 0 0 999px rgba(8, 12, 22, 0.56), inset 0 0 0 1.5px rgba(255, 255, 255, 0.78);
        }
        .dsh-sg-crop-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.14) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.14) 1px, transparent 1px);
          background-size: 73.33px 73.33px;
          opacity: 0.55;
        }
        .dsh-sg-crop-ctrl {
          width: 100%;
          display: flex; align-items: center; gap: 8px;
          font-size: 11.5px; color: ${stUi.headingText};
        }
        .dsh-sg-crop-ctrl input[type="range"] {
          flex: 1; accent-color: ${stUi.p}; cursor: pointer;
        }
        .dsh-sg-crop-acts {
          width: 100%;
          display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex-wrap: wrap;
        }
        .dsh-sg-confirm-bar {
          margin: 8px 0;
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid rgba(244, 63, 94, 0.48);
          background: ${isLight ? 'rgba(255, 241, 242, 0.94)' : 'rgba(68, 18, 34, 0.72)'};
          color: ${isLight ? '#9f1239' : '#fecdd3'};
          font-size: 12px; font-weight: 600;
          display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;
        }
        .dsh-sg-btn-danger {
          background: linear-gradient(135deg, #e11d48, #f43f5e);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 3px 10px rgba(225, 29, 72, 0.34);
        }
        .dsh-sg-btn-danger:hover {
          filter: brightness(1.08);
          border-color: transparent;
          background: linear-gradient(135deg, #e11d48, #f43f5e);
          color: #ffffff;
        }
        .dsh-sg-compat-bar {
          margin-bottom: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid ${stUi.accentBorder};
          background: ${isLight ? 'rgba(241, 247, 255, 0.90)' : 'rgba(22, 30, 48, 0.78)'};
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .dsh-sg-compat-bar[data-mode="we"] {
          border-color: ${isLight ? 'rgba(148, 163, 184, 0.45)' : 'rgba(148, 163, 184, 0.30)'};
          background: ${isLight ? 'rgba(241, 245, 249, 0.92)' : 'rgba(30, 36, 48, 0.72)'};
        }
        .dsh-sg-compat-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }
        .dsh-sg-compat-title {
          font-size: 12.5px;
          font-weight: 700;
          color: ${isLight ? '#0f172a' : '#f1f5f9'};
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .dsh-sg-compat-desc {
          font-size: 11.5px;
          line-height: 1.5;
          color: ${isLight ? '#475569' : '#94a3b8'};
        }
        .dsh-sg-compat-seg {
          display: inline-flex;
          align-items: center;
          padding: 2px;
          border-radius: 9px;
          border: 1px solid ${isLight ? 'rgba(15, 23, 42, 0.10)' : 'rgba(255, 255, 255, 0.12)'};
          background: ${isLight ? 'rgba(226, 232, 240, 0.65)' : 'rgba(10, 14, 24, 0.55)'};
          gap: 2px;
          flex-shrink: 0;
        }
        .dsh-sg-compat-seg button {
          border: none;
          background: transparent;
          color: ${isLight ? '#475569' : '#94a3b8'};
          font-size: 11.5px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 7px;
          cursor: pointer;
          transition: background 0.16s ease, color 0.16s ease, box-shadow 0.16s ease;
        }
        .dsh-sg-compat-seg button:hover {
          color: ${isLight ? '#0f172a' : '#f8fafc'};
        }
        .dsh-sg-compat-seg button[data-active="1"] {
          background: linear-gradient(135deg, ${stUi.primary}, ${stUi.secondary});
          color: #ffffff;
          box-shadow: 0 2px 8px ${stUi.accentGlow};
        }
        .dsh-sg-compat-dimmed {
          opacity: 0.44;
          filter: grayscale(0.55);
          pointer-events: none;
          user-select: none;
          transition: opacity 0.18s ease, filter 0.18s ease;
        }
      `;
      syncWeCompatExternalStyles();
    }

    // -----------------------------------------------------------------------
    // Structure-Aware Chat Finder + IntersectionObserver Zero-Reflow Virtualizer
    // -----------------------------------------------------------------------
    const parkedMap = new WeakMap();
    const parkedSet = new Set();
    const observedSet = new WeakSet();
    let activeScrollEl = null;
    let activeListEl = null;
    let intersectionObs = null;
    let rafPending = false;
    let scrollDegradeTimer = null;
    let mutationObserver = null;
    let themeObserver = null;
    let visibilityBound = false;
    let isJumping = false;
    let cachedItems = [];
    let cachedTurns = [];
    let cachedSessionId = '';

    function isInsideNonMainPane(el) {
      if (!el || typeof el.closest !== 'function') return false;
      return Boolean(el.closest('[data-sidebar-right-panel], [class*="_sidebarCol"], aside, [role="dialog"], #dsh-sg-studio-root'));
    }

    function findScrollContainer() {
      const directCands = [
        ...document.querySelectorAll('[data-conversation-scroll], [class*="scrollBody"], [data-slot="conversation.session"]')
      ].filter((el) => !isInsideNonMainPane(el));
      if (directCands.length > 0) return directCands[0];

      // 启发式兜底：只在主区域内找面积最大的可滚动主容器，绝不误触右侧栏侧栏会话
      let best = null;
      let bestArea = 0;
      const cands = document.querySelectorAll('[class*="_centerCol"] main, [class*="_centerCol"] section, [class*="_centerCol"] div, main');
      for (const el of cands) {
        if (isInsideNonMainPane(el)) continue;
        if (el.scrollHeight <= el.clientHeight + 80 || el.clientWidth < 300 || el.clientHeight < 260) continue;
        const cs = window.getComputedStyle(el);
        if (cs.overflowY !== 'auto' && cs.overflowY !== 'scroll' && cs.overflowY !== 'overlay') continue;
        const area = el.clientWidth * el.clientHeight;
        if (area > bestArea) { bestArea = area; best = el; }
      }
      return best;
    }

    /** 结构探测真正挂载消息列表的父容器（彻底摆脱 CSS Module hash 变化影响） */
    function findMessageListContainer(scrollEl) {
      if (!scrollEl) return null;
      // 1. 优先命中已知类名
      const byClass = scrollEl.querySelectorAll('[class*="flowItem"]');
      if (byClass.length >= 2 && byClass[0].parentElement) return byClass[0].parentElement;

      // 2. 结构探测：在滚动区内找到直接子项最多且不是输入框/代码块/表格的列表容器
      let best = null;
      let bestCount = 0;
      const nodes = [scrollEl, ...scrollEl.querySelectorAll('div, ul, ol, section')];
      for (const n of nodes) {
        if (n.closest && n.closest('[class*="composerSeat"], pre, table, svg, [role="dialog"]')) continue;
        const k = n.children ? n.children.length : 0;
        if (k < 4 || k <= bestCount) continue;
        // 排除内部有上百个 inline span 的纯文本块
        const firstTag = n.children[0]?.tagName;
        if (firstTag === 'SPAN' || firstTag === 'BR' || firstTag === 'OPTION') continue;
        best = n;
        bestCount = k;
      }
      return best;
    }

    function getFlowItems(scrollEl) {
      if (!scrollEl) return [];
      const listEl = findMessageListContainer(scrollEl);
      activeListEl = listEl;
      if (!listEl) return [];

      // 与 DSH 自身的滚动定位口径一致：只把「顶层 turn」算作一条锚点。
      // 排除 agent 每一步的 turn-process 节点，以及折叠过程组内部的成员节点。
      const candidates = Array.from(listEl.querySelectorAll(
        '[data-chat-flow-key]:not([data-chat-group-key]):not([data-chat-flow-kind="turn-process"])'
      )).filter((el) => el.parentElement === listEl);

      // 老版本/其他构建可能没有 data-chat-flow-key，退回直接子节点并按属性过滤。
      const items = candidates.length ? candidates : Array.from(listEl.children).filter((el) => {
        if (el.nodeType !== 1) return false;
        const cls = String(el.className || '');
        if (/composerSeat|spacer|Spacer/i.test(cls)) return false;
        if (el.hasAttribute('data-chat-group-key')) return false;
        if (el.dataset?.chatFlowKind === 'turn-process') return false;
        return true;
      });

      return items.filter((el) => {
        if (el.dataset?.chatFlowKind === 'turn-process') return false;
        if (el.closest?.('[data-turn-process-member]')) return false;
        return true;
      });
    }

    function restoreItem(el) {
      const rec = parkedMap.get(el);
      if (!rec) return;
      parkedMap.delete(el);
      parkedSet.delete(el);
      el.removeAttribute('data-sg-parked');
      el.style.minHeight = '';
      el.style.containIntrinsicSize = '';
    }

    function restoreAllParked() {
      for (const el of [...parkedSet]) restoreItem(el);
      stats.parkedItems = 0;
    }

    /** React 100% 安全虚拟化：绝不从 DOM 摘除 React 管理的子节点，仅用 CSS content-visibility: hidden 跳过布局与绘制 */
    function parkItem(el) {
      if (parkedMap.has(el)) return;
      if (document.activeElement && el.contains(document.activeElement)) return;
      const sel = window.getSelection?.();
      if (sel && !sel.isCollapsed && sel.anchorNode && el.contains(sel.anchorNode)) return;
      const h = el.offsetHeight;
      if (h < 24) return;
      const summary = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
      el.style.minHeight = `${h}px`;
      el.style.containIntrinsicSize = `auto ${h}px`;
      el.setAttribute('data-sg-parked', '1');
      parkedMap.set(el, { height: h, summary });
      parkedSet.add(el);
    }

    function rebuildIntersectionObserver(scrollEl) {
      if (intersectionObs) {
        try { intersectionObs.disconnect(); } catch {}
        intersectionObs = null;
      }
      if (!scrollEl || !config.virtualizeEnabled) return;
      const marginPx = Math.round(Math.max(600, (scrollEl.clientHeight || 800) * (config.overscanViewports || 1.8)));
      intersectionObs = new IntersectionObserver((entries) => {
        if (isJumping || !config.virtualizeEnabled) return;
        const items = cachedItems;
        const tailSafeIdx = Math.max(0, items.length - config.keepTailItems);
        for (const entry of entries) {
          const el = entry.target;
          const idx = items.indexOf(el);
          if (idx === -1) continue;
          if (entry.isIntersecting || idx >= tailSafeIdx) {
            if (parkedMap.has(el)) restoreItem(el);
          } else {
            parkItem(el);
          }
        }
        stats.parkedItems = parkedSet.size;
        stats.activeItems = Math.max(0, items.length - parkedSet.size);
      }, {
        root: scrollEl,
        rootMargin: `${marginPx}px 0px ${marginPx}px 0px`,
        threshold: 0
      });
    }

    /** 秒切跳转：只恢复目标窗口 ±3 条并瞬间设置 scrollTop，避免 smooth 滚动触发沿途几十屏重排 */
    function instantJumpToIndex(targetIndex) {
      const scrollEl = findScrollContainer();
      const items = getFlowItems(scrollEl);
      if (!scrollEl || targetIndex < 0 || targetIndex >= items.length) return;

      isJumping = true;
      const start = Math.max(0, targetIndex - 3);
      const end = Math.min(items.length - 1, targetIndex + 3);
      for (let i = start; i <= end; i++) restoreItem(items[i]);

      const targetEl = items[targetIndex];
      const scrollRect = scrollEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const nextTop = scrollEl.scrollTop + (targetRect.top - scrollRect.top) - 16;
      scrollEl.scrollTop = Math.max(0, nextTop);

      requestAnimationFrame(() => {
        isJumping = false;
        runVirtualizePass();
      });
    }

    function instantJumpToElement(targetEl) {
      if (!targetEl) return;
      isJumping = true;
      restoreItem(targetEl);
      if (targetEl.previousElementSibling) restoreItem(targetEl.previousElementSibling);
      if (targetEl.nextElementSibling) restoreItem(targetEl.nextElementSibling);

      try {
        targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      } catch {}

      const scrollEl = findScrollContainer();
      if (scrollEl) {
        const scrollRect = scrollEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const delta = targetRect.top - scrollRect.top - 16;
        if (Math.abs(delta) > 4) {
          scrollEl.scrollTop = Math.max(0, scrollEl.scrollTop + delta);
        }
      }

      requestAnimationFrame(() => {
        isJumping = false;
        runVirtualizePass();
      });
    }

    function applyLazyImages(scrollEl) {
      if (!config.lazyImages || !scrollEl) return;
      const imgs = scrollEl.querySelectorAll('img:not([data-sg-lazy])');
      for (const img of imgs) {
        img.setAttribute('data-sg-lazy', '1');
        img.loading = 'lazy';
        img.decoding = 'async';
      }
    }

    function applyCompactCode(scrollEl) {
      if (!scrollEl) return;
      const pres = scrollEl.querySelectorAll('pre');
      let collapsedCount = 0;
      for (const pre of pres) {
        if (!config.compactCodeEnabled) {
          pre.classList.remove('dsh-sg-code-collapsed');
          continue;
        }
        if (pre.dataset.sgUserExpanded === '1') continue;
        if (pre.scrollHeight > config.compactMaxHeightPx + 40) {
          pre.classList.add('dsh-sg-code-collapsed');
          collapsedCount++;
          if (pre.dataset.sgCollapseBound !== '1') {
            pre.dataset.sgCollapseBound = '1';
            pre.addEventListener('click', () => {
              if (!pre.classList.contains('dsh-sg-code-collapsed')) return;
              pre.classList.remove('dsh-sg-code-collapsed');
              pre.dataset.sgUserExpanded = '1';
            });
          }
        }
      }
      stats.collapsedCodes = collapsedCount;
    }

    let cachedNativeRailSelectors = '';
    function ensureNativeRailHideCss() {
      const found = new Set();
      try {
        const styleEl = document.querySelector('style[data-plugin-css*="TurnNavigator.module.css"]');
        const cssText = styleEl ? (styleEl.textContent || '') : '';
        if (cssText) {
          const re = /\.([A-Za-z0-9_-]+_(?:frame|slot))\b/g;
          let m;
          while ((m = re.exec(cssText)) !== null) found.add(`.${m[1]}`);
        }
      } catch {}

      const selectors = [
        ...Array.from(found),
        'nav[class*="_frame"]:has([class*="_marks"])',
        'div[class*="_slot"]:has(> nav[class*="_frame"] [class*="_marks"])',
      ];
      const key = selectors.join(',');
      if (key === cachedNativeRailSelectors && document.getElementById('dsh-sg-native-rail-css')) {
        return Array.from(found);
      }
      cachedNativeRailSelectors = key;

      let tag = document.getElementById('dsh-sg-native-rail-css');
      if (!tag) {
        tag = document.createElement('style');
        tag.id = 'dsh-sg-native-rail-css';
        (document.head || document.documentElement).appendChild(tag);
      }
      const ruleSelectors = selectors.map((s) => `html[data-sg-anchor-rail-active="1"] ${s}`).join(',\n');
      tag.textContent = `${ruleSelectors} {\n  opacity: 0 !important;\n  visibility: hidden !important;\n  pointer-events: none !important;\n}`;
      return Array.from(found);
    }

    /** 定位并隐藏 DSH 原生右侧横杠轨道（TurnNavigator），以便由我们的Antigravity合并式轨道无缝接管 */
    function syncNativeRailVisibility(scrollEl, hide) {
      if (!hide) {
        document.documentElement.removeAttribute('data-sg-anchor-rail-active');
        for (const el of document.querySelectorAll('[data-sg-native-rail-hidden="1"]')) {
          el.removeAttribute('data-sg-native-rail-hidden');
        }
        return;
      }
      document.documentElement.setAttribute('data-sg-anchor-rail-active', '1');
      const nativeClassSelectors = ensureNativeRailHideCss();
      if (!scrollEl) return;
      const sRect = scrollEl.getBoundingClientRect();
      const marked = new Set();

      // 优先精准命中 DSH 原生 TurnNavigator 节点
      for (const sel of nativeClassSelectors) {
        for (const el of document.querySelectorAll(sel)) marked.add(el);
      }
      for (const nav of document.querySelectorAll('nav[class*="_frame"]')) {
        if (nav.querySelector('[class*="_marks"], [class*="_mark"]')) {
          marked.add(nav);
          if (nav.parentElement && /_slot\b/.test(nav.parentElement.className || '')) {
            marked.add(nav.parentElement);
          }
        }
      }

      const looksLikeNativeRail = (el, r) => {
        if (r.width < 4 || r.width > 64 || r.height < 12) return false;
        if (Math.abs(r.right - sRect.right) > 72) return false;
        if (r.bottom < sRect.top - 20 || r.top > sRect.bottom + 20) return false;
        const kids = el.children;
        if (!kids || kids.length < 2) {
          // 可能是包了一层内容器，再看一层子元素
          const inner = kids && kids.length === 1 ? kids[0].children : null;
          if (!inner || inner.length < 2) return false;
          let thinInner = 0;
          for (const k of inner) {
            const kr = k.getBoundingClientRect();
            if (kr.height <= 18 || kr.width <= 28) thinInner++;
          }
          return thinInner >= 2;
        }
        let thin = 0;
        for (const k of kids) {
          const kr = k.getBoundingClientRect();
          if (kr.height <= 18 || kr.width <= 28) thin++;
        }
        return thin >= 2;
      };

      // 从聊天滚动区向上走 4 层，扫描同级的窄竖条容器（兼容 2 轮短对话）
      let node = scrollEl;
      for (let level = 0; level < 4 && node; level++) {
        const host = node.parentElement;
        if (!host) break;
        for (const el of host.children) {
          if (el === scrollEl || el.id === 'dsh-sg-anchor-rail' || el.id === 'dsh-sg-rail-popover') continue;
          if (el.contains(scrollEl)) continue;
          const r = el.getBoundingClientRect();
          if (r.width < 4 || r.width > 64 || r.height < 12) continue;
          if (Math.abs(r.right - sRect.right) > 72) continue;
          if (r.bottom < sRect.top - 20 || r.top > sRect.bottom + 20) continue;
          if (r.height >= 100 || looksLikeNativeRail(el, r)) {
            marked.add(el);
          }
        }
        node = host;
      }

      // 兜底：全文档窄竖条 + 内部至少 2 条细小横杠子元素（覆盖 2 轮起的所有对话）
      for (const el of document.querySelectorAll('div, ul, nav, aside')) {
        if (el === scrollEl || el.id === 'dsh-sg-anchor-rail' || el.id === 'dsh-sg-rail-popover') continue;
        if (el.contains(scrollEl)) continue;
        if (el.closest('[data-composer-card], [data-windows-titlebar], [data-sidebar-right-panel]')) continue;
        const r = el.getBoundingClientRect();
        if (looksLikeNativeRail(el, r)) marked.add(el);
      }

      for (const el of marked) el.setAttribute('data-sg-native-rail-hidden', '1');
    }

    function runVirtualizePass() {
      rafPending = false;
      if (isJumping) return;
      const scrollEl = findScrollContainer();
      if (!scrollEl) {
        renderAnchorRail([], null);
        return;
      }
      if (scrollEl !== activeScrollEl) {
        bindScrollContainer(scrollEl);
        rebuildIntersectionObserver(scrollEl);
      }

      const items = getFlowItems(scrollEl);
      cachedItems = items;
      stats.totalItems = items.length;
      cachedTurns = getConversationTurns(scrollEl);

      if (!config.virtualizeEnabled || items.length <= config.keepTailItems + 4) {
        restoreAllParked();
        stats.activeItems = items.length;
        applyLazyImages(scrollEl);
        applyCompactCode(scrollEl);
        renderAnchorRail(cachedTurns, scrollEl);
        if (pendingTurnJump) settlePendingTurnJump(scrollEl);
        return;
      }

      if (!intersectionObs) rebuildIntersectionObserver(scrollEl);
      for (const el of items) {
        if (!observedSet.has(el)) {
          observedSet.add(el);
          if (intersectionObs) intersectionObs.observe(el);
        }
      }

      stats.parkedItems = parkedSet.size;
      stats.activeItems = Math.max(0, items.length - parkedSet.size);
      applyLazyImages(scrollEl);
      applyCompactCode(scrollEl);
      renderAnchorRail(cachedTurns, scrollEl);
      if (pendingTurnJump) settlePendingTurnJump(scrollEl);
    }

    function scheduleVirtualize() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(runVirtualizePass);
    }

    function triggerScrollDegrade() {
      if (!config.dynamicDegradeOnScroll || config.turboMode) return;
      document.documentElement.setAttribute('data-dsh-sg-scrolling', '1');
      if (scrollDegradeTimer) clearTimeout(scrollDegradeTimer);
      scrollDegradeTimer = setTimeout(() => {
        document.documentElement.removeAttribute('data-dsh-sg-scrolling');
      }, 180);
    }

    let railUpdateTimer = null;
    let seamlessLoadInFlight = false;
    let seamlessLoadCooldownUntil = 0;
    let lastSeamlessScrollTop = -1;

    function captureTopScrollAnchor(scrollEl) {
      if (!scrollEl || !scrollEl.isConnected) return null;
      const sRect = scrollEl.getBoundingClientRect();
      const rows = scrollEl.querySelectorAll('[data-chat-flow-key]');
      let anchorEl = null;
      let anchorTop = 0;
      for (const row of rows) {
        if (!row.isConnected) continue;
        const r = row.getBoundingClientRect();
        if (r.height <= 0) continue;
        if (r.bottom > sRect.top + 4) {
          anchorEl = row;
          anchorTop = r.top - sRect.top;
          break;
        }
      }
      return {
        anchorEl,
        anchorTop,
        scrollTop: scrollEl.scrollTop,
        scrollHeight: scrollEl.scrollHeight
      };
    }

    function compensateAfterPrepend(scrollEl, anchor) {
      if (!scrollEl || !scrollEl.isConnected || !anchor) return;
      let attempts = 0;
      const tick = () => {
        attempts++;
        if (!scrollEl.isConnected || isJumping || pendingTurnJump) return;
        const heightDelta = scrollEl.scrollHeight - anchor.scrollHeight;
        if (heightDelta > 4) {
          if (anchor.anchorEl && anchor.anchorEl.isConnected) {
            const sRect = scrollEl.getBoundingClientRect();
            const curTop = anchor.anchorEl.getBoundingClientRect().top - sRect.top;
            const drift = curTop - anchor.anchorTop;
            // 闭环纠偏：若浏览器原生 overflow-anchor 已经稳住位置（drift≈0），不重复补偿；否则精准回正
            if (Math.abs(drift) > 1.5) {
              scrollEl.scrollTop = Math.max(0, scrollEl.scrollTop + drift);
            }
          } else {
            scrollEl.scrollTop = Math.max(0, anchor.scrollTop + heightDelta);
          }
          return;
        }
        if (attempts < 6) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    function consumeOlderSeamlessly(scrollEl, session) {
      if (!scrollEl || !scrollEl.isConnected || !session || typeof session.consumeOlder !== 'function') return false;
      const anchor = captureTopScrollAnchor(scrollEl);
      let consumed = false;
      try {
        consumed = Boolean(session.consumeOlder());
      } catch {
        consumed = false;
      }
      if (consumed) {
        compensateAfterPrepend(scrollEl, anchor);
      }
      return consumed;
    }

    function maybeSeamlessLoadOlder(scrollEl, forceNearTop = false) {
      if (!scrollEl || !scrollEl.isConnected) return;
      if (isJumping || pendingTurnJump || seamlessLoadInFlight) return;
      if (Date.now() < seamlessLoadCooldownUntil) return;
      if (!sessionsSvc || typeof sessionsSvc.binding !== 'function') return;

      const curTop = scrollEl.scrollTop;
      const prevTop = lastSeamlessScrollTop;
      lastSeamlessScrollTop = curTop;

      const maxScroll = Math.max(0, scrollEl.scrollHeight - scrollEl.clientHeight);
      const distFromBottom = maxScroll - curTop;
      // 正停留在最新消息底部且内容本身已超过一屏时，不主动拉历史
      if (!forceNearTop && distFromBottom <= 24 && maxScroll > 80) return;

      const threshold = Math.max(1400, Math.round(scrollEl.clientHeight * 2.2));
      const movingUp = prevTop < 0 || curTop < prevTop;
      if (curTop > threshold) return;
      if (!forceNearTop && !movingUp && curTop > 360) return;

      const sessionId = resolveActiveSessionId();
      if (!sessionId) return;
      const session = (() => {
        try { return sessionsSvc.binding(sessionId)?.session || null; } catch { return null; }
      })();
      if (!session || typeof session.getSnapshot !== 'function') return;

      const snap = (() => { try { return session.getSnapshot(); } catch { return null; } })();
      if (!snap || snap.openState !== 'open' || !snap.hasMore || snap.loadingOlder) return;
      if (snap.historyLoadStatus === 'error') return;

      // 情况 1：DSH 原生已提前拉好一页但因滚动/惯性卡在 pendingConsumption -> 立即无感消费 + 锚点稳住
      if (snap.historyLoadStatus === 'pendingConsumption') {
        seamlessLoadInFlight = true;
        try {
          consumeOlderSeamlessly(scrollEl, session);
        } finally {
          seamlessLoadInFlight = false;
          seamlessLoadCooldownUntil = Date.now() + 220;
        }
        return;
      }

      // 情况 2：空闲且还有更早历史 -> 后台静默预拉（拉取期间不打断手势），就绪瞬间捕获当前位置再无感拼接
      if (snap.historyLoadStatus === 'idle' && typeof session.loadOlder === 'function') {
        seamlessLoadInFlight = true;
        void (async () => {
          try {
            await session.loadOlder({ deferConsumption: true });
            if (!scrollEl.isConnected || isJumping || pendingTurnJump) return;
            if (resolveActiveSessionId() !== sessionId) return;
            const latestSnap = (() => { try { return session.getSnapshot(); } catch { return null; } })();
            if (latestSnap && latestSnap.historyLoadStatus === 'pendingConsumption') {
              consumeOlderSeamlessly(scrollEl, session);
            }
          } catch {} finally {
            seamlessLoadInFlight = false;
            seamlessLoadCooldownUntil = Date.now() + 220;
          }
        })();
      }
    }

    function onScroll() {
      triggerScrollDegrade();
      if (activeScrollEl) maybeSeamlessLoadOlder(activeScrollEl, false);
      // 虚拟化已由原生 IntersectionObserver 异步驱动，滚动时零同步重排；仅停止滚动后轻量更新当前圆点高亮
      if (railUpdateTimer) clearTimeout(railUpdateTimer);
      railUpdateTimer = setTimeout(() => {
        if (cachedTurns.length && activeScrollEl) renderAnchorRail(cachedTurns, activeScrollEl);
      }, 120);
    }

    function onUserScrollInterrupt(ev) {
      pinnedAnchorIdx = -1;
      pinnedAnchorUntil = 0;
      if (pendingTurnJump) cancelPendingTurnJump();
      // 已顶在 scrollTop=0 时滚轮继续上推不会再触发 scroll 事件，这里直接触发无缝续载
      if (ev && ev.type === 'wheel' && ev.deltaY < 0 && activeScrollEl && activeScrollEl.scrollTop <= 240) {
        maybeSeamlessLoadOlder(activeScrollEl, true);
      }
    }

    function bindScrollContainer(scrollEl) {
      if (activeScrollEl) {
        activeScrollEl.removeEventListener('scroll', onScroll);
        activeScrollEl.removeEventListener('wheel', onUserScrollInterrupt);
        activeScrollEl.removeEventListener('touchstart', onUserScrollInterrupt);
      }
      activeScrollEl = scrollEl;
      lastSeamlessScrollTop = -1;
      activeScrollEl.addEventListener('scroll', onScroll, { passive: true });
      activeScrollEl.addEventListener('wheel', onUserScrollInterrupt, { passive: true });
      activeScrollEl.addEventListener('touchstart', onUserScrollInterrupt, { passive: true });
    }

    function bindVisibilityAndTheme() {
      if (visibilityBound) return;
      visibilityBound = true;
      // 方案 A：右侧栏内任意滚动容器滚动时同步触发玻璃动态降级
      document.addEventListener('scroll', (ev) => {
        if (!config.rightSidebarBoostEnabled || !config.dynamicDegradeOnScroll || config.turboMode) return;
        const t = ev.target;
        if (t instanceof Element && t.closest('[data-sidebar-right-panel]')) {
          document.documentElement.setAttribute('data-dsh-sg-scrolling', '1');
          if (scrollDegradeTimer) clearTimeout(scrollDegradeTimer);
          scrollDegradeTimer = setTimeout(() => {
            document.documentElement.removeAttribute('data-dsh-sg-scrolling');
          }, 180);
        }
      }, true);
      document.addEventListener('visibilitychange', () => {
        if (config.pauseWhenHidden && document.hidden) {
          document.documentElement.setAttribute('data-dsh-sg-hidden', '1');
        } else {
          document.documentElement.removeAttribute('data-dsh-sg-hidden');
        }
      });
      if (!themeObserver) {
        let lastTheme = detectTheme();
        const onThemeMutate = () => {
          const cur = detectTheme();
          if (cur !== lastTheme) {
            lastTheme = cur;
            applyVisualStyles();
            ensureWallpaperLayer();
            notify();
          }
        };
        themeObserver = new MutationObserver(onThemeMutate);
        themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class', 'data-theme', 'data-color-mode', 'data-ds-dark-theme', 'style'],
        });
        if (document.body) {
          themeObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-ds-dark-theme', 'class', 'data-theme'],
          });
        }
      }
    }

    function maybeSmoothFollowBottom() {
      if (!config.smoothScrollFollow || !activeScrollEl || isJumping) return;
      const dist = activeScrollEl.scrollHeight - activeScrollEl.scrollTop - activeScrollEl.clientHeight;
      if (dist > 8 && dist < 140) activeScrollEl.scrollTop = activeScrollEl.scrollHeight;
    }

    const SIDECHAT_BETA_RE = /(侧边对话|側邊對話|Side Chat)\s*[\(（]\s*beta\s*[\)）]/gi;

    function stripSidechatBetaLabels(root) {
      if (!root) return;
      try {
        if (root.nodeType === 3) {
          const v = root.nodeValue;
          if (v && SIDECHAT_BETA_RE.test(v)) {
            SIDECHAT_BETA_RE.lastIndex = 0;
            root.nodeValue = v.replace(SIDECHAT_BETA_RE, '$1');
          }
          return;
        }
        if (root.nodeType !== 1) return;
        for (const attr of ['title', 'aria-label']) {
          const av = root.getAttribute?.(attr);
          if (av && SIDECHAT_BETA_RE.test(av)) {
            SIDECHAT_BETA_RE.lastIndex = 0;
            root.setAttribute(attr, av.replace(SIDECHAT_BETA_RE, '$1'));
          }
        }
        if (root.textContent && !/beta/i.test(root.textContent)) return;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          const v = node.nodeValue;
          if (v && SIDECHAT_BETA_RE.test(v)) {
            SIDECHAT_BETA_RE.lastIndex = 0;
            node.nodeValue = v.replace(SIDECHAT_BETA_RE, '$1');
          }
        }
        const titled = root.querySelectorAll?.('[title*="beta" i], [aria-label*="beta" i]');
        if (titled) {
          for (const el of titled) {
            for (const attr of ['title', 'aria-label']) {
              const av = el.getAttribute(attr);
              if (av && SIDECHAT_BETA_RE.test(av)) {
                SIDECHAT_BETA_RE.lastIndex = 0;
                el.setAttribute(attr, av.replace(SIDECHAT_BETA_RE, '$1'));
              }
            }
          }
        }
      } catch {}
    }

    function startDomObserver() {
      bindVisibilityAndTheme();
      if (mutationObserver || !document.body) return;
      stripSidechatBetaLabels(document.body);
      mutationObserver = new MutationObserver((records) => {
        for (const rec of records) {
          if (rec.type === 'childList' && rec.addedNodes) {
            for (const n of rec.addedNodes) stripSidechatBetaLabels(n);
          } else if (rec.type === 'characterData' && rec.target) {
            stripSidechatBetaLabels(rec.target);
          }
        }
        scheduleVirtualize();
        maybeSmoothFollowBottom();
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    // -----------------------------------------------------------------------
    // Antigravity-Style Merged Turn Anchor Rail + Popover (Stable DOM + Delegation)
    // -----------------------------------------------------------------------
    let openMergedChunkIdx = -1;
    let railSignature = '';
    let pendingTurnJump = null;
    let pendingJumpToken = 0;
    let busyTurnNum = null;
    let pinnedAnchorIdx = -1;
    let pinnedAnchorUntil = 0;

    function getItemSummary(el) {
      const rec = parkedMap.get(el);
      return rec ? rec.summary : (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 72);
    }

    function extractItemTime(el) {
      if (!el) return '';
      const selectors = ['time[datetime]', '[data-clock] > span', '[data-clock] span'];
      for (const sel of selectors) {
        const nodes = el.querySelectorAll?.(sel) || [];
        for (const node of nodes) {
          const txt = (node.textContent || '').trim();
          if (/^\d{1,2}:\d{2}/.test(txt) || /\d{1,2}月\d{1,2}日/.test(txt)) return txt.slice(0, 32);
        }
      }
      return '';
    }

    function extractUserPrompt(el) {
      if (!el) return '';
      // 0. 虚拟化停靠的元素：textContent 可能为空，用停车时缓存的 summary 兜底
      const rec = parkedMap.get(el);
      // 1. 优先从用户消息气泡提取
      const bubble = el.querySelector?.('[data-message-bubble]');
      if (bubble) {
        const raw = (bubble.textContent || '').trim().replace(/\s+/g, ' ');
        if (raw) return raw.slice(0, 240);
      }
      // 2. turn-trigger 节点（"继续" 等）——从标题 span 提取
      const triggerSpan = el.querySelector?.('[data-generation-continuation] span:last-child, [data-turn-trigger] [class*="title"]');
      if (triggerSpan) {
        const raw = (triggerSpan.textContent || '').trim().replace(/\s+/g, ' ');
        if (raw) return raw.slice(0, 240);
      }
      // 3. 兜底：整个元素的 textContent，但排除掉按钮/SVG 等噪音
      const clone = el.cloneNode ? el.cloneNode(true) : null;
      if (clone) {
        clone.querySelectorAll?.('svg, button, [data-clock], [class*="actions"], [data-turn-process-inline]').forEach((n) => n.remove());
        const raw = (clone.textContent || '').trim().replace(/\s+/g, ' ');
        if (raw) return raw.slice(0, 240);
      }
      // 4. 最终兜底：停车 summary
      if (rec && rec.summary) return rec.summary.slice(0, 240);
      return '';
    }

    function extractAssistantReply(el) {
      if (!el) return '';
      const md = el.querySelector?.('[data-text-interaction-source], [class*="markdown"], [class*="body"]');
      let raw = '';
      if (md) {
        const cleanMd = md.cloneNode ? md.cloneNode(true) : null;
        if (cleanMd) {
          cleanMd.querySelectorAll?.('[data-turn-process-inline], [class*="reasoning"], [data-clock]').forEach((n) => n.remove());
          raw = cleanMd.textContent;
        } else {
          raw = md.textContent;
        }
      }
      if (!raw) {
        const lines = (el.textContent || '').split(/\n+/).map((s) => s.trim().replace(/\s+/g, ' ')).filter(Boolean);
        const filtered = lines.filter((line) => !/^(用量|\d{1,2}:\d{2}|复制|分支|TOK|TOKENS)/i.test(line));
        raw = filtered.join(' ');
      }
      raw = (raw || '').trim().replace(/\s+/g, ' ');
      if (raw.startsWith('用量') || /^\d{1,2}:\d{2}$/.test(raw)) return '';
      return raw.slice(0, 280);
    }

    function resolveActiveSessionId(snap) {
      const snapshot = snap || (sessionsSvc && typeof sessionsSvc.list?.getSnapshot === 'function'
        ? (() => { try { return sessionsSvc.list.getSnapshot(); } catch { return null; } })()
        : null);

      const domSessionId = (() => {
        const el = activeScrollEl || document.querySelector('[data-slot="conversation.session"]');
        const root = el?.closest?.('[data-session-id], [data-chat-session-id], [data-session]');
        return root?.getAttribute?.('data-session-id')
          || root?.getAttribute?.('data-chat-session-id')
          || root?.getAttribute?.('data-session')
          || '';
      })();

      let mainViewId = '';
      const byId = snapshot?.byId && typeof snapshot.byId === 'object' ? snapshot.byId : {};
      for (const [id, row] of Object.entries(byId)) {
        if ((Number(row?.retainedBy?.mainView) || 0) > 0) { mainViewId = id; break; }
      }

      if (mainViewId) {
        cachedSessionId = mainViewId;
        return mainViewId;
      }
      if (domSessionId) {
        cachedSessionId = domSessionId;
        return domSessionId;
      }
      return cachedSessionId || '';
    }

    function getTurnOutlineFromSessions() {
      if (!sessionsSvc || typeof sessionsSvc.list?.getSnapshot !== 'function') return [];
      let snap = null;
      try { snap = sessionsSvc.list.getSnapshot(); } catch { return []; }
      if (!snap || typeof snap !== 'object') return [];

      const activeId = resolveActiveSessionId(snap);
      const projSources = [];
      if (activeId && snap.projectionsBySession?.[activeId]?.values) {
        projSources.push(snap.projectionsBySession[activeId].values);
      }
      if (activeId && snap.byId?.[activeId]?.projectionValues) {
        projSources.push(snap.byId[activeId].projectionValues);
      }

      // 仅当完全无法确定主视图会话 ID 时，才允许回退查找唯一可用的 turnOutline；绝不覆盖已确定的主视图会话。
      if (!activeId && snap.projectionsBySession && typeof snap.projectionsBySession === 'object') {
        const entries = Object.entries(snap.projectionsBySession).filter(([, proj]) => {
          const arr = proj?.values?.turnOutline;
          return Array.isArray(arr) && arr.length > 0;
        });
        if (entries.length === 1) {
          cachedSessionId = entries[0][0];
          projSources.push(entries[0][1].values);
        }
      }

      for (const vals of projSources) {
        const outline = vals?.turnOutline;
        if (!Array.isArray(outline) || outline.length === 0) continue;
        const clean = outline
          .map((row) => (row && Number.isFinite(row.turn) && Number.isFinite(row.seq))
            ? {
                turn: Math.max(0, Math.trunc(row.turn)),
                seq: Math.max(0, Math.trunc(row.seq)),
                prompt: typeof row.prompt === 'string' ? row.prompt.trim() : '',
                response: typeof row.response === 'string' ? row.response.trim() : ''
              }
            : null)
          .filter(Boolean)
          .sort((a, b) => a.turn - b.turn);
        if (clean.length) return clean;
      }
      return [];
    }

    function getConversationTurns(scrollEl) {
      if (!scrollEl) return [];
      const listEl = findMessageListContainer(scrollEl);
      if (!listEl) return [];

      const children = Array.from(listEl.children).filter((el) => {
        if (el.nodeType !== 1) return false;
        const cls = String(el.className || '');
        if (/composerSeat|spacer|Spacer/i.test(cls)) return false;
        return true;
      });

      const turns = [];
      let currentTurn = null;

      for (let i = 0; i < children.length; i++) {
        const el = children[i];

        // 严格排除 agent 工具调用/思考步骤/过程组内部成员
        if (el.closest?.('[data-turn-process-member]')) continue;
        if (el.dataset?.chatFlowKind === 'turn-process') continue;
        if (el.dataset?.chatFlowKind === 'turn-tail') {
          if (currentTurn && !currentTurn.time) {
            const t = extractItemTime(el);
            if (t) currentTurn.time = t;
          }
          continue;
        }

        const userBubble = el.querySelector?.('[data-message-bubble]');
        const isUserKind = el.dataset?.chatFlowKind === 'user' || el.dataset?.chatFlowKind === 'steering';
        const isTurnTrigger = el.dataset?.chatFlowKind === 'turn-trigger';
        const isUser = Boolean(userBubble || isUserKind);
        const isAssistant = Boolean(
          el.dataset?.chatFlowKind === 'assistant-step'
          || el.querySelector?.('[data-text-interaction-source]')
        );

        if (isUser || isTurnTrigger) {
          // 用户的每一次提问 或 turn-trigger（继续/agent 自动续行等）：坚定开启一轮全新锚点
          currentTurn = {
            index: turns.length,
            anchorEl: el,
            userEl: el,
            assistantEl: null,
            userText: '',
            assistantText: '',
            time: extractItemTime(el) || ''
          };
          turns.push(currentTurn);
        } else if (isAssistant) {
          if (!currentTurn) {
            // 开场白等无提问的助手回复：只有在完全没有当前轮时才新建
            currentTurn = {
              index: turns.length,
              anchorEl: el,
              userEl: null,
              assistantEl: el,
              userText: '',
              assistantText: '',
              time: extractItemTime(el) || ''
            };
            turns.push(currentTurn);
          } else if (!currentTurn.assistantEl) {
            // 取本轮第一个助手正文作为回复预览
            currentTurn.assistantEl = el;
            if (!currentTurn.time) currentTurn.time = extractItemTime(el) || '';
          }
          // 关键：同一轮里后续 assistant-step（agent 多步执行/分析）一律归入本轮，
          // 绝不新建独立轮次——否则会冒出只有分析内容的孤立卡片
        } else if (!currentTurn) {
          currentTurn = {
            index: turns.length,
            anchorEl: el,
            userEl: el,
            assistantEl: null,
            userText: '',
            assistantText: '',
            time: extractItemTime(el) || ''
          };
          turns.push(currentTurn);
        }
      }

      // 先提取已加载窗口内的提问和回复文本
      for (let i = 0; i < turns.length; i++) {
        const turn = turns[i];
        turn.index = i;
        const jumpEl = turn.anchorEl || turn.userEl;
        turn.flowKey = jumpEl?.dataset?.chatFlowKey || jumpEl?.dataset?.chatAnchorKey || '';
        turn.userText = turn.userEl ? extractUserPrompt(turn.userEl) : '';
        turn.assistantText = extractAssistantReply(turn.assistantEl);
        // 纯助手轮次（agent 自动播报/续行）：userEl 为空时 userText 必为空；
        // 万一 trigger 节点误抓到助手正文，与回复相同则清空，避免卡片两行显示同一段 agent 文本
        if (turn.userText && turn.userText === turn.assistantText) turn.userText = '';
      }

      // DSH 原生 turnOutline 覆盖整个会话；DOM 只负责覆盖已加载窗口。
      // 这样久远会话即使没上滑加载，锚点总数和摘要也仍然存在。
      const outline = getTurnOutlineFromSessions();
      if (outline.length > 0) {
        const loadedByTurn = new Map();
        for (const turn of turns) {
          const jumpEl = turn.anchorEl || turn.userEl;
          const domTurnNum = Number(jumpEl?.dataset?.chatTurn);
          if (Number.isFinite(domTurnNum) && domTurnNum >= 0) loadedByTurn.set(domTurnNum, turn);
        }

        const merged = outline.map((entry, i) => {
          const loaded = loadedByTurn.get(entry.turn);
          const base = {
            index: i,
            outlineTurn: entry.turn,
            seq: entry.seq,
            anchorEl: null,
            userEl: null,
            assistantEl: null,
            userText: entry.prompt || '',
            assistantText: entry.response || '',
            time: '',
            loaded: false
          };
          if (!loaded) return base;
          return {
            ...base,
            anchorEl: loaded.anchorEl,
            userEl: loaded.userEl,
            assistantEl: loaded.assistantEl,
            userText: loaded.userText || base.userText,
            assistantText: loaded.assistantText || base.assistantText,
            time: loaded.time || '',
            flowKey: loaded.flowKey || '',
            loaded: true
          };
        });

        // outline 尚未包含的最新一轮（例如当前正在生成）仍保留在 DOM 末尾。
        for (const turn of turns) {
          const domTurnNum = Number((turn.anchorEl || turn.userEl)?.dataset?.chatTurn);
          if (!Number.isFinite(domTurnNum) || domTurnNum < 0 || loadedByTurn.has(domTurnNum)) continue;
          turn.index = merged.length;
          turn.outlineTurn = domTurnNum;
          turn.loaded = true;
          merged.push(turn);
        }
        return merged;
      }

      return turns;
    }

    function cancelPendingTurnJump(refreshRail = true) {
      pendingJumpToken++;
      const hadPending = pendingTurnJump !== null || busyTurnNum !== null;
      pendingTurnJump = null;
      busyTurnNum = null;
      if (hadPending && refreshRail && activeScrollEl && cachedTurns.length) {
        renderAnchorRail(cachedTurns, activeScrollEl);
      }
    }

    function findLoadedTurnElement(scrollEl, targetTurnNum, fallbackIdx) {
      if (!scrollEl) return null;
      if (Number.isFinite(targetTurnNum) && targetTurnNum >= 0) {
        const direct = scrollEl.querySelector(
          `[data-chat-turn="${targetTurnNum}"][data-chat-flow-key], [data-chat-turn="${targetTurnNum}"]`
        );
        if (direct && direct.isConnected) return direct;
      }
      const fresh = getConversationTurns(scrollEl);
      if (fresh && fresh.length) {
        if (Number.isFinite(targetTurnNum) && targetTurnNum >= 0) {
          const byNum = fresh.find((t) => t.outlineTurn === targetTurnNum && (t.anchorEl?.isConnected || t.userEl?.isConnected));
          if (byNum) return byNum.anchorEl || byNum.userEl;
        }
        const byIdx = fresh[fallbackIdx];
        if (byIdx && (byIdx.anchorEl?.isConnected || byIdx.userEl?.isConnected)) {
          return byIdx.anchorEl || byIdx.userEl;
        }
      }
      return null;
    }

    function landOnTurnElement(el, token, targetIdx = -1) {
      if (!el || !el.isConnected) return;
      if (Number.isFinite(targetIdx) && targetIdx >= 0) {
        pinnedAnchorIdx = targetIdx;
        pinnedAnchorUntil = Date.now() + 900;
      }
      instantJumpToElement(el);
      const scrollNow = activeScrollEl || findScrollContainer();
      if (scrollNow && cachedTurns.length) renderAnchorRail(cachedTurns, scrollNow);
      // 刚加载进来的历史轮次可能伴随 Markdown / 图片 / 代码块异步重排，120ms 后再做一次轻量对齐校准
      setTimeout(() => {
        if (token !== pendingJumpToken) return;
        const scrollEl = activeScrollEl || findScrollContainer();
        if (!scrollEl || !el.isConnected) return;
        const scrollRect = scrollEl.getBoundingClientRect();
        const targetRect = el.getBoundingClientRect();
        const delta = targetRect.top - scrollRect.top - 16;
        if (Math.abs(delta) > 24) {
          scrollEl.scrollTop = Math.max(0, scrollEl.scrollTop + delta);
        }
        if (cachedTurns.length) renderAnchorRail(cachedTurns, scrollEl);
      }, 120);
    }

    function settlePendingTurnJump(scrollEl) {
      const jump = pendingTurnJump;
      if (!jump) return false;
      const targetScroll = scrollEl || activeScrollEl || findScrollContainer();
      if (!targetScroll) return false;
      if (Date.now() - jump.startedAt > 15000) {
        cancelPendingTurnJump(true);
        return false;
      }
      const el = findLoadedTurnElement(targetScroll, jump.turnNum, jump.idx);
      if (!el) return false;
      const token = jump.token;
      const targetIdx = jump.idx;
      pendingTurnJump = null;
      busyTurnNum = null;
      landOnTurnElement(el, token, targetIdx);
      return true;
    }

    async function runLoadThroughJump(jump, session) {
      try {
        await session.loadThrough(jump.seq);
      } catch {}
      if (pendingTurnJump !== jump || jump.token !== pendingJumpToken) return;

      // 等 React 提交新分页的历史 DOM
      for (let frame = 0; frame < 6; frame++) {
        await new Promise((r) => requestAnimationFrame(r));
        if (pendingTurnJump !== jump || jump.token !== pendingJumpToken) return;
        const scrollEl = activeScrollEl || findScrollContainer();
        if (scrollEl) {
          cachedTurns = getConversationTurns(scrollEl);
          if (settlePendingTurnJump(scrollEl)) return;
        }
      }

      // 若首次 loadThrough 因并发 olderRequest 提前返回但尚未覆盖目标 seq，则延迟重试最多 2 次
      if (jump.retries < 2) {
        const snap = typeof session.getSnapshot === 'function' ? (() => { try { return session.getSnapshot(); } catch { return null; } })() : null;
        const hasMore = snap ? snap.hasMore !== false : true;
        if (hasMore) {
          jump.retries++;
          await new Promise((r) => setTimeout(r, 180));
          if (pendingTurnJump !== jump || jump.token !== pendingJumpToken) return;
          return runLoadThroughJump(jump, session);
        }
      }

      // 兜底：若已到会话开头仍无精确 turn 节点，落到最近的大于等于目标 turn 的已加载节点
      const scrollEl = activeScrollEl || findScrollContainer();
      if (scrollEl && pendingTurnJump === jump && jump.token === pendingJumpToken) {
        const fresh = getConversationTurns(scrollEl);
        const fallback = fresh.find((t) =>
          (t.anchorEl?.isConnected || t.userEl?.isConnected)
          && (!Number.isFinite(jump.turnNum) || !Number.isFinite(t.outlineTurn) || t.outlineTurn >= jump.turnNum)
        );
        const token = jump.token;
        pendingTurnJump = null;
        busyTurnNum = null;
        if (fallback) {
          landOnTurnElement(fallback.anchorEl || fallback.userEl, token);
        } else {
          renderAnchorRail(cachedTurns, scrollEl);
        }
      }
    }

    /** 统一跳转：已加载轮次秒切定位；未加载历史轮次走 DSH 原生 loadThrough(seq) 并自动等待落位 */
    function jumpToTurnIdx(idx) {
      if (!Number.isFinite(idx)) return;
      cancelPendingTurnJump(false);
      const token = pendingJumpToken;
      const scrollEl = activeScrollEl || findScrollContainer();
      const targetTurn = cachedTurns && cachedTurns[idx];
      if (!targetTurn) { instantJumpToIndex(idx); return; }

      pinnedAnchorIdx = idx;
      pinnedAnchorUntil = Date.now() + 900;
      if (scrollEl && cachedTurns.length) renderAnchorRail(cachedTurns, scrollEl);

      const targetTurnNum = Number.isFinite(targetTurn.outlineTurn) ? targetTurn.outlineTurn : idx;

      // 先尝试直接命中当前已加载 DOM（含通过 data-chat-turn 重查）
      let el = (targetTurn.anchorEl && targetTurn.anchorEl.isConnected)
        ? targetTurn.anchorEl
        : ((targetTurn.userEl && targetTurn.userEl.isConnected) ? targetTurn.userEl : null);
      if (!el && scrollEl && targetTurn.loaded) {
        el = findLoadedTurnElement(scrollEl, targetTurnNum, idx);
      }
      if (el && el.isConnected) {
        landOnTurnElement(el, token, idx);
        return;
      }

      // 未加载的历史轮次：复用 DSH 原生 session.loadThrough(seq) 分页拉取，加载完成后自动落位
      if (Number.isFinite(targetTurn.seq)) {
        const sessionId = resolveActiveSessionId();
        if (sessionsSvc && typeof sessionsSvc.binding === 'function' && sessionId) {
          try {
            const binding = sessionsSvc.binding(sessionId);
            const session = binding?.session;
            if (session && typeof session.loadThrough === 'function') {
              const jump = {
                token,
                turnNum: targetTurnNum,
                seq: targetTurn.seq,
                idx,
                sessionId,
                retries: 0,
                startedAt: Date.now()
              };
              pendingTurnJump = jump;
              busyTurnNum = targetTurnNum;
              if (scrollEl && cachedTurns.length) renderAnchorRail(cachedTurns, scrollEl);
              void runLoadThroughJump(jump, session);
              return;
            }
          } catch {}
        }
      }

      // 退化兜底：用 flowKey 或已加载行号定位
      const flowKey = targetTurn.flowKey || targetTurn.anchorEl?.dataset?.chatFlowKey || targetTurn.anchorEl?.dataset?.chatAnchorKey;
      if (flowKey && typeof CSS !== 'undefined' && CSS.escape) {
        const fresh = document.querySelector(`[data-chat-flow-key="${CSS.escape(flowKey)}"], [data-chat-anchor-key="${CSS.escape(flowKey)}"]`);
        if (fresh) { landOnTurnElement(fresh, token); return; }
      }
      if (scrollEl) {
        const loadedEl = findLoadedTurnElement(scrollEl, targetTurnNum, idx);
        if (loadedEl) { landOnTurnElement(loadedEl, token); return; }
        const rows = scrollEl.querySelectorAll('[data-chat-flow-key]');
        if (rows[Math.min(idx, rows.length - 1)]) { landOnTurnElement(rows[Math.min(idx, rows.length - 1)], token); return; }
      }
      instantJumpToIndex(idx);
    }

    let railHoverHideTimer = 0;
    let railHoverKey = '';

    function cancelRailHoverHide() {
      if (railHoverHideTimer) {
        clearTimeout(railHoverHideTimer);
        railHoverHideTimer = 0;
      }
    }

    function hideRailHoverCard(immediate = false) {
      cancelRailHoverHide();
      if (immediate) {
        railHoverKey = '';
        const card = document.getElementById('dsh-sg-rail-hover');
        if (card) card.remove();
        return;
      }
      railHoverHideTimer = window.setTimeout(() => {
        railHoverHideTimer = 0;
        railHoverKey = '';
        const card = document.getElementById('dsh-sg-rail-hover');
        if (card) card.remove();
      }, 180);
    }

    function getCurrentTurnIdx(turns, scrollEl) {
      if (!turns || !turns.length) return -1;
      if (Date.now() < pinnedAnchorUntil && pinnedAnchorIdx >= 0 && pinnedAnchorIdx < turns.length) {
        return pinnedAnchorIdx;
      }
      if (!scrollEl || !scrollEl.isConnected) return turns.length - 1;
      const atBottom = scrollEl.scrollHeight - scrollEl.clientHeight - scrollEl.scrollTop <= 24;
      if (atBottom) return turns.length - 1;
      const sRect = scrollEl.getBoundingClientRect();
      const probeY = sRect.top + Math.min(140, scrollEl.clientHeight * 0.25);
      let matched = -1;
      let firstConnected = -1;
      for (let i = 0; i < turns.length; i++) {
        const el = turns[i].anchorEl || turns[i].userEl;
        if (!el || !el.isConnected) continue;
        if (firstConnected === -1) firstConnected = i;
        const r = el.getBoundingClientRect();
        if (r.top <= probeY) {
          matched = i;
        } else {
          break;
        }
      }
      if (matched !== -1) return matched;
      if (firstConnected !== -1) return firstConnected;
      return turns.length - 1;
    }

    function showRailHoverCard(target) {
      if (!target || !document.body) return;
      cancelRailHoverHide();
      const kind = target.dataset.sgKind;
      const rect = target.getBoundingClientRect();
      const currentIdx = getCurrentTurnIdx(cachedTurns, activeScrollEl || findScrollContainer());
      const key = kind === 'pill'
        ? `pill:${target.dataset.sgStart}:${target.dataset.sgEnd}:${currentIdx}`
        : `dot:${target.dataset.sgIdx}`;
      if (key === railHoverKey) return;

      railHoverKey = key;
      let card = document.getElementById('dsh-sg-rail-hover');
      if (!card) {
        card = document.createElement('div');
        card.id = 'dsh-sg-rail-hover';
        card.addEventListener('pointerenter', cancelRailHoverHide);
        card.addEventListener('pointerleave', () => hideRailHoverCard());
        card.addEventListener('click', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const row = ev.target.closest?.('[data-sg-kind="hoverrow"]');
          const targetIdx = row ? Number(row.dataset.sgIdx) : Number(card.dataset.sgIdx);
          hideRailHoverCard(true);
          openMergedChunkIdx = -1;
          const pop = document.getElementById('dsh-sg-rail-popover');
          if (pop) pop.remove();

          jumpToTurnIdx(targetIdx);
        }, true);
        document.body.appendChild(card);
      }
      card.innerHTML = '';
      card.dataset.sgRole = kind;
      card.dataset.sgIdx = kind === 'pill' ? String(target.dataset.sgStart) : String(target.dataset.sgIdx);

      let cardWidth = 300;

      if (kind === 'dot') {
        const idx = Number(target.dataset.sgIdx);
        const turn = cachedTurns[idx] || {};
        const total = cachedTurns.length || 1;

        // 1. 用户的话（我的话）—— 纯 agent 轮次没有提问时不渲染，改用助手文本做主标题
        const userDiv = document.createElement('div');
        userDiv.className = 'dsh-sg-turn-user';
        if (turn.userText) {
          userDiv.textContent = turn.userText;
          card.appendChild(userDiv);
        }

        // 2. 助手的回复（无用户提问时作为主内容；有提问时作为回复段）
        if (turn.assistantText) {
          const assistDiv = document.createElement('div');
          assistDiv.className = turn.userText ? 'dsh-sg-turn-assistant' : 'dsh-sg-turn-user';
          assistDiv.textContent = turn.assistantText;
          card.appendChild(assistDiv);
        }

        // 3. 底部 footer（左边 N of M，右边时间）
        const footDiv = document.createElement('div');
        footDiv.className = 'dsh-sg-turn-footer';
        const countSpan = document.createElement('span');
        countSpan.textContent = `${idx + 1} of ${total}`;
        const timeSpan = document.createElement('span');
        timeSpan.textContent = turn.time || '';
        footDiv.appendChild(countSpan);
        footDiv.appendChild(timeSpan);
        card.appendChild(footDiv);
      } else if (kind === 'pill') {
        cardWidth = 356;
        const start = Number(target.dataset.sgStart);
        const end = Number(target.dataset.sgEnd);
        const chunkTurns = cachedTurns.slice(start, end);
        const times = chunkTurns.map((t) => t.time).filter(Boolean);
        const firstTime = times[0] || '';
        const lastTime = times[times.length - 1] || '';
        const timeRange = times.length
          ? `${firstTime || '—'} ~ ${lastTime || '—'}`
          : `早期轮次 #${start + 1} – #${end}`;
        const summary = chunkTurns[0]?.userText || `早期对话 #${start + 1} – #${end}`;

        const topRow = document.createElement('div');
        topRow.className = 'dsh-sg-hover-top';
        const idxSpan = document.createElement('span');
        idxSpan.className = 'dsh-sg-hover-idx';
        idxSpan.textContent = '↕';
        const titleSpan = document.createElement('span');
        titleSpan.className = 'dsh-sg-hover-title-lg';
        titleSpan.textContent = summary;
        const countSpan = document.createElement('span');
        countSpan.className = 'dsh-sg-hover-count';
        countSpan.textContent = `${end - start} turns`;
        topRow.appendChild(idxSpan);
        topRow.appendChild(titleSpan);
        topRow.appendChild(countSpan);
        card.appendChild(topRow);

        const range = document.createElement('div');
        range.className = 'dsh-sg-hover-range';
        range.textContent = timeRange;
        card.appendChild(range);

        let currentRowEl = null;
        for (let i = start; i < end; i++) {
          const t = cachedTurns[i] || {};
          const row = document.createElement('div');
          row.className = 'dsh-sg-hover-row';
          row.dataset.sgKind = 'hoverrow';
          row.dataset.sgIdx = String(i);
          if (i === currentIdx) {
            row.dataset.current = '1';
            currentRowEl = row;
          }
          const time = document.createElement('span');
          time.className = 'dsh-sg-hover-row-time';
          time.textContent = t.time || '—';
          const role = document.createElement('span');
          role.className = 'dsh-sg-hover-row-role';
          role.textContent = '你';
          const text = document.createElement('span');
          text.className = 'dsh-sg-hover-row-text';
          text.textContent = t.userText || '（提问内容）';
          row.appendChild(time);
          row.appendChild(role);
          row.appendChild(text);
          card.appendChild(row);
        }
        if (currentRowEl) {
          requestAnimationFrame(() => {
            try { currentRowEl.scrollIntoView({ block: 'nearest' }); } catch {}
          });
        }
      }

      const isLeftRail = config.anchorRailPosition === 'left';
      const cardLeft = isLeftRail
        ? Math.min(window.innerWidth - cardWidth - 12, Math.round(rect.right + 10))
        : Math.max(12, Math.round(rect.left - cardWidth - 8));
      card.style.left = `${cardLeft}px`;
      card.style.right = 'auto';
      card.style.width = `${cardWidth}px`;
      const cardH = card.offsetHeight || 140;
      const top = Math.max(16, Math.min(window.innerHeight - cardH - 16, Math.round(rect.top + rect.height / 2 - cardH / 2)));
      card.style.top = `${top}px`;
    }

    /** 轨道只绑定一次委托事件，避免每帧重建导致点击丢失 */
    function ensureRailElement() {
      let rail = document.getElementById('dsh-sg-anchor-rail');
      if (rail && rail.dataset.sgBound === '1') return rail;
      if (!rail) {
        rail = document.createElement('div');
        rail.id = 'dsh-sg-anchor-rail';
        document.body.appendChild(rail);
      }
      rail.dataset.sgBound = '1';
      rail.addEventListener('pointerover', (ev) => {
        const target = ev.target.closest('[data-sg-kind="dot"], [data-sg-kind="pill"]');
        if (target) showRailHoverCard(target);
      });
      rail.addEventListener('pointerleave', () => hideRailHoverCard(false));
      rail.addEventListener('click', (ev) => {
        const target = ev.target.closest('[data-sg-kind]');
        if (!target) return;
        ev.preventDefault();
        ev.stopPropagation();
        hideRailHoverCard();
        const kind = target.dataset.sgKind;
        const idx = Number(target.dataset.sgIdx);
        if (kind === 'pill') {
          openMergedChunkIdx = openMergedChunkIdx === idx ? -1 : idx;
          renderAnchorRail(cachedTurns, activeScrollEl);
        } else if (kind === 'dot') {
          openMergedChunkIdx = -1;
          jumpToTurnIdx(idx);
        } else if (kind === 'poprow') {
          openMergedChunkIdx = -1;
          const pop = document.getElementById('dsh-sg-rail-popover');
          if (pop) pop.remove();
          jumpToTurnIdx(idx);
        }
      }, true);
      return rail;
    }

    function isAnchorRailObscured(scrollEl) {
      if (!scrollEl || !scrollEl.isConnected) return true;
      const sRect = scrollEl.getBoundingClientRect();
      if (sRect.width < 80 || sRect.height < 80) return true;
      if (sRect.bottom <= 0 || sRect.top >= window.innerHeight || sRect.right <= 0 || sRect.left >= window.innerWidth) {
        return true;
      }

      // 1) 存在任意可见模态弹窗/对话框（例如设置页面、导出弹窗、统计弹窗等）时立即避让
      const dialogs = document.querySelectorAll('[role="dialog"], [aria-modal="true"], dialog[open]');
      for (const dlg of dialogs) {
        if (!dlg || !dlg.isConnected) continue;
        if (dlg.closest('#dsh-sg-anchor-rail, #dsh-sg-rail-popover, #dsh-sg-rail-hover')) continue;
        const r = dlg.getBoundingClientRect();
        if (r.width < 40 || r.height < 40) continue;
        const cs = getComputedStyle(dlg);
        if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
        return true;
      }

      // 2) 采样点命中测试：检查锚点所在位置是否被全屏覆盖层/抽屉/设置视图盖住
      if (typeof document.elementsFromPoint === 'function') {
        const isLeftRail = config.anchorRailPosition === 'left';
        const sampleX = Math.max(4, Math.min(window.innerWidth - 4, Math.round(isLeftRail ? sRect.left + 16 : sRect.right - 22)));
        const sampleY = Math.max(4, Math.min(window.innerHeight - 4, Math.round(sRect.top + sRect.height / 2)));
        const stack = document.elementsFromPoint(sampleX, sampleY);
        for (const el of stack) {
          if (!el || el === document.documentElement || el === document.body) break;
          if (el.closest('#dsh-sg-anchor-rail, #dsh-sg-rail-popover, #dsh-sg-rail-hover')) continue;
          if (el.closest('[data-sg-native-rail-hidden="1"]')) continue;
          const cs = getComputedStyle(el);
          if (cs.pointerEvents === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
          if (scrollEl.contains(el) || el.contains(scrollEl)) return false;
          // 命中了与聊天滚动区无关的上层可交互元素（如设置页遮罩、浮层面板等）
          return true;
        }
      }

      return false;
    }

    function hideAnchorRailOverlay(scrollEl, restoreNativeRail = true) {
      if (restoreNativeRail) syncNativeRailVisibility(scrollEl, false);
      hideRailHoverCard(true);
      openMergedChunkIdx = -1;
      const r = document.getElementById('dsh-sg-anchor-rail');
      const p = document.getElementById('dsh-sg-rail-popover');
      if (r) r.remove();
      if (p) p.remove();
      railSignature = '';
    }

    function renderAnchorRail(turns, scrollEl) {
      if (!document.body) return;

      if (!config.anchorRailEnabled || !turns || turns.length < 2 || !scrollEl) {
        hideAnchorRailOverlay(scrollEl, true);
        return;
      }

      if (isAnchorRailObscured(scrollEl)) {
        hideAnchorRailOverlay(scrollEl, false);
        return;
      }

      syncNativeRailVisibility(scrollEl, true);

      const rail = ensureRailElement();

      // 精准贴合聊天区左/右边缘，垂直居中对齐
      const sRect = scrollEl.getBoundingClientRect();
      const isLeftRail = config.anchorRailPosition === 'left';
      const railLeft = isLeftRail
        ? Math.max(8, Math.round(sRect.left + 8))
        : Math.max(12, Math.round(sRect.right - 22));
      rail.style.left = `${railLeft}px`;
      rail.style.right = 'auto';
      rail.style.top = `${Math.round(sRect.top + sRect.height / 2)}px`;
      rail.style.transform = 'translateY(-50%)';
      rail.style.maxHeight = `${Math.max(180, Math.round(sRect.height - 96))}px`;
      rail.style.overflowY = 'auto';

      // 找出当前视口所在的 turn index
      const currentIdx = getCurrentTurnIdx(turns, scrollEl);

      const recentN = config.anchorRecentDots || 14;
      const chunkN = config.anchorMergeChunk || 20;
      const splitAt = Math.max(0, turns.length - recentN);

      const chunks = [];
      for (let i = 0; i < splitAt; i += chunkN) {
        chunks.push({ start: i, end: Math.min(splitAt, i + chunkN) });
      }

      let busyIdx = -1;
      if (busyTurnNum !== null) {
        busyIdx = turns.findIndex((t, i) => (Number.isFinite(t.outlineTurn) ? t.outlineTurn : i) === busyTurnNum);
      }

      const signature = `${turns.length}|${recentN}|${chunkN}|${currentIdx}|${openMergedChunkIdx}|${busyIdx}|${isLeftRail ? 'L' : 'R'}`;
      const pop = document.getElementById('dsh-sg-rail-popover');

      // 结构未变时只更新状态属性，绝不重建 DOM（保证点击可靠）
      if (signature === railSignature && rail.children.length > 0) {
        updateRailStateOnly(rail, chunks, splitAt, currentIdx, busyIdx);
        renderPopover(pop, chunks, turns, railLeft, currentIdx);
        return;
      }

      railSignature = signature;
      rail.innerHTML = '';

      chunks.forEach((ch, cIdx) => {
        const pill = document.createElement('div');
        pill.className = 'dsh-sg-rail-pill';
        pill.dataset.sgKind = 'pill';
        pill.dataset.sgIdx = String(cIdx);
        pill.dataset.sgStart = String(ch.start);
        pill.dataset.sgEnd = String(ch.end);
        pill.dataset.active = openMergedChunkIdx === cIdx ? '1' : '0';
        pill.dataset.current = (currentIdx >= ch.start && currentIdx < ch.end) ? '1' : '0';
        pill.dataset.busy = (busyIdx >= ch.start && busyIdx < ch.end) ? '1' : '0';
        rail.appendChild(pill);
      });

      for (let i = splitAt; i < turns.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'dsh-sg-rail-dot';
        dot.dataset.sgKind = 'dot';
        dot.dataset.sgIdx = String(i);
        dot.dataset.current = i === currentIdx ? '1' : '0';
        dot.dataset.busy = i === busyIdx ? '1' : '0';
        rail.appendChild(dot);
      }

      renderPopover(pop, chunks, turns, railLeft, currentIdx);
    }

    function updateRailStateOnly(rail, chunks, splitAt, currentIdx, busyIdx = -1) {
      for (const el of rail.children) {
        const kind = el.dataset.sgKind;
        if (kind === 'pill') {
          const cIdx = Number(el.dataset.sgIdx);
          const ch = chunks[cIdx];
          el.dataset.active = openMergedChunkIdx === cIdx ? '1' : '0';
          el.dataset.current = (ch && currentIdx >= ch.start && currentIdx < ch.end) ? '1' : '0';
          el.dataset.busy = (ch && busyIdx >= ch.start && busyIdx < ch.end) ? '1' : '0';
        } else if (kind === 'dot') {
          const dIdx = Number(el.dataset.sgIdx);
          el.dataset.current = dIdx === currentIdx ? '1' : '0';
          el.dataset.busy = dIdx === busyIdx ? '1' : '0';
        }
      }
    }

    function renderPopover(pop, chunks, turns, railLeft, currentIdx = -1) {
      if (openMergedChunkIdx < 0 || openMergedChunkIdx >= chunks.length) {
        const existing = document.getElementById('dsh-sg-rail-popover');
        if (existing) existing.remove();
        return;
      }
      const ch = chunks[openMergedChunkIdx];
      let panel = document.getElementById('dsh-sg-rail-popover');
      if (!panel) {
        panel = document.createElement('div');
        panel.id = 'dsh-sg-rail-popover';
        document.body.appendChild(panel);
      }
      const isLeftRail = config.anchorRailPosition === 'left';
      const popLeft = isLeftRail
        ? Math.min(window.innerWidth - 372 - 12, Math.round(railLeft + 26))
        : Math.max(12, Math.round(railLeft - 372 - 14));
      panel.style.left = `${popLeft}px`;
      panel.style.right = 'auto';
      panel.style.width = '372px';
      panel.innerHTML = '';

      const head = document.createElement('div');
      head.className = 'dsh-sg-pop-head';
      const titleSpan = document.createElement('span');
      titleSpan.className = 'dsh-sg-pop-title';
      titleSpan.textContent = `早期对话 #${ch.start + 1} – #${ch.end}`;
      const countSpan = document.createElement('span');
      countSpan.className = 'dsh-sg-pop-count';
      countSpan.textContent = `${ch.end - ch.start} 条`;
      head.appendChild(titleSpan);
      head.appendChild(countSpan);
      panel.appendChild(head);

      const chTimes = [];
      for (let i = ch.start; i < ch.end; i++) {
        const t = turns[i]?.time;
        if (t) chTimes.push(t);
      }
      if (chTimes.length) {
        const rangeEl = document.createElement('div');
        rangeEl.className = 'dsh-sg-hover-range';
        rangeEl.textContent = `${chTimes[0]} ~ ${chTimes[chTimes.length - 1]}`;
        panel.appendChild(rangeEl);
      }

      let currentRowEl = null;
      for (let i = ch.start; i < ch.end; i++) {
        const t = turns[i] || {};
        const row = document.createElement('div');
        row.className = 'dsh-sg-pop-row';
        row.dataset.sgKind = 'poprow';
        row.dataset.sgIdx = String(i);
        if (i === currentIdx) {
          row.dataset.current = '1';
          currentRowEl = row;
        }
        const idxSpan = document.createElement('span');
        idxSpan.className = 'dsh-sg-pop-idx';
        idxSpan.textContent = `#${i + 1}`;
        const txtSpan = document.createElement('span');
        txtSpan.className = 'dsh-sg-pop-txt';
        txtSpan.textContent = t.userText || '（提问内容）';
        const timeSpan = document.createElement('span');
        timeSpan.className = 'dsh-sg-pop-time';
        timeSpan.textContent = t.time || '';
        row.appendChild(idxSpan);
        row.appendChild(txtSpan);
        if (timeSpan.textContent) row.appendChild(timeSpan);
        panel.appendChild(row);
      }
      if (currentRowEl) {
        requestAnimationFrame(() => {
          try { currentRowEl.scrollIntoView({ block: 'nearest' }); } catch {}
        });
      }

      // 浮窗同样使用事件委托
      if (panel.dataset.sgBound !== '1') {
        panel.dataset.sgBound = '1';
        panel.addEventListener('click', (ev) => {
          const row = ev.target.closest('[data-sg-kind="poprow"]');
          if (!row) return;
          ev.preventDefault();
          ev.stopPropagation();
          const idx = Number(row.dataset.sgIdx);
          openMergedChunkIdx = -1;
          panel.remove();
          jumpToTurnIdx(idx);
        }, true);
      }
    }

    // -----------------------------------------------------------------------
    // Top-Right Floating Bar (Outline + Turbo + dsh-unlag Reload)
    // -----------------------------------------------------------------------
    let outlineOpen = false;

    function setOutlineAnchor(btn) {
      if (!btn || typeof btn.getBoundingClientRect !== 'function') return;
      const r = btn.getBoundingClientRect();
      const root = document.documentElement;
      root.style.setProperty('--dsh-sg-outline-top', `${Math.round(r.bottom + 6)}px`);
      root.style.setProperty('--dsh-sg-outline-right', `${Math.max(8, Math.round(window.innerWidth - r.right))}px`);
    }

    function toggleOutline(btn) {
      outlineOpen = !outlineOpen;
      if (outlineOpen) setOutlineAnchor(btn);
      renderFloatingBar();
      notify();
    }

    const HDR_ICON = {
      outline: 'M4 6h16M4 12h10M4 18h13',
      glass: 'M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z',
      turbo: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
      reload: 'M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7'
    };

    function HeaderIcon({ d }) {
      return jsx('svg', {
        width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
        children: jsx('path', { d })
      });
    }

    /** 会话顶栏官方插槽按钮：目录 / 琉璃⇄极速 / 无痛刷新（不再悬浮，窄窗口也不会盖住右侧栏） */
    function HeaderUtilities() {
      useStore();
      if (!config.chapterOutlineEnabled) return null;
      const btn = (key, title, d, active, onClick) => jsx('button', {
        key, type: 'button', className: 'dsh-sg-hdr-btn', title, 'aria-label': title,
        'data-active': active ? '1' : '0', onClick, children: jsx(HeaderIcon, { d })
      });
      return jsxs('span', {
        className: 'dsh-sg-hdr-group',
        children: [
          btn('outline', '会话目录', HDR_ICON.outline, outlineOpen, (e) => toggleOutline(e.currentTarget)),
          btn('turbo', config.turboMode ? '极速模式（点击恢复琉璃态）' : '琉璃态（点击切换极速模式）',
            config.turboMode ? HDR_ICON.turbo : HDR_ICON.glass, config.turboMode,
            () => updateConfig({ turboMode: !config.turboMode }, true)),
          btn('reload', '无痛刷新前端界面（不影响后台会话）', HDR_ICON.reload, false,
            () => { restoreAllParked(); window.location.reload(); })
        ]
      });
    }

    function renderFloatingBar() {
      if (!document.body) return;
      // 旧版悬浮胶囊已迁移到会话顶栏官方插槽，残留节点直接清理
      const legacyBar = document.getElementById('dsh-sg-fab-bar');
      if (legacyBar) legacyBar.remove();
      let panel = document.getElementById('dsh-sg-outline-panel');
      if (!config.chapterOutlineEnabled) {
        outlineOpen = false;
        if (panel) panel.remove();
        return;
      }

      if (outlineOpen) {
        if (!panel) {
          panel = document.createElement('div');
          panel.id = 'dsh-sg-outline-panel';
          document.body.appendChild(panel);
        }
        const scrollEl = findScrollContainer();
        const items = getFlowItems(scrollEl);
        panel.innerHTML = '';
        const title = document.createElement('div');
        title.style.cssText = 'font-weight:600;margin-bottom:8px;';
        title.textContent = `会话目录（${items.length} 条 · 已裁剪 ${stats.parkedItems}）`;
        panel.appendChild(title);
        items.forEach((el, idx) => {
          const txt = getItemSummary(el);
          if (!txt) return;
          const row = document.createElement('div');
          row.className = 'dsh-sg-outline-item';
          row.textContent = `#${idx + 1}  ${txt}`;
          row.onclick = () => {
            outlineOpen = false;
            renderFloatingBar();
            notify();
            instantJumpToIndex(idx);
          };
          panel.appendChild(row);
        });
      } else if (panel) {
        panel.remove();
      }
    }

    /** 注入用户自定义 CSS（整合 dsh-plugin-custom-css）：始终保持为 head 中最后一个 style，赢得级联 */
    function applyCustomCss() {
      const ID = 'dsh-sg-custom-css';
      let el = document.getElementById(ID);
      const css = (config.customCss || '');
      if (!config.customCssEnabled || !css.trim()) {
        if (el) el.remove();
        return;
      }
      if (!el) {
        el = document.createElement('style');
        el.id = ID;
        document.head.appendChild(el);
      }
      if (el.textContent !== css) el.textContent = css;
      // 保持在 head 末尾，避免被宿主后追加的样式覆盖
      const last = document.head.lastElementChild;
      if (last && last !== el) document.head.appendChild(el);
    }

    // -----------------------------------------------------------------------
    // Antigravity-Style Session Instant-Switch Engine
    // (LRU Keep-Alive via native sessions.retain + Idle Warmup + Hover Prefetch)
    // -----------------------------------------------------------------------
    const LRU_SOURCE = 'dsh-azure-glass-lru';
    let sessionsSvc = null;
    const lruPool = new Map(); // sessionId -> { ref, readyAt }
    const inFlightRetain = new Set(); // 防止 retain 同步触发 list.set 造成重入
    const failedCooldown = new Map(); // sessionId -> expireTs，失败后冷却 60s 不重试
    let syncTimer = null;
    let isMutatingPool = false;
    let warmupTimer = null;
    let warmupRunId = 0;
    let hoverTimer = null;
    let hoverBound = false;

    function updateCachedSessionStat() {
      if (stats.cachedSessions !== lruPool.size) {
        stats.cachedSessions = lruPool.size;
        notify();
      }
    }

    function releaseSession(id) {
      const rec = lruPool.get(id);
      if (!rec) return;
      lruPool.delete(id);
      isMutatingPool = true;
      try { rec.ref?.release?.(); } catch {}
      finally { isMutatingPool = false; }
      updateCachedSessionStat();
    }

    function clearSessionKeepAlive() {
      warmupRunId++;
      if (warmupTimer) { clearTimeout(warmupTimer); warmupTimer = null; }
      if (syncTimer) { clearTimeout(syncTimer); syncTimer = null; }
      for (const id of [...lruPool.keys()]) releaseSession(id);
    }

    function hasExternalRetainer(row) {
      const rb = row?.retainedBy;
      if (!rb || typeof rb !== 'object') return false;
      for (const [src, cnt] of Object.entries(rb)) {
        if (src !== LRU_SOURCE && cnt > 0) return true;
      }
      return false;
    }

    function evictSessionOverflow() {
      const limit = Math.max(0, Number(config.sessionKeepAliveMax) || 0);
      if (!config.sessionKeepAliveEnabled || limit === 0) {
        clearSessionKeepAlive();
        return;
      }
      if (lruPool.size <= limit) return;
      const byId = sessionsSvc?.list?.getSnapshot?.()?.byId || {};
      for (const id of [...lruPool.keys()]) {
        if (lruPool.size <= limit) break;
        if (hasExternalRetainer(byId[id])) continue;
        releaseSession(id);
      }
      for (const id of [...lruPool.keys()]) {
        if (lruPool.size <= limit) break;
        releaseSession(id);
      }
    }

    function touchSession(id) {
      if (!sessionsSvc || !id || !config.sessionKeepAliveEnabled) return null;
      if (inFlightRetain.has(id)) return null;
      const coolUntil = failedCooldown.get(id);
      if (coolUntil && Date.now() < coolUntil) return null;

      const limit = Math.max(0, Number(config.sessionKeepAliveMax) || 0);
      if (limit <= 0) return null;

      const existing = lruPool.get(id);
      if (existing) {
        lruPool.delete(id);
        lruPool.set(id, existing);
        return existing.ref;
      }

      const snap = sessionsSvc.list?.getSnapshot?.();
      const row = snap?.byId?.[id];
      if (!row || row.parentId || row.formatStatus === 'migration-required') return null;

      inFlightRetain.add(id);
      isMutatingPool = true;
      let ref = null;
      try {
        ref = sessionsSvc.retain(id, { source: LRU_SOURCE });
        const rec = { ref, readyAt: 0 };
        lruPool.set(id, rec);
        if (ref?.ready && typeof ref.ready.then === 'function') {
          ref.ready.then(
            () => {
              rec.readyAt = Date.now();
              failedCooldown.delete(id);
            },
            () => {
              // 打开失败：60 秒冷却，绝不立刻重入死循环
              failedCooldown.set(id, Date.now() + 60000);
              setTimeout(() => releaseSession(id), 0);
            }
          );
        }
      } catch {
        failedCooldown.set(id, Date.now() + 60000);
        ref = null;
      } finally {
        isMutatingPool = false;
        inFlightRetain.delete(id);
      }

      if (ref) {
        evictSessionOverflow();
        updateCachedSessionStat();
      }
      return ref;
    }

    function syncActiveSessionsFromList() {
      if (!sessionsSvc || isMutatingPool) return;
      const snap = sessionsSvc.list?.getSnapshot?.();
      if (!snap || !snap.byId) return;
      const byId = snap.byId;

      for (const id of [...lruPool.keys()]) {
        if (!byId[id]) releaseSession(id);
      }

      if (!config.sessionKeepAliveEnabled || (Number(config.sessionKeepAliveMax) || 0) <= 0) return;

      for (const [id, row] of Object.entries(byId)) {
        if (row && !row.parentId && hasExternalRetainer(row)) {
          touchSession(id);
        }
      }
    }

    function scheduleSyncActiveSessions() {
      if (isMutatingPool || syncTimer) return;
      syncTimer = setTimeout(() => {
        syncTimer = null;
        syncActiveSessionsFromList();
      }, 80);
    }

    function scheduleBackgroundWarmup(delayMs = 2500) {
      if (warmupTimer) { clearTimeout(warmupTimer); warmupTimer = null; }
      const runId = ++warmupRunId;
      if (!sessionsSvc || !config.sessionKeepAliveEnabled) return;
      const targetCount = Math.min(
        Math.max(0, Number(config.sessionWarmupCount) || 0),
        Math.max(0, Number(config.sessionKeepAliveMax) || 0)
      );
      if (targetCount <= 0) return;

      warmupTimer = setTimeout(async () => {
        warmupTimer = null;
        if (runId !== warmupRunId || !sessionsSvc || !config.sessionKeepAliveEnabled) return;
        const snap = sessionsSvc.list?.getSnapshot?.();
        const byId = snap?.byId;
        if (!byId) return;

        // 按最近活跃时间倒序挑选主会话（排除子代理和需迁移的旧格式）
        const candidates = Object.values(byId)
          .filter((r) => r && r.id && !r.parentId && !r.blank && r.formatStatus !== 'migration-required')
          .sort((a, b) => (Number(b.updatedAt) || 0) - (Number(a.updatedAt) || 0))
          .slice(0, targetCount);

        for (const row of candidates) {
          if (runId !== warmupRunId || !config.sessionKeepAliveEnabled) return;
          if (lruPool.has(row.id)) continue;
          const ref = touchSession(row.id);
          if (ref?.ready && typeof ref.ready.then === 'function') {
            await Promise.race([
              ref.ready.catch(() => {}),
              new Promise((r) => setTimeout(r, 15000))
            ]);
          }
          if (runId !== warmupRunId) return;
          await new Promise((r) => setTimeout(r, 450));
        }
      }, delayMs);
    }

    function matchSessionIdBySidebarText(rawText) {
      if (!sessionsSvc || !rawText) return '';
      // 去掉末尾时间戳（如 "32分钟" / "3小时" / "1天" / "刚刚"）
      const cleaned = rawText
        .replace(/\s*\d+\s*(秒|分钟|小时|天|周|个月|年)前?\s*$/g, '')
        .replace(/\s*(刚刚|昨天|前天)\s*$/g, '')
        .replace(/\.{3,}$|…+$/g, '')
        .trim();
      if (cleaned.length < 2) return '';

      const byId = sessionsSvc.list?.getSnapshot?.()?.byId;
      if (!byId) return '';

      let prefixMatch = '';
      for (const [id, row] of Object.entries(byId)) {
        if (!row || row.parentId) continue;
        const t1 = (row.displayTitle || '').trim();
        const t2 = (row.title || '').trim();
        if (t1 === cleaned || t2 === cleaned) return id;
        if (!prefixMatch && cleaned.length >= 4 && ((t1 && t1.startsWith(cleaned)) || (t2 && t2.startsWith(cleaned)))) {
          prefixMatch = id;
        }
      }
      return prefixMatch;
    }

    function bindHoverPrefetch() {
      if (hoverBound) return;
      hoverBound = true;
      document.addEventListener('pointerover', (ev) => {
        if (!config.sessionKeepAliveEnabled || !config.sessionHoverPrefetch || !sessionsSvc) return;
        const t = ev.target;
        if (!(t instanceof Element)) return;
        const aside = t.closest('aside, nav');
        if (!aside) return;
        const rect = aside.getBoundingClientRect();
        if (rect.left > 120) return; // 只针对左侧会话栏

        const item = t.closest('button, a, [role="button"], [role="treeitem"], li');
        if (!item || !aside.contains(item)) return;
        const text = (item.textContent || '').trim().replace(/\s+/g, ' ');
        if (!text || text.length > 140) return;

        if (hoverTimer) clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          hoverTimer = null;
          if (!config.sessionKeepAliveEnabled || !config.sessionHoverPrefetch) return;
          const sid = matchSessionIdBySidebarText(text);
          if (sid) touchSession(sid);
        }, 140);
      }, true);
    }

    function syncSessionKeepAlivePolicy() {
      if (!sessionsSvc) return;
      if (!config.sessionKeepAliveEnabled || (Number(config.sessionKeepAliveMax) || 0) <= 0) {
        clearSessionKeepAlive();
      } else {
        evictSessionOverflow();
        syncActiveSessionsFromList();
      }
    }

    // -----------------------------------------------------------------------
    // Integrated Side-Session Auto-Open (migrated & fixed from dsh-side-session)
    // -----------------------------------------------------------------------
    const sideSeenByParent = new Map();

    function extractChildIdsByParent(snapshot) {
      const map = new Map();
      if (!snapshot || typeof snapshot !== 'object') return map;
      // 兼容旧版 subagentsByParent
      if (snapshot.subagentsByParent && typeof snapshot.subagentsByParent === 'object') {
        for (const [parentId, catalog] of Object.entries(snapshot.subagentsByParent)) {
          if (!catalog || catalog.state !== 'ready' || !Array.isArray(catalog.entries)) continue;
          const set = map.get(parentId) || new Set();
          for (const entry of catalog.entries) {
            if (entry && entry.kind === 'child' && entry.id) set.add(entry.id);
          }
          map.set(parentId, set);
        }
      }
      // 兼容新版 byId[].parentId
      if (snapshot.byId && typeof snapshot.byId === 'object') {
        for (const [id, row] of Object.entries(snapshot.byId)) {
          if (row && row.parentId) {
            const set = map.get(row.parentId) || new Set();
            set.add(id);
            map.set(row.parentId, set);
          }
        }
      }
      // 兼容新版 projectionsBySession[].values.subagentCatalog
      if (snapshot.projectionsBySession && typeof snapshot.projectionsBySession === 'object') {
        for (const [parentId, proj] of Object.entries(snapshot.projectionsBySession)) {
          const cat = proj?.values?.subagentCatalog;
          if (!Array.isArray(cat)) continue;
          const set = map.get(parentId) || new Set();
          for (const child of cat) {
            const cid = child?.sessionId || child?.id;
            if (cid) set.add(cid);
          }
          map.set(parentId, set);
        }
      }
      return map;
    }

    async function settleSideChild(svc, parentId, before, attempts = 6) {
      for (let i = 0; i < attempts; i++) {
        try {
          if (typeof svc.refreshSubagents === 'function') await svc.refreshSubagents(parentId);
          else if (typeof svc.refreshProjections === 'function') await svc.refreshProjections(parentId);
        } catch {}
        const snap = svc.list?.getSnapshot?.();
        const byParent = extractChildIdsByParent(snap);
        const curSet = byParent.get(parentId);
        if (curSet && curSet.size > 0) {
          let fallback;
          for (const cid of curSet) {
            if (!before.has(cid)) return cid;
            fallback = cid;
          }
          if (fallback !== undefined && before.size === 0) return fallback;
        }
        if (i < attempts - 1) await new Promise((r) => setTimeout(r, 150));
      }
      return undefined;
    }

    function attachSessionsService(svc, subCtx) {
      if (!svc || typeof svc.retain !== 'function' || !svc.list) return;
      sessionsSvc = svc;
      scheduleVirtualize();

      // 左侧栏防「未命名」闪烁保护层：
      // DSH 加载大会话阻塞后端心跳重连时，原生 handleConnected() 会清空 projectionStores 导致所有会话 title 瞬间变 undefined。
      // 这里用 WeakMap 缓存包装 getSnapshot（100% 满足 React useSyncExternalStore 引用稳定性契约），在重连过渡期自动兜底上次已知真实标题。
      const lastKnownTitles = new Map();
      const snapshotPatchCache = new WeakMap();
      let origGetSnapshot = null;
      let snapshotWrapped = false;
      if (typeof svc.list.getSnapshot === 'function') {
        try {
          origGetSnapshot = svc.list.getSnapshot.bind(svc.list);
          svc.list.getSnapshot = () => {
            const raw = origGetSnapshot();
            if (!raw || typeof raw !== 'object' || !raw.byId) return raw;
            const cached = snapshotPatchCache.get(raw);
            if (cached) return cached;

            let needsPatch = false;
            for (const [id, row] of Object.entries(raw.byId)) {
              if (!row) continue;
              if (typeof row.title === 'string' && row.title.trim()) {
                lastKnownTitles.set(id, {
                  title: row.title,
                  displayTitle: row.displayTitle || row.title
                });
              } else if (!row.blank && lastKnownTitles.has(id)) {
                needsPatch = true;
              }
            }

            if (!needsPatch) {
              snapshotPatchCache.set(raw, raw);
              return raw;
            }

            const patchedById = { ...raw.byId };
            for (const [id, row] of Object.entries(raw.byId)) {
              if (row && !row.blank && (!row.title || !String(row.title).trim())) {
                const known = lastKnownTitles.get(id);
                if (known) {
                  patchedById[id] = {
                    ...row,
                    title: known.title,
                    displayTitle: known.displayTitle
                  };
                }
              }
            }
            const patched = { ...raw, byId: patchedById };
            snapshotPatchCache.set(raw, patched);
            return patched;
          };
          snapshotWrapped = true;
        } catch {}
      }

      bindHoverPrefetch();
      scheduleSyncActiveSessions();
      scheduleBackgroundWarmup(2500);

      const syncSideSeen = () => {
        try {
          const snap = svc.list?.getSnapshot?.();
          const byParent = extractChildIdsByParent(snap);
          for (const [pid, set] of byParent.entries()) sideSeenByParent.set(pid, set);
        } catch {}
      };
      syncSideSeen();

      let warmedAfterReady = false;
      const unsub = svc.list.subscribe(() => {
        syncSideSeen();
        if (isMutatingPool) return;
        scheduleSyncActiveSessions();
        if (!warmedAfterReady) {
          const snap = svc.list.getSnapshot?.();
          if (snap && snap.ids && snap.ids.length > 0) {
            warmedAfterReady = true;
            scheduleBackgroundWarmup(2200);
          }
        }
      });

      // 监听 /side-chat 命令执行成功并自动打开新建的旁会话
      let unsubCmd = null;
      if (subCtx && typeof subCtx.on === 'function') {
        try {
          unsubCmd = subCtx.on('command/executed', async (sessionId, cmdName, result) => {
            if (cmdName !== 'side-chat' || result?.kind !== 'success') return;
            const before = new Set(sideSeenByParent.get(sessionId) || []);
            const childId = await settleSideChild(svc, sessionId, before);
            if (!childId) return;
            try {
              if (typeof svc.openSubagent === 'function') {
                svc.openSubagent({ parentSessionId: sessionId, childSessionId: childId, mode: 'continuable' });
              }
            } catch {}
          });
        } catch {}
      }

      const cleanup = () => {
        try { if (typeof unsub === 'function') unsub(); } catch {}
        try { if (typeof unsubCmd === 'function') unsubCmd(); } catch {}
        try {
          if (snapshotWrapped && origGetSnapshot) svc.list.getSnapshot = origGetSnapshot;
        } catch {}
        clearSessionKeepAlive();
        if (sessionsSvc === svc) sessionsSvc = null;
      };
      if (subCtx && typeof subCtx.effect === 'function') {
        subCtx.effect(() => cleanup, 'dsh-azure-glass: session-keepalive');
      }
    }

    // -----------------------------------------------------------------------
    // Skin Workshop Runtime (with Wallpaper Engine background yield)
    // -----------------------------------------------------------------------
    const SKIN_STYLE_ID = 'dsh-ag-skin-style';
    let lastAppliedSkinKey = '';
    let skinApplySeq = 0;

    async function applyActiveSkin(force = false) {
      const skinId = typeof config.activeSkinId === 'string' ? config.activeSkinId.trim() : '';
      const stripBg = Boolean(weCompatState.wallpaperActive && config.skinRespectWe !== false);
      const key = skinId ? `${skinId}::${stripBg ? '1' : '0'}` : '';
      if (!force && key === lastAppliedSkinKey) return;
      lastAppliedSkinKey = key;

      const existing = document.getElementById(SKIN_STYLE_ID);
      if (!skinId) {
        if (existing) existing.remove();
        document.documentElement.removeAttribute('data-dsh-skin');
        return;
      }

      const seq = ++skinApplySeq;
      try {
        const res = await fetch(`${API_BASE}/skins/css?id=${encodeURIComponent(skinId)}&stripBg=${stripBg ? '1' : '0'}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (seq !== skinApplySeq || !data?.ok || typeof data.css !== 'string') return;
        let styleEl = document.getElementById(SKIN_STYLE_ID);
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = SKIN_STYLE_ID;
        }
        styleEl.textContent = data.css;
        document.head.appendChild(styleEl);
        document.documentElement.setAttribute('data-dsh-skin', skinId);
      } catch {}
    }

    // -----------------------------------------------------------------------
    // On-demand Mermaid Diagram Renderer (auto dark/light sync)
    // -----------------------------------------------------------------------
    const MERMAID_KEYWORDS_RE = /^\s*(?:graph|flowchart|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|gantt|pie|mindmap|timeline|gitGraph|journey|quadrantChart|requirementDiagram|C4Context|C4Container|C4Component|xychart-beta|sankey-beta|block-beta)\b/;
    let mermaidLoadPromise = null;
    let mermaidObs = null;
    let mermaidScanTimer = null;
    let mermaidLastTheme = '';
    let mermaidRenderSeq = 0;

    function ensureMermaidLoaded() {
      if (typeof window !== 'undefined' && window.mermaid && typeof window.mermaid.render === 'function') {
        return Promise.resolve(window.mermaid);
      }
      if (mermaidLoadPromise) return mermaidLoadPromise;
      mermaidLoadPromise = new Promise((resolve) => {
        try {
          const s = document.createElement('script');
          s.src = `${API_BASE}/mermaid.js`;
          s.async = true;
          s.onload = () => resolve(window.mermaid || null);
          s.onerror = () => { mermaidLoadPromise = null; resolve(null); };
          document.head.appendChild(s);
        } catch {
          mermaidLoadPromise = null;
          resolve(null);
        }
      });
      return mermaidLoadPromise;
    }

    function isMermaidCodeBlock(preEl) {
      if (!preEl || preEl.closest('.dsh-sg-root, [data-dsh-ag-mermaid-wrap]')) return null;
      const codeEl = preEl.querySelector('code') || preEl;
      const src = (codeEl.textContent || '').trim();
      if (src.length < 8 || src.length > 40000) return null;
      const cls = `${preEl.className || ''} ${codeEl.className || ''}`.toLowerCase();
      const wrap = preEl.closest('.md-code-block') || preEl.parentElement;
      const langLabel = wrap?.querySelector?.('[class*="_language_"], [class*="lang"], .md-code-block-infostring')?.textContent?.trim()?.toLowerCase() || '';
      const isTaggedMermaid = cls.includes('language-mermaid') || cls.includes('lang-mermaid') || langLabel === 'mermaid';
      const isGenericLabel = !langLabel || langLabel === '代码块' || langLabel === 'code block' || langLabel === 'text' || langLabel === 'plain';
      if (!isTaggedMermaid && !(isGenericLabel && MERMAID_KEYWORDS_RE.test(src))) return null;
      return { host: wrap?.classList?.contains('md-code-block') ? wrap : preEl, src };
    }

    async function scanAndRenderMermaid(forceRerender = false) {
      if (config.mermaidEnabled === false) {
        document.querySelectorAll('[data-dsh-ag-mermaid-wrap]').forEach((el) => el.remove());
        document.querySelectorAll('[data-dsh-ag-mermaid-hidden]').forEach((el) => {
          el.style.display = '';
          el.removeAttribute('data-dsh-ag-mermaid-hidden');
        });
        return;
      }

      const theme = detectTheme() === 'dark' ? 'dark' : 'default';
      const themeChanged = forceRerender || (mermaidLastTheme && mermaidLastTheme !== theme);
      const pres = document.querySelectorAll('pre');
      const targets = [];
      for (const pre of pres) {
        const match = isMermaidCodeBlock(pre);
        if (!match) continue;
        const host = match.host;
        const prevSrc = host.getAttribute('data-dsh-ag-mermaid-src');
        const prevTheme = host.getAttribute('data-dsh-ag-mermaid-theme');
        if (!themeChanged && prevSrc === match.src && prevTheme === theme) continue;
        targets.push(match);
      }
      if (targets.length === 0) return;

      const mermaid = await ensureMermaidLoaded();
      if (!mermaid || typeof mermaid.render !== 'function') return;
      mermaidLastTheme = theme;
      try {
        mermaid.initialize({ startOnLoad: false, theme, securityLevel: 'strict' });
      } catch {}

      for (const { host, src } of targets) {
        try {
          const rid = `dsh-ag-mmd-${++mermaidRenderSeq}`;
          const rendered = await mermaid.render(rid, src);
          const svg = typeof rendered === 'string' ? rendered : rendered?.svg;
          if (!svg) continue;

          host.setAttribute('data-dsh-ag-mermaid-src', src);
          host.setAttribute('data-dsh-ag-mermaid-theme', theme);
          let box = host.nextElementSibling;
          if (!box || !box.hasAttribute('data-dsh-ag-mermaid-wrap')) {
            box = document.createElement('div');
            box.setAttribute('data-dsh-ag-mermaid-wrap', '1');
            box.style.cssText = 'margin:8px 0;padding:12px;border-radius:10px;border:1px solid rgba(148,163,184,0.25);background:rgba(15,23,42,0.18);overflow-x:auto;position:relative;';
            host.insertAdjacentElement('afterend', box);
          }
          const showSource = box.getAttribute('data-show-source') === '1';
          box.innerHTML = '';

          const bar = document.createElement('div');
          bar.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:11px;opacity:0.78;';
          const title = document.createElement('span');
          title.textContent = 'Mermaid 图示';
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.textContent = showSource ? '隐藏源码' : '查看源码';
          btn.style.cssText = 'padding:2px 8px;border-radius:6px;border:1px solid rgba(148,163,184,0.35);background:transparent;color:inherit;cursor:pointer;font-size:11px;';
          btn.onclick = () => {
            const nextShow = box.getAttribute('data-show-source') !== '1';
            box.setAttribute('data-show-source', nextShow ? '1' : '0');
            host.style.display = nextShow ? '' : 'none';
            if (nextShow) host.removeAttribute('data-dsh-ag-mermaid-hidden');
            else host.setAttribute('data-dsh-ag-mermaid-hidden', '1');
            btn.textContent = nextShow ? '隐藏源码' : '查看源码';
          };
          bar.appendChild(title);
          bar.appendChild(btn);

          const svgWrap = document.createElement('div');
          svgWrap.style.cssText = 'display:flex;justify-content:center;align-items:center;min-height:40px;';
          svgWrap.innerHTML = svg;

          box.appendChild(bar);
          box.appendChild(svgWrap);

          if (!showSource) {
            host.style.display = 'none';
            host.setAttribute('data-dsh-ag-mermaid-hidden', '1');
          }
        } catch {
          // Leave original code block intact while streaming or on invalid syntax
        }
      }
    }

    function scheduleMermaidScan(force = false) {
      if (mermaidScanTimer) clearTimeout(mermaidScanTimer);
      mermaidScanTimer = setTimeout(() => {
        mermaidScanTimer = null;
        void scanAndRenderMermaid(force);
      }, force ? 120 : 450);
    }

    function syncMermaidEngine() {
      if (config.mermaidEnabled === false) {
        if (mermaidObs) { try { mermaidObs.disconnect(); } catch {} mermaidObs = null; }
        void scanAndRenderMermaid(false);
        return;
      }
      if (!mermaidObs && typeof MutationObserver === 'function' && document.body) {
        mermaidObs = new MutationObserver(() => scheduleMermaidScan(false));
        mermaidObs.observe(document.body, { childList: true, subtree: true });
      }
      scheduleMermaidScan(false);
    }

    // -----------------------------------------------------------------------
    // Official Settings -> Plugins Page Quick Update Bar & Update Summary Helpers
    // -----------------------------------------------------------------------
    const OFFICIAL_UPDATER_BAR_ID = 'dsh-ag-official-plugin-updater-bar';
    const OFFICIAL_UPDATER_POPUP_ID = 'dsh-ag-official-plugin-popup-card';
    let officialUpdaterObs = null;
    let officialUpdaterTimer = null;
    let officialUpdaterRepositionCleanup = null;

    function formatUpdatableSummaryText(updatableList) {
      if (!Array.isArray(updatableList) || updatableList.length === 0) return '';
      return updatableList
        .map((p) => `${p.name}\n${p.installedVersion || '?'} → ${p.updateInfo?.latestVersion || '?'}`)
        .join('\n');
    }

    async function copyTextToClipboard(text) {
      const value = String(text || '');
      if (!value) return false;
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          return true;
        }
      } catch {}
      try {
        const ta = document.createElement('textarea');
        ta.value = value;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none;';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        return Boolean(ok);
      } catch {
        return false;
      }
    }

    function removeOfficialUpdaterPopup() {
      if (typeof officialUpdaterRepositionCleanup === 'function') {
        try { officialUpdaterRepositionCleanup(); } catch {}
        officialUpdaterRepositionCleanup = null;
      }
      const pop = document.getElementById(OFFICIAL_UPDATER_POPUP_ID);
      if (pop) pop.remove();
    }

    function removeOfficialUpdaterBar() {
      removeOfficialUpdaterPopup();
      const el = document.getElementById(OFFICIAL_UPDATER_BAR_ID);
      if (el) el.remove();
    }

    function findOfficialPluginsToolbarSeat() {
      // 1. Primary official hook: [data-plugin-panel] -> [data-plugin-group="bundles"] -> firstElementChild ("Installed" header)
      const panel = document.querySelector('[data-plugin-panel]');
      if (panel instanceof HTMLElement && !panel.closest('.dsh-sg-root')) {
        const bundles = panel.querySelector('[data-plugin-group="bundles"]');
        if (bundles instanceof HTMLElement) {
          const head = bundles.firstElementChild;
          if (head instanceof HTMLElement) {
            return { seat: head, mode: 'head' };
          }
          return { seat: bundles, mode: 'prepend' };
        }
        // Fallback inside [data-plugin-panel] if bundles group attribute changed
        const candidates = panel.querySelectorAll('h1, h2, h3, h4, [role="heading"], div, span');
        for (const el of candidates) {
          if (el.closest('.dsh-sg-root') || el.id === OFFICIAL_UPDATER_BAR_ID) continue;
          const txt = (el.textContent || '').trim();
          if (/^(?:已安装|已安装插件|Installed(?:\s+Plugins)?)(?:\s*[（(]?\d+[)）]?)?$/i.test(txt)) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              return { seat: el, mode: 'after' };
            }
          }
        }
      }

      // 2. Fallback when [data-plugin-panel] wrapper is absent
      const headings = document.querySelectorAll('h1, h2, h3, h4, [role="heading"], div');
      for (const el of headings) {
        if (el.closest('.dsh-sg-root') || el.id === OFFICIAL_UPDATER_BAR_ID) continue;
        if (el.children.length > 3) continue;
        const txt = (el.textContent || '').trim();
        if (/^(?:已安装|已安装插件|Installed(?:\s+Plugins)?)(?:\s*[（(]?\d+[)）]?)?$/i.test(txt)) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            return { seat: el, mode: 'after' };
          }
        }
      }
      return null;
    }

    function ensureOfficialUpdaterStyles() {
      const styleId = 'dsh-ag-official-updater-style';
      if (document.getElementById(styleId)) return;
      const st = document.createElement('style');
      st.id = styleId;
      st.textContent = `
        .dsh-ag-ou-btn {
          cursor: pointer;
          font-size: 12px;
          line-height: 18px;
          border-radius: 7px;
          transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease, transform 0.12s ease;
        }
        .dsh-ag-ou-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .dsh-ag-ou-btn:active:not(:disabled) {
          transform: scale(0.96);
        }
        .dsh-ag-ou-btn--check {
          padding: 4px 10px;
          font-weight: 600;
          border: 1px solid rgba(56,189,248,0.42);
          background: rgba(56,189,248,0.16);
          color: #e0f2fe;
        }
        .dsh-ag-ou-btn--check:hover:not(:disabled) {
          border-color: rgba(56,189,248,0.78);
          background: rgba(56,189,248,0.28);
          color: #ffffff;
          box-shadow: 0 0 12px rgba(56,189,248,0.32);
          transform: translateY(-1px);
        }
        .dsh-ag-ou-btn--check[data-theme="light"] {
          border-color: rgba(59,130,246,0.35);
          background: rgba(241,247,255,0.92);
          color: #1e3a8a;
        }
        .dsh-ag-ou-btn--check[data-theme="light"]:hover:not(:disabled) {
          border-color: rgba(37,99,235,0.62);
          background: rgba(219,234,254,0.96);
          color: #1d4ed8;
          box-shadow: 0 4px 12px rgba(59,130,246,0.22);
          transform: translateY(-1px);
        }
        .dsh-ag-ou-btn--summary {
          padding: 3px 9px;
          border: 1px solid rgba(148,163,184,0.28);
          background: rgba(15,23,42,0.52);
          color: #cbd5e1;
        }
        .dsh-ag-ou-btn--summary:hover:not(:disabled) {
          border-color: rgba(56,189,248,0.55);
          background: rgba(30,41,59,0.78);
          color: #f8fafc;
          box-shadow: 0 0 10px rgba(56,189,248,0.2);
          transform: translateY(-1px);
        }
        .dsh-ag-ou-btn--summary[data-theme="light"] {
          border-color: rgba(15,23,42,0.16);
          background: rgba(255,255,255,0.85);
          color: #334155;
        }
        .dsh-ag-ou-btn--summary[data-theme="light"]:hover:not(:disabled) {
          border-color: rgba(59,130,246,0.45);
          background: rgba(239,246,255,0.95);
          color: #0f172a;
          box-shadow: 0 3px 10px rgba(59,130,246,0.16);
          transform: translateY(-1px);
        }
        .dsh-ag-ou-btn--primary {
          padding: 4px 10px;
          font-weight: 600;
          border: none;
          background: linear-gradient(135deg,#3b82f6,#7c3aed);
          color: #ffffff;
          box-shadow: 0 3px 10px rgba(99,102,241,0.28);
        }
        .dsh-ag-ou-btn--primary:hover:not(:disabled) {
          filter: brightness(1.1);
          box-shadow: 0 5px 14px rgba(99,102,241,0.44);
          transform: translateY(-1px);
        }
        .dsh-ag-ou-btn--copy {
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 600;
          border: 1px solid rgba(56,189,248,0.45);
          background: rgba(56,189,248,0.18);
          color: #e0f2fe;
        }
        .dsh-ag-ou-btn--copy:hover:not(:disabled) {
          border-color: rgba(56,189,248,0.8);
          background: rgba(56,189,248,0.3);
          color: #ffffff;
          box-shadow: 0 0 10px rgba(56,189,248,0.28);
          transform: translateY(-1px);
        }
        .dsh-ag-ou-btn--copy[data-theme="light"] {
          border-color: rgba(59,130,246,0.38);
          background: rgba(219,234,254,0.9);
          color: #1d4ed8;
        }
        .dsh-ag-ou-btn--copy[data-theme="light"]:hover:not(:disabled) {
          border-color: rgba(37,99,235,0.68);
          background: rgba(191,219,254,0.96);
          color: #1e40af;
          box-shadow: 0 3px 10px rgba(59,130,246,0.2);
          transform: translateY(-1px);
        }
        .dsh-ag-ou-btn--close {
          padding: 2px 7px;
          border-radius: 6px;
          font-size: 11.5px;
          border: 1px solid rgba(148,163,184,0.3);
          background: transparent;
          color: #cbd5e1;
        }
        .dsh-ag-ou-btn--close:hover:not(:disabled) {
          border-color: rgba(148,163,184,0.62);
          background: rgba(148,163,184,0.18);
          color: #ffffff;
        }
        .dsh-ag-ou-btn--close[data-theme="light"] {
          border-color: rgba(148,163,184,0.35);
          color: #475569;
        }
        .dsh-ag-ou-btn--close[data-theme="light"]:hover:not(:disabled) {
          border-color: rgba(100,116,139,0.55);
          background: rgba(148,163,184,0.16);
          color: #0f172a;
        }
      `;
      document.head.appendChild(st);
    }

    function mountOfficialUpdaterBarIfVisible() {
      if (config.pluginUpdaterPlacement !== 'both') {
        removeOfficialUpdaterBar();
        return;
      }
      const existingBar = document.getElementById(OFFICIAL_UPDATER_BAR_ID);
      if (existingBar && existingBar.isConnected) {
        // Ensure we are still on the official plugins view
        const seatEl = existingBar._dshSeatEl;
        if (seatEl && seatEl.isConnected) return;
        removeOfficialUpdaterBar();
      } else if (existingBar) {
        removeOfficialUpdaterBar();
      }

      const found = findOfficialPluginsToolbarSeat();
      if (!found || !found.seat) {
        removeOfficialUpdaterPopup();
        return;
      }

      const { seat, mode } = found;
      const bar = document.createElement('div');
      bar.id = OFFICIAL_UPDATER_BAR_ID;
      bar._dshSeatEl = seat;

      if (mode === 'head') {
        const cs = window.getComputedStyle(seat);
        if (cs.display !== 'flex' && cs.display !== 'inline-flex') {
          seat.style.display = 'flex';
          seat.style.alignItems = 'center';
          seat.style.justifyContent = 'space-between';
          seat.style.gap = '10px';
          seat.style.flexWrap = 'wrap';
        }
        bar.style.cssText = 'display:inline-flex;flex-wrap:wrap;align-items:center;gap:8px;margin-left:auto;position:relative;flex-shrink:0;z-index:25;font-size:12.5px;';
      } else {
        bar.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:8px 0 10px;padding:7px 11px;border-radius:10px;border:1px solid rgba(56,189,248,0.34);background:rgba(15,23,42,0.48);font-size:12.5px;position:relative;z-index:25;';
      }

      ensureOfficialUpdaterStyles();
      const isLight = detectTheme() === 'light';
      const themeTag = isLight ? 'light' : 'dark';

      const checkBtn = document.createElement('button');
      checkBtn.type = 'button';
      checkBtn.textContent = '🔍 检查全部更新';
      checkBtn.className = 'dsh-ag-ou-btn dsh-ag-ou-btn--check';
      checkBtn.setAttribute('data-theme', themeTag);

      const summaryBtn = document.createElement('button');
      summaryBtn.type = 'button';
      summaryBtn.className = 'dsh-ag-ou-btn dsh-ag-ou-btn--summary';
      summaryBtn.setAttribute('data-theme', themeTag);
      summaryBtn.style.display = 'none';

      const updateAllBtn = document.createElement('button');
      updateAllBtn.type = 'button';
      updateAllBtn.className = 'dsh-ag-ou-btn dsh-ag-ou-btn--primary';
      updateAllBtn.style.display = 'none';

      let lastUpdatable = [];
      let popupOpen = false;

      const positionPopup = (pop) => {
        if (!pop || !bar.isConnected) return;
        const rect = bar.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return;
        const top = Math.min(window.innerHeight - 140, Math.max(12, Math.round(rect.bottom + 8)));
        const right = Math.max(12, Math.round(window.innerWidth - rect.right));
        const maxH = Math.max(160, Math.min(380, Math.round(window.innerHeight - top - 16)));
        pop.style.top = `${top}px`;
        pop.style.right = `${right}px`;
        const bodyEl = pop.querySelector('[data-dsh-ag-popup-body="1"]');
        if (bodyEl) bodyEl.style.maxHeight = `${Math.max(110, maxH - 48)}px`;
      };

      const renderPopup = () => {
        removeOfficialUpdaterPopup();
        if (!popupOpen || lastUpdatable.length === 0) return;

        const darkMode = detectTheme() !== 'light';
        const pop = document.createElement('div');
        pop.id = OFFICIAL_UPDATER_POPUP_ID;
        pop.style.cssText = [
          'position:fixed',
          'z-index:9999',
          'min-width:250px',
          'max-width:min(380px,82vw)',
          'border-radius:12px',
          `border:1px solid ${darkMode ? 'rgba(148,163,184,0.34)' : 'rgba(59,130,246,0.28)'}`,
          `background:${darkMode ? 'rgba(30,41,59,0.86)' : 'rgba(248,250,252,0.94)'}`,
          `color:${darkMode ? '#e2e8f0' : '#0f172a'}`,
          'backdrop-filter:blur(16px) saturate(140%)',
          '-webkit-backdrop-filter:blur(16px) saturate(140%)',
          'box-shadow:0 12px 34px rgba(0,0,0,0.35)',
          'padding:10px 12px',
          'display:flex',
          'flex-direction:column',
          'gap:8px',
          'user-select:text',
          '-webkit-user-select:text'
        ].join(';');

        const headRow = document.createElement('div');
        headRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;padding-bottom:6px;border-bottom:1px solid rgba(148,163,184,0.22);user-select:none;';

        const headTitle = document.createElement('span');
        headTitle.textContent = `可更新插件（${lastUpdatable.length}）`;
        headTitle.style.cssText = 'font-size:12px;font-weight:700;';

        const headActions = document.createElement('div');
        headActions.style.cssText = 'display:flex;align-items:center;gap:6px;';

        const copyText = formatUpdatableSummaryText(lastUpdatable);
        const popThemeTag = darkMode ? 'dark' : 'light';
        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.textContent = '📋 一键复制';
        copyBtn.className = 'dsh-ag-ou-btn dsh-ag-ou-btn--copy';
        copyBtn.setAttribute('data-theme', popThemeTag);
        copyBtn.onclick = async () => {
          const ok = await copyTextToClipboard(copyText);
          copyBtn.textContent = ok ? '✅ 已复制' : '复制失败';
          setTimeout(() => { if (copyBtn.isConnected) copyBtn.textContent = '📋 一键复制'; }, 2000);
        };

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.textContent = '收起';
        closeBtn.className = 'dsh-ag-ou-btn dsh-ag-ou-btn--close';
        closeBtn.setAttribute('data-theme', popThemeTag);
        closeBtn.onclick = () => {
          popupOpen = false;
          removeOfficialUpdaterPopup();
        };

        headActions.appendChild(copyBtn);
        headActions.appendChild(closeBtn);
        headRow.appendChild(headTitle);
        headRow.appendChild(headActions);

        const bodyEl = document.createElement('div');
        bodyEl.setAttribute('data-dsh-ag-popup-body', '1');
        bodyEl.style.cssText = [
          'overflow-y:auto',
          'user-select:text',
          '-webkit-user-select:text',
          'cursor:text',
          'white-space:pre-wrap',
          'word-break:break-word',
          'font-size:13px',
          'line-height:1.58',
          `color:${darkMode ? '#bae6fd' : '#0f172a'}`
        ].join(';');
        bodyEl.textContent = copyText;

        pop.appendChild(headRow);
        pop.appendChild(bodyEl);
        document.body.appendChild(pop);
        positionPopup(pop);

        const onReposition = () => {
          if (!bar.isConnected || !seat.isConnected) {
            removeOfficialUpdaterBar();
            return;
          }
          positionPopup(pop);
        };
        window.addEventListener('resize', onReposition, true);
        window.addEventListener('scroll', onReposition, true);
        officialUpdaterRepositionCleanup = () => {
          window.removeEventListener('resize', onReposition, true);
          window.removeEventListener('scroll', onReposition, true);
        };
      };

      summaryBtn.onclick = () => {
        if (lastUpdatable.length === 0) return;
        popupOpen = !popupOpen;
        renderPopup();
      };

      checkBtn.onclick = async () => {
        checkBtn.disabled = true;
        checkBtn.textContent = '检查中...';
        try {
          const r = await fetch(`${API_BASE}/plugins/check?force=1`, { cache: 'no-store' });
          const d = await r.json();
          if (!d?.ok) throw new Error(d?.error || '检查失败');
          lastUpdatable = (d.plugins || []).filter((p) => p.updateInfo?.hasUpdate);
          const actionable = lastUpdatable.filter((p) => p.sourceKind === 'npm' || p.sourceKind === 'github');
          summaryBtn.style.display = 'inline-block';
          if (lastUpdatable.length > 0) {
            summaryBtn.textContent = `发现 ${lastUpdatable.length} 个新版本 ▾`;
            popupOpen = true;
            renderPopup();
          } else {
            summaryBtn.textContent = `全部 ${d.count} 个均已最新`;
            popupOpen = false;
            removeOfficialUpdaterPopup();
          }
          if (actionable.length > 0) {
            updateAllBtn.style.display = 'inline-block';
            updateAllBtn.textContent = `⬆️ 全部更新（${actionable.length}）`;
          } else {
            updateAllBtn.style.display = 'none';
          }
        } catch (err) {
          summaryBtn.style.display = 'inline-block';
          summaryBtn.textContent = `检查失败：${err?.message || err}`;
        } finally {
          checkBtn.disabled = false;
          checkBtn.textContent = '🔍 检查全部更新';
        }
      };

      updateAllBtn.onclick = async () => {
        const targets = lastUpdatable.filter((p) => p.sourceKind === 'npm' || p.sourceKind === 'github');
        if (targets.length === 0) return;
        updateAllBtn.disabled = true;
        checkBtn.disabled = true;
        let done = 0;
        for (const p of targets) {
          updateAllBtn.textContent = `更新中 ${done + 1}/${targets.length}...`;
          try {
            const ur = await fetch(`${API_BASE}/plugins/update`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: p.name })
            });
            const ud = await ur.json();
            if (ud?.ok) done++;
          } catch {}
        }
        updateAllBtn.disabled = false;
        checkBtn.disabled = false;
        updateAllBtn.textContent = `✅ 已更新 ${done}/${targets.length}（重启生效）`;
        summaryBtn.textContent = `请重启 DSH 使新版本生效`;
      };

      bar.appendChild(checkBtn);
      bar.appendChild(summaryBtn);
      bar.appendChild(updateAllBtn);

      if (mode === 'head') {
        seat.appendChild(bar);
      } else if (mode === 'prepend') {
        seat.prepend(bar);
      } else {
        seat.insertAdjacentElement('afterend', bar);
      }
    }

    function syncOfficialPluginUpdaterBar() {
      if (config.pluginUpdaterPlacement !== 'both') {
        if (officialUpdaterObs) { try { officialUpdaterObs.disconnect(); } catch {} officialUpdaterObs = null; }
        removeOfficialUpdaterBar();
        return;
      }
      if (!officialUpdaterObs && typeof MutationObserver === 'function' && document.body) {
        officialUpdaterObs = new MutationObserver(() => {
          if (officialUpdaterTimer) clearTimeout(officialUpdaterTimer);
          officialUpdaterTimer = setTimeout(mountOfficialUpdaterBarIfVisible, 220);
        });
        officialUpdaterObs.observe(document.body, { childList: true, subtree: true });
      }
      mountOfficialUpdaterBarIfVisible();
    }

    function applyAll() {
      startWeCompatObserver();
      applyVisualStyles();
      applyCustomCss();
      ensureWallpaperLayer();
      renderFloatingBar();
      scheduleVirtualize();
      syncSessionKeepAlivePolicy();
      syncComposerIsland();
      void applyActiveSkin();
      syncMermaidEngine();
      syncOfficialPluginUpdaterBar();
    }

    // -----------------------------------------------------------------------
    // 5-Tab Studio UI (Settings + Right Sidebar)
    // -----------------------------------------------------------------------
    function AzureGlassIcon(props) {
      const size = (props && typeof props.size === 'number' && props.size > 0) ? props.size : 18;
      return jsxs('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: '#38bdf8',
        strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
        children: [jsx('path', { d: 'M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z' })]
      });
    }

    function RightSidebarTitle() {
      return jsxs('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' }, children: [jsx(AzureGlassIcon, {}), '苍蓝琉璃'] });
    }

    const TABS = [
      { id: 'perf', label: '⚡ 性能引擎' },
      { id: 'wallpaper', label: '🖼️ 壁纸视差' },
      { id: 'skins', label: '🎭 皮肤工坊' },
      { id: 'glass', label: '🪟 玻璃质感' },
      { id: 'color', label: '🎨 色彩排版' },
      { id: 'layout', label: '📑 Antigravity布局' },
      { id: 'fx', label: '✨ 特效头像' },
      { id: 'addons', label: '🛠️ 效率增强' },
      { id: 'plugins', label: '🔌 插件更新' },
      { id: 'css', label: '🧩 自定义 CSS' }
    ];

    // -----------------------------------------------------------------------
    // 方案 A：接管 dsh-better-sidebar >5MB 非二进制大文件查看器
    // -----------------------------------------------------------------------
    const LARGE_FILE_BINARY_EXTS = new Set([
      'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'ico', 'avif', 'tif', 'tiff', 'psd',
      'pdf', 'zip', 'gz', 'tar', '7z', 'rar', 'xz', 'bz2', 'zst',
      'mp4', 'm4v', 'webm', 'mov', 'avi', 'mkv', 'mp3', 'wav', 'flac', 'ogg', 'm4a', 'aac', 'opus',
      'woff', 'woff2', 'ttf', 'otf', 'eot',
      'exe', 'dll', 'so', 'dylib', 'wasm', 'bin', 'dat', 'db', 'sqlite', 'sqlite3',
      'class', 'jar', 'pyc', 'o', 'a', 'lib',
      'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'asar', 'pak', 'dmg', 'iso', 'apk', 'ipa'
    ]);

    function detectLargeTextFile(filePath, head) {
      if (!head || !head.length) return false;
      const cleanPath = String(filePath || '').split(/[?#]/)[0];
      const dot = cleanPath.lastIndexOf('.');
      if (dot > cleanPath.lastIndexOf('/') && dot > cleanPath.lastIndexOf('\\')) {
        const ext = cleanPath.slice(dot + 1).toLowerCase();
        if (LARGE_FILE_BINARY_EXTS.has(ext)) return false;
      }
      const probeLen = Math.min(head.length, 4096);
      let ctrlCount = 0;
      for (let i = 0; i < probeLen; i++) {
        const b = head[i];
        if (b === 0) return false;
        if (b < 32 && b !== 9 && b !== 10 && b !== 13 && b !== 12 && b !== 27) ctrlCount++;
      }
      return (ctrlCount / probeLen) <= 0.02;
    }

    function isAbsoluteFsPath(p) {
      return /^[a-zA-Z]:[\\/]/.test(p) || /^\\\\/.test(p) || /^\/[^/]/.test(p);
    }

    function joinNativePath(baseDir, relPath) {
      const base = String(baseDir || '').replace(/[\\/]+$/, '');
      const rel = String(relPath || '').replace(/^[\\/]+/, '');
      if (!base) return relPath;
      if (!rel) return base;
      const isWin = /^[a-zA-Z]:/.test(base) || base.includes('\\');
      const sep = isWin ? '\\' : '/';
      const normRel = isWin ? rel.replace(/\//g, '\\') : rel.replace(/\\/g, '/');
      return `${base}${sep}${normRel}`;
    }

    async function resolveSidebarAbsPath(bsCtx, relPath, scope, signal) {
      const raw = String(relPath || '').trim();
      if (!raw || isAbsoluteFsPath(raw)) return raw;
      const sid = scope?.sessionId;
      let cwd =
        (sid && sessionsSvc?.list?.getSnapshot?.()?.byId?.[sid]?.cwd) ||
        (sid && bsCtx?.sessions?.list?.getSnapshot?.()?.byId?.[sid]?.cwd) ||
        scope?.cwd ||
        '';
      if (!cwd && sid) {
        try {
          const res = await fetch('/sidebar/api/session.cwd', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: sid }),
            signal
          });
          if (res.ok) {
            const data = await res.json();
            cwd = data?.cwd || data?.root || '';
          }
        } catch {}
      }
      return cwd ? joinNativePath(cwd, raw) : raw;
    }

    async function loadLargeFileForSidebar(bsCtx, relPath, scope, signal) {
      const absPath = await resolveSidebarAbsPath(bsCtx, relPath, scope, signal);
      const sessionId = typeof scope?.sessionId === 'string' ? scope.sessionId : '';
      const res = await fetch(`${API_BASE}/file/meta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: absPath, sessionId }),
        signal
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `大文件索引建立失败 (HTTP ${res.status})`);
      }
      return { ...data, sessionId };
    }

    /** 接管 dsh-better-sidebar 的 >5MB 非二进制大文件行级视口虚拟查看器 */
    function LargeFileHostViewer(props) {
      const LINE_H = 22;
      const CHUNK_LINES = 120;
      const meta = props?.customData || null;
      const visible = props?.visible !== false;
      const onToolbarState = props?.onToolbarState;
      const onToolbarControls = props?.onToolbarControls;
      const onLineConsumed = props?.onLineConsumed;
      const onReload = props?.onReload;

      const [scrollTop, setScrollTop] = React.useState(0);
      const [viewH, setViewH] = React.useState(520);
      const [jumpInput, setJumpInput] = React.useState('');
      const [highlightRange, setHighlightRange] = React.useState(null);
      const [searchQ, setSearchQ] = React.useState('');
      const [searchHits, setSearchHits] = React.useState([]);
      const [searchTruncated, setSearchTruncated] = React.useState(false);
      const [searching, setSearching] = React.useState(false);
      const [, setChunkTick] = React.useReducer((n) => n + 1, 0);

      const boxRef = React.useRef(null);
      const searchInputRef = React.useRef(null);
      const chunkMapRef = React.useRef(new Map());
      const inflightRef = React.useRef(new Set());
      const activePathRef = React.useRef('');

      React.useEffect(() => {
        onToolbarState?.({
          modes: false,
          mode: 'preview',
          dirty: false,
          editable: false,
          largeFile: true,
          saveState: 'idle'
        });
        onToolbarControls?.(null);
        return () => { onToolbarControls?.(null); };
      }, [onToolbarState, onToolbarControls]);

      React.useEffect(() => {
        const nextPath = meta?.path || '';
        if (activePathRef.current !== nextPath) {
          activePathRef.current = nextPath;
          chunkMapRef.current.clear();
          inflightRef.current.clear();
          setSearchHits([]);
          setSearchTruncated(false);
          setHighlightRange(null);
          setScrollTop(0);
          if (boxRef.current) boxRef.current.scrollTop = 0;
        }
      }, [meta?.path, meta?.mtimeMs]);

      React.useEffect(() => {
        const el = boxRef.current;
        if (!el) return;
        const measure = () => {
          const h = el.clientHeight;
          if (h > 80) setViewH(h);
        };
        measure();
        if (typeof ResizeObserver === 'function') {
          const ro = new ResizeObserver(measure);
          ro.observe(el);
          return () => ro.disconnect();
        }
      }, [meta?.path]);

      const fetchChunk = React.useCallback(async (targetPath, chunkIdx) => {
        if (!targetPath || chunkIdx < 0) return;
        const key = `${targetPath}#${chunkIdx}`;
        if (chunkMapRef.current.has(key) || inflightRef.current.has(key)) return;
        inflightRef.current.add(key);
        try {
          const res = await fetch(`${API_BASE}/file/slice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: targetPath, sessionId: meta?.sessionId || '', startLine: chunkIdx * CHUNK_LINES, count: CHUNK_LINES })
          });
          const data = await res.json();
          if (res.ok && data.ok && activePathRef.current === targetPath) {
            chunkMapRef.current.set(key, data.lines || []);
            if (chunkMapRef.current.size > 48) {
              const oldest = chunkMapRef.current.keys().next().value;
              chunkMapRef.current.delete(oldest);
            }
            setChunkTick();
          }
        } catch {}
        finally { inflightRef.current.delete(key); }
      }, []);

      const jumpToLine = React.useCallback((oneBasedLine, oneBasedEnd) => {
        if (!meta || !meta.totalLines) return;
        const startIdx = Math.max(0, Math.min(meta.totalLines - 1, Math.floor(Number(oneBasedLine) || 1) - 1));
        const endIdx = oneBasedEnd
          ? Math.max(startIdx, Math.min(meta.totalLines - 1, Math.floor(Number(oneBasedEnd)) - 1))
          : startIdx;
        setHighlightRange([startIdx, endIdx]);
        const top = Math.max(0, startIdx * LINE_H - Math.floor(viewH * 0.32));
        if (boxRef.current) boxRef.current.scrollTop = top;
        setScrollTop(top);
        const cStart = Math.floor(startIdx / CHUNK_LINES);
        const cEnd = Math.floor(endIdx / CHUNK_LINES);
        for (let c = cStart; c <= cEnd; c++) void fetchChunk(meta.path, c);
      }, [meta, viewH, fetchChunk]);

      React.useEffect(() => {
        if (!meta || !props?.line) return;
        jumpToLine(props.line, props.lineEnd);
        onLineConsumed?.();
      }, [meta?.path, props?.line, props?.lineEnd, jumpToLine, onLineConsumed]);

      const runSearch = React.useCallback(async () => {
        if (!meta || !searchQ.trim()) { setSearchHits([]); setSearchTruncated(false); return; }
        setSearching(true);
        try {
          const res = await fetch(`${API_BASE}/file/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: meta.path, sessionId: meta?.sessionId || '', query: searchQ.trim(), maxHits: 200 })
          });
          const data = await res.json();
          if (res.ok && data.ok) {
            setSearchHits(data.hits || []);
            setSearchTruncated(Boolean(data.truncated));
          }
        } catch {}
        finally { setSearching(false); }
      }, [meta, searchQ]);

      const totalLines = meta?.totalLines || 0;
      const startLine = Math.max(0, Math.floor(scrollTop / LINE_H) - 12);
      const endLine = Math.min(totalLines, Math.ceil((scrollTop + viewH) / LINE_H) + 14);

      React.useEffect(() => {
        if (!meta || !visible || totalLines <= 0) return;
        const cStart = Math.floor(startLine / CHUNK_LINES);
        const cEnd = Math.floor(Math.max(0, endLine - 1) / CHUNK_LINES);
        for (let c = cStart; c <= cEnd; c++) void fetchChunk(meta.path, c);
      }, [meta, visible, totalLines, startLine, endLine, fetchChunk]);

      const fmtSize = (b) => b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : b >= 1024 ? `${(b / 1024).toFixed(1)} KB` : `${b} B`;

      if (!meta) {
        return jsx('div', {
          style: { padding: '16px', fontSize: '13px', opacity: 0.72 },
          children: '正在建立大文件行偏移索引…'
        });
      }

      const gutterW = Math.max(46, String(totalLines).length * 8 + 14);
      const rows = [];
      for (let i = startLine; i < endLine; i++) {
        const cIdx = Math.floor(i / CHUNK_LINES);
        const chunk = chunkMapRef.current.get(`${meta.path}#${cIdx}`);
        const text = chunk ? (chunk[i - cIdx * CHUNK_LINES] ?? '') : '…';
        const isHi = highlightRange && i >= highlightRange[0] && i <= highlightRange[1];
        rows.push(
          jsxs('div', {
            key: i,
            style: {
              position: 'absolute',
              top: `${i * LINE_H}px`,
              left: 0,
              minWidth: '100%',
              height: `${LINE_H}px`,
              lineHeight: `${LINE_H}px`,
              display: 'flex',
              gap: '12px',
              padding: '0 12px 0 8px',
              boxSizing: 'border-box',
              fontFamily: 'Consolas, "JetBrains Mono", ui-monospace, monospace',
              fontSize: '12px',
              whiteSpace: 'pre',
              background: isHi ? 'rgba(56, 189, 248, 0.22)' : 'transparent',
              boxShadow: isHi ? 'inset 3px 0 0 #38bdf8' : 'none'
            },
            children: [
              jsx('span', {
                style: {
                  width: `${gutterW}px`,
                  textAlign: 'right',
                  opacity: isHi ? 0.92 : 0.45,
                  userSelect: 'none',
                  flexShrink: 0,
                  fontVariantNumeric: 'tabular-nums'
                },
                children: i + 1
              }),
              jsx('span', { style: { userSelect: 'text' }, children: text })
            ]
          })
        );
      }

      return jsxs('div', {
        tabIndex: -1,
        onKeyDown: (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
            e.preventDefault();
            searchInputRef.current?.focus();
            searchInputRef.current?.select();
          }
        },
        style: {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden',
          outline: 'none'
        },
        children: [
          jsxs('div', {
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              alignItems: 'center',
              padding: '6px 10px',
              fontSize: '12px',
              borderBottom: '1px solid rgba(148, 163, 184, 0.22)',
              background: 'rgba(56, 189, 248, 0.06)',
              flexShrink: 0
            },
            children: [
              jsx('span', {
                style: {
                  padding: '2px 7px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#38bdf8',
                  background: 'rgba(56, 189, 248, 0.14)',
                  border: '1px solid rgba(56, 189, 248, 0.32)'
                },
                children: '⚡ 极速视图'
              }),
              jsx('span', {
                style: { opacity: 0.78, marginRight: 'auto', fontVariantNumeric: 'tabular-nums' },
                children: `${fmtSize(meta.size)} · ${totalLines.toLocaleString()} 行（只读虚拟切片）`
              }),
              jsx('input', {
                className: 'dsh-sg-input',
                style: { width: '78px', padding: '3px 7px', fontSize: '12px' },
                placeholder: '跳行号',
                value: jumpInput,
                onChange: (e) => setJumpInput(e.target.value),
                onKeyDown: (e) => { if (e.key === 'Enter') jumpToLine(jumpInput); }
              }),
              jsx('button', {
                type: 'button',
                className: 'dsh-sg-btn',
                style: { padding: '3px 8px', fontSize: '12px' },
                onClick: () => jumpToLine(jumpInput),
                children: '跳转'
              }),
              jsx('input', {
                ref: searchInputRef,
                className: 'dsh-sg-input',
                style: { width: '148px', padding: '3px 7px', fontSize: '12px' },
                placeholder: '极速搜索 (Ctrl+F)…',
                value: searchQ,
                onChange: (e) => setSearchQ(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === 'Enter') void runSearch();
                  if (e.key === 'Escape') { setSearchHits([]); setSearchTruncated(false); }
                }
              }),
              jsx('button', {
                type: 'button',
                className: 'dsh-sg-btn',
                style: { padding: '3px 8px', fontSize: '12px' },
                onClick: () => void runSearch(),
                children: searching ? '搜索中…' : '搜索'
              }),
              onReload ? jsx('button', {
                type: 'button',
                className: 'dsh-sg-btn',
                style: { padding: '3px 8px', fontSize: '12px' },
                title: '重新读取文件索引',
                onClick: () => onReload(),
                children: '刷新'
              }) : null
            ]
          }),
          searchHits.length > 0 ? jsxs('div', {
            style: {
              maxHeight: '132px',
              overflowY: 'auto',
              padding: '4px 8px',
              borderBottom: '1px solid rgba(148, 163, 184, 0.22)',
              fontSize: '11px',
              flexShrink: 0
            },
            children: [
              jsxs('div', {
                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', opacity: 0.72 },
                children: [
                  jsx('span', { children: `命中 ${searchHits.length} 处${searchTruncated ? '（仅显示前 200 处）' : ''}` }),
                  jsx('button', {
                    type: 'button',
                    className: 'dsh-sg-btn',
                    style: { padding: '1px 6px', fontSize: '11px' },
                    onClick: () => { setSearchHits([]); setSearchTruncated(false); },
                    children: '收起'
                  })
                ]
              }),
              ...searchHits.map((h, idx) =>
                jsxs('div', {
                  key: `${h.line}-${idx}`,
                  className: 'dsh-sg-outline-item',
                  onClick: () => jumpToLine(h.line + 1),
                  children: [`L${h.line + 1}: ${h.preview}`]
                })
              )
            ]
          }) : null,
          jsx('div', {
            ref: boxRef,
            onScroll: (e) => setScrollTop(e.currentTarget.scrollTop),
            style: {
              flex: 1,
              minHeight: 0,
              overflow: 'auto',
              position: 'relative'
            },
            children: jsx('div', {
              style: {
                position: 'relative',
                height: `${Math.max(viewH, totalLines * LINE_H)}px`,
                minWidth: '100%'
              },
              children: rows
            })
          })
        ]
      });
    }

    const QUICK_FONTS = [
      { label: '默认', val: '' },
      { label: '雅黑', val: '"Microsoft YaHei", sans-serif' },
      { label: '楷体', val: 'KaiTi, STKaiti, serif' },
      { label: '宋体', val: 'SimSun, STSong, serif' },
      { label: '黑体', val: 'SimHei, STHeiti, sans-serif' },
      { label: '等宽', val: '"JetBrains Mono", Consolas, monospace' }
    ];

    const GLASS_PRESET_KEYS = [
      'glassEnabled',
      'glassBlurPx',
      'glassSurfaceOpacity',
      'glassChatBgOpacity',
      'glassRightSidebarOpacity',
      'glassComposerBlurPx',
      'glassComposerOpacity',
      'glassSidechatComposerBlurPx',
      'glassSidechatComposerOpacity',
      'sidechatComposerRightGapPx',
      'glassModalBlurPx',
      'glassBubbleOpacity',
      'glassBubbleBlurPx',
      'glassOverlayOpacity',
      'glassOverlayBlurPx',
      'glassDiffOpacity',
      'glassDiffBlurPx',
      'solidOverlay',
      'solidDiff',
      'glassSaturate',
      'glassBorderAlpha',
      'glassRadiusPx',
      'minimalScrollbar',
      'transparentHeader',
      'glassHeaderOpacity',
      'glassHeaderBlurPx'
    ];

    const COLOR_PRESET_KEYS = [
      'colorPreset',
      'uiColors',
      'proseColors',
      'proseBoost',
      'rowHighlightEnabled',
      'toolRowColor',
      'summaryRowColor',
      'fileCardColor',
      'caretColor',
      'fontFamily',
      'monoFontFamily',
      'fontSizePx',
      'lineHeight',
      'codeFontSizePx'
    ];

    function pickPresetFields(source, keys) {
      const out = {};
      for (const k of keys) {
        const v = source[k];
        if (v && typeof v === 'object' && !Array.isArray(v)) out[k] = { ...v };
        else out[k] = v;
      }
      return out;
    }

    const GLASS_DEFAULT_PRESET = pickPresetFields(DEFAULT_CONFIG, GLASS_PRESET_KEYS);

    /** Neko Glass 黑紫毛玻璃自定义下拉组件（替代系统原生 <select>） */
    function NekoSelect({ value, options, onChange }) {
      const [open, setOpen] = React.useState(false);
      const [focusIdx, setFocusIdx] = React.useState(-1);
      const [openUp, setOpenUp] = React.useState(false);
      const wrapRef = React.useRef(null);
      const triggerRef = React.useRef(null);

      const selectedIdx = Math.max(0, options.findIndex((o) => o.value === value));
      const current = options[selectedIdx] || options[0] || { value: '', label: '' };

      const decideDirection = React.useCallback(() => {
        const el = triggerRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const estH = Math.min(240, options.length * 34 + 16);
        const spaceBelow = window.innerHeight - r.bottom - 12;
        setOpenUp(spaceBelow < estH && r.top > estH + 12);
      }, [options.length]);

      React.useEffect(() => {
        if (!open) return;
        decideDirection();
        setFocusIdx(selectedIdx);
        const onDocDown = (e) => {
          if (wrapRef.current?.contains(e.target)) return;
          setOpen(false);
        };
        document.addEventListener('mousedown', onDocDown, true);
        return () => {
          document.removeEventListener('mousedown', onDocDown, true);
        };
      }, [open, decideDirection, selectedIdx]);

      const pick = (opt) => {
        setOpen(false);
        if (opt && opt.value !== value) onChange(opt.value);
      };

      const onKeyDown = (e) => {
        if (!open) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setOpen(true);
          }
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          setOpen(false);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setFocusIdx((i) => (i + 1) % options.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setFocusIdx((i) => (i - 1 + options.length) % options.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          pick(options[focusIdx >= 0 ? focusIdx : selectedIdx]);
        }
      };

      return jsxs('div', {
        ref: wrapRef,
        className: 'dsh-sg-nselect-wrap',
        children: [
          jsxs('button', {
            ref: triggerRef,
            type: 'button',
            className: 'dsh-sg-nselect-trigger',
            'data-open': open ? '1' : '0',
            'aria-haspopup': 'listbox',
            'aria-expanded': open,
            onClick: (e) => { e.stopPropagation(); setOpen((v) => !v); },
            onKeyDown,
            children: [
              jsx('span', { className: 'dsh-sg-nselect-label', children: current.label }),
              jsxs('svg', {
                className: 'dsh-sg-nselect-arrow',
                viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 2,
                strokeLinecap: 'round', strokeLinejoin: 'round',
                children: [jsx('path', { d: 'M4 6l4 4 4-4' })]
              })
            ]
          }),
          open ? jsx('div', {
            role: 'listbox',
            className: 'dsh-sg-nselect-menu',
            'data-up': openUp ? '1' : '0',
            children: options.map((opt, idx) =>
              jsxs('div', {
                key: opt.value,
                role: 'option',
                'aria-selected': opt.value === value,
                className: 'dsh-sg-nselect-opt',
                'data-selected': opt.value === value ? '1' : '0',
                'data-focus': idx === focusIdx ? '1' : '0',
                onMouseEnter: () => setFocusIdx(idx),
                onMouseDown: (e) => { e.preventDefault(); e.stopPropagation(); pick(opt); },
                children: [
                  jsx('span', { children: opt.label }),
                  opt.value === value ? jsx('span', { className: 'dsh-sg-nselect-check', children: '✓' }) : null
                ]
              })
            )
          }) : null
        ]
      });
    }

    function AvatarCropper({ src, role, fileName, isGif, onCancel, onConfirm, onKeepOriginal }) {
      const STAGE = 220;
      const [nat, setNat] = React.useState({ w: 0, h: 0 });
      const [zoom, setZoom] = React.useState(1);
      const [offset, setOffset] = React.useState({ x: 0, y: 0 });
      const imgRef = React.useRef(null);
      const dragRef = React.useRef(null);

      const baseScale = nat.w > 0 && nat.h > 0 ? STAGE / Math.min(nat.w, nat.h) : 1;
      const scale = baseScale * zoom;
      const dispW = nat.w * scale;
      const dispH = nat.h * scale;

      const clampOffset = React.useCallback((ox, oy, z) => {
        if (!nat.w || !nat.h) return { x: 0, y: 0 };
        const sc = (STAGE / Math.min(nat.w, nat.h)) * z;
        const maxX = Math.max(0, (nat.w * sc - STAGE) / 2);
        const maxY = Math.max(0, (nat.h * sc - STAGE) / 2);
        return {
          x: Math.min(maxX, Math.max(-maxX, ox)),
          y: Math.min(maxY, Math.max(-maxY, oy))
        };
      }, [nat.w, nat.h]);

      const applyZoom = (nextZ) => {
        const z = Math.min(4, Math.max(1, Number(nextZ) || 1));
        setZoom(z);
        setOffset((prev) => clampOffset(prev.x, prev.y, z));
      };

      const onPointerDown = (e) => {
        e.preventDefault();
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
        dragRef.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y };
      };

      const onPointerMove = (e) => {
        const d = dragRef.current;
        if (!d) return;
        const nx = d.ox + (e.clientX - d.startX);
        const ny = d.oy + (e.clientY - d.startY);
        setOffset(clampOffset(nx, ny, zoom));
      };

      const onPointerUp = (e) => {
        if (!dragRef.current) return;
        dragRef.current = null;
        try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
      };

      const onWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.14 : -0.14;
        applyZoom(Number((zoom + delta).toFixed(2)));
      };

      const handleConfirm = () => {
        const img = imgRef.current;
        if (!img || !nat.w || !nat.h) {
          onKeepOriginal();
          return;
        }
        try {
          const outSize = 256;
          const imgLeft = STAGE / 2 + offset.x - dispW / 2;
          const imgTop = STAGE / 2 + offset.y - dispH / 2;
          const sx = Math.max(0, (0 - imgLeft) / scale);
          const sy = Math.max(0, (0 - imgTop) / scale);
          const sSize = Math.min(nat.w - sx, nat.h - sy, STAGE / scale);
          const cvs = document.createElement('canvas');
          cvs.width = outSize;
          cvs.height = outSize;
          const ctx2 = cvs.getContext('2d');
          if (ctx2) {
            ctx2.imageSmoothingEnabled = true;
            ctx2.imageSmoothingQuality = 'high';
            ctx2.drawImage(img, sx, sy, sSize, sSize, 0, 0, outSize, outSize);
            let out = cvs.toDataURL('image/webp', 0.90);
            if (!out || !out.startsWith('data:image/webp')) {
              out = cvs.toDataURL('image/png');
            }
            if (out) {
              onConfirm(out);
              return;
            }
          }
        } catch {}
        onKeepOriginal();
      };

      return jsxs('div', {
        className: 'dsh-sg-crop-box',
        children: [
          jsxs('div', {
            className: 'dsh-sg-crop-head',
            children: [
              jsx('span', { children: `✂️ 裁切${role === 'user' ? '用户' : '助手'}头像（1:1 区域 · 拖拽移动 / 滚轮缩放）` }),
              jsx('button', { type: 'button', className: 'dsh-sg-btn', onClick: onCancel, children: '取消' })
            ]
          }),
          jsxs('div', {
            className: 'dsh-sg-crop-body',
            children: [
              jsxs('div', {
                className: 'dsh-sg-crop-stage',
                onPointerDown,
                onPointerMove,
                onPointerUp,
                onPointerCancel: onPointerUp,
                onWheel,
                children: [
                  jsx('img', {
                    ref: imgRef,
                    src,
                    alt: fileName || 'avatar',
                    className: 'dsh-sg-crop-img',
                    onLoad: (e) => {
                      const el = e.currentTarget;
                      setNat({ w: el.naturalWidth || 220, h: el.naturalHeight || 220 });
                      setZoom(1);
                      setOffset({ x: 0, y: 0 });
                    },
                    style: nat.w > 0 ? {
                      width: `${dispW}px`,
                      height: `${dispH}px`,
                      transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`
                    } : { opacity: 0 }
                  }),
                  jsx('div', { className: 'dsh-sg-crop-grid' }),
                  jsx('div', { className: 'dsh-sg-crop-mask' })
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-crop-ctrl',
                children: [
                  jsx('span', { children: '缩放' }),
                  jsx('input', {
                    type: 'range',
                    min: 1,
                    max: 4,
                    step: 0.02,
                    value: zoom,
                    onChange: (e) => applyZoom(e.target.value)
                  }),
                  jsx('span', { style: { minWidth: '38px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }, children: `${zoom.toFixed(2)}x` }),
                  jsx('button', {
                    type: 'button',
                    className: 'dsh-sg-btn',
                    onClick: () => { setZoom(1); setOffset({ x: 0, y: 0 }); },
                    children: '居中'
                  })
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-crop-acts',
                children: [
                  isGif ? jsx('button', {
                    type: 'button',
                    className: 'dsh-sg-btn',
                    onClick: onKeepOriginal,
                    children: '跳过裁切（保留 GIF 动图）'
                  }) : null,
                  jsx('button', {
                    type: 'button',
                    className: 'dsh-sg-btn dsh-sg-btn-primary',
                    onClick: handleConfirm,
                    children: '确认裁切并保存'
                  })
                ]
              })
            ]
          })
        ]
      });
    }

    function StudioPanel() {
      const { config: cfg, stats: st } = useStore();
      const [activeTab, setActiveTab] = React.useState('perf');
      const [uploadMsg, setUploadMsg] = React.useState('');
      const [presetName, setPresetName] = React.useState('');
      const [glassPresetName, setGlassPresetName] = React.useState('');
      const [numDrafts, setNumDrafts] = React.useState({});
      const [themeOpen, setThemeOpen] = React.useState(false);
      const [themeSlotName, setThemeSlotName] = React.useState('');
      const [pluginVer, setPluginVer] = React.useState(PLUGIN_VERSION);
      const [verToast, setVerToast] = React.useState('');
      const [verReleaseUrl, setVerReleaseUrl] = React.useState('');
      const [dshMode, setDshMode] = React.useState(() => detectTheme());
      const verToastTimerRef = React.useRef(null);
      const islandSnap = React.useSyncExternalStore(
        composerIslandStore.subscribe,
        composerIslandStore.getSnapshot,
        composerIslandStore.getSnapshot
      );
      const weCompat = React.useSyncExternalStore(
        weCompatStore.subscribe,
        weCompatStore.getSnapshot,
        weCompatStore.getSnapshot
      );
      const renderWeCompatSwitch = (moduleLabel, configKey, azureDesc, weDesc) => {
        if (!weCompat.installed) return null;
        const azureOwned = cfg[configKey] !== false;
        return jsxs('div', {
          className: 'dsh-sg-compat-bar',
          'data-mode': azureOwned ? 'azure' : 'we',
          children: [
            jsxs('div', {
              className: 'dsh-sg-compat-head',
              children: [
                jsx('span', { className: 'dsh-sg-compat-title', children: `🤝 Wallpaper Engine 共存 · ${moduleLabel}` }),
                jsxs('div', {
                  className: 'dsh-sg-compat-seg',
                  children: [
                    jsx('button', {
                      type: 'button',
                      'data-active': azureOwned ? '1' : '0',
                      onClick: () => updateConfig({ [configKey]: true }, true),
                      children: '由苍蓝琉璃控制'
                    }),
                    jsx('button', {
                      type: 'button',
                      'data-active': !azureOwned ? '1' : '0',
                      onClick: () => updateConfig({ [configKey]: false }, true),
                      children: '由 Wallpaper Engine 控制'
                    })
                  ]
                })
              ]
            }),
            jsx('div', {
              className: 'dsh-sg-compat-desc',
              children: azureOwned ? azureDesc : weDesc
            })
          ]
        });
      };
      React.useEffect(() => {
        if (activeTab === 'layout') composerIslandStore.rescan();
      }, [activeTab]);

      React.useEffect(() => {
        const onMode = (m) => setDshMode(m || detectTheme());
        dshThemeListeners.add(onMode);
        const obs = new MutationObserver(() => setDshMode(detectTheme()));
        if (document.body) obs.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme', 'data-theme'] });
        let alive = true;
        fetch(`${API_BASE}/version`, { cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            if (alive && d?.ok && typeof d.currentVersion === 'string' && d.currentVersion.trim()) {
              setPluginVer(d.currentVersion.trim());
            }
          })
          .catch(() => {});
        return () => {
          alive = false;
          dshThemeListeners.delete(onMode);
          obs.disconnect();
          if (verToastTimerRef.current) clearTimeout(verToastTimerRef.current);
        };
      }, []);

      const showVerToast = (msg, url = '', ms = 3600) => {
        setVerToast(msg);
        setVerReleaseUrl(url || '');
        if (verToastTimerRef.current) clearTimeout(verToastTimerRef.current);
        verToastTimerRef.current = setTimeout(() => {
          setVerToast('');
          setVerReleaseUrl('');
        }, ms);
      };

      const onClickVersionBtn = async () => {
        let cur = pluginVer || PLUGIN_VERSION;
        showVerToast(`正在检查 GitHub 更新（当前 v${cur}）...`, '', 6000);
        try {
          const r = await fetch(`${API_BASE}/version?check=1&force=1`, { cache: 'no-store' });
          if (r.ok) {
            const d = await r.json();
            if (d?.ok) {
              if (d.currentVersion) {
                cur = String(d.currentVersion).trim();
                setPluginVer(cur);
              }
              if (d.checked && d.hasUpdate && d.latestVersion) {
                showVerToast(`发现新版本 v${d.latestVersion}（当前 v${cur}）`, d.releaseUrl || 'https://github.com/A16Nights/dsh-azure-glass/releases', 8000);
                return;
              }
              if (d.checked) {
                showVerToast(`当前 v${cur} 已是最新版本${d.prerelease ? '（测试版）' : ''}`, '', 3200);
                return;
              }
            }
          }
        } catch {}
        showVerToast(`当前版本 v${cur}（暂无法连接 GitHub 检查更新）`, '', 3600);
      };

      const resolvedUiTheme = resolveStudioUiTheme(cfg.studioUiTheme);
      const uiThemeCfg = resolvedUiTheme.config;
      const [themeDraftP, setThemeDraftP] = React.useState(uiThemeCfg.customDraft.primary);
      const [themeDraftS, setThemeDraftS] = React.useState(uiThemeCfg.customDraft.secondary);
      const [hexInputP, setHexInputP] = React.useState(uiThemeCfg.customDraft.primary);
      const [hexInputS, setHexInputS] = React.useState(uiThemeCfg.customDraft.secondary);

      React.useEffect(() => {
        setThemeDraftP(uiThemeCfg.customDraft.primary);
        setThemeDraftS(uiThemeCfg.customDraft.secondary);
        setHexInputP(uiThemeCfg.customDraft.primary);
        setHexInputS(uiThemeCfg.customDraft.secondary);
      }, [uiThemeCfg.customDraft.primary, uiThemeCfg.customDraft.secondary, uiThemeCfg.activeId]);

      React.useEffect(() => {
        if (!themeOpen) setStudioThemePreview(null, null);
        return () => setStudioThemePreview(null, null);
      }, [themeOpen]);

      const previewUiTheme = (nextP, nextS) => {
        const p = normalizeHex6(nextP, themeDraftP);
        const s = normalizeHex6(nextS, themeDraftS);
        setThemeDraftP(p);
        setThemeDraftS(s);
        setHexInputP(p);
        setHexInputS(s);
        setStudioThemePreview(p, s);
      };

      const saveUiTheme = (nextTheme) => {
        setStudioThemePreview(null, null);
        updateConfig({ studioUiTheme: sanitizeStudioUiTheme(nextTheme) }, true);
      };

      const selectOfficialUiTheme = (off) => {
        saveUiTheme({
          ...uiThemeCfg,
          activeId: off.id,
          customDraft: { primary: off.primary, secondary: off.secondary }
        });
      };

      const applyCustomUiTheme = () => {
        saveUiTheme({
          ...uiThemeCfg,
          activeId: 'custom',
          customDraft: { primary: themeDraftP, secondary: themeDraftS }
        });
      };

      const saveToUiThemeSlot = (idx, isOverwrite = false) => {
        const slots = Array.from({ length: 4 }, (_, i) => uiThemeCfg.slots[i] || null);
        const existing = slots[idx];
        const fallbackName = isOverwrite && existing ? existing.name : `自定义 ${idx + 1}`;
        const name = (themeSlotName || '').trim().slice(0, 18) || fallbackName;
        slots[idx] = { id: `slot-${idx}`, name, primary: themeDraftP, secondary: themeDraftS };
        setThemeSlotName('');
        saveUiTheme({
          ...uiThemeCfg,
          activeId: `slot-${idx}`,
          customDraft: { primary: themeDraftP, secondary: themeDraftS },
          slots
        });
      };

      const useUiThemeSlot = (idx) => {
        const sl = uiThemeCfg.slots[idx];
        if (!sl) return;
        saveUiTheme({
          ...uiThemeCfg,
          activeId: sl.id,
          customDraft: { primary: sl.primary, secondary: sl.secondary }
        });
      };

      const clearUiThemeSlot = (idx) => {
        const slots = Array.from({ length: 4 }, (_, i) => uiThemeCfg.slots[i] || null);
        slots[idx] = null;
        const nextActive = uiThemeCfg.activeId === `slot-${idx}` ? 'official-azure' : uiThemeCfg.activeId;
        saveUiTheme({ ...uiThemeCfg, activeId: nextActive, slots });
      };

      const [wpLibrary, setWpLibrary] = React.useState({ activeId: '', items: [], max: 12 });
      const [avatarCropTask, setAvatarCropTask] = React.useState(null);
      const [pendingDelete, setPendingDelete] = React.useState(null);

      const openAvatarCropper = (role, file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const src = String(reader.result || '');
          if (!src) return;
          const isGif = /^data:image\/gif/i.test(src) || /\.gif$/i.test(file.name || '');
          setAvatarCropTask({ role, src, fileName: file.name || '', isGif });
        };
        reader.readAsDataURL(file);
      };

      const refreshWpLibrary = React.useCallback(async () => {
        try {
          const r = await fetch(`${API_BASE}/wallpaper/list`, { cache: 'no-store' });
          if (!r.ok) return;
          const d = await r.json();
          if (d?.ok && Array.isArray(d.items)) {
            setWpLibrary({ activeId: d.activeId || '', items: d.items, max: d.max || 12 });
          }
        } catch {}
      }, []);

      React.useEffect(() => {
        if (activeTab === 'wallpaper') void refreshWpLibrary();
      }, [activeTab, refreshWpLibrary]);

      const onPickWallpaper = (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
          setUploadMsg('上传并保存中…');
          try {
            const res = await fetch(`${API_BASE}/wallpaper/upload`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ dataUrl: reader.result, name: file.name || '' })
            });
            const data = await res.json();
            if (res.ok && data.ok) {
              updateConfig({
                wallpaperEnabled: true,
                wallpaperSource: 'uploaded',
                hasUploadedWallpaper: true,
                wallpaperMime: data.mime || '',
                wallpaperVersion: data.wallpaperVersion || Date.now()
              }, true);
              if (data.library && Array.isArray(data.library.items)) {
                setWpLibrary({ activeId: data.library.activeId || '', items: data.library.items, max: wpLibrary.max || 12 });
              } else {
                void refreshWpLibrary();
              }
              setUploadMsg('已保存并生效~');
            } else {
              setUploadMsg(`失败：${data.error || res.status}`);
            }
          } catch (err) { setUploadMsg(`失败：${err?.message || err}`); }
        };
        reader.readAsDataURL(file);
      };

      const onSelectSavedWallpaper = async (id) => {
        setUploadMsg('切换中…');
        try {
          const res = await fetch(`${API_BASE}/wallpaper/select`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
          });
          const data = await res.json();
          if (res.ok && data.ok) {
            updateConfig({
              wallpaperEnabled: true,
              wallpaperSource: 'uploaded',
              hasUploadedWallpaper: true,
              wallpaperMime: data.mime || '',
              wallpaperVersion: data.wallpaperVersion || Date.now()
            }, true);
            if (data.library && Array.isArray(data.library.items)) {
              setWpLibrary({ activeId: data.library.activeId || '', items: data.library.items, max: wpLibrary.max || 12 });
            }
            setUploadMsg('已切换~');
          } else {
            setUploadMsg(`切换失败：${data.error || res.status}`);
          }
        } catch (err) { setUploadMsg(`切换失败：${err?.message || err}`); }
      };

      const onDeleteSavedWallpaper = async (id) => {
        try {
          const res = await fetch(`${API_BASE}/wallpaper/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
          });
          const data = await res.json();
          if (res.ok && data.ok) {
            updateConfig({
              hasUploadedWallpaper: Boolean(data.hasUploadedWallpaper),
              wallpaperMime: data.wallpaperMime || '',
              wallpaperVersion: data.wallpaperVersion || Date.now()
            }, true);
            if (data.library && Array.isArray(data.library.items)) {
              setWpLibrary({ activeId: data.library.activeId || '', items: data.library.items, max: wpLibrary.max || 12 });
            } else {
              void refreshWpLibrary();
            }
          }
        } catch {}
      };

      const compressAvatarFile = (file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const rawUrl = String(reader.result || '');
          if (!rawUrl || /^data:image\/gif/i.test(rawUrl)) {
            resolve(rawUrl);
            return;
          }
          const img = new Image();
          img.onload = () => {
            try {
              const maxSide = 192;
              const scale = Math.min(1, maxSide / Math.max(img.width || 1, img.height || 1));
              const w = Math.max(1, Math.round((img.width || maxSide) * scale));
              const h = Math.max(1, Math.round((img.height || maxSide) * scale));
              const cvs = document.createElement('canvas');
              cvs.width = w;
              cvs.height = h;
              const c2 = cvs.getContext('2d');
              if (c2) {
                c2.drawImage(img, 0, 0, w, h);
                const out = cvs.toDataURL('image/webp', 0.88);
                if (out && out.startsWith('data:image/')) {
                  resolve(out);
                  return;
                }
              }
            } catch {}
            resolve(rawUrl);
          };
          img.onerror = () => resolve(rawUrl);
          img.src = rawUrl;
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });

      const saveAvatarToLibrary = (role, url, rawName = '') => {
        const clean = String(url || '').trim();
        if (!clean) return;
        const listKey = role === 'user' ? 'savedUserAvatars' : 'savedAssistantAvatars';
        const urlKey = role === 'user' ? 'userAvatarUrl' : 'assistantAvatarUrl';
        const curList = Array.isArray(cfg[listKey]) ? cfg[listKey] : [];
        const filtered = curList.filter((x) => x && x.url !== clean);
        const name = (String(rawName || '').replace(/\.[^./\\]+$/, '').trim() || `头像 ${filtered.length + 1}`).slice(0, 24);
        const nextList = [{ id: `av_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`, name, url: clean }, ...filtered].slice(0, 8);
        updateConfig({ [urlKey]: clean, [listKey]: nextList }, true);
      };

      const deleteAvatarFromLibrary = (role, id) => {
        const listKey = role === 'user' ? 'savedUserAvatars' : 'savedAssistantAvatars';
        const curList = Array.isArray(cfg[listKey]) ? cfg[listKey] : [];
        updateConfig({ [listKey]: curList.filter((x) => x && x.id !== id) }, true);
      };

      const toggleRow = (label, hint, key) => {
        const checked = Boolean(cfg[key]);
        return jsxs('div', {
          className: 'dsh-sg-row',
          children: [
            jsxs('div', { children: [jsx('label', { children: label }), hint ? jsx('div', { className: 'dsh-sg-sub', children: hint }) : null] }),
            jsx('button', {
              type: 'button',
              role: 'switch',
              className: 'dsh-sg-switch',
              'aria-checked': checked ? 'true' : 'false',
              'aria-label': label,
              onClick: () => updateConfig({ [key]: !checked }, true),
              children: jsx('span', { className: 'dsh-sg-switch-thumb' })
            })
          ]
        });
      };

      const rangeRow = (label, key, min, max, step, unit = '') => {
        const stepStr = String(step);
        const decimals = stepStr.includes('.') ? stepStr.split('.')[1].length : 0;
        const normalizeNum = (raw) => {
          const n = Number(raw);
          if (!Number.isFinite(n)) return cfg[key];
          const clamped = Math.min(max, Math.max(min, n));
          return decimals > 0 ? Number(clamped.toFixed(decimals)) : Math.round(clamped);
        };
        const clearDraft = () => setNumDrafts((prev) => {
          if (!(key in prev)) return prev;
          const next = { ...prev };
          delete next[key];
          return next;
        });
        const commitNum = (raw) => {
          clearDraft();
          if (String(raw).trim() === '') return;
          const nextVal = normalizeNum(raw);
          if (nextVal !== cfg[key]) updateConfig({ [key]: nextVal }, true);
        };
        const curVal = cfg[key] ?? min;
        const inputVal = numDrafts[key] !== undefined ? numDrafts[key] : String(curVal);
        return jsxs('div', {
          className: 'dsh-sg-row',
          children: [
            jsx('label', { children: `${label}：${curVal}${unit}` }),
            jsxs('div', {
              className: 'dsh-sg-range-ctrl',
              children: [
                jsx('input', {
                  type: 'range',
                  min,
                  max,
                  step,
                  value: curVal,
                  onChange: (e) => {
                    clearDraft();
                    updateConfig({ [key]: Number(e.target.value) });
                  }
                }),
                jsx('input', {
                  type: 'number',
                  className: 'dsh-sg-num-input',
                  min,
                  max,
                  step,
                  value: inputVal,
                  title: `范围：${min} ~ ${max}${unit}`,
                  onChange: (e) => {
                    const txt = e.target.value;
                    setNumDrafts((prev) => ({ ...prev, [key]: txt }));
                    if (txt.trim() === '') return;
                    const parsed = Number(txt);
                    if (Number.isFinite(parsed) && parsed >= min && parsed <= max) {
                      updateConfig({ [key]: decimals > 0 ? Number(parsed.toFixed(decimals)) : Math.round(parsed) });
                    }
                  },
                  onBlur: (e) => commitNum(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === 'Enter') {
                      commitNum(e.currentTarget.value);
                      e.currentTarget.blur();
                    } else if (e.key === 'Escape') {
                      clearDraft();
                      e.currentTarget.blur();
                    }
                  }
                }),
                unit ? jsx('span', { className: 'dsh-sg-num-unit', children: unit.trim() }) : null
              ]
            })
          ]
        });
      };

      const uiColorRow = (slot) => {
        const val = (cfg.uiColors && cfg.uiColors[slot.key]) || '';
        return jsxs('div', {
          className: 'dsh-sg-row',
          children: [
            jsx('label', { children: slot.label }),
            jsxs('div', {
              style: { display: 'flex', alignItems: 'center', gap: '6px' },
              children: [
                jsx('input', {
                  type: 'color',
                  value: val || slot.fallback,
                  onChange: (e) => updateConfig({ uiColors: { ...(cfg.uiColors || {}), [slot.key]: e.target.value } })
                }),
                jsx('span', { className: 'dsh-sg-sub', style: { width: '56px' }, children: val || '默认' }),
                jsx('button', {
                  type: 'button',
                  className: 'dsh-sg-btn',
                  onClick: () => {
                    const next = { ...(cfg.uiColors || {}) };
                    delete next[slot.key];
                    updateConfig({ uiColors: next }, true);
                  },
                  children: '重置'
                })
              ]
            })
          ]
        });
      };

      const proseColorRow = (slot) => {
        const val = (cfg.proseColors && cfg.proseColors[slot.key]) || '';
        return jsxs('div', {
          className: 'dsh-sg-row',
          children: [
            jsx('label', { children: slot.label }),
            jsxs('div', {
              style: { display: 'flex', alignItems: 'center', gap: '6px' },
              children: [
                jsx('input', {
                  type: 'color',
                  value: val || slot.fallback,
                  onChange: (e) => updateConfig({ proseColors: { ...(cfg.proseColors || {}), [slot.key]: e.target.value } })
                }),
                jsx('span', { className: 'dsh-sg-sub', style: { width: '56px' }, children: val || '默认' }),
                jsx('button', {
                  type: 'button',
                  className: 'dsh-sg-btn',
                  onClick: () => {
                    const next = { ...(cfg.proseColors || {}) };
                    delete next[slot.key];
                    updateConfig({ proseColors: next }, true);
                  },
                  children: '重置'
                })
              ]
            })
          ]
        });
      };

      // WCAG 实时对比度提示
      const bgRef = (cfg.uiColors && cfg.uiColors.bgBase) || (detectTheme() === 'light' ? '#ffffff' : '#141720');
      const fgRef = (cfg.uiColors && cfg.uiColors.labelPrimary) || (detectTheme() === 'light' ? '#1e293b' : '#e2e8f0');
      const accRef = (cfg.uiColors && cfg.uiColors.brandPrimary) || '#38bdf8';
      const fgRatio = contrastRatio(fgRef, bgRef);
      const accRatio = contrastRatio(accRef, bgRef);
      const fmtRatio = (r) => !r ? '--' : `${r.toFixed(1)}:1 ${r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : '⚠️偏低'}`;

      const allSavedPresets = Array.isArray(cfg.savedPresets) ? cfg.savedPresets : [];
      const glassCustomPresets = allSavedPresets.filter((p) => p && p.scope === 'glass');
      const colorCustomPresets = allSavedPresets.filter((p) => p && (!p.scope || p.scope === 'color'));

      const saveGlassPreset = () => {
        const name = glassPresetName.trim();
        if (!name) return;
        const snapshot = pickPresetFields(cfg, GLASS_PRESET_KEYS);
        const next = [
          ...allSavedPresets.filter((p) => !(p && p.scope === 'glass' && p.name === name)),
          { name, scope: 'glass', data: snapshot }
        ];
        updateConfig({ savedPresets: next }, true);
        setGlassPresetName('');
      };

      const deleteGlassPreset = (name) => {
        const next = allSavedPresets.filter((p) => !(p && p.scope === 'glass' && p.name === name));
        updateConfig({ savedPresets: next }, true);
      };

      const saveColorPreset = () => {
        const name = presetName.trim();
        if (!name) return;
        const snapshot = pickPresetFields(cfg, COLOR_PRESET_KEYS);
        const next = [
          ...allSavedPresets.filter((p) => !(p && (!p.scope || p.scope === 'color') && p.name === name)),
          { name, scope: 'color', data: snapshot }
        ];
        updateConfig({ savedPresets: next }, true);
        setPresetName('');
      };

      const deleteColorPreset = (name) => {
        const next = allSavedPresets.filter((p) => !(p && (!p.scope || p.scope === 'color') && p.name === name));
        updateConfig({ savedPresets: next }, true);
      };

      return jsxs('div', {
        children: [
          jsxs('div', {
            className: 'dsh-sg-studio-head',
            children: [
              jsx(AzureGlassIcon, {}),
              jsx('h3', { className: 'dsh-sg-studio-title', children: zh.heading }),
              jsx('span', { className: 'dsh-sg-badge', children: cfg.turboMode ? '⚡ 极速模式' : '✨ 琉璃态' }),
              jsxs('div', {
                className: 'dsh-sg-head-actions',
                children: [
                  jsxs('button', {
                    type: 'button',
                    className: 'dsh-sg-theme-btn',
                    'data-active': themeOpen ? '1' : '0',
                    title: `切换琉璃自身 UI 主题（当前：${resolvedUiTheme.name}）`,
                    onClick: () => setThemeOpen((v) => !v),
                    children: [
                      jsx('span', { className: 'dsh-sg-theme-dot' }),
                      jsx('span', { children: '主题' })
                    ]
                  }),
                  jsx('button', {
                    type: 'button',
                    className: 'dsh-sg-mode-btn',
                    title: dshMode === 'dark' ? '点击切换 DSH 为浅色模式' : '点击切换 DSH 为暗色模式',
                    onClick: () => {
                      const next = toggleDshThemeMode();
                      setDshMode(next);
                    },
                    children: dshMode === 'dark' ? '🌙 暗色' : '☀️ 浅色'
                  }),
                  jsx('button', {
                    type: 'button',
                    className: 'dsh-sg-ver-btn',
                    title: `苍蓝琉璃 v${pluginVer}（点击检查版本）`,
                    onClick: onClickVersionBtn,
                    children: `v${pluginVer}`
                  })
                ]
              })
            ]
          }),

          verToast ? jsxs('div', {
            className: 'dsh-sg-ver-toast',
            style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' },
            children: [
              jsx('span', { children: verToast }),
              verReleaseUrl ? jsx('a', {
                href: verReleaseUrl,
                target: '_blank',
                rel: 'noreferrer',
                style: { color: 'inherit', textDecoration: 'underline', fontWeight: 600, flexShrink: 0 },
                children: '前往更新 ↗'
              }) : null
            ]
          }) : null,

          themeOpen ? jsxs('div', {
            className: 'dsh-sg-theme-center',
            children: [
              jsxs('div', {
                className: 'dsh-sg-tc-head',
                children: [
                  jsxs('div', {
                    children: [
                      jsxs('div', {
                        className: 'dsh-sg-tc-title',
                        children: [
                          jsx('span', { className: 'dsh-sg-theme-dot' }),
                          jsx('span', { children: '琉璃 UI 主题色调中心' })
                        ]
                      }),
                      jsx('div', {
                        className: 'dsh-sg-sub',
                        style: { marginTop: '2px' },
                        children: `当前生效：${resolvedUiTheme.name} · 仅作用于苍蓝琉璃自身面板与浮层`
                      })
                    ]
                  }),
                  jsx('button', {
                    type: 'button',
                    className: 'dsh-sg-btn',
                    onClick: () => setThemeOpen(false),
                    children: '收起'
                  })
                ]
              }),

              jsxs('div', {
                className: 'dsh-sg-tc-sec',
                children: [
                  jsxs('div', {
                    className: 'dsh-sg-tc-sec-hd',
                    children: [jsx('span', { children: '官方预设主题' }), jsx('span', { children: '2 套内置' })]
                  }),
                  jsx('div', {
                    className: 'dsh-sg-tc-grid',
                    children: STUDIO_UI_OFFICIAL_THEMES.map((off) => {
                      const isAct = uiThemeCfg.activeId === off.id;
                      return jsxs('button', {
                        key: off.id,
                        type: 'button',
                        className: 'dsh-sg-tc-card',
                        'data-active': isAct ? '1' : '0',
                        onClick: () => selectOfficialUiTheme(off),
                        children: [
                          jsx('div', { className: 'dsh-sg-tc-bar', style: { background: makeStudioThemeGrad(off.primary, off.secondary) } }),
                          jsxs('div', {
                            className: 'dsh-sg-tc-card-top',
                            children: [
                              jsx('span', { className: 'dsh-sg-tc-name', children: off.name }),
                              jsx('span', { className: 'dsh-sg-tc-pill', children: isAct ? '✓ 当前' : off.badge })
                            ]
                          }),
                          jsx('div', { className: 'dsh-sg-tc-desc', children: off.desc })
                        ]
                      });
                    })
                  })
                ]
              }),

              jsxs('div', {
                className: 'dsh-sg-tc-sec',
                children: [
                  jsxs('div', {
                    className: 'dsh-sg-tc-sec-hd',
                    children: [jsx('span', { children: '自定义双色搭配' }), jsx('span', { children: 'A 主体（60%）→ B 辅助（40%）' })]
                  }),
                  jsxs('div', {
                    className: 'dsh-sg-tc-custom',
                    children: [
                      jsxs('div', {
                        className: 'dsh-sg-tc-color-row',
                        children: [
                          jsxs('div', {
                            className: 'dsh-sg-tc-color-col',
                            children: [
                              jsx('span', { className: 'dsh-sg-tc-lbl', children: 'A 主体色' }),
                              jsxs('div', {
                                className: 'dsh-sg-tc-input-wrap',
                                children: [
                                  jsx('input', {
                                    type: 'color',
                                    className: 'dsh-sg-tc-picker',
                                    value: themeDraftP,
                                    onChange: (e) => previewUiTheme(e.target.value, themeDraftS)
                                  }),
                                  jsx('input', {
                                    type: 'text',
                                    className: 'dsh-sg-tc-hex',
                                    maxLength: 7,
                                    value: hexInputP,
                                    onChange: (e) => {
                                      const v = e.target.value;
                                      setHexInputP(v);
                                      if (/^#?[0-9a-fA-F]{6}$/.test(v.trim())) previewUiTheme(v, themeDraftS);
                                    },
                                    onBlur: () => setHexInputP(themeDraftP)
                                  })
                                ]
                              }),
                              jsx('div', {
                                className: 'dsh-sg-tc-swatches',
                                children: STUDIO_UI_SWATCHES.map((hex) =>
                                  jsx('button', {
                                    key: `p-${hex}`,
                                    type: 'button',
                                    className: 'dsh-sg-tc-swatch',
                                    style: { background: hex },
                                    title: `主体色 ${hex}`,
                                    onClick: () => previewUiTheme(hex, themeDraftS)
                                  })
                                )
                              })
                            ]
                          }),
                          jsx('button', {
                            type: 'button',
                            className: 'dsh-sg-tc-swap',
                            title: '对调 A 与 B 的主辅占比',
                            onClick: () => previewUiTheme(themeDraftS, themeDraftP),
                            children: '⇄'
                          }),
                          jsxs('div', {
                            className: 'dsh-sg-tc-color-col',
                            children: [
                              jsx('span', { className: 'dsh-sg-tc-lbl', children: 'B 辅助色' }),
                              jsxs('div', {
                                className: 'dsh-sg-tc-input-wrap',
                                children: [
                                  jsx('input', {
                                    type: 'color',
                                    className: 'dsh-sg-tc-picker',
                                    value: themeDraftS,
                                    onChange: (e) => previewUiTheme(themeDraftP, e.target.value)
                                  }),
                                  jsx('input', {
                                    type: 'text',
                                    className: 'dsh-sg-tc-hex',
                                    maxLength: 7,
                                    value: hexInputS,
                                    onChange: (e) => {
                                      const v = e.target.value;
                                      setHexInputS(v);
                                      if (/^#?[0-9a-fA-F]{6}$/.test(v.trim())) previewUiTheme(themeDraftP, v);
                                    },
                                    onBlur: () => setHexInputS(themeDraftS)
                                  })
                                ]
                              }),
                              jsx('div', {
                                className: 'dsh-sg-tc-swatches',
                                children: STUDIO_UI_SWATCHES.map((hex) =>
                                  jsx('button', {
                                    key: `s-${hex}`,
                                    type: 'button',
                                    className: 'dsh-sg-tc-swatch',
                                    style: { background: hex },
                                    title: `辅助色 ${hex}`,
                                    onClick: () => previewUiTheme(themeDraftP, hex)
                                  })
                                )
                              })
                            ]
                          })
                        ]
                      }),
                      jsxs('div', {
                        className: 'dsh-sg-tc-apply-row',
                        children: [
                          jsx('input', {
                            type: 'text',
                            className: 'dsh-sg-input',
                            style: { flex: 1, minWidth: 0 },
                            maxLength: 18,
                            placeholder: '自定义预设名称（选填）',
                            value: themeSlotName,
                            onChange: (e) => setThemeSlotName(e.target.value)
                          }),
                          jsx('button', {
                            type: 'button',
                            className: 'dsh-sg-btn dsh-sg-btn-primary',
                            onClick: applyCustomUiTheme,
                            children: '应用当前自定义'
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),

              jsxs('div', {
                className: 'dsh-sg-tc-sec',
                children: [
                  jsxs('div', {
                    className: 'dsh-sg-tc-sec-hd',
                    children: [jsx('span', { children: '自定义预设栏位' }), jsx('span', { children: '4 个可存槽位' })]
                  }),
                  jsx('div', {
                    className: 'dsh-sg-tc-grid',
                    children: [0, 1, 2, 3].map((idx) => {
                      const sl = uiThemeCfg.slots[idx];
                      if (!sl) {
                        return jsx('button', {
                          key: `slot-${idx}`,
                          type: 'button',
                          className: 'dsh-sg-tc-card empty',
                          onClick: () => saveToUiThemeSlot(idx, false),
                          children: `＋ 保存当前搭配到栏位 ${idx + 1}`
                        });
                      }
                      const isAct = uiThemeCfg.activeId === sl.id;
                      return jsxs('div', {
                        key: sl.id,
                        className: 'dsh-sg-tc-card',
                        'data-active': isAct ? '1' : '0',
                        onClick: () => useUiThemeSlot(idx),
                        children: [
                          jsx('div', { className: 'dsh-sg-tc-bar', style: { background: makeStudioThemeGrad(sl.primary, sl.secondary) } }),
                          jsxs('div', {
                            className: 'dsh-sg-tc-card-top',
                            children: [
                              jsx('span', { className: 'dsh-sg-tc-name', children: sl.name }),
                              isAct ? jsx('span', { className: 'dsh-sg-tc-pill', children: '✓ 当前' }) : null
                            ]
                          }),
                          jsx('div', { className: 'dsh-sg-tc-desc', children: `${sl.primary} → ${sl.secondary}` }),
                          jsxs('div', {
                            className: 'dsh-sg-tc-slot-acts',
                            children: [
                              jsx('button', {
                                type: 'button',
                                className: 'dsh-sg-tc-slot-act',
                                onClick: (e) => { e.stopPropagation(); saveToUiThemeSlot(idx, true); },
                                children: '覆盖'
                              }),
                              jsx('button', {
                                type: 'button',
                                className: 'dsh-sg-tc-slot-act del',
                                onClick: (e) => { e.stopPropagation(); clearUiThemeSlot(idx); },
                                children: '清空'
                              })
                            ]
                          })
                        ]
                      });
                    })
                  })
                ]
              })
            ]
          }) : null,

          jsx('div', {
            className: 'dsh-sg-tabs',
            children: TABS.map((tb) =>
              jsx('button', {
                key: tb.id, type: 'button', className: 'dsh-sg-tab',
                'data-active': activeTab === tb.id ? '1' : '0',
                onClick: () => setActiveTab(tb.id),
                children: tb.label
              })
            )
          }),

          activeTab === 'perf' ? jsxs('div', {
            children: [
              jsxs('div', {
                className: 'dsh-sg-stat-grid',
                children: [
                  jsxs('div', { className: 'dsh-sg-stat-box', children: [jsx('div', { className: 'dsh-sg-stat-num', children: st.totalItems }), jsx('div', { className: 'dsh-sg-sub', children: '总消息' })] }),
                  jsxs('div', { className: 'dsh-sg-stat-box', children: [jsx('div', { className: 'dsh-sg-stat-num', children: st.activeItems }), jsx('div', { className: 'dsh-sg-sub', children: '活跃 DOM' })] }),
                  jsxs('div', { className: 'dsh-sg-stat-box', children: [jsx('div', { className: 'dsh-sg-stat-num', children: st.parkedItems }), jsx('div', { className: 'dsh-sg-sub', children: '已裁剪' })] }),
                  jsxs('div', { className: 'dsh-sg-stat-box', children: [jsx('div', { className: 'dsh-sg-stat-num', children: st.collapsedCodes }), jsx('div', { className: 'dsh-sg-sub', children: '折叠代码' })] })
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '长会话视口 DOM 虚拟化与秒切跳转' }),
                  toggleRow('⚡ 一键极速模式（Turbo）', '临时关闭壁纸和全部玻璃模糊，获得最高帧率', 'turboMode'),
                  toggleRow('启用视口按需渲染虚拟化', '对视口外历史消息启用按需跳过布局与绘制；跳转时直达目标不卡顿', 'virtualizeEnabled'),
                  rangeRow('上下缓冲区', 'overscanViewports', 1, 4, 0.2, ' 屏'),
                  rangeRow('尾部常驻保护', 'keepTailItems', 4, 24, 1, ' 条'),
                  toggleRow('图片懒加载与异步解码', '减少长会话图片同时解码引起的卡顿', 'lazyImages'),
                  toggleRow('滚动时自动动态降级模糊', '滚动瞬间临时关闭 backdrop-filter（开启后滚动可能出现模糊闪烁，默认关闭更稳）', 'dynamicDegradeOnScroll'),
                  toggleRow('右侧栏大文档视口加速', '对右侧栏长代码块、Markdown 与表格按视口按需渲染，提升浏览流畅度', 'rightSidebarBoostEnabled')
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsxs('div', {
                    style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' },
                    children: [
                      jsx('h4', { style: { margin: 0 }, children: `Antigravity式会话秒切引擎（已保活 ${st.cachedSessions} / ${cfg.sessionKeepAliveMax}）` }),
                      jsx('button', {
                        type: 'button',
                        className: 'dsh-sg-btn',
                        onClick: () => clearSessionKeepAlive(),
                        children: '清空热缓存'
                      })
                    ]
                  }),
                  toggleRow('启用会话 LRU 内存保活（0ms 瞬切）', '切走会话时保留内存状态与历史窗口，切回来不触发重新解压与「载入历史...」', 'sessionKeepAliveEnabled'),
                  rangeRow('LRU 最大保活会话数', 'sessionKeepAliveMax', 0, 20, 1, ' 个'),
                  rangeRow('启动后台静默预热数', 'sessionWarmupCount', 0, 12, 1, ' 个'),
                  toggleRow('左侧栏悬停 140ms 提前预热', '鼠标移到左侧会话标题上即抢跑预加载，点下去秒开', 'sessionHoverPrefetch')
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '界面兼容优化与后台省电' }),
                  toggleRow('窗口隐藏时暂停动画省电', '切后台时自动暂停离屏动效', 'pauseWhenHidden'),
                  toggleRow('修复 0.2.2 会话区底部幽灵空白', '消除底部 ~1100px 虚空', 'fixGhostGap'),
                  toggleRow('修复设置弹窗滚动卡死', '确保设置页面内容区可正常滚动', 'fixSettingsScroll')
                ]
              })
            ]
          }) : null,

          activeTab === 'wallpaper' ? jsxs('div', {
            children: [
              weCompat.wallpaperActive ? jsxs('div', {
                className: 'dsh-sg-compat-bar',
                'data-mode': 'we',
                children: [
                  jsxs('div', {
                    className: 'dsh-sg-compat-head',
                    children: [
                      jsx('span', { className: 'dsh-sg-compat-title', children: '🤝 Wallpaper Engine 壁纸运行中 · 已自动让位' })
                    ]
                  }),
                  jsx('div', {
                    className: 'dsh-sg-compat-desc',
                    children: '检测到 Wallpaper Engine 插件正在显示壁纸，苍蓝琉璃的壁纸与视差层已自动暂停，优先保证 Wallpaper Engine 壁纸正常使用；在那边关闭壁纸后将自动恢复。'
                  })
                ]
              }) : null,
              jsxs('div', {
                className: weCompat.wallpaperActive ? 'dsh-sg-compat-dimmed' : '',
                children: [
                  jsxs('div', {
                    className: 'dsh-sg-card',
                    children: [
                      jsx('h4', { children: '图片与视频壁纸' }),
                  toggleRow('启用自定义壁纸', '自动透明化 DSH 外框，壁纸即时透出', 'wallpaperEnabled'),
                  jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsx('label', { children: '上传本地图片或视频（PNG/JPG/WebP/GIF/MP4/WebM）' }),
                      jsxs('div', {
                        style: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
                        children: [
                          uploadMsg ? jsx('span', { className: 'dsh-sg-sub', children: uploadMsg }) : null,
                          jsxs('label', {
                            className: 'dsh-sg-btn dsh-sg-file-btn',
                            children: [
                              '上传并保存',
                              jsx('input', {
                                className: 'dsh-sg-file-input',
                                type: 'file',
                                accept: 'image/*,video/mp4,video/webm',
                                onChange: onPickWallpaper
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  }),
                  wpLibrary.items.length > 0 ? jsxs('div', {
                    className: 'dsh-sg-wp-lib-wrap',
                    children: [
                      jsxs('div', {
                        className: 'dsh-sg-wp-lib-head',
                        children: [
                          jsx('span', { children: `已保存的本地壁纸（${wpLibrary.items.length}/${wpLibrary.max || 12}）` }),
                          jsx('span', { className: 'dsh-sg-sub', children: '点击缩略图一键切换' })
                        ]
                      }),
                      pendingDelete?.kind === 'wallpaper' ? jsxs('div', {
                        className: 'dsh-sg-confirm-bar',
                        children: [
                          jsx('span', { children: `⚠️ 确定删除壁纸「${pendingDelete.name}」吗？删除后无法恢复。` }),
                          jsxs('div', {
                            style: { display: 'flex', gap: '6px', flexShrink: 0 },
                            children: [
                              jsx('button', { type: 'button', className: 'dsh-sg-btn', onClick: () => setPendingDelete(null), children: '取消' }),
                              jsx('button', {
                                type: 'button',
                                className: 'dsh-sg-btn dsh-sg-btn-danger',
                                onClick: () => {
                                  const targetId = pendingDelete.id;
                                  setPendingDelete(null);
                                  void onDeleteSavedWallpaper(targetId);
                                },
                                children: '确认删除'
                              })
                            ]
                          })
                        ]
                      }) : null,
                      jsx('div', {
                        className: 'dsh-sg-wp-lib-grid',
                        children: wpLibrary.items.map((item) => {
                          const isAct = (cfg.wallpaperSource || 'uploaded') === 'uploaded' && wpLibrary.activeId === item.id;
                          const isVid = String(item.mime || '').startsWith('video/');
                          const src = `${API_BASE}/wallpaper/item?id=${encodeURIComponent(item.id)}`;
                          return jsxs('div', {
                            key: item.id,
                            className: 'dsh-sg-wp-card',
                            'data-active': isAct ? '1' : '0',
                            title: `${item.name}${isVid ? '（视频）' : ''} · 点击切换`,
                            onClick: () => onSelectSavedWallpaper(item.id),
                            children: [
                              isVid
                                ? jsx('video', { className: 'dsh-sg-wp-thumb', src, muted: true, preload: 'metadata' })
                                : jsx('img', { className: 'dsh-sg-wp-thumb', src, loading: 'lazy', alt: item.name }),
                              isAct
                                ? jsx('span', { className: 'dsh-sg-wp-tag', children: '✓ 使用中' })
                                : (isVid ? jsx('span', { className: 'dsh-sg-wp-tag', children: '🎬 视频' }) : null),
                              jsx('button', {
                                type: 'button',
                                className: 'dsh-sg-wp-del',
                                title: '删除此壁纸',
                                onClick: (e) => { e.stopPropagation(); setPendingDelete({ kind: 'wallpaper', id: item.id, name: item.name || '未命名壁纸' }); },
                                children: '×'
                              }),
                              jsx('div', { className: 'dsh-sg-wp-label', children: item.name })
                            ]
                          });
                        })
                      })
                    ]
                  }) : null,
                  jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsx('label', { children: '或填入图片 / 视频 URL' }),
                      jsx('input', {
                        className: 'dsh-sg-input', style: { width: '210px' }, placeholder: 'https://...',
                        value: cfg.wallpaperUrl || '',
                        onChange: (e) => updateConfig({ wallpaperUrl: e.target.value, wallpaperSource: e.target.value ? 'url' : 'uploaded' })
                      })
                    ]
                  }),
                  jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsx('label', { children: '填充方式' }),
                      jsx(NekoSelect, {
                        value: cfg.wallpaperFit || 'cover',
                        options: [
                          { value: 'cover', label: '铺满裁剪（cover）' },
                          { value: 'contain', label: '完整居中（contain）' },
                          { value: 'auto', label: '原始尺寸（auto）' }
                        ],
                        onChange: (v) => updateConfig({ wallpaperFit: v }, true)
                      })
                    ]
                  }),
                  rangeRow('水平位置 X', 'wallpaperPosX', 0, 100, 1, '%'),
                  rangeRow('垂直位置 Y', 'wallpaperPosY', 0, 100, 1, '%'),
                  rangeRow('画面缩放', 'wallpaperScale', 100, 160, 2, '%'),
                  rangeRow('壁纸不透明度', 'wallpaperOpacity', 0.05, 1, 0.05, ''),
                  rangeRow('壁纸亮度', 'wallpaperBrightness', 30, 150, 5, '%'),
                  rangeRow('壁纸饱和度', 'wallpaperSaturate', 0, 200, 5, '%'),
                  rangeRow('通用壁纸模糊', 'wallpaperBlurPx', 0, 24, 1, 'px'),
                  rangeRow('空对话页壁纸模糊', 'wallpaperBlurEmptyPx', 0, 24, 1, 'px'),
                  rangeRow('有对话时壁纸模糊', 'wallpaperBlurContentPx', 0, 24, 1, 'px'),
                  rangeRow('可读性遮罩浓度（Scrim）', 'wallpaperScrim', 0, 0.85, 0.05, ''),
                  toggleRow('视频壁纸静音', '播放 MP4/WebM 壁纸时默认静音', 'wallpaperVideoMuted'),
                  !cfg.wallpaperVideoMuted ? rangeRow('视频壁纸音量', 'wallpaperVideoVolume', 0, 1, 0.05, '') : null
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '动态氛围背景（光晕 / 等高线）' }),
                  jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsx('label', { children: '动态背景模式' }),
                      jsx(NekoSelect, {
                        value: cfg.bgEffectMode || 'none',
                        options: [
                          { value: 'none', label: '关闭' },
                          { value: 'glow', label: '双色氛围光晕（Glow）' },
                          { value: 'topo', label: '流动等高线地形（Topo）' }
                        ],
                        onChange: (v) => updateConfig({ bgEffectMode: v }, true)
                      })
                    ]
                  }),
                  cfg.bgEffectMode === 'glow' ? jsxs('div', {
                    children: [
                      jsxs('div', { className: 'dsh-sg-row', children: [jsx('label', { children: '光晕主色 / 辅色' }), jsxs('div', { style: { display: 'flex', gap: '8px' }, children: [jsx('input', { type: 'color', value: cfg.glowColorA || '#38bdf8', onChange: (e) => updateConfig({ glowColorA: e.target.value }) }), jsx('input', { type: 'color', value: cfg.glowColorB || '#a855f7', onChange: (e) => updateConfig({ glowColorB: e.target.value }) })] })] }),
                      rangeRow('光晕浓度', 'glowOpacity', 0.05, 0.85, 0.05, ''),
                      rangeRow('渐变角度', 'glowAngle', 0, 360, 5, '°')
                    ]
                  }) : null,
                  cfg.bgEffectMode === 'topo' ? jsxs('div', {
                    children: [
                      jsxs('div', { className: 'dsh-sg-row', children: [jsx('label', { children: '等高线颜色' }), jsx('input', { type: 'color', value: cfg.topoColor || '#38bdf8', onChange: (e) => updateConfig({ topoColor: e.target.value }) })] }),
                      rangeRow('线条浓度', 'topoOpacity', 0.05, 0.65, 0.05, ''),
                      rangeRow('地形密度', 'topoDensity', 4, 24, 1, ' 层'),
                      rangeRow('流动速度', 'topoSpeed', 0, 3, 0.2, 'x')
                    ]
                  }) : null
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '3D 鼠标视差纵深' }),
                  toggleRow('启用 3D 鼠标视差', '光标移动时壁纸沿中心对称方向轻柔偏移（自动微放大防露边）', 'parallaxEnabled'),
                  rangeRow('背景缓动距离', 'parallaxTravelPct', 0.5, 6, 0.5, '%'),
                  toggleRow('界面元素跟随偏移', '聊天区、侧栏与输入框随视差轻挪（微幅纵深）', 'parallaxUiFollow')
                ]
              })
                ]
              })
            ]
          }) : null,

          activeTab === 'glass' ? jsxs('div', {
            children: [
              renderWeCompatSwitch(
                '毛玻璃质感',
                'weControlGlass',
                '当前由苍蓝琉璃控制分区毛玻璃，已自动屏蔽 Wallpaper Engine 的叠加玻璃样式。',
                '当前毛玻璃质感由 Wallpaper Engine 控制，下方设置已暂停并变灰。'
              ),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '对话输入框（独立控制）' }),
                  renderWeCompatSwitch(
                    '对话输入框',
                    'weControlComposer',
                    '当前由苍蓝琉璃控制对话输入框，已主动屏蔽 Wallpaper Engine 对对话框的样式与按钮改色。',
                    '当前对话输入框由 Wallpaper Engine 控制，苍蓝琉璃已放行对方对对话框的修改，下方设置已暂停并变灰。'
                  ),
                  jsxs('div', {
                    className: (weCompat.installed && cfg.weControlComposer === false) ? 'dsh-sg-compat-dimmed' : '',
                    children: [
                      rangeRow('主输入框不透明度', 'glassComposerOpacity', 0.05, 0.98, 0.02, ''),
                      rangeRow('主输入框模糊半径', 'glassComposerBlurPx', 0, 32, 1, 'px')
                    ]
                  })
                ]
              }),
              jsxs('div', {
                className: (weCompat.installed && cfg.weControlGlass === false) ? 'dsh-sg-compat-dimmed' : '',
                children: [
                  jsxs('div', {
                    className: 'dsh-sg-card',
                    children: [
                      jsx('h4', { children: '一键配置与自定义预设' }),
                  jsxs('div', {
                    className: 'dsh-sg-chips',
                    style: { marginBottom: '10px' },
                    children: [
                      jsx('button', {
                        type: 'button',
                        className: 'dsh-sg-btn',
                        onClick: () => updateConfig({ ...GLASS_DEFAULT_PRESET }, true),
                        children: '系统默认'
                      })
                    ]
                  }),
                  jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsx('input', {
                        className: 'dsh-sg-input',
                        style: { flex: 1 },
                        placeholder: '输入玻璃质感预设名（如：通透磨砂）',
                        value: glassPresetName,
                        onChange: (e) => setGlassPresetName(e.target.value),
                        onKeyDown: (e) => { if (e.key === 'Enter') saveGlassPreset(); }
                      }),
                      jsx('button', { type: 'button', className: 'dsh-sg-btn dsh-sg-btn-primary', onClick: saveGlassPreset, children: '保存当前配置' })
                    ]
                  }),
                  glassCustomPresets.length > 0 ? jsx('div', {
                    className: 'dsh-sg-chips',
                    style: { marginTop: '8px' },
                    children: glassCustomPresets.map((p) =>
                      jsxs('span', {
                        key: p.name,
                        style: { display: 'inline-flex', gap: '4px', alignItems: 'center' },
                        children: [
                          jsx('button', {
                            type: 'button',
                            className: 'dsh-sg-btn',
                            onClick: () => updateConfig(pickPresetFields(p.data || {}, GLASS_PRESET_KEYS), true),
                            children: p.name
                          }),
                          jsx('button', {
                            type: 'button',
                            className: 'dsh-sg-btn',
                            title: '删除预设',
                            onClick: () => deleteGlassPreset(p.name),
                            children: '×'
                          })
                        ]
                      })
                    )
                  }) : null
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '总开关与全局质感' }),
                  toggleRow('启用窗口玻璃模糊', '作用于侧边栏、右侧栏、输入框、气泡与弹窗，不影响消息滚动流畅度', 'glassEnabled'),
                  rangeRow('玻璃色彩饱和度', 'glassSaturate', 80, 200, 5, '%'),
                  rangeRow('玻璃边框高光强度', 'glassBorderAlpha', 0, 0.35, 0.02, ''),
                  rangeRow('面板圆角半径', 'glassRadiusPx', 0, 24, 1, 'px'),
                  toggleRow('极简细滚动条', '柔和细滑块，隐藏滚动条箭头与粗轨道', 'minimalScrollbar')
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '顶部标题栏' }),
                  rangeRow('顶部标题栏不透明度（0 全透明 / 1 实底）', 'glassHeaderOpacity', 0, 1, 0.02, ''),
                  rangeRow('顶部标题栏模糊半径', 'glassHeaderBlurPx', 0, 32, 1, 'px')
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '左侧栏、右侧栏与聊天主区' }),
                  rangeRow('左侧栏不透明度', 'glassSurfaceOpacity', 0, 0.98, 0.02, ''),
                  rangeRow('右侧栏背景不透明度', 'glassRightSidebarOpacity', 0, 0.98, 0.02, ''),
                  rangeRow('左侧栏 / 右侧栏模糊半径', 'glassBlurPx', 0, 32, 1, 'px'),
                  rangeRow('聊天主区背景不透明度', 'glassChatBgOpacity', 0, 0.98, 0.02, '')
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '侧边对话输入框' }),
                  rangeRow('侧边对话输入框不透明度', 'glassSidechatComposerOpacity', 0.05, 1, 0.02, ''),
                  rangeRow('侧边对话输入框模糊半径', 'glassSidechatComposerBlurPx', 0, 32, 1, 'px'),
                  rangeRow('侧边对话输入框右侧留白', 'sidechatComposerRightGapPx', 0, 260, 4, 'px')
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '消息气泡' }),
                  rangeRow('用户消息气泡不透明度', 'glassBubbleOpacity', 0.1, 1, 0.04, ''),
                  rangeRow('用户消息气泡模糊半径', 'glassBubbleBlurPx', 0, 24, 1, 'px')
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '浮层、菜单与弹窗' }),
                  rangeRow('浮层 / 菜单 / 弹窗不透明度（1.00 为纯实心）', 'glassOverlayOpacity', 0.2, 1, 0.02, ''),
                  rangeRow('浮层 / 菜单 / 弹窗模糊半径', 'glassOverlayBlurPx', 0, 32, 1, 'px')
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '代码 Diff 区域' }),
                  rangeRow('代码 Diff 区域不透明度（1.00 为纯实心）', 'glassDiffOpacity', 0.2, 1, 0.02, ''),
                  rangeRow('代码 Diff 区域模糊半径', 'glassDiffBlurPx', 0, 32, 1, 'px')
                ]
              })
                ]
              })
            ]
          }) : null,

          activeTab === 'color' ? jsxs('div', {
            children: [
              renderWeCompatSwitch(
                '色彩、文本改色与字体',
                'weControlColor',
                '当前由苍蓝琉璃控制界面配色、文本改色、字体与光标，已自动屏蔽 Wallpaper Engine 的对应样式。',
                '当前色彩与字体由 Wallpaper Engine 插件控制，下方设置已暂停并变灰。'
              ),
              jsxs('div', {
                className: (weCompat.installed && cfg.weControlColor === false) ? 'dsh-sg-compat-dimmed' : '',
                children: [
                  jsxs('div', {
                    className: 'dsh-sg-card',
                    children: [
                      jsx('h4', { children: '一键配色主题与自定义预设' }),
                  jsxs('div', {
                    className: 'dsh-sg-sub',
                    style: { marginBottom: '8px' },
                    children: [`WCAG 对比度实时校验：正文/背景 `, jsx('strong', { children: fmtRatio(fgRatio) }), ` ｜ 强调色/背景 `, jsx('strong', { children: fmtRatio(accRatio) })]
                  }),
                  jsxs('div', {
                    className: 'dsh-sg-chips',
                    style: { marginBottom: '10px' },
                    children: [
                      ...Object.entries(BUILTIN_PALETTES).map(([id, pal]) =>
                        jsx('button', {
                          key: id, type: 'button', className: 'dsh-sg-btn',
                          onClick: () => updateConfig({ colorPreset: id, uiColors: pal.uiColors, proseColors: pal.proseColors, caretColor: pal.caretColor }, true),
                          children: pal.label
                        })
                      ),
                      jsx('button', {
                        type: 'button', className: 'dsh-sg-btn',
                        onClick: () => {
                          const c = randomAccentHex();
                          updateConfig({ uiColors: { ...(cfg.uiColors || {}), brandPrimary: c, brandText: c, link: c }, caretColor: c }, true);
                        },
                        children: '🎲 随机强调色'
                      })
                    ]
                  }),
                  jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsx('input', {
                        className: 'dsh-sg-input',
                        style: { flex: 1 },
                        placeholder: '输入色彩排版预设名（如：小仓唯夜空）',
                        value: presetName,
                        onChange: (e) => setPresetName(e.target.value),
                        onKeyDown: (e) => { if (e.key === 'Enter') saveColorPreset(); }
                      }),
                      jsx('button', { type: 'button', className: 'dsh-sg-btn dsh-sg-btn-primary', onClick: saveColorPreset, children: '保存当前配置' })
                    ]
                  }),
                  colorCustomPresets.length > 0 ? jsx('div', {
                    className: 'dsh-sg-chips',
                    style: { marginTop: '8px' },
                    children: colorCustomPresets.map((p) =>
                      jsxs('span', {
                        key: p.name,
                        style: { display: 'inline-flex', gap: '4px', alignItems: 'center' },
                        children: [
                          jsx('button', {
                            type: 'button',
                            className: 'dsh-sg-btn',
                            onClick: () => updateConfig(pickPresetFields(p.data || {}, COLOR_PRESET_KEYS), true),
                            children: p.name
                          }),
                          jsx('button', {
                            type: 'button',
                            className: 'dsh-sg-btn',
                            title: '删除预设',
                            onClick: () => deleteColorPreset(p.name),
                            children: '×'
                          })
                        ]
                      })
                    )
                  }) : null
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '过程行高亮与正文亮度' }),
                  jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsx('label', { children: '正文高亮亮度档位' }),
                      jsx(NekoSelect, {
                        value: cfg.proseBoost || 'off',
                        options: [
                          { value: 'off', label: '原值（关闭）' },
                          { value: 'soft', label: '柔和提亮（Soft）' },
                          { value: 'strong', label: '鲜明提亮（Strong）' }
                        ],
                        onChange: (v) => updateConfig({ proseBoost: v }, true)
                      })
                    ]
                  }),
                  toggleRow('启用过程行高亮', '给工具调用行、本轮汇总行和文件卡片独立着色', 'rowHighlightEnabled'),
                  cfg.rowHighlightEnabled ? jsxs('div', {
                    children: [
                      jsxs('div', { className: 'dsh-sg-row', children: [jsx('label', { children: '工具行高亮色' }), jsx('input', { type: 'color', value: cfg.toolRowColor || '#7EE787', onChange: (e) => updateConfig({ toolRowColor: e.target.value }) })] }),
                      jsxs('div', { className: 'dsh-sg-row', children: [jsx('label', { children: '汇总行高亮色' }), jsx('input', { type: 'color', value: cfg.summaryRowColor || '#FAC863', onChange: (e) => updateConfig({ summaryRowColor: e.target.value }) })] }),
                      jsxs('div', { className: 'dsh-sg-row', children: [jsx('label', { children: '文件卡片高亮色' }), jsx('input', { type: 'color', value: cfg.fileCardColor || '#6699CC', onChange: (e) => updateConfig({ fileCardColor: e.target.value }) })] })
                    ]
                  }) : null
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '18 个界面色彩槽位（直通 --dsw-alias-*）' }),
                  ...UI_COLOR_SLOTS.map(uiColorRow)
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '9 个 Markdown 正文角色（Prose Roles）' }),
                  ...PROSE_COLOR_SLOTS.map(proseColorRow)
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '字体与输入光标' }),
                  jsxs('div', {
                    className: 'dsh-sg-chips',
                    style: { marginBottom: '8px' },
                    children: QUICK_FONTS.map((f) =>
                      jsx('button', {
                        key: f.label, type: 'button', className: 'dsh-sg-btn',
                        onClick: () => updateConfig({ fontFamily: f.val }, true),
                        children: f.label
                      })
                    )
                  }),
                  jsxs('div', { className: 'dsh-sg-row', children: [jsx('label', { children: '正文字体族' }), jsx('input', { className: 'dsh-sg-input', style: { width: '190px' }, placeholder: 'Microsoft YaHei, Inter', value: cfg.fontFamily || '', onChange: (e) => updateConfig({ fontFamily: e.target.value }) })] }),
                  jsxs('div', { className: 'dsh-sg-row', children: [jsx('label', { children: '等宽代码字体族' }), jsx('input', { className: 'dsh-sg-input', style: { width: '190px' }, placeholder: 'JetBrains Mono, Consolas', value: cfg.monoFontFamily || '', onChange: (e) => updateConfig({ monoFontFamily: e.target.value }) })] }),
                  rangeRow('正文字号', 'fontSizePx', 12, 20, 1, 'px'),
                  rangeRow('正文行高', 'lineHeight', 1.35, 2.1, 0.05, ''),
                  rangeRow('代码块字号', 'codeFontSizePx', 11, 18, 1, 'px')
                ]
              })
                ]
              })
            ]
          }) : null,

          activeTab === 'layout' ? jsxs('div', {
            children: [
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: 'Antigravity风布局、合并式锚点轨道与丝滑交互' }),
                  toggleRow('使用 Antigravity 风格合并式锚点', '开启后替代 DSH 原生锚点，早期轮次自动合并为竖条；关闭则恢复 DSH 原生锚点', 'anchorRailEnabled'),
                  jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsxs('div', {
                        children: [
                          jsx('label', { children: '锚点轨道位置' }),
                          jsx('div', { className: 'dsh-sg-sub', children: '切换轨道贴在聊天区左侧或右侧，悬停与展开卡片会自动朝内侧弹出' })
                        ]
                      }),
                      jsxs('div', {
                        className: 'dsh-sg-chips',
                        children: [
                          jsx('button', {
                            type: 'button',
                            className: 'dsh-sg-btn',
                            'data-active': (cfg.anchorRailPosition || 'right') === 'left' ? '1' : '0',
                            onClick: () => {
                              hideRailHoverCard(true);
                              updateConfig({ anchorRailPosition: 'left' }, true);
                            },
                            children: '左侧'
                          }),
                          jsx('button', {
                            type: 'button',
                            className: 'dsh-sg-btn',
                            'data-active': (cfg.anchorRailPosition || 'right') !== 'left' ? '1' : '0',
                            onClick: () => {
                              hideRailHoverCard(true);
                              updateConfig({ anchorRailPosition: 'right' }, true);
                            },
                            children: '右侧'
                          })
                        ]
                      })
                    ]
                  }),
                  rangeRow('轨道最近圆点数', 'anchorRecentDots', 6, 28, 1, ' 个'),
                  rangeRow('早期轮次合并粒度', 'anchorMergeChunk', 10, 40, 5, ' 条/组'),
                  toggleRow('启用Antigravity风清爽排版', '优化长文本行高、代码块圆角与柔和边框', 'antigravityLayout'),
                  toggleRow('启用 Mermaid 图示渲染', '自动将对话与文档预览中的 mermaid 代码块原地渲染为 SVG 图示，跟随深浅色重绘', 'mermaidEnabled'),
                  rangeRow('聊天内容最大宽度（0=不限）', 'chatMaxWidthPx', 0, 1400, 40, 'px'),
                  toggleRow('自动折叠超长代码块', '超出阈值高度的代码块默认折叠，点击可展开', 'compactCodeEnabled'),
                  rangeRow('代码块折叠阈值', 'compactMaxHeightPx', 180, 720, 20, 'px'),
                  toggleRow('显示顶部目录 / 琉璃 / 刷新快捷胶囊', '在顶部显示目录、苍蓝琉璃与刷新快捷入口', 'chapterOutlineEnabled'),
                  toggleRow('流式输出丝滑滚底跟随', '靠近底部时柔和跟随新内容，往上翻阅时自动松手', 'smoothScrollFollow'),
                  toggleRow('输入框失焦自动折叠高度', '未输入时自动压低输入框高度', 'composerAutoFold')
                ]
              }),
              (() => {
                const selectedSet = new Set(islandSnap.selected);
                const selectedCount = islandSnap.items.filter((it) => selectedSet.has(it.id)).length;
                const groups = ISLAND_ZONE_ORDER
                  .map((zone) => ({ zone, items: islandSnap.items.filter((it) => it.zone === zone) }))
                  .filter((g) => g.items.length > 0);
                return jsxs('div', {
                  className: 'dsh-sg-card',
                  children: [
                    jsx('h4', { children: '🫧 琉璃收纳匣（对话栏控件收纳）' }),
                    toggleRow('启用琉璃收纳匣', '将对话输入框底部的插件按钮收纳进琉璃收纳匣，悬停或点击向上展开', 'composerIslandEnabled'),
                    cfg.composerIslandEnabled !== false ? jsxs('div', {
                      children: [
                        jsxs('div', {
                          className: 'dsh-sg-row',
                          children: [
                            jsx('div', {
                              className: 'dsh-sg-sub',
                              children: `已检测 ${islandSnap.items.length} 个控件，已收起 ${selectedCount} 个`
                            }),
                            jsxs('div', {
                              className: 'dsh-sg-chips',
                              children: [
                                jsx('button', {
                                  type: 'button',
                                  className: 'dsh-sg-btn',
                                  onClick: () => composerIslandStore.rescan(),
                                  children: '重新扫描'
                                }),
                                jsx('button', {
                                  type: 'button',
                                  className: 'dsh-sg-btn',
                                  onClick: () => composerIslandStore.reset(),
                                  children: '恢复默认'
                                })
                              ]
                            })
                          ]
                        }),
                        groups.length === 0 ? jsx('div', {
                          className: 'dsh-sg-sub',
                          style: { padding: '8px 0 4px' },
                          children: '当前输入框尚未检测到可配置控件（切到对话页面后会自动检测，或点“重新扫描”）'
                        }) : groups.map((g) => jsxs('div', {
                          key: g.zone,
                          style: { marginTop: '10px' },
                          children: [
                            jsx('div', {
                              className: 'dsh-sg-sub',
                              style: { fontWeight: 600, marginBottom: '4px', opacity: 0.9 },
                              children: ISLAND_ZONE_LABELS[g.zone]
                            }),
                            ...g.items.map((item) => {
                              const isInIsland = selectedSet.has(item.id);
                              return jsxs('div', {
                                key: item.id,
                                className: 'dsh-sg-row',
                                children: [
                                  jsx('div', {
                                    style: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12.5px' },
                                    title: item.label,
                                    children: item.label
                                  }),
                                  jsxs('div', {
                                    style: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
                                    children: [
                                      jsx('span', {
                                        className: 'dsh-sg-sub',
                                        style: { minWidth: '28px', textAlign: 'right' },
                                        children: isInIsland ? '匣内' : '原位'
                                      }),
                                      jsx('button', {
                                        type: 'button',
                                        className: 'dsh-sg-switch',
                                        role: 'switch',
                                        'aria-checked': isInIsland ? 'true' : 'false',
                                        'data-on': isInIsland ? '1' : '0',
                                        onClick: () => composerIslandStore.setSelected(item.id, !isInIsland),
                                        children: jsx('span', { className: 'dsh-sg-switch-knob' })
                                      })
                                    ]
                                  })
                                ]
                              });
                            })
                          ]
                        }))
                      ]
                    }) : null
                  ]
                });
              })()
            ]
          }) : null,

          activeTab === 'fx' ? jsxs('div', {
            children: [
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '点击光效' }),
                  toggleRow('启用点击特效', '鼠标点击时在落点绽放霓虹光效，窗口隐藏自动停帧', 'fxClickEnabled'),
                  jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsx('label', { children: '点击特效样式' }),
                      jsx(NekoSelect, {
                        value: cfg.fxClickStyle || 'both',
                        options: [
                          { value: 'both', label: '✨ 涟漪 + 星火（经典双效）' },
                          { value: 'ripple', label: '💫 霓虹双环涟漪（Ripple）' },
                          { value: 'sparkle', label: '🎆 爆裂星火流光（Sparks）' },
                          { value: 'starburst', label: '🌟 星芒烟花绽放（Starburst）' },
                          { value: 'petal', label: '🌸 樱落飞舞花瓣（Petal）' },
                          { value: 'heart', label: '💖 微光上浮爱心（Heart）' }
                        ],
                        onChange: (v) => updateConfig({ fxClickStyle: v }, true)
                      })
                    ]
                  })
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '鼠标光迹拖尾' }),
                  toggleRow('启用鼠标光迹拖尾', '移动光标时跟随霓虹光带或星尘，无移动即停帧零耗电', 'fxTrailEnabled'),
                  jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsx('label', { children: '拖尾样式' }),
                      jsx(NekoSelect, {
                        value: cfg.fxTrailStyle || 'comet',
                        options: [
                          { value: 'comet', label: '☄️ 发光彗尾（渐隐光带）' },
                          { value: 'dust', label: '✨ 闪烁星尘（微粒飘散）' }
                        ],
                        onChange: (v) => updateConfig({ fxTrailStyle: v }, true)
                      })
                    ]
                  })
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '光效配色与霓虹质感' }),
                  jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsx('label', { children: '光效配色模式' }),
                      jsx(NekoSelect, {
                        value: cfg.fxColorMode || 'accent',
                        options: [
                          { value: 'accent', label: '🎨 跟随琉璃主题双色' },
                          { value: 'rainbow', label: '🌈 彩虹霓虹流转' },
                          { value: 'custom', label: '🖌️ 自定义单色' }
                        ],
                        onChange: (v) => updateConfig({ fxColorMode: v }, true)
                      })
                    ]
                  }),
                  (cfg.fxColorMode || 'accent') === 'custom'
                    ? jsxs('div', { className: 'dsh-sg-row', children: [jsx('label', { children: '自定义特效颜色' }), jsx('input', { type: 'color', value: cfg.fxColor || '#38bdf8', onChange: (e) => updateConfig({ fxColor: e.target.value }) })] })
                    : null,
                  rangeRow('特效光晕强度（霓虹辉光）', 'fxGlow', 0, 100, 5, '%'),
                  rangeRow('特效不透明度', 'fxOpacity', 0.2, 1, 0.05, ''),
                  rangeRow('特效尺寸倍率', 'fxSize', 0.5, 2.5, 0.1, 'x'),
                  jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsx('label', { children: '画面混合模式' }),
                      jsx(NekoSelect, {
                        value: cfg.fxBlend || 'screen',
                        options: [
                          { value: 'screen', label: '滤色（霓虹发光·推荐）' },
                          { value: 'normal', label: '正常（实色贴纸感）' },
                          { value: 'lighten', label: '变亮（柔和提亮）' },
                          { value: 'overlay', label: '叠加（高对比光影）' }
                        ],
                        onChange: (v) => updateConfig({ fxBlend: v }, true)
                      })
                    ]
                  })
                ]
              }),
              jsxs('div', {
                className: 'dsh-sg-card',
                children: [
                  jsx('h4', { children: '自定义会话头像（支持 1:1 裁切与多张切换）' }),
                  renderWeCompatSwitch(
                    '自定义会话头像',
                    'weControlAvatar',
                    '当前由苍蓝琉璃控制会话头像，已自动屏蔽 Wallpaper Engine 的头像节点。',
                    '当前会话头像由 Wallpaper Engine 插件控制，下方头像设置已暂停并变灰。'
                  ),
                  jsxs('div', {
                    className: (weCompat.installed && cfg.weControlAvatar === false) ? 'dsh-sg-compat-dimmed' : '',
                    children: [
                      (pendingDelete?.kind === 'user-avatar' || pendingDelete?.kind === 'assistant-avatar') ? jsxs('div', {
                    className: 'dsh-sg-confirm-bar',
                    children: [
                      jsx('span', { children: `⚠️ 确定删除${pendingDelete.kind === 'user-avatar' ? '用户' : '助手'}头像「${pendingDelete.name}」吗？` }),
                      jsxs('div', {
                        style: { display: 'flex', gap: '6px', flexShrink: 0 },
                        children: [
                          jsx('button', { type: 'button', className: 'dsh-sg-btn', onClick: () => setPendingDelete(null), children: '取消' }),
                          jsx('button', {
                            type: 'button',
                            className: 'dsh-sg-btn dsh-sg-btn-danger',
                            onClick: () => {
                              const role = pendingDelete.kind === 'user-avatar' ? 'user' : 'assistant';
                              const targetId = pendingDelete.id;
                              setPendingDelete(null);
                              deleteAvatarFromLibrary(role, targetId);
                            },
                            children: '确认删除'
                          })
                        ]
                      })
                    ]
                  }) : null,
                  avatarCropTask ? jsx(AvatarCropper, {
                    src: avatarCropTask.src,
                    role: avatarCropTask.role,
                    fileName: avatarCropTask.fileName,
                    isGif: avatarCropTask.isGif,
                    onCancel: () => setAvatarCropTask(null),
                    onConfirm: (croppedUrl) => {
                      saveAvatarToLibrary(avatarCropTask.role, croppedUrl, avatarCropTask.fileName);
                      setAvatarCropTask(null);
                    },
                    onKeepOriginal: () => {
                      saveAvatarToLibrary(avatarCropTask.role, avatarCropTask.src, avatarCropTask.fileName);
                      setAvatarCropTask(null);
                    }
                  }) : null,
                  jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsx('label', { children: '用户头像（URL 或本地小图）' }),
                      jsxs('div', {
                        style: { display: 'flex', gap: '6px', alignItems: 'center' },
                        children: [
                          jsx('input', { className: 'dsh-sg-input', style: { width: '130px' }, placeholder: 'https://...', value: cfg.userAvatarUrl || '', onChange: (e) => updateConfig({ userAvatarUrl: e.target.value }) }),
                          jsxs('label', {
                            className: 'dsh-sg-btn dsh-sg-file-btn',
                            children: [
                              '上传并保存',
                              jsx('input', {
                                className: 'dsh-sg-file-input',
                                type: 'file',
                                accept: 'image/*',
                                onChange: (e) => {
                                  const f = e.target.files?.[0];
                                  e.target.value = '';
                                  if (f) openAvatarCropper('user', f);
                                }
                              })
                            ]
                          }),
                          cfg.userAvatarUrl ? jsx('button', { type: 'button', className: 'dsh-sg-btn', title: '将当前头像存入用户头像库', onClick: () => saveAvatarToLibrary('user', cfg.userAvatarUrl), children: '存库' }) : null,
                          jsx('button', { type: 'button', className: 'dsh-sg-btn', onClick: () => updateConfig({ userAvatarUrl: '' }, true), children: '清除' })
                        ]
                      })
                    ]
                  }),
                  Array.isArray(cfg.savedUserAvatars) && cfg.savedUserAvatars.length > 0 ? jsxs('div', {
                    className: 'dsh-sg-av-lib',
                    children: [
                      jsx('span', { className: 'dsh-sg-sub', style: { marginRight: '2px' }, children: `已存用户头像 (${cfg.savedUserAvatars.length}/8)：` }),
                      ...cfg.savedUserAvatars.map((av) =>
                        jsxs('div', {
                          key: av.id,
                          className: 'dsh-sg-av-chip',
                          'data-active': cfg.userAvatarUrl === av.url ? '1' : '0',
                          title: `${av.name} · 点击切换`,
                          onClick: () => updateConfig({ userAvatarUrl: av.url }, true),
                          children: [
                            jsx('img', { className: 'dsh-sg-av-img', src: av.url, alt: av.name }),
                            jsx('button', {
                              type: 'button',
                              className: 'dsh-sg-av-del',
                              title: '移除此头像',
                              onClick: (e) => { e.stopPropagation(); setPendingDelete({ kind: 'user-avatar', id: av.id, name: av.name || '未命名头像' }); },
                              children: '×'
                            })
                          ]
                        })
                      )
                    ]
                  }) : null,
                  jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsx('label', { children: '助手头像（URL 或本地小图）' }),
                      jsxs('div', {
                        style: { display: 'flex', gap: '6px', alignItems: 'center' },
                        children: [
                          jsx('input', { className: 'dsh-sg-input', style: { width: '130px' }, placeholder: 'https://...', value: cfg.assistantAvatarUrl || '', onChange: (e) => updateConfig({ assistantAvatarUrl: e.target.value }) }),
                          jsxs('label', {
                            className: 'dsh-sg-btn dsh-sg-file-btn',
                            children: [
                              '上传并保存',
                              jsx('input', {
                                className: 'dsh-sg-file-input',
                                type: 'file',
                                accept: 'image/*',
                                onChange: (e) => {
                                  const f = e.target.files?.[0];
                                  e.target.value = '';
                                  if (f) openAvatarCropper('assistant', f);
                                }
                              })
                            ]
                          }),
                          cfg.assistantAvatarUrl ? jsx('button', { type: 'button', className: 'dsh-sg-btn', title: '将当前头像存入助手头像库', onClick: () => saveAvatarToLibrary('assistant', cfg.assistantAvatarUrl), children: '存库' }) : null,
                          jsx('button', { type: 'button', className: 'dsh-sg-btn', onClick: () => updateConfig({ assistantAvatarUrl: '' }, true), children: '清除' })
                        ]
                      })
                    ]
                  }),
                  Array.isArray(cfg.savedAssistantAvatars) && cfg.savedAssistantAvatars.length > 0 ? jsxs('div', {
                    className: 'dsh-sg-av-lib',
                    children: [
                      jsx('span', { className: 'dsh-sg-sub', style: { marginRight: '2px' }, children: `已存助手头像 (${cfg.savedAssistantAvatars.length}/8)：` }),
                      ...cfg.savedAssistantAvatars.map((av) =>
                        jsxs('div', {
                          key: av.id,
                          className: 'dsh-sg-av-chip',
                          'data-active': cfg.assistantAvatarUrl === av.url ? '1' : '0',
                          title: `${av.name} · 点击切换`,
                          onClick: () => updateConfig({ assistantAvatarUrl: av.url }, true),
                          children: [
                            jsx('img', { className: 'dsh-sg-av-img', src: av.url, alt: av.name }),
                            jsx('button', {
                              type: 'button',
                              className: 'dsh-sg-av-del',
                              title: '移除此头像',
                              onClick: (e) => { e.stopPropagation(); setPendingDelete({ kind: 'assistant-avatar', id: av.id, name: av.name || '未命名头像' }); },
                              children: '×'
                            })
                          ]
                        })
                      )
                    ]
                  }) : null
                    ]
                  })
                ]
              })
            ]
          }) : null,

          activeTab === 'skins' ? jsx(SkinWorkshopTab, {
            cfg,
            weCompat,
            updateConfig,
            toggleRow
          }) : null,

          activeTab === 'addons' ? jsx(BuiltInAddonsTab, {
            cfg,
            updateConfig
          }) : null,

          activeTab === 'plugins' ? jsx(PluginManagerTab, {
            cfg,
            updateConfig
          }) : null,

          activeTab === 'css' ? jsxs('div', {
            className: 'dsh-sg-card',
            children: [
              jsx('h4', { children: '自定义 CSS' }),
              toggleRow('启用自定义 CSS', '关闭后停止注入，但已保存的代码会保留', 'customCssEnabled'),
              jsxs('div', {
                className: 'dsh-sg-row',
                children: [
                  jsx('span', { className: 'dsh-sg-sub', children: '编辑时实时注入并自动保存；本插件的样式不会被移除' }),
                  jsx('span', {
                    className: 'dsh-sg-sub',
                    children: `${(cfg.customCss || '').length} 字符`
                  })
                ]
              }),
              jsx('textarea', {
                spellCheck: false,
                autoComplete: 'off',
                wrap: 'off',
                placeholder: '/* 示例 */\n:root { --dsw-alias-brand-primary: #22d3ee; }\n[class*="composerSeat"] { border-radius: 16px; }',
                value: cfg.customCss || '',
                onChange: (e) => updateConfig({ customCss: e.target.value }),
                style: {
                  width: '100%',
                  minHeight: '260px',
                  marginTop: '8px',
                  padding: '10px',
                  boxSizing: 'border-box',
                  fontFamily: 'Consolas, "JetBrains Mono", monospace',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  color: detectTheme() === 'light' ? '#0f172a' : '#e2e8f0',
                  background: detectTheme() === 'light' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(10, 14, 22, 0.72)',
                  border: detectTheme() === 'light' ? '1px solid rgba(148, 163, 184, 0.45)' : '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '8px',
                  resize: 'vertical'
                }
              }),
              jsxs('div', {
                style: { display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' },
                children: [
                  jsx('button', {
                    type: 'button', className: 'dsh-sg-btn',
                    onClick: () => updateConfig({ customCss: '' }, true),
                    children: '清空代码'
                  })
                ]
              })
            ]
          }) : null,

          jsxs('div', {
            style: { display: 'flex', justifyContent: 'flex-end', marginTop: '6px' },
            children: [
              jsx('button', {
                type: 'button', className: 'dsh-sg-btn',
                onClick: () => updateConfig({ ...DEFAULT_CONFIG, savedPresets: cfg.savedPresets || [], customCss: cfg.customCss || '', studioUiTheme: cfg.studioUiTheme || DEFAULT_CONFIG.studioUiTheme, savedUserAvatars: cfg.savedUserAvatars || [], savedAssistantAvatars: cfg.savedAssistantAvatars || [] }, true),
                children: '恢复全部默认设置'
              })
            ]
          })
        ]
      });
    }

    function SkinWorkshopTab({ cfg, weCompat, updateConfig, toggleRow }) {
      const [loading, setLoading] = React.useState(true);
      const [localSkins, setLocalSkins] = React.useState([]);
      const [catalog, setCatalog] = React.useState([]);
      const [sites, setSites] = React.useState([]);
      const [statusMsg, setStatusMsg] = React.useState('');
      const [busyId, setBusyId] = React.useState('');
      const [confirmDeleteId, setConfirmDeleteId] = React.useState('');
      const zipInputRef = React.useRef(null);

      const refreshSkins = React.useCallback(async () => {
        setLoading(true);
        try {
          const r = await fetch(`${API_BASE}/skins/list`, { cache: 'no-store' });
          const d = await r.json();
          if (d?.ok) {
            setLocalSkins(Array.isArray(d.local) ? d.local : []);
            setCatalog(Array.isArray(d.catalog) ? d.catalog : []);
            setSites(Array.isArray(d.sites) ? d.sites : []);
          }
        } catch (err) {
          setStatusMsg(`加载皮肤列表失败：${err?.message || err}`);
        } finally {
          setLoading(false);
        }
      }, []);

      React.useEffect(() => { void refreshSkins(); }, [refreshSkins]);

      const onApplySkin = (id) => {
        const nextId = cfg.activeSkinId === id ? '' : id;
        updateConfig({ activeSkinId: nextId }, true);
        setStatusMsg(nextId ? `已切换皮肤：${nextId}` : '已还原为苍蓝琉璃自调风格');
      };

      const onDeleteLocal = async (id) => {
        setBusyId(id);
        try {
          const r = await fetch(`${API_BASE}/skins/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
          });
          const d = await r.json();
          if (!d?.ok) throw new Error(d?.error || '删除失败');
          if (cfg.activeSkinId === id) updateConfig({ activeSkinId: '' }, true);
          setConfirmDeleteId('');
          await refreshSkins();
          setStatusMsg(`已删除本地皮肤：${id}`);
        } catch (err) {
          setStatusMsg(`删除失败：${err?.message || err}`);
        } finally {
          setBusyId('');
        }
      };

      const onImportZip = (e) => {
        const file = e.target?.files?.[0];
        if (e.target) e.target.value = '';
        if (!file) return;
        setBusyId('__import__');
        setStatusMsg('正在校验并安全导入皮肤包（已自动忽略任意可执行脚本）...');
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const r = await fetch(`${API_BASE}/skins/import`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ dataUrl: String(reader.result || ''), name: file.name })
            });
            const d = await r.json();
            if (!d?.ok) throw new Error(d?.error || '导入失败');
            await refreshSkins();
            updateConfig({ activeSkinId: d.id }, true);
            setStatusMsg(`已导入并启用皮肤「${d.name || d.id}」`);
          } catch (err) {
            setStatusMsg(`导入失败：${err?.message || err}`);
          } finally {
            setBusyId('');
          }
        };
        reader.readAsDataURL(file);
      };

      const isDark = detectTheme() === 'dark';

      return jsxs('div', {
        children: [
          weCompat.wallpaperActive ? jsxs('div', {
            className: 'dsh-sg-compat-bar',
            'data-mode': 'we',
            style: { marginBottom: '10px' },
            children: [
              jsx('div', { className: 'dsh-sg-compat-head', children: jsx('span', { className: 'dsh-sg-compat-title', children: '🤝 Wallpaper Engine 壁纸运行中 · 皮肤壁纸层已自动让位' }) }),
              jsx('div', { className: 'dsh-sg-compat-desc', children: '当前优先保证 Wallpaper Engine 动态壁纸透出；开启下方选项后，使用创意工坊皮肤时仅应用其配色与 UI 风格，自动剥离皮肤自带壁纸。' })
            ]
          }) : null,

          jsxs('div', {
            className: 'dsh-sg-card',
            children: [
              jsxs('div', {
                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
                children: [
                  jsx('h4', { style: { margin: 0 }, children: '🎭 皮肤创意工坊（仅皮肤主题）' }),
                  jsxs('div', {
                    style: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
                    children: [
                      cfg.activeSkinId ? jsx('button', {
                        type: 'button',
                        className: 'dsh-sg-btn',
                        onClick: () => updateConfig({ activeSkinId: '' }, true),
                        children: '还原苍蓝琉璃风格'
                      }) : null,
                      jsx('button', {
                        type: 'button',
                        className: 'dsh-sg-btn',
                        disabled: busyId === '__import__',
                        onClick: () => zipInputRef.current?.click(),
                        children: busyId === '__import__' ? '导入中...' : '📦 导入 v2 皮肤 (.zip)'
                      }),
                      jsx('input', {
                        ref: zipInputRef,
                        type: 'file',
                        accept: '.zip',
                        style: { display: 'none' },
                        onChange: onImportZip
                      })
                    ]
                  })
                ]
              }),
              jsx('div', {
                className: 'dsh-sg-sub',
                style: { marginTop: '6px' },
                children: cfg.activeSkinId
                  ? `当前生效皮肤：${cfg.activeSkinId}（导入时自动过滤可执行脚本，仅安全加载样式与本地素材）`
                  : '当前使用苍蓝琉璃自调风格；下方可一键启用本地皮肤、精选主题，或导入从 dsh-market.com 下载的标准 v2 皮肤包。'
              }),
              toggleRow('Wallpaper Engine 运行时自动让位壁纸', '检测到 Wallpaper Engine 壁纸运行中时，自动剥离皮肤自带壁纸层，优先展示 WE 动态壁纸', 'skinRespectWe'),
              statusMsg ? jsx('div', {
                style: { marginTop: '6px', padding: '6px 10px', borderRadius: '8px', background: 'rgba(56,189,248,0.12)', fontSize: '12px' },
                children: statusMsg
              }) : null
            ]
          }),

          jsxs('div', {
            className: 'dsh-sg-card',
            children: [
              jsxs('div', {
                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
                children: [
                  jsx('h4', { style: { margin: 0 }, children: `本地皮肤库（${localSkins.length}）` }),
                  jsx('button', { type: 'button', className: 'dsh-sg-btn', onClick: () => void refreshSkins(), children: loading ? '刷新中...' : '刷新列表' })
                ]
              }),
              localSkins.length === 0 ? jsx('div', {
                className: 'dsh-sg-sub',
                children: '本地 ~/.dsh/skins 暂无外部皮肤，可直接应用下方内置精选主题，或导入 v2 皮肤包。'
              }) : jsx('div', {
                style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '10px' },
                children: localSkins.map((s) => {
                  const active = cfg.activeSkinId === s.id;
                  const preview = isDark ? (s.previewDark || s.previewLight) : (s.previewLight || s.previewDark);
                  return jsxs('div', {
                    key: s.id,
                    style: {
                      borderRadius: '10px',
                      border: active ? `1.5px solid ${s.accent || '#38bdf8'}` : '1px solid rgba(148,163,184,0.22)',
                      background: active
                        ? (detectTheme() === 'light' ? 'rgba(59,130,246,0.12)' : 'rgba(56,189,248,0.10)')
                        : (detectTheme() === 'light' ? 'rgba(255,255,255,0.84)' : 'rgba(15,23,42,0.25)'),
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column'
                    },
                    children: [
                      preview ? jsx('div', {
                        style: {
                          height: '84px',
                          backgroundImage: `url("${preview}")`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          borderBottom: '1px solid rgba(148,163,184,0.16)'
                        }
                      }) : jsx('div', {
                        style: {
                          height: '28px',
                          background: `linear-gradient(120deg, ${s.accent || '#38bdf8'}55, rgba(15,23,42,0.5))`,
                          borderBottom: '1px solid rgba(148,163,184,0.16)'
                        }
                      }),
                      jsxs('div', {
                        style: { padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
                        children: [
                          jsxs('div', {
                            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' },
                            children: [
                              jsx('strong', { style: { fontSize: '12.5px' }, children: s.name }),
                              jsx('span', { style: { fontSize: '10.5px', opacity: 0.7 }, children: `v${s.version}` })
                            ]
                          }),
                          jsx('div', { className: 'dsh-sg-sub', style: { fontSize: '11px', lineHeight: 1.4 }, children: s.tagline || s.author }),
                          jsxs('div', {
                            style: { display: 'flex', gap: '6px', marginTop: 'auto', paddingTop: '6px' },
                            children: [
                              jsx('button', {
                                type: 'button',
                                className: 'dsh-sg-btn',
                                'data-active': active ? '1' : '0',
                                style: { flex: 1 },
                                onClick: () => onApplySkin(s.id),
                                children: active ? '使用中（点击还原）' : '应用皮肤'
                              }),
                              confirmDeleteId === s.id ? jsx('button', {
                                type: 'button',
                                className: 'dsh-sg-btn',
                                style: { borderColor: '#f87171', color: '#fca5a5' },
                                disabled: busyId === s.id,
                                onClick: () => void onDeleteLocal(s.id),
                                children: '确认删'
                              }) : jsx('button', {
                                type: 'button',
                                className: 'dsh-sg-btn',
                                title: '删除此本地皮肤',
                                'aria-label': '删除此本地皮肤',
                                style: { padding: '4px 7px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
                                onClick: () => setConfirmDeleteId(s.id),
                                children: jsxs('svg', {
                                  width: 14,
                                  height: 14,
                                  viewBox: '0 0 24 24',
                                  fill: 'none',
                                  stroke: 'currentColor',
                                  strokeWidth: 2,
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  children: [
                                    jsx('polyline', { points: '3 6 5 6 21 6' }),
                                    jsx('path', { d: 'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6' }),
                                    jsx('path', { d: 'M10 11v6' }),
                                    jsx('path', { d: 'M14 11v6' }),
                                    jsx('path', { d: 'M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' })
                                  ]
                                })
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  });
                })
              })
            ]
          }),

          jsxs('div', {
            className: 'dsh-sg-card',
            children: [
              jsx('h4', { children: '✨ 精选主题皮肤目录（零依赖昼夜双色 · 一键应用）' }),
              jsx('div', {
                style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '8px', marginTop: '8px' },
                children: catalog.map((item) => {
                  const active = cfg.activeSkinId === item.id;
                  return jsxs('div', {
                    key: item.id,
                    style: {
                      padding: '9px 10px',
                      borderRadius: '10px',
                      border: active ? `1.5px solid ${item.accent}` : '1px solid rgba(148,163,184,0.22)',
                      background: active
                        ? (detectTheme() === 'light' ? 'rgba(59,130,246,0.12)' : 'rgba(56,189,248,0.10)')
                        : (detectTheme() === 'light' ? 'rgba(255,255,255,0.84)' : 'rgba(15,23,42,0.22)'),
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px'
                    },
                    children: [
                      jsxs('div', {
                        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' },
                        children: [
                          jsx('strong', { style: { fontSize: '12.5px' }, children: item.name }),
                          jsx('div', {
                            style: { display: 'flex', gap: '3px' },
                            children: (item.swatches || []).map((c, idx) => jsx('span', {
                              key: idx,
                              style: { width: '10px', height: '10px', borderRadius: '999px', background: c, border: '1px solid rgba(255,255,255,0.25)' }
                            }))
                          })
                        ]
                      }),
                      jsx('div', { className: 'dsh-sg-sub', style: { fontSize: '11px', lineHeight: 1.4 }, children: item.tagline }),
                      jsxs('div', {
                        style: { display: 'flex', gap: '6px', marginTop: 'auto', paddingTop: '4px' },
                        children: [
                          jsx('button', {
                            type: 'button',
                            className: 'dsh-sg-btn',
                            'data-active': active ? '1' : '0',
                            style: { flex: 1 },
                            onClick: () => onApplySkin(item.id),
                            children: active ? '使用中（点击还原）' : '应用皮肤'
                          })
                        ]
                      })
                    ]
                  });
                })
              })
            ]
          }),

          jsxs('div', {
            className: 'dsh-sg-card',
            children: [
              jsx('h4', { children: '🌐 互联网 DSH 皮肤分享站收录' }),
              jsx('div', { className: 'dsh-sg-sub', style: { marginBottom: '8px' }, children: '可在以下专门的 DSH 皮肤站浏览更多社区皮肤，下载 v2 皮肤压缩包后点击上方「导入 v2 皮肤 (.zip)」即可直接启用：' }),
              jsx('div', {
                style: { display: 'flex', flexDirection: 'column', gap: '6px' },
                children: sites.map((site) => jsxs('a', {
                  key: site.id,
                  href: site.url,
                  target: '_blank',
                  rel: 'noreferrer',
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(148,163,184,0.2)',
                    background: detectTheme() === 'light' ? 'rgba(255,255,255,0.84)' : 'rgba(15,23,42,0.2)',
                    textDecoration: 'none',
                    color: 'inherit'
                  },
                  children: [
                    jsx('strong', { style: { fontSize: '12.5px', color: detectTheme() === 'light' ? '#0369a1' : '#7dd3fc' }, children: `${site.name} ↗` }),
                    jsx('span', { className: 'dsh-sg-sub', style: { fontSize: '11px' }, children: site.desc })
                  ]
                }))
              })
            ]
          })
        ]
      });
    }

    function PluginManagerTab({ cfg, updateConfig }) {
      const [plugins, setPlugins] = React.useState([]);
      const [profileName, setProfileName] = React.useState('');
      const [loading, setLoading] = React.useState(true);
      const [checking, setChecking] = React.useState(false);
      const [updatingAll, setUpdatingAll] = React.useState(false);
      const [busyMap, setBusyMap] = React.useState({});
      const [query, setQuery] = React.useState('');
      const [statusMsg, setStatusMsg] = React.useState('');
      const [summaryOpen, setSummaryOpen] = React.useState(false);
      const [copied, setCopied] = React.useState(false);
      const copyTimerRef = React.useRef(null);

      const loadList = React.useCallback(async () => {
        setLoading(true);
        try {
          const r = await fetch(`${API_BASE}/plugins/list`, { cache: 'no-store' });
          const d = await r.json();
          if (d?.ok) {
            setPlugins(Array.isArray(d.plugins) ? d.plugins : []);
            setProfileName(d.profileName || '');
          }
        } catch (err) {
          setStatusMsg(`读取插件列表失败：${err?.message || err}`);
        } finally {
          setLoading(false);
        }
      }, []);

      React.useEffect(() => { void loadList(); }, [loadList]);

      const onCheckAll = async (force = true) => {
        setChecking(true);
        setStatusMsg('正在并发检查所有已装第三方插件的最新版本（npm / GitHub）...');
        try {
          const r = await fetch(`${API_BASE}/plugins/check?force=${force ? '1' : '0'}`, { cache: 'no-store' });
          const d = await r.json();
          if (!d?.ok) throw new Error(d?.error || '检查失败');
          const list = Array.isArray(d.plugins) ? d.plugins : [];
          setPlugins(list);
          const updatable = list.filter((p) => p.updateInfo?.hasUpdate).length;
          setSummaryOpen(updatable > 0);
          setStatusMsg(updatable > 0 ? `检查完成：发现 ${updatable} 个插件有新版本~` : `检查完成：全部 ${list.length} 个第三方插件均已是最新版本~`);
        } catch (err) {
          setStatusMsg(`检查更新失败：${err?.message || err}`);
        } finally {
          setChecking(false);
        }
      };

      const onTogglePlugin = async (p) => {
        setBusyMap((m) => ({ ...m, [p.name]: 'toggle' }));
        try {
          const r = await fetch(`${API_BASE}/plugins/toggle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: p.name, enabled: !p.enabled })
          });
          const d = await r.json();
          if (!d?.ok) throw new Error(d?.error || '切换失败');
          await loadList();
          setStatusMsg(`已${!p.enabled ? '启用' : '停用'} ${p.name}${d.needsRestart ? '（重启 DSH 后生效）' : ''}`);
        } catch (err) {
          setStatusMsg(`操作失败：${err?.message || err}`);
        } finally {
          setBusyMap((m) => { const n = { ...m }; delete n[p.name]; return n; });
        }
      };

      const onUpdateOne = async (p) => {
        setBusyMap((m) => ({ ...m, [p.name]: 'update' }));
        setStatusMsg(`正在更新 ${p.name}...`);
        try {
          const r = await fetch(`${API_BASE}/plugins/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: p.name })
          });
          const d = await r.json();
          if (!d?.ok) throw new Error(d?.error || '更新失败');
          await loadList();
          setStatusMsg(`✅ ${p.name} 已更新完成，重启 DSH 后生效~`);
        } catch (err) {
          setStatusMsg(`更新 ${p.name} 失败：${err?.message || err}`);
        } finally {
          setBusyMap((m) => { const n = { ...m }; delete n[p.name]; return n; });
        }
      };

      const allUpdatableList = plugins.filter((p) => p.updateInfo?.hasUpdate);
      const updatableList = allUpdatableList.filter((p) => p.sourceKind === 'npm' || p.sourceKind === 'github');
      const summaryText = React.useMemo(() => formatUpdatableSummaryText(allUpdatableList), [allUpdatableList]);

      const onCopySummary = async () => {
        if (!summaryText) return;
        const ok = await copyTextToClipboard(summaryText);
        if (!ok) {
          setStatusMsg('自动复制失败，可直接在下方卡片中手动框选复制文本');
          return;
        }
        setCopied(true);
        if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
        copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
      };

      const onUpdateAll = async () => {
        if (updatableList.length === 0) return;
        setUpdatingAll(true);
        let okCount = 0;
        for (const p of updatableList) {
          setStatusMsg(`批量更新中（${okCount + 1}/${updatableList.length}）：${p.name}...`);
          try {
            const r = await fetch(`${API_BASE}/plugins/update`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: p.name })
            });
            const d = await r.json();
            if (d?.ok) okCount++;
          } catch {}
        }
        await loadList();
        setUpdatingAll(false);
        setStatusMsg(`批量更新结束：成功 ${okCount}/${updatableList.length} 个，重启 DSH 后全部生效~`);
      };

      const filtered = plugins.filter((p) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
      });

      const placement = cfg.pluginUpdaterPlacement === 'glass-only' ? 'glass-only' : 'both';

      return jsxs('div', {
        children: [
          jsxs('div', {
            className: 'dsh-sg-card',
            children: [
              jsx('h4', { children: '🔌 插件更新入口位置' }),
              jsxs('div', {
                className: 'dsh-sg-row',
                children: [
                  jsxs('div', {
                    children: [
                      jsx('label', { children: '快捷更新条显示范围' }),
                      jsx('div', { className: 'dsh-sg-sub', children: '自由选择在「苍蓝琉璃内 + 官方插件页」双端显示，或仅保留在苍蓝琉璃工坊内' })
                    ]
                  }),
                  jsxs('div', {
                    className: 'dsh-sg-chips',
                    children: [
                      jsx('button', {
                        type: 'button',
                        className: 'dsh-sg-btn',
                        'data-active': placement === 'both' ? '1' : '0',
                        onClick: () => updateConfig({ pluginUpdaterPlacement: 'both' }, true),
                        children: '双端显示（琉璃 + 官方页）'
                      }),
                      jsx('button', {
                        type: 'button',
                        className: 'dsh-sg-btn',
                        'data-active': placement === 'glass-only' ? '1' : '0',
                        onClick: () => updateConfig({ pluginUpdaterPlacement: 'glass-only' }, true),
                        children: '仅留在苍蓝琉璃内'
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          jsxs('div', {
            className: 'dsh-sg-card',
            children: [
              jsxs('div', {
                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
                children: [
                  jsx('h4', { style: { margin: 0 }, children: `已装第三方插件（${plugins.length}${profileName ? ` · ${profileName}` : ''}）` }),
                  jsxs('div', {
                    style: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
                    children: [
                      jsx('button', {
                        type: 'button',
                        className: 'dsh-sg-btn',
                        disabled: checking || updatingAll,
                        onClick: () => void onCheckAll(true),
                        children: checking ? '检查中...' : '🔍 检查全部更新'
                      }),
                      updatableList.length > 0 ? jsx('button', {
                        type: 'button',
                        className: 'dsh-sg-btn',
                        'data-active': '1',
                        disabled: updatingAll || checking,
                        onClick: () => void onUpdateAll(),
                        children: updatingAll ? '批量更新中...' : `⬆️ 全部更新（${updatableList.length}）`
                      }) : null
                    ]
                  })
                ]
              }),
              jsx('input', {
                type: 'text',
                value: query,
                onChange: (e) => setQuery(e.target.value),
                placeholder: '搜索插件包名或描述...',
                style: {
                  width: '100%',
                  marginTop: '8px',
                  padding: '6px 10px',
                  boxSizing: 'border-box',
                  borderRadius: '8px',
                  border: '1px solid rgba(148,163,184,0.28)',
                  background: detectTheme() === 'light' ? 'rgba(255,255,255,0.92)' : 'rgba(15,23,42,0.35)',
                  color: 'inherit',
                  fontSize: '12px'
                }
              }),
              (statusMsg || allUpdatableList.length > 0) ? jsxs('div', {
                style: {
                  marginTop: '8px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  background: 'rgba(56,189,248,0.12)',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  flexWrap: 'wrap'
                },
                children: [
                  jsx('span', { children: statusMsg || `已有最近检查结果：${allUpdatableList.length} 个插件有新版本` }),
                  allUpdatableList.length > 0 ? jsx('button', {
                    type: 'button',
                    className: 'dsh-sg-btn',
                    style: { padding: '2px 8px', fontSize: '11px' },
                    onClick: () => setSummaryOpen((v) => !v),
                    children: summaryOpen ? '收起清单卡 ▲' : `展开清单卡（${allUpdatableList.length}）▾`
                  }) : null
                ]
              }) : null,
              summaryOpen && allUpdatableList.length > 0 ? jsxs('div', {
                style: {
                  marginTop: '8px',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(56,189,248,0.36)',
                  background: detectTheme() === 'light' ? 'rgba(248,250,252,0.92)' : 'rgba(15,23,42,0.68)',
                  backdropFilter: 'blur(14px) saturate(135%)',
                  WebkitBackdropFilter: 'blur(14px) saturate(135%)',
                  boxShadow: '0 8px 26px rgba(0,0,0,0.22)'
                },
                children: [
                  jsxs('div', {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      marginBottom: '6px',
                      paddingBottom: '6px',
                      borderBottom: '1px solid rgba(148,163,184,0.2)'
                    },
                    children: [
                      jsx('strong', { style: { fontSize: '12px' }, children: `📦 可更新版本清单（${allUpdatableList.length}）` }),
                      jsxs('div', {
                        style: { display: 'flex', alignItems: 'center', gap: '6px' },
                        children: [
                          jsx('button', {
                            type: 'button',
                            className: 'dsh-sg-btn',
                            'data-active': copied ? '1' : '0',
                            style: { padding: '3px 9px', fontSize: '11.5px' },
                            onClick: () => void onCopySummary(),
                            children: copied ? '✅ 已复制' : '📋 一键复制'
                          }),
                          jsx('button', {
                            type: 'button',
                            className: 'dsh-sg-btn',
                            style: { padding: '3px 8px', fontSize: '11.5px' },
                            onClick: () => setSummaryOpen(false),
                            children: '收起'
                          })
                        ]
                      })
                    ]
                  }),
                  jsx('div', {
                    style: {
                      userSelect: 'text',
                      WebkitUserSelect: 'text',
                      cursor: 'text',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      fontSize: '12.5px',
                      lineHeight: 1.58,
                      maxHeight: '220px',
                      overflowY: 'auto',
                      color: detectTheme() === 'light' ? '#0f172a' : '#bae6fd'
                    },
                    children: summaryText
                  })
                ]
              }) : null,
              loading ? jsx('div', { className: 'dsh-sg-sub', style: { marginTop: '10px' }, children: '读取插件列表中...' }) : jsx('div', {
                style: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px', maxHeight: '420px', overflowY: 'auto' },
                children: filtered.map((p) => {
                  const u = p.updateInfo;
                  const busy = busyMap[p.name];
                  const sourceTag = p.sourceKind === 'npm' ? 'npm' : (p.sourceKind === 'github' ? 'GitHub' : (p.sourceKind === 'local-link' ? '本地链接' : '离线包'));
                  return jsxs('div', {
                    key: p.name,
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: u?.hasUpdate ? '1px solid rgba(56,189,248,0.48)' : '1px solid rgba(148,163,184,0.18)',
                      background: p.enabled
                        ? (detectTheme() === 'light' ? 'rgba(255,255,255,0.84)' : 'rgba(15,23,42,0.26)')
                        : (detectTheme() === 'light' ? 'rgba(241,245,249,0.72)' : 'rgba(15,23,42,0.12)'),
                      opacity: p.enabled ? 1 : 0.65
                    },
                    children: [
                      jsxs('div', {
                        style: { minWidth: 0, flex: 1 },
                        children: [
                          jsxs('div', {
                            style: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' },
                            children: [
                              jsx('strong', { style: { fontSize: '12.5px', wordBreak: 'break-all' }, children: p.name }),
                              jsx('span', { style: { fontSize: '10.5px', padding: '1px 6px', borderRadius: '999px', background: 'rgba(148,163,184,0.2)' }, children: `v${p.installedVersion}` }),
                              jsx('span', { style: { fontSize: '10.5px', padding: '1px 6px', borderRadius: '999px', background: detectTheme() === 'light' ? 'rgba(2,132,199,0.12)' : 'rgba(56,189,248,0.15)', color: detectTheme() === 'light' ? '#0369a1' : '#7dd3fc' }, children: sourceTag }),
                              u?.hasUpdate ? jsx('span', {
                                style: { fontSize: '10.5px', padding: '1px 6px', borderRadius: '999px', background: detectTheme() === 'light' ? 'rgba(22,163,74,0.14)' : 'rgba(34,197,94,0.2)', color: detectTheme() === 'light' ? '#15803d' : '#86efac', fontWeight: 600 },
                                children: `新版本 v${u.latestVersion}`
                              }) : null,
                              u?.requiresDsh ? jsx('span', { style: { fontSize: '10.5px', opacity: 0.72 }, children: `需 DSH ${u.requiresDsh}` }) : null
                            ]
                          }),
                          p.description ? jsx('div', { className: 'dsh-sg-sub', style: { fontSize: '11px', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, children: p.description }) : null
                        ]
                      }),
                      jsxs('div', {
                        style: { display: 'flex', gap: '6px', flexShrink: 0 },
                        children: [
                          u?.hasUpdate && (p.sourceKind === 'npm' || p.sourceKind === 'github') ? jsx('button', {
                            type: 'button',
                            className: 'dsh-sg-btn',
                            'data-active': '1',
                            disabled: Boolean(busy) || updatingAll,
                            onClick: () => void onUpdateOne(p),
                            children: busy === 'update' ? '更新中...' : '更新'
                          }) : null,
                          !p.isSelf ? jsx('button', {
                            type: 'button',
                            className: 'dsh-sg-btn dsh-sg-power-btn',
                            'data-enabled': p.enabled ? '1' : '0',
                            disabled: Boolean(busy),
                            title: p.enabled ? '当前已启用（点击停用）' : '当前已停用（点击启用）',
                            'aria-label': p.enabled ? '停用插件' : '启用插件',
                            onClick: () => void onTogglePlugin(p),
                            children: busy === 'toggle'
                              ? jsx('span', { style: { fontSize: '11px', lineHeight: 1 }, children: '…' })
                              : jsxs('svg', {
                                width: 15,
                                height: 15,
                                viewBox: '0 0 24 24',
                                fill: 'none',
                                stroke: 'currentColor',
                                strokeWidth: 2.1,
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round',
                                children: [
                                  jsx('path', { d: 'M18.36 6.64a9 9 0 1 1-12.73 0' }),
                                  jsx('line', { x1: 12, y1: 2, x2: 12, y2: 12 }),
                                  !p.enabled ? jsx('line', { x1: 4, y1: 4, x2: 20, y2: 20, strokeWidth: 2 }) : null
                                ]
                              })
                          }) : null
                        ]
                      })
                    ]
                  });
                })
              })
            ]
          })
        ]
      });
    }

    function PluginDetailUpdateSection(props) {
      const { config: cfg } = useStore();
      const [checking, setChecking] = React.useState(false);
      const [updating, setUpdating] = React.useState(false);
      const [item, setItem] = React.useState(null);
      const [msg, setMsg] = React.useState('');

      const pkgName = props?.subject?.kind === 'bundle' ? props?.subject?.pkg?.name : '';
      const installed = Boolean(props?.subject?.kind === 'bundle' && props?.subject?.pkg?.installed);
      if (cfg.pluginUpdaterPlacement === 'glass-only' || !installed || !pkgName || pkgName.startsWith('@deepseek-ai/')) {
        return null;
      }

      const onCheckThis = async () => {
        setChecking(true);
        setMsg('');
        try {
          const r = await fetch(`${API_BASE}/plugins/check?force=1`, { cache: 'no-store' });
          const d = await r.json();
          if (!d?.ok) throw new Error(d?.error || '检查失败');
          const found = (d.plugins || []).find((p) => p.name === pkgName) || null;
          setItem(found);
          if (!found) {
            setMsg('未在第三方依赖列表找到该插件');
          } else if (found.updateInfo?.hasUpdate) {
            setMsg(`发现新版本：${found.installedVersion} → ${found.updateInfo.latestVersion}`);
          } else {
            setMsg(`已是最新版本（${found.installedVersion || '?'}）`);
          }
        } catch (err) {
          setMsg(`检查失败：${err?.message || err}`);
        } finally {
          setChecking(false);
        }
      };

      const onUpdateThis = async () => {
        if (!item) return;
        setUpdating(true);
        try {
          const r = await fetch(`${API_BASE}/plugins/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: pkgName })
          });
          const d = await r.json();
          if (!d?.ok) throw new Error(d?.error || '更新失败');
          setMsg('✅ 已更新完成，重启 DSH 后生效');
        } catch (err) {
          setMsg(`更新失败：${err?.message || err}`);
        } finally {
          setUpdating(false);
        }
      };

      return jsxs('section', {
        style: {
          marginTop: '12px',
          padding: '12px 14px',
          borderRadius: '10px',
          border: '1px solid rgba(56,189,248,0.28)',
          background: 'var(--dsw-alias-bg-layer-1, rgba(15,23,42,0.32))',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '760px'
        },
        children: [
          jsx('h3', { style: { margin: 0, fontSize: '13px', fontWeight: 600 }, children: '✨ 苍蓝琉璃 · 检查更新' }),
          jsxs('div', {
            style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
            children: [
              jsx('button', {
                type: 'button',
                disabled: checking || updating,
                onClick: () => void onCheckThis(),
                style: {
                  padding: '4px 11px',
                  borderRadius: '7px',
                  border: '1px solid rgba(56,189,248,0.42)',
                  background: 'rgba(56,189,248,0.16)',
                  color: 'var(--dsw-alias-label-primary, inherit)',
                  cursor: 'pointer',
                  fontSize: '12px'
                },
                children: checking ? '检查中...' : '🔍 检查更新'
              }),
              item?.updateInfo?.hasUpdate && (item.sourceKind === 'npm' || item.sourceKind === 'github') ? jsx('button', {
                type: 'button',
                disabled: updating || checking,
                onClick: () => void onUpdateThis(),
                style: {
                  padding: '4px 11px',
                  borderRadius: '7px',
                  border: 'none',
                  background: 'linear-gradient(135deg,#3b82f6,#7c3aed)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600
                },
                children: updating ? '更新中...' : `⬆️ 更新至 ${item.updateInfo.latestVersion}`
              }) : null,
              msg ? jsx('span', { style: { fontSize: '12px', opacity: 0.88, userSelect: 'text', WebkitUserSelect: 'text' }, children: msg }) : null
            ]
          })
        ]
      });
    }

    function SettingsSection() {
      return jsx('div', { style: { padding: '6px 4px' }, children: jsx(StudioPanel, {}) });
    }

    function RightSidebarPanel() {
      return jsx('div', {
        className: 'dsh-sg-panel-scroll',
        style: { padding: '12px 14px', height: '100%', overflowY: 'auto', boxSizing: 'border-box' },
        children: jsx(StudioPanel, {})
      });
    }

    // -----------------------------------------------------------------------
    // Plugin Entry
    // -----------------------------------------------------------------------
    // -----------------------------------------------------------------------
    // 内置效率增强模块前端运行时（drag-and-drop / chat-link-actions / conversation-search）
    // -----------------------------------------------------------------------
    let activePluginCtx = null;
    const addonClientForks = {
      dragAndDrop: null,
      chatLinkActions: null,
      conversationSearch: null
    };
    const addonClientModuleCache = {};
    let addonClientSyncInFlight = false;

    const ADDON_CLIENT_SPECS = [
      { key: 'dragAndDrop', bundleName: 'drag-and-drop', cfgKey: 'dragAndDropEnabled' },
      { key: 'chatLinkActions', bundleName: 'chat-link-actions', cfgKey: 'chatLinkActionsEnabled' },
      { key: 'conversationSearch', bundleName: 'conversation-search', cfgKey: 'conversationSearchEnabled' }
    ];

    function disposeAddonClientFork(key) {
      const f = addonClientForks[key];
      addonClientForks[key] = null;
      if (f && typeof f.dispose === 'function') {
        try { f.dispose(); } catch {}
      }
    }

    function disposeAllAddonClientForks() {
      for (const spec of ADDON_CLIENT_SPECS) disposeAddonClientFork(spec.key);
    }

    async function loadAddonClientModule(bundleName) {
      if (addonClientModuleCache[bundleName]) return addonClientModuleCache[bundleName];
      const resp = await fetch(`${API_BASE}/addons/client?name=${encodeURIComponent(bundleName)}`, { cache: 'no-store' });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const code = await resp.text();
      const loader = window.__ModuleLoader__;
      if (!loader || typeof loader.load !== 'function') {
        throw new Error('__ModuleLoader__ unavailable');
      }
      let captured = null;
      const origLoad = loader.load;
      loader.load = function (entry) {
        captured = entry;
      };
      try {
        // Execute bundle in isolated function scope so __ModuleLoader__.load captures its factory
        const runner = new Function(code);
        runner();
      } finally {
        loader.load = origLoad;
      }
      if (!captured || typeof captured.factory !== 'function') {
        throw new Error(`Invalid client bundle: ${bundleName}`);
      }
      const mod = captured.factory(require);
      addonClientModuleCache[bundleName] = mod;
      return mod;
    }

    async function syncBuiltInAddonsClient() {
      if (!activePluginCtx || addonClientSyncInFlight) return;
      addonClientSyncInFlight = true;
      try {
        let hostStatus = {};
        try {
          const r = await fetch(`${API_BASE}/addons/status`, { cache: 'no-store' });
          const d = await r.json();
          if (d?.ok && d.status) hostStatus = d.status;
        } catch {}

        for (const spec of ADDON_CLIENT_SPECS) {
          const enabled = config[spec.cfgKey] !== false;
          const hState = hostStatus[spec.key]?.state;
          if (!enabled || hState === 'yielded') {
            disposeAddonClientFork(spec.key);
            continue;
          }
          if (addonClientForks[spec.key]) continue;
          try {
            const mod = await loadAddonClientModule(spec.bundleName);
            if (!mod || typeof mod.apply !== 'function') continue;
            addonClientForks[spec.key] = activePluginCtx.plugin({
              name: `dsh-azure-glass:client:${spec.bundleName}`,
              inject: Array.isArray(mod.inject) ? mod.inject : [],
              apply: mod.apply
            });
          } catch (err) {
            console.warn(`[dsh-azure-glass] failed to mount client addon ${spec.bundleName}:`, err);
          }
        }
      } finally {
        addonClientSyncInFlight = false;
      }
    }

    function BuiltInAddonsTab({ cfg, updateConfig }) {
      const [statusMap, setStatusMap] = React.useState({});
      const [hostReady, setHostReady] = React.useState(true);
      const [busyKey, setBusyKey] = React.useState('');

      const fetchStatus = React.useCallback(async () => {
        try {
          const r = await fetch(`${API_BASE}/addons/status`, { cache: 'no-store' });
          if (!r.ok) {
            setHostReady(false);
            return;
          }
          const d = await r.json();
          if (d?.ok && d.status) {
            setHostReady(true);
            setStatusMap(d.status);
          } else {
            setHostReady(false);
          }
        } catch {
          setHostReady(false);
        }
      }, []);

      React.useEffect(() => {
        void fetchStatus();
      }, [fetchStatus]);

      const onToggleAddon = async (cfgKey, modKey) => {
        setBusyKey(modKey);
        try {
          const nextVal = !(cfg[cfgKey] !== false);
          updateConfig({ [cfgKey]: nextVal }, true);
          await new Promise((r) => setTimeout(r, 120));
          const r = await fetch(`${API_BASE}/addons/sync`, { method: 'POST' });
          const d = await r.json();
          if (d?.ok && d.status) setStatusMap(d.status);
          await syncBuiltInAddonsClient();
        } catch {}
        finally {
          setBusyKey('');
        }
      };

      const renderBadge = (modKey) => {
        if (!hostReady) {
          return jsx('span', { style: { fontSize: '10.5px', padding: '1px 7px', borderRadius: '999px', background: 'rgba(245,158,11,0.2)', color: '#fbbf24', fontWeight: 600 }, children: '需重启 DSH 生效' });
        }
        const st = statusMap[modKey]?.state || 'idle';
        if (st === 'active') {
          return jsx('span', { style: { fontSize: '10.5px', padding: '1px 7px', borderRadius: '999px', background: 'rgba(34,197,94,0.18)', color: '#4ade80', fontWeight: 600 }, children: '苍蓝琉璃运行中' });
        }
        if (st === 'yielded') {
          return jsx('span', { style: { fontSize: '10.5px', padding: '1px 7px', borderRadius: '999px', background: 'rgba(245,158,11,0.2)', color: '#fbbf24', fontWeight: 600 }, children: '已让位给独立插件' });
        }
        if (st === 'error') {
          return jsx('span', { style: { fontSize: '10.5px', padding: '1px 7px', borderRadius: '999px', background: 'rgba(239,68,68,0.2)', color: '#f87171', fontWeight: 600 }, title: statusMap[modKey]?.message || '', children: '加载异常' });
        }
        if (st === 'idle') {
          return jsx('span', { style: { fontSize: '10.5px', padding: '1px 7px', borderRadius: '999px', background: 'rgba(56,189,248,0.16)', color: '#7dd3fc' }, children: '初始化中...' });
        }
        return jsx('span', { style: { fontSize: '10.5px', padding: '1px 7px', borderRadius: '999px', background: 'rgba(148,163,184,0.18)', color: '#94a3b8' }, children: '已关闭' });
      };

      const items = [
        {
          modKey: 'cookieGuard',
          cfgKey: 'cookieGuardEnabled',
          title: '🍪 Cookie 431 自动防护',
          desc: '自动放宽请求头上限并清理过期 dsh-auth-* Cookie，根治长期使用后 431 打不开 Web UI 的问题。'
        },
        {
          modKey: 'dragAndDrop',
          cfgKey: 'dragAndDropEnabled',
          title: '📂 拖拽文件生成路径芯片',
          desc: '将本地文件或文件夹拖入页面任意位置，自动解析真实绝对路径并在输入框上方生成可删除芯片，支持不打字直接发送。'
        },
        {
          modKey: 'chatLinkActions',
          cfgKey: 'chatLinkActionsEnabled',
          title: '🖱️ 对话文件链接右键菜单',
          desc: '右键对话中的文件路径或附件弹出自绘菜单：引用到对话、在资源管理器中查看、复制路径、发送到…以及自定义入口。'
        },
        {
          modKey: 'conversationSearch',
          cfgKey: 'conversationSearchEnabled',
          title: '🔎 会话全文搜索与跳转',
          desc: '在输入框旁工具栏提供放大镜入口，支持当前/全部会话的宽松、精确、正则三态检索，点击结果自动跨会话定位并高亮。'
        }
      ];

      return jsxs('div', {
        style: { display: 'flex', flexDirection: 'column', gap: '10px' },
        children: [
          jsxs('div', {
            className: 'dsh-sg-card',
            children: [
              jsx('h4', { children: '内置效率增强模块（一站式整合）' }),
              jsx('div', {
                className: 'dsh-sg-sub',
                style: { marginBottom: '10px' },
                children: '以下 4 项功能已完整内置进苍蓝琉璃，支持独立热启停；若本机仍启用同名独立插件，苍蓝琉璃会自动让位避免冲突。'
              }),
              jsx('div', {
                style: { display: 'flex', flexDirection: 'column', gap: '8px' },
                children: items.map((it) => {
                  const on = cfg[it.cfgKey] !== false;
                  return jsxs('div', {
                    key: it.modKey,
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(148,163,184,0.2)',
                      background: on
                        ? (detectTheme() === 'light' ? 'rgba(255,255,255,0.84)' : 'rgba(15,23,42,0.22)')
                        : (detectTheme() === 'light' ? 'rgba(241,245,249,0.72)' : 'rgba(15,23,42,0.1)')
                    },
                    children: [
                      jsxs('div', {
                        style: { minWidth: 0, flex: 1 },
                        children: [
                          jsxs('div', {
                            style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
                            children: [
                              jsx('strong', { style: { fontSize: '12.5px' }, children: it.title }),
                              renderBadge(it.modKey)
                            ]
                          }),
                          jsx('div', { className: 'dsh-sg-sub', style: { fontSize: '11.5px', marginTop: '3px' }, children: it.desc })
                        ]
                      }),
                      jsx('button', {
                        type: 'button',
                        className: 'dsh-sg-btn',
                        'data-active': on ? '1' : '0',
                        disabled: busyKey === it.modKey,
                        onClick: () => void onToggleAddon(it.cfgKey, it.modKey),
                        children: busyKey === it.modKey ? '切换中...' : (on ? '已开启' : '已关闭')
                      })
                    ]
                  });
                })
              })
            ]
          }),
          cfg.cookieGuardEnabled !== false ? jsxs('div', {
            className: 'dsh-sg-card',
            children: [
              jsx('h4', { children: '🍪 Cookie 防护参数' }),
              jsxs('div', {
                className: 'dsh-sg-row',
                children: [
                  jsxs('div', {
                    children: [
                      jsx('div', { style: { fontSize: '12.5px', fontWeight: 600 }, children: `多开保留其它实例 Cookie 数：${cfg.cookieGuardKeepOtherCookies ?? 3} 条` }),
                      jsx('div', { className: 'dsh-sg-sub', children: '单开可设为 0（最激进），多开建议保留 3 条' })
                    ]
                  }),
                  jsx('input', {
                    type: 'range',
                    min: 0,
                    max: 8,
                    step: 1,
                    value: Number(cfg.cookieGuardKeepOtherCookies ?? 3),
                    onChange: (e) => {
                      updateConfig({ cookieGuardKeepOtherCookies: Number(e.target.value) }, true);
                      setTimeout(() => { void fetch(`${API_BASE}/addons/sync`, { method: 'POST' }); }, 150);
                    }
                  })
                ]
              })
            ]
          }) : null,
          jsxs('div', {
            className: 'dsh-sg-card',
            children: [
              jsx('h4', { children: '🔭 苍蓝上下文观察窗与实时余额' }),
              jsx('div', {
                className: 'dsh-sg-sub',
                style: { marginBottom: '10px' },
                children: '在输入框下方显示毛玻璃胶囊状态条（轮次/步数、生成速度、缓存命中率、上下文占比、压缩次数与供应商余额），点击弹出完整上下文观察窗；可直接替代独立 dsh-balance 插件。'
              }),
              jsxs('div', {
                style: { display: 'flex', flexDirection: 'column', gap: '8px' },
                children: [
                  jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsxs('div', {
                        children: [
                          jsx('div', { style: { fontSize: '12.5px', fontWeight: 600 }, children: '启用底部胶囊与观察窗' }),
                          jsx('div', { className: 'dsh-sg-sub', children: '仅按需读取当前单个会话，零启动扫描开销' })
                        ]
                      }),
                      jsx('button', {
                        type: 'button',
                        className: 'dsh-sg-btn',
                        'data-active': cfg.observerEnabled !== false ? '1' : '0',
                        onClick: () => updateConfig({ observerEnabled: cfg.observerEnabled === false }, true),
                        children: cfg.observerEnabled !== false ? '已开启' : '已关闭'
                      })
                    ]
                  }),
                  cfg.observerEnabled !== false ? jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsxs('div', {
                        children: [
                          jsx('div', { style: { fontSize: '12.5px', fontWeight: 600 }, children: '显示当前供应商余额与额度' }),
                          jsx('div', { className: 'dsh-sg-sub', children: '支持 DeepSeek 官方、Kimi Coding、GLM Coding、MiniMax、OpenRouter、OpenCode Go（5 分钟缓存）' })
                        ]
                      }),
                      jsx('button', {
                        type: 'button',
                        className: 'dsh-sg-btn',
                        'data-active': cfg.observerShowBalance !== false ? '1' : '0',
                        onClick: () => updateConfig({ observerShowBalance: cfg.observerShowBalance === false }, true),
                        children: cfg.observerShowBalance !== false ? '已开启' : '已关闭'
                      })
                    ]
                  }) : null,
                  cfg.observerEnabled !== false ? jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsxs('div', {
                        children: [
                          jsx('div', { style: { fontSize: '12.5px', fontWeight: 600 }, children: `观察窗背景透明度：${Math.round((cfg.observerModalOpacity ?? 0.86) * 100)}%` }),
                          jsx('div', { className: 'dsh-sg-sub', children: '独立控制苍蓝观察窗弹窗底色透明程度，不影响其他弹窗' })
                        ]
                      }),
                      jsx('input', {
                        type: 'range',
                        min: 0.15,
                        max: 0.98,
                        step: 0.01,
                        value: Number(cfg.observerModalOpacity ?? 0.86),
                        onChange: (e) => updateConfig({ observerModalOpacity: Number(e.target.value) }, true)
                      })
                    ]
                  }) : null,
                  cfg.observerEnabled !== false ? jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsxs('div', {
                        children: [
                          jsx('div', { style: { fontSize: '12.5px', fontWeight: 600 }, children: `观察窗背景毛玻璃模糊：${Math.round(cfg.observerModalBlurPx ?? 22)}px` }),
                          jsx('div', { className: 'dsh-sg-sub', children: '0px 为纯半透明无模糊，调高可获得更柔和的磨砂质感' })
                        ]
                      }),
                      jsx('input', {
                        type: 'range',
                        min: 0,
                        max: 40,
                        step: 1,
                        value: Number(cfg.observerModalBlurPx ?? 22),
                        onChange: (e) => updateConfig({ observerModalBlurPx: Number(e.target.value) }, true)
                      })
                    ]
                  }) : null,
                  cfg.observerEnabled !== false ? jsxs('div', {
                    className: 'dsh-sg-row',
                    children: [
                      jsxs('div', {
                        children: [
                          jsx('div', { style: { fontSize: '12.5px', fontWeight: 600 }, children: '观察窗背景底色' }),
                          jsx('div', { className: 'dsh-sg-sub', children: `当前色值：${cfg.observerModalBgColor || '#1a1d29'}` })
                        ]
                      }),
                      jsxs('div', {
                        style: { display: 'flex', alignItems: 'center', gap: '8px' },
                        children: [
                          jsx('input', {
                            type: 'color',
                            value: /^#[0-9a-f]{6}$/i.test(cfg.observerModalBgColor || '') ? cfg.observerModalBgColor : '#1a1d29',
                            onChange: (e) => updateConfig({ observerModalBgColor: e.target.value }, true),
                            style: { width: '34px', height: '26px', border: 'none', borderRadius: '6px', background: 'transparent', cursor: 'pointer' }
                          }),
                          jsx('button', {
                            type: 'button',
                            className: 'dsh-sg-btn',
                            onClick: () => updateConfig({ observerModalBgColor: '#1a1d29', observerModalOpacity: 0.86, observerModalBlurPx: 22 }, true),
                            children: '重置背景'
                          })
                        ]
                      })
                    ]
                  }) : null
                ]
              })
            ]
          })
        ]
      });
    }

    // ── 苍蓝上下文观察窗（输入框下方毛玻璃胶囊 + 1:1 复刻观察弹窗） ─────────
    const OBSERVER_STYLE_ID = 'dsh-azure-glass-observer-style';
    function ensureObserverStyle() {
      if (document.getElementById(OBSERVER_STYLE_ID)) return;
      const st = document.createElement('style');
      st.id = OBSERVER_STYLE_ID;
      st.textContent = `
        .dsh-ag-obs-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 11.5px;
          line-height: 1.45;
          color: rgba(226, 232, 240, 0.92);
          background: rgba(24, 28, 40, 0.68);
          border: 1px solid rgba(148, 163, 184, 0.22);
          backdrop-filter: blur(12px) saturate(130%);
          -webkit-backdrop-filter: blur(12px) saturate(130%);
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
          transition: background 140ms ease, border-color 140ms ease, transform 120ms ease;
        }
        .dsh-ag-obs-pill:hover {
          background: rgba(36, 42, 60, 0.84);
          border-color: rgba(96, 165, 250, 0.45);
          transform: translateY(-0.5px);
        }
        .dsh-ag-obs-sep { opacity: 0.4; }
        .dsh-ag-obs-pct-ok { color: #34d399; font-weight: 600; }
        .dsh-ag-obs-pct-warn { color: #fbbf24; font-weight: 600; }
        .dsh-ag-obs-pct-crit { color: #f87171; font-weight: 600; }
        .dsh-ag-obs-compact-badge {
          display: inline-flex;
          align-items: center;
          padding: 0 6px;
          border-radius: 999px;
          font-size: 10.5px;
          font-weight: 600;
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.18);
          border: 1px solid rgba(245, 158, 11, 0.34);
        }
        .dsh-ag-obs-bal-badge {
          color: #38bdf8;
          font-weight: 600;
        }
        .dsh-ag-obs-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2147483630;
          background: rgba(8, 10, 18, 0.56);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: dshAgObsFadeIn 140ms ease;
        }
        @keyframes dshAgObsFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .dsh-ag-obs-modal {
          width: min(860px, 94vw);
          max-height: 88vh;
          overflow-y: auto;
          border-radius: 16px;
          background: rgba(26, 29, 41, 0.88);
          border: 1px solid rgba(148, 163, 184, 0.24);
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(22px) saturate(140%);
          -webkit-backdrop-filter: blur(22px) saturate(140%);
          color: #e2e8f0;
          padding: 18px 20px 14px;
          font-family: inherit;
          font-variant-numeric: tabular-nums;
        }
        .dsh-ag-obs-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.16);
          margin-bottom: 14px;
        }
        .dsh-ag-obs-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14.5px;
          font-weight: 700;
          color: #f8fafc;
          min-width: 0;
        }
        .dsh-ag-obs-session-tag {
          font-size: 12px;
          font-weight: 500;
          color: #cbd5e1;
          background: rgba(15, 23, 42, 0.52);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 8px;
          padding: 3px 10px;
          max-width: 360px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .dsh-ag-obs-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .dsh-ag-obs-btn {
          background: rgba(148, 163, 184, 0.14);
          color: #e2e8f0;
          border: 1px solid rgba(148, 163, 184, 0.24);
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 12px;
          cursor: pointer;
          transition: background 120ms ease;
        }
        .dsh-ag-obs-btn:hover { background: rgba(148, 163, 184, 0.26); }
        .dsh-ag-obs-grid4 {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 14px;
        }
        @media (max-width: 680px) {
          .dsh-ag-obs-grid4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        .dsh-ag-obs-card {
          background: rgba(38, 43, 59, 0.62);
          border: 1px solid rgba(148, 163, 184, 0.16);
          border-radius: 12px;
          padding: 12px 14px;
        }
        .dsh-ag-obs-card-label {
          font-size: 11.5px;
          color: #94a3b8;
          margin-bottom: 6px;
        }
        .dsh-ag-obs-card-val {
          font-size: 17px;
          font-weight: 700;
          color: #f8fafc;
          line-height: 1.25;
        }
        .dsh-ag-obs-card-sub {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 2px;
        }
        .dsh-ag-obs-section {
          background: rgba(38, 43, 59, 0.52);
          border: 1px solid rgba(148, 163, 184, 0.16);
          border-radius: 12px;
          padding: 13px 15px;
          margin-bottom: 12px;
        }
        .dsh-ag-obs-section-hd {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12.5px;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 10px;
        }
        .dsh-ag-obs-bar-row {
          margin-bottom: 8px;
        }
        .dsh-ag-obs-bar-row:last-child { margin-bottom: 0; }
        .dsh-ag-obs-bar-meta {
          display: flex;
          justify-content: space-between;
          font-size: 11.5px;
          color: #cbd5e1;
          margin-bottom: 4px;
        }
        .dsh-ag-obs-bar-track {
          height: 6px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.55);
          overflow: hidden;
        }
        .dsh-ag-obs-bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 260ms ease;
        }
        .dsh-ag-obs-grid2 {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 12px;
        }
        @media (max-width: 680px) {
          .dsh-ag-obs-grid2 { grid-template-columns: 1fr; }
        }
        .dsh-ag-obs-kv {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          padding: 4px 0;
          color: #cbd5e1;
        }
        .dsh-ag-obs-step-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          padding: 5px 0;
          border-bottom: 1px dashed rgba(148, 163, 184, 0.1);
        }
        .dsh-ag-obs-step-row:last-child { border-bottom: none; }
        .dsh-ag-obs-step-txt {
          color: #cbd5e1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 11.5px;
        }
        .dsh-ag-obs-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          padding-top: 10px;
          border-top: 1px solid rgba(148, 163, 184, 0.14);
          font-size: 11.5px;
          color: #94a3b8;
        }
      `;
      document.head.appendChild(st);
    }

    function fmtTokCompact(n) {
      const v = Number(n) || 0;
      if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
      if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
      return String(Math.round(v));
    }

    function pctToneClass(pct) {
      if (pct >= 80) return 'dsh-ag-obs-pct-crit';
      if (pct >= 60) return 'dsh-ag-obs-pct-warn';
      return 'dsh-ag-obs-pct-ok';
    }

    function pctStrokeColor(pct) {
      if (pct >= 80) return '#f87171';
      if (pct >= 60) return '#fbbf24';
      return '#34d399';
    }

    function ContextRingSvg({ pct }) {
      const p = Math.max(0, Math.min(100, Number(pct) || 0));
      const r = 5.5;
      const c = 2 * Math.PI * r;
      const offset = c * (1 - p / 100);
      return jsxs('svg', {
        width: 14,
        height: 14,
        viewBox: '0 0 16 16',
        style: { flexShrink: 0 },
        children: [
          jsx('circle', { cx: 8, cy: 8, r, fill: 'none', stroke: 'rgba(148,163,184,0.28)', strokeWidth: 2 }),
          jsx('circle', {
            cx: 8,
            cy: 8,
            r,
            fill: 'none',
            stroke: pctStrokeColor(p),
            strokeWidth: 2,
            strokeDasharray: c,
            strokeDashoffset: offset,
            strokeLinecap: 'round',
            transform: 'rotate(-90 8 8)'
          })
        ]
      });
    }

    function hexToRgbaSafe(hex, alpha) {
      const m = String(hex || '').trim().match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
      const a = Math.max(0.15, Math.min(0.98, Number(alpha) || 0.86));
      if (!m) return `rgba(26, 29, 41, ${a})`;
      return `rgba(${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}, ${a})`;
    }

    function AzureObserverModal({ open, onClose, data, loading, onRefresh, cfg }) {
      React.useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, [open, onClose]);

      if (!open) return null;

      const d = data || {};
      const pct = Number(d.contextPct) || 0;
      const bal = d.balance;
      const breakdown = Array.isArray(d.breakdown) ? d.breakdown : [];
      const toolCats = Array.isArray(d.toolCategories) ? d.toolCategories : [];
      const heaviest = Array.isArray(d.heaviestSteps) ? d.heaviestSteps : [];
      const modalBlur = Math.max(0, Math.min(40, Math.round(Number(cfg?.observerModalBlurPx ?? 22))));
      const modalBg = hexToRgbaSafe(cfg?.observerModalBgColor || '#1a1d29', cfg?.observerModalOpacity ?? 0.86);

      const modalNode = jsx('div', {
        className: 'dsh-ag-obs-backdrop',
        onClick: (e) => { if (e.target === e.currentTarget) onClose(); },
        children: jsxs('div', {
          className: 'dsh-ag-obs-modal',
          style: {
            background: modalBg,
            backdropFilter: `blur(${modalBlur}px) saturate(140%)`,
            WebkitBackdropFilter: `blur(${modalBlur}px) saturate(140%)`
          },
          children: [
            jsxs('div', {
              className: 'dsh-ag-obs-header',
              children: [
                jsxs('div', {
                  className: 'dsh-ag-obs-title',
                  children: [
                    jsx('span', { children: '✦ 苍蓝上下文观察窗' }),
                    jsx('span', {
                      className: 'dsh-ag-obs-session-tag',
                      title: d.title || d.sessionId || '',
                      children: `${d.title || '当前会话'} (${d.turns || 0}轮 ${d.steps || 0}步 · ${pct}%)`
                    })
                  ]
                }),
                jsxs('div', {
                  className: 'dsh-ag-obs-actions',
                  children: [
                    jsx('button', {
                      type: 'button',
                      className: 'dsh-ag-obs-btn',
                      disabled: loading,
                      onClick: onRefresh,
                      children: loading ? '刷新中…' : '↻ 刷新'
                    }),
                    jsx('button', {
                      type: 'button',
                      className: 'dsh-ag-obs-btn',
                      onClick: onClose,
                      children: '关闭 ×'
                    })
                  ]
                })
              ]
            }),

            // 顶部 4 指标卡
            jsxs('div', {
              className: 'dsh-ag-obs-grid4',
              children: [
                jsxs('div', {
                  className: 'dsh-ag-obs-card',
                  children: [
                    jsx('div', { className: 'dsh-ag-obs-card-label', children: '轮次 / 步数' }),
                    jsx('div', { className: 'dsh-ag-obs-card-val', children: `${d.turns || 0} 轮 ${d.steps || 0} 步` }),
                    d.spendCny > 0 ? jsx('div', { className: 'dsh-ag-obs-card-sub', children: `本会话估算 ¥${Number(d.spendCny).toFixed(2)}` }) : null
                  ]
                }),
                jsxs('div', {
                  className: 'dsh-ag-obs-card',
                  children: [
                    jsx('div', { className: 'dsh-ag-obs-card-label', children: '上下文占用' }),
                    jsx('div', {
                      className: `dsh-ag-obs-card-val ${pctToneClass(pct)}`,
                      children: `${fmtTokCompact(d.currentContextTokens)} / ${fmtTokCompact(d.contextWindow)}`
                    }),
                    jsx('div', { className: `dsh-ag-obs-card-sub ${pctToneClass(pct)}`, children: `(${pct}%)` })
                  ]
                }),
                jsxs('div', {
                  className: 'dsh-ag-obs-card',
                  children: [
                    jsx('div', { className: 'dsh-ag-obs-card-label', children: '精准缓存命中率' }),
                    jsx('div', { className: 'dsh-ag-obs-card-val', style: { color: '#38bdf8' }, children: `${d.cacheHitRate || 0}%` }),
                    jsx('div', { className: 'dsh-ag-obs-card-sub', children: `命中 ${fmtTokCompact(d.totalCacheReadTokens)} tok` })
                  ]
                }),
                jsxs('div', {
                  className: 'dsh-ag-obs-card',
                  children: [
                    jsx('div', { className: 'dsh-ag-obs-card-label', children: '实时生成速度' }),
                    jsx('div', { className: 'dsh-ag-obs-card-val', children: d.tokPerSec > 0 ? `${d.tokPerSec} tok/s` : '待生成' }),
                    jsx('div', { className: 'dsh-ag-obs-card-sub', children: d.model || d.provider || '—' })
                  ]
                })
              ]
            }),

            // 上下文精准构成
            jsxs('div', {
              className: 'dsh-ag-obs-section',
              children: [
                jsxs('div', {
                  className: 'dsh-ag-obs-section-hd',
                  children: [
                    jsx('span', { children: '🧠 当前窗口上下文构成拆解' }),
                    jsx('span', { style: { color: '#94a3b8', fontWeight: 600 }, children: `${fmtTokCompact(d.currentContextTokens)} tok` })
                  ]
                }),
                breakdown.length > 0 ? breakdown.map((item) => jsxs('div', {
                  key: item.key,
                  className: 'dsh-ag-obs-bar-row',
                  children: [
                    jsxs('div', {
                      className: 'dsh-ag-obs-bar-meta',
                      children: [
                        jsx('span', { children: item.label }),
                        jsx('span', { children: `${fmtTokCompact(item.tokens)} tok (${item.pct}%)` })
                      ]
                    }),
                    jsx('div', {
                      className: 'dsh-ag-obs-bar-track',
                      children: jsx('div', {
                        className: 'dsh-ag-obs-bar-fill',
                        style: { width: `${Math.max(1.5, Math.min(100, item.pct))}%`, background: item.color || '#8b5cf6' }
                      })
                    })
                  ]
                })) : jsx('div', { style: { fontSize: '12px', color: '#94a3b8' }, children: '当前会话尚无上下文数据' })
              ]
            }),

            // 供应商余额 / 额度卡
            bal && bal.supported ? jsxs('div', {
              className: 'dsh-ag-obs-section',
              children: [
                jsxs('div', {
                  className: 'dsh-ag-obs-section-hd',
                  children: [
                    jsx('span', { children: `⚡ 供应商余额与额度 (${bal.label || bal.provider})` }),
                    jsx('span', { style: { fontSize: '11.5px', color: '#94a3b8', fontWeight: 500 }, children: d.model || d.provider })
                  ]
                }),
                bal.error ? jsx('div', { style: { fontSize: '12px', color: '#f87171' }, children: bal.error }) : jsxs('div', {
                  style: { display: 'grid', gridTemplateColumns: `repeat(${Math.min(3, Math.max(1, (bal.items || []).length))}, minmax(0, 1fr))`, gap: '10px' },
                  children: (bal.items || []).map((it, idx) => jsxs('div', {
                    key: idx,
                    style: { background: 'rgba(15,23,42,0.42)', borderRadius: '10px', padding: '10px 12px', border: '1px solid rgba(148,163,184,0.14)' },
                    children: [
                      jsxs('div', {
                        style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' },
                        children: [
                          jsx('span', { style: { color: '#cbd5e1' }, children: it.title }),
                          jsx('span', {
                            style: {
                              fontWeight: 700,
                              color: it.status === 'error' ? '#f87171' : (it.status === 'warn' ? '#fbbf24' : '#34d399')
                            },
                            children: it.valueText
                          })
                        ]
                      }),
                      typeof it.pct === 'number' ? jsx('div', {
                        className: 'dsh-ag-obs-bar-track',
                        style: { marginBottom: '5px' },
                        children: jsx('div', {
                          className: 'dsh-ag-obs-bar-fill',
                          style: {
                            width: `${Math.max(2, Math.min(100, it.pct))}%`,
                            background: it.status === 'error' ? '#f87171' : (it.status === 'warn' ? '#fbbf24' : '#34d399')
                          }
                        })
                      }) : null,
                      it.subText ? jsx('div', { style: { fontSize: '11px', color: '#94a3b8', textAlign: 'right' }, children: it.subText }) : null
                    ]
                  }))
                })
              ]
            }) : null,

            // 工具消耗分类 + 压缩状态
            jsxs('div', {
              className: 'dsh-ag-obs-grid2',
              children: [
                jsxs('div', {
                  className: 'dsh-ag-obs-section',
                  style: { marginBottom: 0 },
                  children: [
                    jsx('div', { className: 'dsh-ag-obs-section-hd', children: jsx('span', { children: '🛠️ 活跃窗口工具消耗' }) }),
                    toolCats.length > 0 ? toolCats.map((c) => jsxs('div', {
                      key: c.name,
                      className: 'dsh-ag-obs-kv',
                      children: [
                        jsx('span', { children: `${c.name} (${c.count})` }),
                        jsx('span', { style: { color: '#94a3b8' }, children: `~${fmtTokCompact(c.tokens)} tok` })
                      ]
                    })) : jsx('div', { style: { fontSize: '12px', color: '#94a3b8' }, children: '暂无工具调用记录' })
                  ]
                }),
                jsxs('div', {
                  className: 'dsh-ag-obs-section',
                  style: { marginBottom: 0 },
                  children: [
                    jsxs('div', {
                      className: 'dsh-ag-obs-section-hd',
                      children: [
                        jsx('span', { children: '📦 压缩状态与会话信息' }),
                        jsx('span', { className: 'dsh-ag-obs-compact-badge', children: `压缩 ${d.compactions || 0} 次` })
                      ]
                    }),
                    jsxs('div', {
                      className: 'dsh-ag-obs-kv',
                      children: [
                        jsx('span', { children: '压缩来源明细' }),
                        jsx('span', {
                          children: `官方 ${d.nativeCompactions || 0} 次 · billion-context ${d.biliCompactions || 0} 次${d.biliDecompactions > 0 ? ` (解压 ${d.biliDecompactions} 次)` : ''}`
                        })
                      ]
                    }),
                    jsxs('div', { className: 'dsh-ag-obs-kv', children: [jsx('span', { children: '当前供应商' }), jsx('span', { children: d.provider || '—' })] }),
                    jsxs('div', { className: 'dsh-ag-obs-kv', children: [jsx('span', { children: '当前模型' }), jsx('span', { children: d.model || '—' })] }),
                    jsxs('div', { className: 'dsh-ag-obs-kv', children: [jsx('span', { children: '窗口上限' }), jsx('span', { children: `${fmtTokCompact(d.contextWindow)} tok` })] })
                  ]
                })
              ]
            }),

            // 最重步骤 Top 5
            jsxs('div', {
              className: 'dsh-ag-obs-section',
              children: [
                jsx('div', { className: 'dsh-ag-obs-section-hd', children: jsx('span', { children: '🔥 最重步骤 Top 5' }) }),
                heaviest.length > 0 ? heaviest.map((st, idx) => jsxs('div', {
                  key: idx,
                  className: 'dsh-ag-obs-step-row',
                  children: [
                    jsx('span', {
                      className: 'dsh-ag-obs-step-txt',
                      title: `[${st.tool}] ${st.preview}`,
                      children: `#${idx + 1} [${st.tool}] ${st.preview}`
                    }),
                    jsx('span', { style: { color: '#94a3b8', flexShrink: 0, fontWeight: 600 }, children: `~${fmtTokCompact(st.tokens)} tok` })
                  ]
                })) : jsx('div', { style: { fontSize: '12px', color: '#94a3b8' }, children: '暂无大体积工具步骤' })
              ]
            }),

            jsxs('div', {
              className: 'dsh-ag-obs-footer',
              children: [
                jsx('span', { children: '提示：按 Esc 或点击空白处关闭，点「刷新」立即更新余额与统计。' }),
                jsx('span', {
                  children: `总输入 ${fmtTokCompact(d.totalInputTokens)} · 缓存 ${fmtTokCompact(d.totalCacheReadTokens)} · 输出 ${fmtTokCompact(d.totalOutputTokens)}`
                })
              ]
            })
          ]
        })
      });

      try {
        const ReactDOM = require('react-dom');
        if (ReactDOM && typeof ReactDOM.createPortal === 'function' && document.body) {
          return ReactDOM.createPortal(modalNode, document.body);
        }
      } catch {}
      return modalNode;
    }

    function AzureObserverCapsule({ sessionId }) {
      const { config: cfg } = useStore();
      const [data, setData] = React.useState(null);
      const [open, setOpen] = React.useState(false);
      const [loading, setLoading] = React.useState(false);

      const enabled = cfg.observerEnabled !== false;
      const showBal = cfg.observerShowBalance !== false;

      const fetchNow = React.useCallback((forceRefresh) => {
        if (!enabled) return;
        const qs = new URLSearchParams();
        if (sessionId) qs.set('sessionId', String(sessionId));
        qs.set('balance', showBal ? '1' : '0');
        if (forceRefresh) qs.set('refresh', '1');
        if (forceRefresh) setLoading(true);
        fetch(`${API_BASE}/observer/telemetry?${qs.toString()}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((j) => {
            if (j && j.ok) setData(j);
          })
          .catch(() => {})
          .finally(() => {
            if (forceRefresh) setLoading(false);
          });
      }, [enabled, sessionId, showBal]);

      React.useEffect(() => {
        if (!enabled) return;
        ensureObserverStyle();
        fetchNow(false);
        const timer = setInterval(() => {
          if (document.visibilityState === 'hidden') return;
          fetchNow(false);
        }, 3000);
        return () => clearInterval(timer);
      }, [enabled, fetchNow]);

      if (!enabled) return null;

      const d = data || {};
      const pct = Number(d.contextPct) || 0;
      const balShort = showBal && d.balance && d.balance.supported && d.balance.shortText ? d.balance.shortText : '';

      return jsxs(React.Fragment, {
        children: [
          jsxs('button', {
            type: 'button',
            className: 'dsh-ag-obs-pill',
            title: '点击打开苍蓝上下文观察窗（查看上下文构成、缓存命中、工具消耗与供应商余额）',
            onClick: () => {
              setOpen(true);
              fetchNow(false);
            },
            children: [
              jsx('span', { children: `⏱ ${d.turns || 0} 轮 ${d.steps || 0} 步` }),
              d.tokPerSec > 0 ? jsxs(React.Fragment, {
                children: [
                  jsx('span', { className: 'dsh-ag-obs-sep', children: '·' }),
                  jsx('span', { children: `${d.tokPerSec} tok/s` })
                ]
              }) : null,
              d.totalAllTokens > 0 ? jsxs(React.Fragment, {
                children: [
                  jsx('span', { className: 'dsh-ag-obs-sep', children: '·' }),
                  jsx('span', { children: `${fmtTokCompact(d.totalAllTokens)} tok` })
                ]
              }) : null,
              d.totalInputTokens > 0 ? jsxs(React.Fragment, {
                children: [
                  jsx('span', { className: 'dsh-ag-obs-sep', children: '·' }),
                  jsx('span', { children: `缓存命中 ${d.cacheHitRate || 0}%` })
                ]
              }) : null,
              jsx(ContextRingSvg, { pct }),
              jsx('span', { className: pctToneClass(pct), children: `${Math.round(pct)}%` }),
              d.compactions > 0 ? jsx('span', { className: 'dsh-ag-obs-compact-badge', children: `压缩 ${d.compactions}次` }) : null,
              balShort ? jsxs(React.Fragment, {
                children: [
                  jsx('span', { className: 'dsh-ag-obs-sep', children: '·' }),
                  jsx('span', { className: 'dsh-ag-obs-bal-badge', children: balShort })
                ]
              }) : null
            ]
          }),
          jsx(AzureObserverModal, {
            open,
            onClose: () => setOpen(false),
            data: d,
            loading,
            onRefresh: () => fetchNow(true),
            cfg
          })
        ]
      });
    }

    const inject = ['slots', 'locale'];

    function apply(ctx) {
      activePluginCtx = ctx;
      if (typeof ctx.on === 'function') {
        ctx.on('dispose', () => {
          disposeAllAddonClientForks();
          if (activePluginCtx === ctx) activePluginCtx = null;
        });
      }
      setTimeout(() => { void syncBuiltInAddonsClient(); }, 300);
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-azure-glass: locale');
      const t = ctx.locale.bind(NS);

      ctx.slots.inject(SECTION_SLOT, () =>
        ctx.slots.register({ name: SECTION_SLOT, id: 'dsh-azure-glass', order: 35, label: () => t('nav'), locale: NS }, SettingsSection)
      );

      const TAB_ID = 'dsh-azure-glass';
      const registerRightSidebar = (tabs) => {
        if (!tabs || typeof tabs.register !== 'function') return void 0;
        try {
          const disposer = tabs.register({
            id: TAB_ID,
            kind: 'azure-glass',
            priority: 'extension',
            title: () => '苍蓝琉璃',
            guide: [{
              id: TAB_ID,
              order: 42,
              title: () => '苍蓝琉璃',
              description: () => '长会话流畅虚拟化、壁纸玻璃质感、配色排版与大文件极速查看',
              icon: AzureGlassIcon
            }]
          });
          return typeof disposer === 'function' ? disposer : void 0;
        } catch (err) {
          console.warn('[dsh-azure-glass] sidebar tab registration failed:', err);
          return void 0;
        }
      };

      if (typeof ctx.inject === 'function') {
        try {
          ctx.inject(['sidebarRightTabs'], (subCtx) => {
            const subTabs = typeof subCtx?.get === 'function' ? subCtx.get('sidebarRightTabs') : subCtx?.sidebarRightTabs;
            const disposer = registerRightSidebar(subTabs);
            if (disposer) subCtx.effect(() => disposer);
          });
          ctx.inject(['sessions'], (sCtx) => {
            const svc = typeof sCtx?.get === 'function' ? sCtx.get('sessions') : sCtx?.sessions;
            attachSessionsService(svc, sCtx);
          });
          ctx.inject(['theme'], (tCtx) => {
            const svc = typeof tCtx?.get === 'function' ? tCtx.get('theme') : tCtx?.theme;
            if (!svc) return;
            dshThemeService = svc;
            const onThemeChanged = () => {
              applyVisualStyles();
              notifyDshThemeListeners();
              scheduleMermaidScan(true);
            };
            const off = typeof tCtx?.on === 'function' ? tCtx.on('theme/change', onThemeChanged) : null;
            tCtx.effect?.(() => () => {
              if (typeof off === 'function') off();
              if (dshThemeService === svc) dshThemeService = null;
            });
          });
          ctx.inject(['betterSidebar'], (bsCtx) => {
            const bs = typeof bsCtx?.get === 'function' ? bsCtx.get('betterSidebar') : bsCtx?.betterSidebar;
            if (!bs || typeof bs.registerFileViewer !== 'function') return;
            try {
              const disposer = bs.registerFileViewer({
                id: 'dsh-azure-glass:large-file',
                title: () => '苍蓝琉璃 · 大文件极速查看',
                icon: (size) => jsx(AzureGlassIcon, { size }),
                exts: [],
                priority: 50,
                fetchStrategy: 'custom',
                detect: detectLargeTextFile,
                load: (relPath, scope, signal) => loadLargeFileForSidebar(bsCtx, relPath, scope, signal),
                component: (viewerProps) => jsx(LargeFileHostViewer, viewerProps)
              });
              if (typeof disposer === 'function') bsCtx.effect(() => disposer);
            } catch (err) {
              console.warn('[dsh-azure-glass] betterSidebar file viewer registration failed:', err);
            }
          });
        } catch (err) {
          console.warn('[dsh-azure-glass] sidebar tab injection failed:', err);
        }
      }

      ctx.slots.inject('conversation.session.header.utilities', () =>
        ctx.slots.register({ name: 'conversation.session.header.utilities', id: 'dsh-azure-glass-quick', order: 90, label: '苍蓝琉璃快捷' }, HeaderUtilities)
      );

      ctx.slots.inject(ISLAND_RIGHT_SLOT, () =>
        ctx.slots.register({ name: ISLAND_RIGHT_SLOT, id: 'dsh-azure-glass-composer-island-trigger', order: 85, inject: () => ({}) }, ComposerIslandSurface)
      );

      ctx.slots.inject('conversation.composer.dock', () =>
        ctx.slots.register(
          { name: 'conversation.composer.dock', id: 'dsh-azure-glass-observer', order: 12, label: '苍蓝观察窗' },
          (props) => jsx(AzureObserverCapsule, { sessionId: props && props.sessionId })
        )
      );

      ctx.slots.inject('sidebar.right.pane.tab', () =>
        ctx.slots.register({ name: 'sidebar.right.pane.tab', key: TAB_ID }, RightSidebarPanel)
      );
      ctx.slots.inject('sidebar.right.pane.tab.title', () =>
        ctx.slots.register({ name: 'sidebar.right.pane.tab.title', key: TAB_ID }, RightSidebarTitle)
      );

      try {
        ctx.slots.inject('plugins.detail.section', () =>
          ctx.slots.register({
            name: 'plugins.detail.section',
            id: 'dsh-azure-glass-detail-updater',
            order: 32,
            inject: () => ({})
          }, PluginDetailUpdateSection)
        );
      } catch {}

      startDomObserver();
      void loadFromHost();
    }

    const cached = readCache();
    if (cached) config = cached;
    try {
      applyAll();
      startDomObserver();
    } catch (err) {
      console.warn('[dsh-azure-glass] boot error:', err);
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  }
});
