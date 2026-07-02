(function () {
  'use strict';

  const DEFAULT_SETTINGS = {
    enabled: false,
    bgColor: '#1a1a2e',
    bgDarkness: 80,
    followSystemTheme: false
  };

  let currentSettings = { ...DEFAULT_SETTINGS };
  let mediaQueryList = null;
  let baseColor = DEFAULT_SETTINGS.bgColor;

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return '#' + toHex(r) + toHex(g) + toHex(b);
  }

  function adjustBrightness(hex, darkness) {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const newL = darkness;
    return hslToHex(hsl.h, hsl.s, newL);
  }

  function applyBgColor(color) {
    const html = document.documentElement;
    html.style.setProperty('--dark-bg-color', color);
  }

  function setDarkMode(enabled) {
    const html = document.documentElement;
    if (enabled) {
      html.classList.add('dark-mode-active');
    } else {
      html.classList.remove('dark-mode-active');
    }
  }

  function isSystemDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function handleSystemThemeChange(e) {
    if (!currentSettings.followSystemTheme) return;
    setDarkMode(e.matches);
    currentSettings.enabled = e.matches;
    browser.storage.local.set({ enabled: e.matches }).catch(() => { });
  }

  function setupSystemThemeListener() {
    if (mediaQueryList) return;
    mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleSystemThemeChange);
    } else if (mediaQueryList.addListener) {
      mediaQueryList.addListener(handleSystemThemeChange);
    }
  }

  function syncSystemTheme() {
    setupSystemThemeListener();
    const isDark = isSystemDark();
    currentSettings.enabled = isDark;
    setDarkMode(isDark);
    browser.storage.local.set({ enabled: isDark }).catch(() => { });
  }

  function loadSettings() {
    return browser.storage.local.get(DEFAULT_SETTINGS).then(settings => {
      currentSettings = { ...DEFAULT_SETTINGS, ...settings };
      baseColor = currentSettings.bgColor;

      const adjustedColor = adjustBrightness(baseColor, currentSettings.bgDarkness);
      applyBgColor(adjustedColor);

      if (currentSettings.followSystemTheme) {
        setupSystemThemeListener();
        const isDark = isSystemDark();
        currentSettings.enabled = isDark;
        setDarkMode(isDark);
      } else if (currentSettings.enabled) {
        setDarkMode(true);
      }
    });
  }

  function handleMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'TOGGLE_DARK_MODE': {
        const newEnabled = !currentSettings.enabled;
        currentSettings.enabled = newEnabled;
        setDarkMode(newEnabled);
        browser.storage.local.set({ enabled: newEnabled }).catch(() => { });
        sendResponse({ enabled: newEnabled });
        return true;
      }

      case 'SET_BG_COLOR': {
        const bgColor = message.payload;
        baseColor = bgColor;
        currentSettings.bgColor = bgColor;
        const adjustedColor = adjustBrightness(baseColor, currentSettings.bgDarkness);
        applyBgColor(adjustedColor);
        browser.storage.local.set({ bgColor: bgColor }).catch(() => { });
        break;
      }

      case 'SET_BG_DARKNESS': {
        const bgDarkness = message.payload;
        currentSettings.bgDarkness = bgDarkness;
        const adjustedColor = adjustBrightness(baseColor, bgDarkness);
        applyBgColor(adjustedColor);
        browser.storage.local.set({ bgDarkness: bgDarkness }).catch(() => { });
        break;
      }

      case 'SET_FOLLOW_SYSTEM_THEME': {
        const newFollow = !currentSettings.followSystemTheme;
        currentSettings.followSystemTheme = newFollow;
        browser.storage.local.set({ followSystemTheme: newFollow }).catch(() => { });
        if (newFollow) {
          syncSystemTheme();
        } else {
          setDarkMode(currentSettings.enabled);
        }
        break;
      }

      case 'GET_DARK_MODE_STATE': {
        sendResponse({
          enabled: document.documentElement.classList.contains('dark-mode-active'),
          bgColor: currentSettings.bgColor,
          bgDarkness: currentSettings.bgDarkness,
          followSystemTheme: currentSettings.followSystemTheme
        });
        return true;
      }

      case 'UPDATE_SETTINGS': {
        const payload = message.payload || {};
        currentSettings = { ...currentSettings, ...payload };
        if (payload.bgColor !== undefined) {
          baseColor = payload.bgColor;
        }
        const adjustedColor = adjustBrightness(baseColor, currentSettings.bgDarkness);
        applyBgColor(adjustedColor);
        if (currentSettings.followSystemTheme) {
          setupSystemThemeListener();
          const isDark = isSystemDark();
          currentSettings.enabled = isDark;
          setDarkMode(isDark);
        } else {
          setDarkMode(currentSettings.enabled);
        }
        break;
      }
    }
  }

  function handleFullscreenChange() {
    const fullscreenElement = document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;

    document.querySelectorAll('.dark-mode-exclude[data-fs-marked]').forEach(el => {
      el.classList.remove('dark-mode-exclude');
      el.removeAttribute('data-fs-marked');
    });

    if (fullscreenElement) {
      fullscreenElement.classList.add('dark-mode-exclude');
      fullscreenElement.setAttribute('data-fs-marked', 'true');
    }
  }

  function setupFullscreenListeners() {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
  }

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    return handleMessage(message, sender, sendResponse);
  });

  setupFullscreenListeners();
  setupSystemThemeListener();
  loadSettings();
})();
