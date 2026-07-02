(function () {
  'use strict';

  // ========== 国际化 ==========
  function i18n(key) {
    try {
      return browser.i18n.getMessage(key) || key;
    } catch (e) {
      return key;
    }
  }

  // ========== 常量定义 ==========
  const LIGHTBOX_ENABLED_KEY = 'lightboxEnabled';
  const LIGHTBOX_SIZE_KEY = 'lightboxSize';
  const SESSION_POSITION_PREFIX = 'dark-mode-lightbox-position';
  const DEFAULT_SIZE = 40;
  const UI_HIDE_DELAY = 3000;
  const MIN_WIDTH_PX = 300;
  const MAX_WIDTH_RATIO = 0.8;
  const ZOOM_MIN = 0.5;
  const ZOOM_MAX = 4;
  const ZOOM_STEP = 0.1;
  const SLIDESHOW_INTERVAL = 3000;
  const DOUBLE_CLICK_ZOOM = 2;
  const SLIDESHOW_PROGRESS_TICK = 50;
  const VIDEO_POSITION_PREFIX = 'dark-mode-lightbox-video-position';
  const PLAYBACK_RATES = [0.5, 1, 1.25, 1.5, 2];
  const VOLUME_INDICATOR_DELAY = 2000;
  const LONG_PRESS_DELAY = 500;
  const FAST_FORWARD_RATE = 3;
  const VOLUME_STEP = 0.005;
  const POSITION_SAVE_INTERVAL = 5000;

  // ========== SVG 图标 ==========
  const SVG_ICONS = {
    close: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    minimize: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    prev: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    next: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg>',
    pause: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
    download: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
    external: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    speed: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    pip: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><rect x="13" y="11" width="7" height="5" rx="1"/></svg>',
    camera: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    loop: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    volume: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
    muted: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>',
    image: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    settings: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
  };

  // ========== 状态 ==========
  const state = {
    enabled: true,
    pluginEnabled: false,
    gallery: [],
    currentIndex: 0,
    isOpen: false,
    size: DEFAULT_SIZE,
    isMinimized: false,
    zoomLevel: 1,
    uiHideTimer: null,
    slideshowTimer: null,
    slideshowProgressTimer: null,
    slideshowStartTime: 0,
    isSlideshowPlaying: false,
    dragOffset: { x: 0, y: 0 },
    isDragging: false,
    preloadedUrls: new Set(),
    playbackRate: 1,
    isLooping: false,
    isMuted: false,
    volumeIndicatorTimer: null,
    fastForwardActive: false,
    buttonSize: 48,
    seenSrcs: new Set()
  };

  // ========== 悬浮按钮 (FAB) ==========
  function applyButtonSize(size) {
    state.buttonSize = size;
    const fab = document.getElementById('dark-mode-lightbox-fab');
    const settingsFab = document.getElementById('dark-mode-settings-fab');
    const px = size + 'px';
    if (fab) {
      fab.style.width = px;
      fab.style.height = px;
    }
    if (settingsFab) {
      settingsFab.style.width = px;
      settingsFab.style.height = px;
      // 设置按钮位置随大小调整，避免与 FAB 重叠
      const offset = size + 32;
      settingsFab.style.right = offset + 'px';
    }
  }

  function createFabButton() {
    if (document.getElementById('dark-mode-lightbox-fab')) return;

    const fab = document.createElement('button');
    fab.id = 'dark-mode-lightbox-fab';
    fab.innerHTML = SVG_ICONS.image;
    fab.title = i18n('openLightbox');

    fab.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: ${state.buttonSize}px;
      height: ${state.buttonSize}px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      z-index: 99995;
      transition: background 0.2s ease, transform 0.2s ease;
      padding: 0;
    `;

    fab.addEventListener('mouseenter', () => {
      fab.style.background = 'rgba(0, 0, 0, 0.8)';
      fab.style.transform = 'scale(1.05)';
    });

    fab.addEventListener('mouseleave', () => {
      fab.style.background = 'rgba(0, 0, 0, 0.6)';
      fab.style.transform = 'scale(1)';
    });

    fab.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(0);
    });

    document.documentElement.appendChild(fab);
  }

  function showFabButton() {
    const fab = document.getElementById('dark-mode-lightbox-fab');
    if (fab) fab.style.display = 'flex';
  }

  function hideFabButton() {
    const fab = document.getElementById('dark-mode-lightbox-fab');
    if (fab) fab.style.display = 'none';
  }

  function removeFabButton() {
    const fab = document.getElementById('dark-mode-lightbox-fab');
    if (fab) fab.remove();
  }

  function updateFabVisibility() {
    if (state.enabled && state.pluginEnabled) {
      createFabButton();
      if (state.isOpen || state.isMinimized) {
        hideFabButton();
      } else {
        showFabButton();
      }
    } else {
      removeFabButton();
    }
  }

  function applyPluginEnabled(enabled) {
    state.pluginEnabled = enabled;
    if (enabled) {
      createSettingsPanel();
      updateFabVisibility();
    } else {
      if (state.isOpen) closeLightbox();
      removeFabButton();
      removeSettingsPanel();
    }
  }

  // ========== 设置面板 (齿轮按钮 + 卡片) ==========
  function createSettingsPanel() {
    if (document.getElementById('dark-mode-settings-fab')) return;

    // 齿轮按钮
    const settingsFab = document.createElement('button');
    settingsFab.id = 'dark-mode-settings-fab';
    settingsFab.innerHTML = SVG_ICONS.settings;
    settingsFab.title = i18n('extensionSettings');
    settingsFab.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: ${state.buttonSize + 32}px;
      width: ${state.buttonSize}px;
      height: ${state.buttonSize}px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      z-index: 99995;
      transition: background 0.2s ease, transform 0.2s ease;
      padding: 0;
    `;

    settingsFab.addEventListener('mouseenter', () => {
      settingsFab.style.background = 'rgba(0, 0, 0, 0.8)';
      settingsFab.style.transform = 'scale(1.05)';
    });
    settingsFab.addEventListener('mouseleave', () => {
      settingsFab.style.background = 'rgba(0, 0, 0, 0.6)';
      settingsFab.style.transform = 'scale(1)';
    });

    // 卡片 (默认隐藏)
    const panel = document.createElement('div');
    panel.id = 'dark-mode-settings-panel';
    panel.style.cssText = `
      position: fixed;
      bottom: ${state.buttonSize + 40}px;
      right: 20px;
      width: 280px;
      max-height: 80vh;
      overflow-y: auto;
      background: rgba(20, 20, 30, 0.95);
      backdrop-filter: blur(10px);
      color: #fff;
      border-radius: 12px;
      padding: 15px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      z-index: 99994;
      display: none;
      font-family: sans-serif;
      font-size: 13px;
    `;
    panel.innerHTML = `
      <div style="margin-bottom: 12px;">
        <label style="display:flex; justify-content:space-between; align-items:center;">
          <span>${i18n('enableDarkMode')}</span>
          <button id="panel-toggle-dark" type="button" style="padding:4px 12px; border-radius:6px; border:none; cursor:pointer; background:#444; color:#fff;">${i18n('off')}</button>
        </label>
      </div>
      <div style="margin-bottom: 12px;">
        <label style="display:block;">
          <span style="display:block; margin-bottom:6px;">${i18n('backgroundColor')}</span>
          <input type="color" id="panel-bg-color" value="#1a1a2e" style="width:100%; height:32px; border:none; border-radius:6px; cursor:pointer; background:transparent;">
        </label>
      </div>
      <div style="margin-bottom: 12px;">
        <label style="display:block;">
          <span style="display:block; margin-bottom:6px;">${i18n('darkness')}: <span id="panel-darkness-value">80%</span></span>
          <input type="range" id="panel-darkness-slider" min="0" max="100" value="80" step="5" style="width:100%;">
        </label>
      </div>
      <div style="margin-bottom: 12px;">
        <label style="display:flex; align-items:center; gap:6px;">
          <input type="checkbox" id="panel-follow-system">
          <span>${i18n('followSystemTheme')}</span>
        </label>
      </div>
      <div style="margin-bottom: 12px;">
        <label style="display:flex; align-items:center; gap:6px;">
          <input type="checkbox" id="panel-enable-lightbox" checked>
          <span>${i18n('enableLightboxViewer')}</span>
        </label>
      </div>
      <div style="margin-bottom: 12px;">
        <label style="display:block;">
          <span style="display:block; margin-bottom:6px;">${i18n('lightboxSize')}: <span id="panel-lightbox-size-value">40%</span></span>
          <input type="range" id="panel-lightbox-size-slider" min="20" max="80" value="40" step="5" style="width:100%; margin-bottom:6px;">
        </label>
        <div style="display:flex; gap:4px; flex-wrap:wrap;">
          <button class="panel-size-btn" data-size="25" style="flex:1; padding:4px 8px; border-radius:6px; border:1px solid transparent; background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.7); cursor:pointer; font-size:11px;">${i18n('sizeCompact')}</button>
          <button class="panel-size-btn active" data-size="40" style="flex:1; padding:4px 8px; border-radius:6px; border:1px solid transparent; background:linear-gradient(135deg,#fff,#b3d4ff); color:#000; cursor:pointer; font-size:11px; font-weight:600;">${i18n('sizeStandard')}</button>
          <button class="panel-size-btn" data-size="60" style="flex:1; padding:4px 8px; border-radius:6px; border:1px solid transparent; background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.7); cursor:pointer; font-size:11px;">${i18n('sizeSpacious')}</button>
          <button class="panel-size-btn" data-size="80" style="flex:1; padding:4px 8px; border-radius:6px; border:1px solid transparent; background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.7); cursor:pointer; font-size:11px;">${i18n('sizeImmersive')}</button>
        </div>
      </div>
    `;

    // 点击齿轮按钮切换卡片显示
    settingsFab.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = panel.style.display === 'none';
      panel.style.display = isHidden ? 'block' : 'none';
    });

    // 点击卡片外部隐藏卡片
    document.addEventListener('click', (e) => {
      if (panel.style.display === 'block' &&
        !panel.contains(e.target) &&
        !settingsFab.contains(e.target)) {
        panel.style.display = 'none';
      }
    });

    // 卡片内控制项事件
    const toggleDarkBtn = panel.querySelector('#panel-toggle-dark');
    toggleDarkBtn.addEventListener('click', () => {
      browser.runtime.sendMessage({ type: 'TOGGLE_DARK_MODE' }).then(response => {
        if (response && response.success) {
          updatePanelUI(response.settings);
        }
      }).catch(() => { });
    });

    panel.querySelector('#panel-bg-color').addEventListener('change', (e) => {
      browser.runtime.sendMessage({ type: 'SET_BG_COLOR', payload: { bgColor: e.target.value } }).catch(() => { });
    });

    const darknessSlider = panel.querySelector('#panel-darkness-slider');
    const darknessValue = panel.querySelector('#panel-darkness-value');
    darknessSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      darknessValue.textContent = `${val}%`;
      browser.runtime.sendMessage({ type: 'SET_BG_DARKNESS', payload: { bgDarkness: val } }).catch(() => { });
    });

    panel.querySelector('#panel-follow-system').addEventListener('change', () => {
      browser.runtime.sendMessage({ type: 'TOGGLE_FOLLOW_SYSTEM' }).then(response => {
        if (response && response.success) {
          updatePanelUI(response.settings);
        }
      }).catch(() => { });
    });

    panel.querySelector('#panel-enable-lightbox').addEventListener('change', (e) => {
      browser.runtime.sendMessage({ type: 'TOGGLE_LIGHTBOX', payload: { enabled: e.target.checked } }).catch(() => { });
    });

    const sizeSlider = panel.querySelector('#panel-lightbox-size-slider');
    const sizeValue = panel.querySelector('#panel-lightbox-size-value');
    const sizeBtns = panel.querySelectorAll('.panel-size-btn');
    sizeSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      sizeValue.textContent = `${val}%`;
      sizeBtns.forEach(b => {
        if (parseInt(b.dataset.size) === val) {
          b.classList.add('active');
          b.style.background = 'linear-gradient(135deg,#fff,#b3d4ff)';
          b.style.color = '#000';
          b.style.fontWeight = '600';
        } else {
          b.classList.remove('active');
          b.style.background = 'rgba(255,255,255,0.1)';
          b.style.color = 'rgba(255,255,255,0.7)';
          b.style.fontWeight = 'normal';
        }
      });
      browser.runtime.sendMessage({ type: 'SET_LIGHTBOX_SIZE', payload: { size: val } }).catch(() => { });
    });

    sizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.size);
        sizeSlider.value = val;
        sizeValue.textContent = `${val}%`;
        sizeBtns.forEach(b => {
          if (parseInt(b.dataset.size) === val) {
            b.classList.add('active');
            b.style.background = 'linear-gradient(135deg,#fff,#b3d4ff)';
            b.style.color = '#000';
            b.style.fontWeight = '600';
          } else {
            b.classList.remove('active');
            b.style.background = 'rgba(255,255,255,0.1)';
            b.style.color = 'rgba(255,255,255,0.7)';
            b.style.fontWeight = 'normal';
          }
        });
        browser.runtime.sendMessage({ type: 'SET_LIGHTBOX_SIZE', payload: { size: val } }).catch(() => { });
      });
    });

    document.documentElement.appendChild(settingsFab);
    document.documentElement.appendChild(panel);

    // 初始化卡片 UI
    browser.runtime.sendMessage({ type: 'GET_SETTINGS' }).then(response => {
      if (response && response.success) {
        updatePanelUI(response.settings);
      }
    }).catch(() => { });

    // 监听 storage 变化同步卡片
    browser.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      if (changes.enabled || changes.bgColor || changes.bgDarkness ||
        changes.followSystem || changes.lightboxEnabled || changes.lightboxSize ||
        changes.buttonSize) {
        browser.runtime.sendMessage({ type: 'GET_SETTINGS' }).then(response => {
          if (response && response.success) {
            updatePanelUI(response.settings);
          }
        }).catch(() => { });
      }
    });
  }

  function updatePanelUI(settings) {
    const panel = document.getElementById('dark-mode-settings-panel');
    if (!panel) return;

    const toggleDarkBtn = panel.querySelector('#panel-toggle-dark');
    if (settings.enabled) {
      toggleDarkBtn.textContent = i18n('on');
      toggleDarkBtn.style.background = '#22c55e';
    } else {
      toggleDarkBtn.textContent = i18n('off');
      toggleDarkBtn.style.background = '#444';
    }

    const bgColor = settings.bgColor !== undefined ? settings.bgColor : '#1a1a2e';
    panel.querySelector('#panel-bg-color').value = bgColor;

    const bgDarkness = settings.bgDarkness !== undefined ? settings.bgDarkness : 80;
    panel.querySelector('#panel-darkness-slider').value = bgDarkness;
    panel.querySelector('#panel-darkness-value').textContent = `${bgDarkness}%`;

    panel.querySelector('#panel-follow-system').checked = settings.followSystem || false;
    panel.querySelector('#panel-enable-lightbox').checked = settings.lightboxEnabled !== false;

    const lightboxSize = settings.lightboxSize !== undefined ? settings.lightboxSize : 40;
    panel.querySelector('#panel-lightbox-size-slider').value = lightboxSize;
    panel.querySelector('#panel-lightbox-size-value').textContent = `${lightboxSize}%`;

    const sizeBtns = panel.querySelectorAll('.panel-size-btn');
    sizeBtns.forEach(b => {
      if (parseInt(b.dataset.size) === lightboxSize) {
        b.classList.add('active');
        b.style.background = 'linear-gradient(135deg,#fff,#b3d4ff)';
        b.style.color = '#000';
        b.style.fontWeight = '600';
      } else {
        b.classList.remove('active');
        b.style.background = 'rgba(255,255,255,0.1)';
        b.style.color = 'rgba(255,255,255,0.7)';
        b.style.fontWeight = 'normal';
      }
    });
  }

  function removeSettingsPanel() {
    const fab = document.getElementById('dark-mode-settings-fab');
    const panel = document.getElementById('dark-mode-settings-panel');
    if (fab) fab.remove();
    if (panel) panel.remove();
  }

  // ========== 灯箱宽度 & body margin 同步 ==========
  function getLightboxWidthPx() {
    const overlay = document.getElementById('dark-mode-lightbox-overlay');
    if (!overlay) return 0;
    return overlay.offsetWidth;
  }

  function updateBodyMargin() {
    const overlay = document.getElementById('dark-mode-lightbox-overlay');
    if (!overlay || !state.isOpen) return;
    if (overlay.classList.contains('minimized')) {
      document.body.style.marginRight = '80px';
    } else {
      document.body.style.marginRight = getLightboxWidthPx() + 'px';
    }
  }

  // ========== 媒体提取 ==========
  function extractMediaFromPage() {
    const media = [];
    const seenSrcs = new Set();
    const images = document.querySelectorAll('img[src]:not([src=""])');
    const videos = document.querySelectorAll('video');

    images.forEach(img => {
      if (img.offsetWidth > 50 && img.offsetHeight > 50) {
        const src = img.src || img.dataset.src || img.dataset.original;
        if (src && !src.includes('data:image/svg+xml') && !seenSrcs.has(src)) {
          seenSrcs.add(src);
          media.push({
            type: 'image',
            src: src,
            alt: img.alt || '',
            title: img.title || '',
            element: img
          });
        }
      }
    });

    videos.forEach(video => {
      const src = video.src || video.currentSrc ||
        (video.querySelector('source[src]') || {}).src;
      if (src && !seenSrcs.has(src)) {
        seenSrcs.add(src);
        media.push({
          type: 'video',
          src: src,
          poster: video.poster || '',
          alt: video.getAttribute('aria-label') || '',
          title: video.title || '',
          element: video
        });
      }
    });

    return media;
  }

  // ========== HTML 结构 ==========
  function createLightboxHTML() {
    const overlay = document.createElement('div');
    overlay.id = 'dark-mode-lightbox-overlay';
    overlay.innerHTML = `
      <div id="dark-mode-lightbox-resize-handle"></div>
      <div id="dark-mode-lightbox-toolbar">
        <div class="toolbar-group">
          <button class="size-btn" data-size="25">紧凑</button>
          <button class="size-btn active" data-size="40">标准</button>
          <button class="size-btn" data-size="60">宽敞</button>
          <button class="size-btn" data-size="80">沉浸</button>
        </div>
        <div class="toolbar-group">
          <button class="toolbar-btn" id="dark-mode-lightbox-slideshow" title="幻灯片播放">${SVG_ICONS.play}</button>
          <button class="toolbar-btn" id="dark-mode-lightbox-download" title="下载图片">${SVG_ICONS.download}</button>
          <button class="toolbar-btn" id="dark-mode-lightbox-newtab" title="新标签打开原图">${SVG_ICONS.external}</button>
        </div>
        <div class="toolbar-group" id="dark-mode-lightbox-video-controls">
          <button class="toolbar-btn" id="dark-mode-lightbox-speed" title="倍速 (S)">1x</button>
          <button class="toolbar-btn" id="dark-mode-lightbox-pip" title="画中画 (P)">${SVG_ICONS.pip}</button>
          <button class="toolbar-btn" id="dark-mode-lightbox-screenshot" title="截图 (C)">${SVG_ICONS.camera}</button>
          <button class="toolbar-btn" id="dark-mode-lightbox-loop" title="循环播放 (L)">${SVG_ICONS.loop}</button>
          <button class="toolbar-btn" id="dark-mode-lightbox-mute" title="静音 (M)">${SVG_ICONS.volume}</button>
        </div>
        <div class="toolbar-group">
          <button class="toolbar-btn" id="dark-mode-lightbox-minimize" title="最小化">${SVG_ICONS.minimize}</button>
          <button class="toolbar-btn" id="dark-mode-lightbox-close" title="关闭">${SVG_ICONS.close}</button>
        </div>
      </div>
      <div id="dark-mode-lightbox-content">
        <div id="dark-mode-lightbox-nav">
          <button id="dark-mode-lightbox-prev">${SVG_ICONS.prev}</button>
          <button id="dark-mode-lightbox-next">${SVG_ICONS.next}</button>
        </div>
        <div id="dark-mode-lightbox-media-container"></div>
        <div id="dark-mode-lightbox-speed-badge"></div>
        <div id="dark-mode-lightbox-volume-indicator"></div>
        <div id="dark-mode-lightbox-fastforward-hint"></div>
        <div id="dark-mode-lightbox-restore-hint"></div>
      </div>
      <div id="dark-mode-lightbox-info">1 / 1</div>
      <div id="dark-mode-lightbox-progress"><div id="dark-mode-lightbox-progress-bar"></div></div>
      <div id="dark-mode-lightbox-slideshow-progress"><div id="dark-mode-lightbox-slideshow-progress-bar"></div></div>
      <div id="dark-mode-lightbox-thumbnails"></div>
      <div class="minimized-icon">${SVG_ICONS.image}</div>
    `;
    return overlay;
  }

  // ========== 停止当前视频 ==========
  function stopCurrentVideo() {
    const media = document.getElementById('dark-mode-lightbox-media');
    if (media && media.tagName === 'VIDEO') {
      saveCurrentVideoPosition(media);
      try {
        media.pause();
        media.removeAttribute('src');
        media.load();
      } catch (e) { }
    }
  }

  // ========== 渲染媒体 ==========
  function renderMedia(index) {
    if (index < 0 || index >= state.gallery.length) return;

    // 切换前停止上一个视频
    stopCurrentVideo();

    state.currentIndex = index;
    state.zoomLevel = 1;
    state.dragOffset = { x: 0, y: 0 };
    state.isDragging = false;

    const item = state.gallery[index];
    const container = document.getElementById('dark-mode-lightbox-media-container');
    const info = document.getElementById('dark-mode-lightbox-info');
    const thumbnails = document.getElementById('dark-mode-lightbox-thumbnails');
    const progressBar = document.getElementById('dark-mode-lightbox-progress-bar');

    if (!container) return;
    container.innerHTML = '';

    // 切换到视频时停止幻灯片自动播放
    if (item.type === 'video') {
      stopSlideshow();
    }

    if (item.type === 'image') {
      const img = document.createElement('img');
      img.id = 'dark-mode-lightbox-media';
      img.src = item.src;
      img.alt = item.alt;
      img.loading = 'lazy';

      // 双击放大/缩小
      img.addEventListener('dblclick', handleDoubleClick);

      // 放大后拖拽移动
      setupZoomDrag(img);

      // 加载完成后：预加载相邻图片、更新悬浮信息
      img.addEventListener('load', () => {
        preloadAdjacentImages(index);
        updateMediaInfo(item, img);
      });
      // 兼容已缓存图片(某些浏览器load事件不再触发)
      if (img.complete) {
        preloadAdjacentImages(index);
        updateMediaInfo(item, img);
      }

      container.appendChild(img);
    } else if (item.type === 'video') {
      const video = document.createElement('video');
      video.id = 'dark-mode-lightbox-media';
      video.className = 'video';
      video.src = item.src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      container.appendChild(video);
      setupVideoEvents(video, item);
      updateSpeedBadge();
    }

    if (info) {
      info.textContent = `${index + 1} / ${state.gallery.length}${item.title ? ' - ' + item.title : ''}`;
    }

    if (thumbnails) {
      thumbnails.innerHTML = '';
      state.gallery.forEach((media, i) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail-item';
        if (i === index) thumb.classList.add('active');
        if (media.type === 'video') thumb.classList.add('video-thumbnail');
        thumb.dataset.index = String(i);

        const img = document.createElement('img');
        img.src = media.type === 'video' ? (media.poster || media.src) : media.src;
        img.alt = `Thumbnail ${i + 1}`;
        thumb.appendChild(img);

        if (media.type === 'video') {
          const playIcon = document.createElement('div');
          playIcon.className = 'thumbnail-play-icon';
          playIcon.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="white"><polygon points="5 3 19 12 5 21"/></svg>';
          thumb.appendChild(playIcon);
        }

        thumbnails.appendChild(thumb);
      });

      // 当前缩略图自动滚动到可见区域
      const activeThumb = thumbnails.querySelector('.thumbnail-item.active');
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }

    if (progressBar) {
      progressBar.style.width = `${((index + 1) / state.gallery.length) * 100}%`;
    }

    toggleVideoControls(item.type === 'video');
    const dlBtn = document.getElementById('dark-mode-lightbox-download');
    if (dlBtn) {
      dlBtn.title = item.type === 'video' ? '下载视频' : '下载图片';
    }

    savePosition();
    resetUITimer();
  }

  // ========== 打开灯箱 ==========
  function openLightbox(startIndex) {
    if (!state.enabled) return;

    state.gallery = extractMediaFromPage();
    if (state.gallery.length === 0) return;

    if (startIndex < 0 || startIndex >= state.gallery.length) {
      startIndex = 0;
    }

    let overlay = document.getElementById('dark-mode-lightbox-overlay');
    if (!overlay) {
      overlay = createLightboxHTML();
      document.documentElement.appendChild(overlay);
      bindPanelEvents(overlay);
      applySize(state.size);
    }

    document.documentElement.classList.add('dark-mode-lightbox-active');
    state.isOpen = true;
    state.isMinimized = false;
    overlay.classList.remove('minimized');

    hideFabButton();
    renderMedia(startIndex);
    resetUITimer();
    updateBodyMargin();
  }

  // ========== 关闭灯箱 ==========
  function closeLightbox() {
    if (!state.isOpen) return;

    stopCurrentVideo();
    stopSlideshow();
    savePosition();

    document.body.style.marginRight = '';
    document.documentElement.classList.remove('dark-mode-lightbox-active');
    state.isOpen = false;
    state.isMinimized = false;
    state.zoomLevel = 1;
    state.dragOffset = { x: 0, y: 0 };
    state.isDragging = false;

    if (state.uiHideTimer) {
      clearTimeout(state.uiHideTimer);
      state.uiHideTimer = null;
    }
    if (state.volumeIndicatorTimer) {
      clearTimeout(state.volumeIndicatorTimer);
      state.volumeIndicatorTimer = null;
    }
    toggleVideoControls(false);
    showFabButton();
  }

  // ========== 导航 ==========
  function navigate(direction) {
    if (state.gallery.length === 0) return;
    let newIndex = state.currentIndex + direction;
    if (newIndex < 0) newIndex = state.gallery.length - 1;
    if (newIndex >= state.gallery.length) newIndex = 0;
    renderMedia(newIndex);
  }

  // ========== 挡位大小 ==========
  function applySize(sizePercent) {
    state.size = sizePercent;
    const overlay = document.getElementById('dark-mode-lightbox-overlay');
    if (overlay) {
      overlay.style.setProperty('--lightbox-width', `${sizePercent}vw`);
      if (state.isOpen) {
        // 立即更新（使用计算值）
        const vw = window.innerWidth * (sizePercent / 100);
        document.body.style.marginRight = vw + 'px';
        // 过渡完成后再修正
        setTimeout(updateBodyMargin, 350);
      }
    }
    document.querySelectorAll('.size-btn').forEach(btn => {
      if (parseInt(btn.dataset.size, 10) === sizePercent) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function saveSizeToStorage(sizePercent) {
    state.size = sizePercent;
    browser.storage.local.set({ [LIGHTBOX_SIZE_KEY]: sizePercent }).catch(() => { });
  }

  // ========== 缩放（结合拖拽位移） ==========
  function applyZoom() {
    const media = document.getElementById('dark-mode-lightbox-media');
    if (!media) return;
    media.style.transform = `translate(${state.dragOffset.x}px, ${state.dragOffset.y}px) scale(${state.zoomLevel})`;
    if (state.zoomLevel !== 1) {
      media.classList.add('zoomed');
    } else {
      media.classList.remove('zoomed');
    }
  }

  // ========== 双击放大/缩小 ==========
  function handleDoubleClick(e) {
    const media = e.currentTarget;
    if (!media || media.tagName !== 'IMG') return;

    if (state.zoomLevel === 1) {
      state.zoomLevel = DOUBLE_CLICK_ZOOM;
    } else {
      // 再次双击恢复原始大小并重置拖拽位置
      state.zoomLevel = 1;
      state.dragOffset = { x: 0, y: 0 };
    }
    applyZoom();
  }

  // ========== 放大后拖拽移动 ==========
  function setupZoomDrag(media) {
    media.addEventListener('mousedown', (e) => {
      if (!media.classList.contains('zoomed')) return;
      if (state.zoomLevel <= 1) return;
      if (e.button !== 0) return;

      e.preventDefault();
      media.classList.add('dragging');
      state.isDragging = true;

      const startX = e.clientX;
      const startY = e.clientY;
      const startOffsetX = state.dragOffset.x;
      const startOffsetY = state.dragOffset.y;

      const onMove = (ev) => {
        state.dragOffset.x = startOffsetX + (ev.clientX - startX);
        state.dragOffset.y = startOffsetY + (ev.clientY - startY);
        applyZoom();
      };

      const onUp = () => {
        media.classList.remove('dragging');
        state.isDragging = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  // ========== 图片预加载 ==========
  function preloadAdjacentImages(index) {
    if (state.gallery.length === 0) return;
    const prev = (index - 1 + state.gallery.length) % state.gallery.length;
    const next = (index + 1) % state.gallery.length;

    [prev, next].forEach(i => {
      if (i === index) return;
      const item = state.gallery[i];
      if (item && item.type === 'image' && !state.preloadedUrls.has(item.src)) {
        state.preloadedUrls.add(item.src);
        try {
          const preloadImg = new Image();
          preloadImg.src = item.src;
        } catch (e) { }
      }
    });
  }

  // ========== 幻灯片自动播放 ==========
  function updateSlideshowButton(isPlaying) {
    state.isSlideshowPlaying = isPlaying;
    const btn = document.getElementById('dark-mode-lightbox-slideshow');
    if (btn) {
      btn.innerHTML = isPlaying ? SVG_ICONS.pause : SVG_ICONS.play;
      btn.title = isPlaying ? '暂停幻灯片' : '幻灯片播放';
      btn.classList.toggle('playing', isPlaying);
    }
  }

  function setSlideshowProgress(percent) {
    const bar = document.getElementById('dark-mode-lightbox-slideshow-progress-bar');
    if (bar) bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
  }

  function startSlideshow() {
    if (state.slideshowTimer) return;
    const item = state.gallery[state.currentIndex];
    if (!item || item.type !== 'image') return;

    updateSlideshowButton(true);
    state.slideshowStartTime = Date.now();
    setSlideshowProgress(0);

    state.slideshowProgressTimer = setInterval(() => {
      const elapsed = Date.now() - state.slideshowStartTime;
      setSlideshowProgress((elapsed / SLIDESHOW_INTERVAL) * 100);
    }, SLIDESHOW_PROGRESS_TICK);

    state.slideshowTimer = setTimeout(() => {
      advanceSlideshow();
    }, SLIDESHOW_INTERVAL);
  }

  function advanceSlideshow() {
    stopSlideshowTimers();
    updateSlideshowButton(false);
    setSlideshowProgress(0);

    navigate(1);

    // 切换后若为图片则继续播放，否则停止
    const item = state.gallery[state.currentIndex];
    if (item && item.type === 'image') {
      startSlideshow();
    } else {
      updateSlideshowButton(false);
    }
  }

  function stopSlideshowTimers() {
    if (state.slideshowTimer) {
      clearTimeout(state.slideshowTimer);
      state.slideshowTimer = null;
    }
    if (state.slideshowProgressTimer) {
      clearInterval(state.slideshowProgressTimer);
      state.slideshowProgressTimer = null;
    }
  }

  function stopSlideshow() {
    stopSlideshowTimers();
    updateSlideshowButton(false);
    setSlideshowProgress(0);
  }

  function toggleSlideshow() {
    if (state.slideshowTimer) {
      stopSlideshow();
    } else {
      startSlideshow();
    }
  }

  // ========== 一键下载 ==========
  function downloadCurrentMedia() {
    const item = state.gallery[state.currentIndex];
    if (!item) return;

    const src = item.src;
    let filename = '';
    try {
      filename = src.split('/').pop().split('?')[0] || '';
    } catch (e) { }
    if (!filename || filename.indexOf('.') === -1) {
      const ext = item.type === 'video' ? '.mp4' : '.jpg';
      const fallback = item.type === 'video' ? 'video' : 'image';
      filename = (filename || fallback) + ext;
    }

    const a = document.createElement('a');
    a.href = src;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ========== 新标签打开原图 ==========
  function openInNewTab() {
    const item = state.gallery[state.currentIndex];
    if (!item) return;
    window.open(item.src, '_blank');
  }

  // ========== 图片信息悬浮显示 ==========
  function updateMediaInfo(item, img) {
    const info = document.getElementById('dark-mode-lightbox-info');
    if (!info || !img) return;

    const width = img.naturalWidth || 0;
    const height = img.naturalHeight || 0;

    let format = '未知';
    try {
      const pathName = new URL(item.src, location.href).pathname;
      const ext = pathName.split('.').pop();
      if (ext && ext.length <= 4 && /^[a-zA-Z0-9]+$/.test(ext)) {
        format = ext.toUpperCase();
      }
    } catch (e) { }

    let fileSize = '未知';
    if (item.src && item.src.indexOf('data:image') === 0) {
      try {
        const base64 = item.src.split(',')[1] || '';
        if (base64) {
          fileSize = `${Math.round(base64.length * 0.75 / 1024)} KB`;
        }
      } catch (e) { }
    } else {
      try {
        const entry = performance.getEntriesByName(item.src).pop();
        if (entry && entry.transferSize) {
          fileSize = `${Math.round(entry.transferSize / 1024)} KB`;
        }
      } catch (e) { }
    }

    const tooltip = [
      `尺寸: ${width} × ${height}`,
      `格式: ${format}`,
      `来源: ${item.src}`,
      `文件大小: ${fileSize}`
    ].join('\n');

    info.title = tooltip;
  }

  // ========== 视频专属功能 ==========
  function toggleVideoControls(show) {
    const overlay = document.getElementById('dark-mode-lightbox-overlay');
    if (overlay) overlay.classList.toggle('video-mode', show);
    if (show) {
      updateSpeedBadge();
      updateMuteButton();
      updateLoopButton();
    } else {
      hideVideoOverlays();
    }
  }

  function hideVideoOverlays() {
    ['speed-badge', 'volume-indicator', 'fastforward-hint', 'restore-hint'].forEach(id => {
      const el = document.getElementById('dark-mode-lightbox-' + id);
      if (el) el.classList.remove('visible');
    });
  }

  function updateSpeedBadge() {
    const badge = document.getElementById('dark-mode-lightbox-speed-badge');
    const btn = document.getElementById('dark-mode-lightbox-speed');
    if (badge) {
      badge.textContent = state.playbackRate + 'x';
      badge.classList.add('visible');
    }
    if (btn) btn.textContent = state.playbackRate + 'x';
  }

  function updateMuteButton() {
    const btn = document.getElementById('dark-mode-lightbox-mute');
    if (btn) {
      btn.innerHTML = state.isMuted ? SVG_ICONS.muted : SVG_ICONS.volume;
      btn.classList.toggle('active', state.isMuted);
      btn.title = state.isMuted ? '取消静音 (M)' : '静音 (M)';
    }
  }

  function updateLoopButton() {
    const btn = document.getElementById('dark-mode-lightbox-loop');
    if (btn) {
      btn.classList.toggle('active', state.isLooping);
      btn.title = state.isLooping ? '关闭循环 (L)' : '循环播放 (L)';
    }
  }

  // 倍速播放
  function cyclePlaybackRate() {
    const media = document.getElementById('dark-mode-lightbox-media');
    if (!media || media.tagName !== 'VIDEO') return;
    const idx = PLAYBACK_RATES.indexOf(state.playbackRate);
    const next = PLAYBACK_RATES[(idx + 1) % PLAYBACK_RATES.length];
    state.playbackRate = next;
    try { media.playbackRate = next; } catch (e) { }
    updateSpeedBadge();
  }

  // 画中画模式
  async function togglePictureInPicture() {
    const media = document.getElementById('dark-mode-lightbox-media');
    if (!media || media.tagName !== 'VIDEO') return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await media.requestPictureInPicture();
      }
    } catch (e) { }
  }

  // 视频截图
  function captureVideoFrame() {
    const media = document.getElementById('dark-mode-lightbox-media');
    if (!media || media.tagName !== 'VIDEO') return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = media.videoWidth || 640;
      canvas.height = media.videoHeight || 360;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(media, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `video-frame-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) { }
  }

  // 循环播放
  function toggleLoop() {
    const media = document.getElementById('dark-mode-lightbox-media');
    if (!media || media.tagName !== 'VIDEO') return;
    state.isLooping = !state.isLooping;
    media.loop = state.isLooping;
    updateLoopButton();
  }

  // 静音
  function toggleMute() {
    const media = document.getElementById('dark-mode-lightbox-media');
    if (!media || media.tagName !== 'VIDEO') return;
    state.isMuted = !state.isMuted;
    media.muted = state.isMuted;
    updateMuteButton();
  }

  // 屏幕中央提示
  function showHint(id, text) {
    const el = document.getElementById('dark-mode-lightbox-' + id);
    if (!el) return;
    el.textContent = text;
    el.classList.add('visible');
  }

  function hideHint(id) {
    const el = document.getElementById('dark-mode-lightbox-' + id);
    if (el) el.classList.remove('visible');
  }

  function showVolumeIndicator(percent) {
    const el = document.getElementById('dark-mode-lightbox-volume-indicator');
    if (!el) return;
    el.textContent = `音量 ${percent}%`;
    el.classList.add('visible');
    if (state.volumeIndicatorTimer) clearTimeout(state.volumeIndicatorTimer);
    state.volumeIndicatorTimer = setTimeout(() => {
      el.classList.remove('visible');
      state.volumeIndicatorTimer = null;
    }, VOLUME_INDICATOR_DELAY);
  }

  function showRestoreHint(seconds) {
    showHint('restore-hint', `已恢复至 ${formatTime(seconds)}`);
    setTimeout(() => hideHint('restore-hint'), VOLUME_INDICATOR_DELAY);
  }

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // 播放位置记忆
  function getVideoPositionKey(src) {
    return `${VIDEO_POSITION_PREFIX}-${src}`;
  }

  function saveCurrentVideoPosition(video) {
    if (!video || !video.src) return;
    try {
      sessionStorage.setItem(getVideoPositionKey(video.src), String(video.currentTime || 0));
    } catch (e) { }
  }

  function loadVideoPosition(src) {
    try {
      const saved = sessionStorage.getItem(getVideoPositionKey(src));
      if (saved !== null) {
        const t = parseFloat(saved);
        if (!isNaN(t) && t > 1) return t;
      }
    } catch (e) { }
    return 0;
  }

  // 视频信息显示
  function updateVideoInfo(item, video) {
    const info = document.getElementById('dark-mode-lightbox-info');
    if (!info || !video) return;
    const duration = video.duration;
    const w = video.videoWidth || 0;
    const h = video.videoHeight || 0;
    let format = '未知';
    try {
      const pathName = new URL(item.src, location.href).pathname;
      const ext = pathName.split('.').pop();
      if (ext && ext.length <= 4 && /^[a-zA-Z0-9]+$/.test(ext)) format = ext.toUpperCase();
    } catch (e) { }
    const tooltip = [
      `时长: ${isFinite(duration) ? formatTime(duration) : '未知'}`,
      `分辨率: ${w} × ${h}`,
      `格式: ${format}`,
      `来源: ${item.src}`
    ].join('\n');
    info.title = tooltip;
  }

  // 音量手势 & 长按快进
  function setupVideoGestures(video) {
    let pointerDown = false;
    let lastY = 0;
    let downX = 0;
    let downY = 0;
    let moved = false;
    let longPressTimer = null;
    let originalRate = 1;

    const startPress = (x, y) => {
      pointerDown = true;
      lastY = y;
      downX = x;
      downY = y;
      moved = false;
      originalRate = video.playbackRate;
      longPressTimer = setTimeout(() => {
        if (!moved) {
          state.fastForwardActive = true;
          try { video.playbackRate = FAST_FORWARD_RATE; } catch (e) { }
          showHint('fastforward-hint', '3x快进');
        }
      }, LONG_PRESS_DELAY);
    };

    const movePress = (x, y) => {
      if (!pointerDown) return;
      const totalDx = x - downX;
      const totalDy = y - downY;
      if (Math.abs(totalDy) > 5 || Math.abs(totalDx) > 5) {
        moved = true;
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }
      }
      if (moved && !state.fastForwardActive) {
        const dy = y - lastY;
        if (Math.abs(dy) > 2) {
          let vol = video.volume + (-dy * VOLUME_STEP);
          vol = Math.max(0, Math.min(1, vol));
          video.volume = vol;
          if (vol > 0 && video.muted) {
            video.muted = false;
            state.isMuted = false;
            updateMuteButton();
          }
          showVolumeIndicator(Math.round(vol * 100));
          lastY = y;
        }
      }
    };

    const endPress = () => {
      pointerDown = false;
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      if (state.fastForwardActive) {
        try { video.playbackRate = originalRate; } catch (e) { }
        state.fastForwardActive = false;
        hideHint('fastforward-hint');
      }
    };

    video.addEventListener('mousedown', (e) => {
      if (e.button === 0) startPress(e.clientX, e.clientY);
    });
    video.addEventListener('mousemove', (e) => movePress(e.clientX, e.clientY));
    video.addEventListener('mouseup', endPress);
    video.addEventListener('mouseleave', endPress);
    video.addEventListener('touchstart', (e) => {
      if (e.touches[0]) startPress(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    video.addEventListener('touchmove', (e) => {
      if (e.touches[0]) movePress(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    video.addEventListener('touchend', endPress);
    video.addEventListener('touchcancel', endPress);
  }

  // 绑定视频相关事件
  function setupVideoEvents(video, item) {
    try {
      video.playbackRate = state.playbackRate;
      video.loop = state.isLooping;
      video.muted = state.isMuted;
    } catch (e) { }

    // 元数据加载后：恢复播放位置 & 更新信息
    video.addEventListener('loadedmetadata', () => {
      const saved = loadVideoPosition(item.src);
      const dur = video.duration || 0;
      if (saved > 1 && saved < dur - 1) {
        try {
          video.currentTime = saved;
          showRestoreHint(saved);
        } catch (e) { }
      }
      updateVideoInfo(item, video);
    });

    // 倍速变化时同步徽标（长按快进时跳过，避免覆盖原倍速状态）
    video.addEventListener('ratechange', () => {
      if (!state.fastForwardActive) {
        state.playbackRate = video.playbackRate;
        updateSpeedBadge();
      }
    });

    // 播放进度实时保存（节流）
    let lastSave = 0;
    video.addEventListener('timeupdate', () => {
      const now = Date.now();
      if (now - lastSave > POSITION_SAVE_INTERVAL) {
        lastSave = now;
        saveCurrentVideoPosition(video);
      }
    });

    setupVideoGestures(video);
  }

  // ========== UI 自动隐藏 ==========
  function resetUITimer() {
    const overlay = document.getElementById('dark-mode-lightbox-overlay');
    if (!overlay || !state.isOpen || state.isMinimized) return;

    overlay.classList.remove('ui-hidden');

    if (state.uiHideTimer) {
      clearTimeout(state.uiHideTimer);
    }
    state.uiHideTimer = setTimeout(() => {
      if (state.isOpen && !state.isMinimized && overlay) {
        overlay.classList.add('ui-hidden');
      }
    }, UI_HIDE_DELAY);
  }

  // ========== 位置记忆 ==========
  function getPositionKey() {
    return `${SESSION_POSITION_PREFIX}-${location.href}`;
  }

  function savePosition() {
    try {
      sessionStorage.setItem(getPositionKey(), String(state.currentIndex));
    } catch (e) { }
  }

  function loadPosition() {
    try {
      const saved = sessionStorage.getItem(getPositionKey());
      if (saved !== null) {
        const idx = parseInt(saved, 10);
        if (!isNaN(idx)) return idx;
      }
    } catch (e) { }
    return 0;
  }

  // ========== 最小化/最大化 ==========
  function toggleMinimize(force) {
    const overlay = document.getElementById('dark-mode-lightbox-overlay');
    if (!overlay) return;

    const next = typeof force === 'boolean' ? force : !state.isMinimized;
    state.isMinimized = next;
    if (next) {
      overlay.classList.add('minimized');
      hideFabButton();
      if (state.uiHideTimer) {
        clearTimeout(state.uiHideTimer);
        state.uiHideTimer = null;
      }
    } else {
      overlay.classList.remove('minimized');
      hideFabButton();
      resetUITimer();
    }
    updateBodyMargin();
  }

  // ========== 拖拽调整宽度 ==========
  function setupResizeDrag(overlay) {
    const handle = overlay.querySelector('#dark-mode-lightbox-resize-handle');
    if (!handle) return;

    handle.addEventListener('mousedown', (e) => {
      if (state.isMinimized) return;
      e.preventDefault();
      handle.classList.add('dragging');

      const onMove = (ev) => {
        const newWidth = window.innerWidth - ev.clientX;
        const maxWidth = window.innerWidth * MAX_WIDTH_RATIO;
        const clampedWidth = Math.max(MIN_WIDTH_PX, Math.min(maxWidth, newWidth));
        overlay.style.setProperty('--lightbox-width', `${clampedWidth}px`);
        updateBodyMargin();  // 实时更新body margin
      };

      const onUp = () => {
        handle.classList.remove('dragging');
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);

        const rect = overlay.getBoundingClientRect();
        const widthPercent = Math.round((rect.width / window.innerWidth) * 100);
        saveSizeToStorage(widthPercent);
        applySize(widthPercent);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  // ========== 绑定面板事件 ==========
  function bindPanelEvents(overlay) {
    const closeBtn = overlay.querySelector('#dark-mode-lightbox-close');
    const minimizeBtn = overlay.querySelector('#dark-mode-lightbox-minimize');
    const prevBtn = overlay.querySelector('#dark-mode-lightbox-prev');
    const nextBtn = overlay.querySelector('#dark-mode-lightbox-next');
    const slideshowBtn = overlay.querySelector('#dark-mode-lightbox-slideshow');
    const downloadBtn = overlay.querySelector('#dark-mode-lightbox-download');
    const newTabBtn = overlay.querySelector('#dark-mode-lightbox-newtab');
    const speedBtn = overlay.querySelector('#dark-mode-lightbox-speed');
    const pipBtn = overlay.querySelector('#dark-mode-lightbox-pip');
    const screenshotBtn = overlay.querySelector('#dark-mode-lightbox-screenshot');
    const loopBtn = overlay.querySelector('#dark-mode-lightbox-loop');
    const muteBtn = overlay.querySelector('#dark-mode-lightbox-mute');
    const thumbnails = overlay.querySelector('#dark-mode-lightbox-thumbnails');
    const sizeBtns = overlay.querySelectorAll('.size-btn');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (minimizeBtn) minimizeBtn.addEventListener('click', () => toggleMinimize());
    if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));
    if (slideshowBtn) slideshowBtn.addEventListener('click', toggleSlideshow);
    if (downloadBtn) downloadBtn.addEventListener('click', downloadCurrentMedia);
    if (newTabBtn) newTabBtn.addEventListener('click', openInNewTab);
    if (speedBtn) speedBtn.addEventListener('click', cyclePlaybackRate);
    if (pipBtn) pipBtn.addEventListener('click', togglePictureInPicture);
    if (screenshotBtn) screenshotBtn.addEventListener('click', captureVideoFrame);
    if (loopBtn) loopBtn.addEventListener('click', toggleLoop);
    if (muteBtn) muteBtn.addEventListener('click', toggleMute);

    if (thumbnails) {
      thumbnails.addEventListener('click', (e) => {
        const thumb = e.target.closest('.thumbnail-item');
        if (thumb && thumbnails.contains(thumb)) {
          renderMedia(parseInt(thumb.dataset.index, 10));
        }
      });
    }

    sizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const size = parseInt(btn.dataset.size, 10);
        applySize(size);
        saveSizeToStorage(size);
      });
    });

    // 最小化状态下点击面板恢复展开
    overlay.addEventListener('click', (e) => {
      if (state.isMinimized &&
        (e.target === overlay || e.target.classList.contains('minimized-icon'))) {
        toggleMinimize(false);
      }
    });

    // UI 自动隐藏：鼠标移动重置定时器
    overlay.addEventListener('mousemove', resetUITimer);
    overlay.addEventListener('mouseleave', () => {
      if (state.isOpen && !state.isMinimized) {
        const ov = document.getElementById('dark-mode-lightbox-overlay');
        if (ov) ov.classList.add('ui-hidden');
      }
    });

    setupResizeDrag(overlay);
  }

  // ========== 键盘处理 ==========
  function handleKeydown(e) {
    if (!state.isOpen) return;

    const media = document.getElementById('dark-mode-lightbox-media');
    const isVideo = media && media.tagName === 'VIDEO';

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (isVideo) {
          const step = e.shiftKey ? 10 : 5;
          try { media.currentTime = Math.max(0, media.currentTime - step); } catch (err) { }
        } else {
          navigate(-1);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (isVideo) {
          const step = e.shiftKey ? 10 : 5;
          try {
            const dur = media.duration || 0;
            media.currentTime = Math.min(dur, media.currentTime + step);
          } catch (err) { }
        } else {
          navigate(1);
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeLightbox();
        break;
      case ' ':
        e.preventDefault();
        if (!isVideo) navigate(1);
        break;
      case 's':
      case 'S':
        if (isVideo) { e.preventDefault(); cyclePlaybackRate(); }
        break;
      case 'p':
      case 'P':
        if (isVideo) { e.preventDefault(); togglePictureInPicture(); }
        break;
      case 'c':
      case 'C':
        if (isVideo) { e.preventDefault(); captureVideoFrame(); }
        break;
      case 'l':
      case 'L':
        if (isVideo) { e.preventDefault(); toggleLoop(); }
        break;
      case 'm':
      case 'M':
        if (isVideo) { e.preventDefault(); toggleMute(); }
        break;
      default:
        if (/^[1-9]$/.test(e.key)) {
          e.preventDefault();
          const targetIndex = parseInt(e.key, 10) - 1;
          if (targetIndex < state.gallery.length) {
            renderMedia(targetIndex);
          }
        }
    }
  }

  // ========== 滚轮处理 ==========
  function handleWheel(e) {
    if (!state.isOpen || state.isMinimized) return;

    const overlay = document.getElementById('dark-mode-lightbox-overlay');
    if (!overlay) return;

    const rect = overlay.getBoundingClientRect();
    const inside = e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom;

    if (!inside) return; // 面板外：正常滚动页面

    if (e.ctrlKey) {
      // Ctrl+滚轮缩放图片
      e.preventDefault();
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
      state.zoomLevel = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, state.zoomLevel + delta));
      applyZoom();
    } else {
      // 面板内滚轮切换上一张/下一张
      e.preventDefault();
      if (e.deltaY > 0 || e.deltaX > 0) {
        navigate(1);
      } else {
        navigate(-1);
      }
    }
  }

  // ========== 点击处理 ==========
  function handleMediaClick(e) {
    if (!state.enabled) return;

    const target = e.target;
    if (target.tagName !== 'IMG' && target.tagName !== 'VIDEO') return;

    // 不拦截灯箱面板内部的点击
    const overlay = document.getElementById('dark-mode-lightbox-overlay');
    if (overlay && overlay.contains(target)) return;

    // 校验媒体有效性
    if (target.tagName === 'IMG') {
      if (target.offsetWidth <= 50 || target.offsetHeight <= 50) return;
    }

    const src = target.tagName === 'IMG'
      ? (target.src || target.dataset.src || target.dataset.original)
      : (target.src || target.currentSrc ||
        (target.querySelector('source[src]') || {}).src);

    if (!src) return;
    if (target.tagName === 'IMG' && src.includes('data:image/svg+xml')) return;

    e.preventDefault();
    e.stopPropagation();

    // 重新提取页面媒体以获取最新画廊
    state.gallery = extractMediaFromPage();
    if (state.gallery.length === 0) return;

    let index = state.gallery.findIndex(m => m.element === target || m.src === src);
    if (index === -1) index = loadPosition();

    if (state.isOpen) {
      // 面板已打开：仅更新内容，不重建面板
      renderMedia(index);
    } else {
      openLightbox(index);
    }
  }

  // ========== 懒加载媒体监听 ==========
  function setupLazyLoadObserver() {
    let debounceTimer = null;

    const debouncedCallback = () => {
      // 仅在灯箱已打开时更新（关闭时下次打开会重新提取）
      if (!state.isOpen) return;

      const newMedia = extractMediaFromPage();
      if (newMedia.length === 0) return;

      // 比对已有 gallery 的 src
      const existingSrcs = new Set(state.gallery.map(m => m.src));
      const added = newMedia.filter(m => !existingSrcs.has(m.src));
      if (added.length === 0) return;

      // 追加新媒体到 gallery 末尾
      state.gallery = state.gallery.concat(added);

      // 重建缩略图栏（保持当前索引不变）
      const thumbnails = document.getElementById('dark-mode-lightbox-thumbnails');
      if (!thumbnails) return;
      thumbnails.innerHTML = '';
      state.gallery.forEach((media, i) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail-item';
        if (i === state.currentIndex) thumb.classList.add('active');
        if (media.type === 'video') thumb.classList.add('video-thumbnail');
        thumb.dataset.index = String(i);

        const img = document.createElement('img');
        img.src = media.type === 'video' ? (media.poster || media.src) : media.src;
        img.alt = `Thumbnail ${i + 1}`;
        thumb.appendChild(img);

        if (media.type === 'video') {
          const playIcon = document.createElement('div');
          playIcon.className = 'thumbnail-play-icon';
          playIcon.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="white"><polygon points="5 3 19 12 5 21"/></svg>';
          thumb.appendChild(playIcon);
        }

        thumbnails.appendChild(thumb);
      });

      // 更新计数与进度条
      const info = document.getElementById('dark-mode-lightbox-info');
      if (info) {
        const item = state.gallery[state.currentIndex];
        info.textContent = `${state.currentIndex + 1} / ${state.gallery.length}${item && item.title ? ' - ' + item.title : ''}`;
      }
      const progressBar = document.getElementById('dark-mode-lightbox-progress-bar');
      if (progressBar) {
        progressBar.style.width = `${((state.currentIndex + 1) / state.gallery.length) * 100}%`;
      }
    };

    const observer = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(debouncedCallback, 300);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    state.mutationObserver = observer;
  }

  // ========== 设置加载 ==========
  function loadSettings() {
    browser.storage.local.get([LIGHTBOX_ENABLED_KEY, LIGHTBOX_SIZE_KEY, 'buttonSize', 'pluginEnabled']).then(result => {
      state.enabled = result[LIGHTBOX_ENABLED_KEY] !== false;
      if (typeof result[LIGHTBOX_SIZE_KEY] === 'number') {
        state.size = result[LIGHTBOX_SIZE_KEY];
      }
      if (typeof result.buttonSize === 'number') {
        state.buttonSize = result.buttonSize;
      }
      state.pluginEnabled = !!result.pluginEnabled;
      applySize(state.size);
      applyButtonSize(state.buttonSize);
      applyPluginEnabled(state.pluginEnabled);
    }).catch(() => { });
  }

  // ========== 消息处理 ==========
  function setupMessageListener() {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (!message) return;

      switch (message.type) {
        case 'UPDATE_SETTINGS':
          if (message.payload && message.payload.pluginEnabled !== undefined) {
            applyPluginEnabled(message.payload.pluginEnabled);
          }
          if (message.payload && typeof message.payload.buttonSize === 'number') {
            applyButtonSize(message.payload.buttonSize);
          }
          if (message.payload && typeof message.payload.lightboxSize === 'number') {
            applySize(message.payload.lightboxSize);
            if (state.isOpen) updateBodyMargin();
          }
          if (message.payload && message.payload.lightboxEnabled !== undefined) {
            state.enabled = !!message.payload.lightboxEnabled;
            browser.storage.local.set({ [LIGHTBOX_ENABLED_KEY]: state.enabled }).catch(() => { });
            if (!state.enabled) closeLightbox();
            updateFabVisibility();
          }
          break;
        case 'TOGGLE_LIGHTBOX':
          state.enabled = !!(message.payload && message.payload.enabled);
          browser.storage.local.set({ [LIGHTBOX_ENABLED_KEY]: state.enabled }).catch(() => { });
          if (!state.enabled) closeLightbox();
          updateFabVisibility();
          break;
        case 'SET_LIGHTBOX_SIZE':
          if (message.payload && typeof message.payload.size === 'number') {
            applySize(message.payload.size);
            saveSizeToStorage(message.payload.size);
            if (state.isOpen) updateBodyMargin();
          }
          break;
        case 'SET_BUTTON_SIZE':
          if (message.payload && typeof message.payload.size === 'number') {
            applyButtonSize(message.payload.size);
          }
          break;
        case 'GET_LIGHTBOX_STATE':
          sendResponse({
            enabled: state.enabled,
            isOpen: state.isOpen,
            isMinimized: state.isMinimized,
            galleryLength: state.gallery.length,
            currentIndex: state.currentIndex,
            size: state.size
          });
          break;
        case 'CLOSE_LIGHTBOX':
          closeLightbox();
          break;
      }
      return true;
    });
  }

  // ========== 初始化 ==========
  function init() {
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('click', handleMediaClick, true);

    setupMessageListener();
    setupLazyLoadObserver();
    loadSettings();
  }

  init();
})();
