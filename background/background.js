(function () {
  const DEFAULT_SETTINGS = {
    enabled: false,
    bgColor: '#1a1a2e',
    bgDarkness: 80,
    followSystem: false,
    systemDark: false,
    lightboxEnabled: true,
    lightboxSize: 40,
    buttonSize: 48
  };

  let currentSettings = { ...DEFAULT_SETTINGS };

  function updateIcon(enabled) {
    const iconPath = enabled ? 'icons/icon-on' : 'icons/icon-off';
    browser.action.setIcon({
      path: {
        16: `${iconPath}-16.png`,
        32: `${iconPath}-32.png`,
        48: `${iconPath}-48.png`,
        128: `${iconPath}-128.png`
      }
    });

    browser.action.setBadgeText({
      text: enabled ? 'ON' : 'OFF'
    });

    browser.action.setBadgeBackgroundColor({
      color: enabled ? '#22c55e' : '#ef4444'
    });
  }

  function broadcastSettings(settings) {
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      tabs.forEach(tab => {
        browser.tabs.sendMessage(tab.id, {
          type: 'UPDATE_SETTINGS',
          payload: settings
        }).catch(() => { });
      });
    });

    browser.tabs.query({}).then(tabs => {
      tabs.forEach(tab => {
        if (tab.url && tab.url.startsWith('http')) {
          browser.tabs.sendMessage(tab.id, {
            type: 'UPDATE_SETTINGS',
            payload: settings
          }).catch(() => { });
        }
      });
    });
  }

  function saveSettings(settings) {
    currentSettings = { ...currentSettings, ...settings };
    return browser.storage.local.set(currentSettings).then(() => {
      updateIcon(currentSettings.enabled);
      broadcastSettings(currentSettings);
      return currentSettings;
    });
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function rgbToHex(rgb) {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return '#' + ((1 << 24) + (parseInt(match[1]) << 16) + (parseInt(match[2]) << 8) + parseInt(match[3])).toString(16).slice(1);
    }
    return rgb;
  }

  function getColorLuminance(color) {
    if (!color) return 255;

    let hexColor = color;
    if (color.startsWith('rgb')) {
      hexColor = rgbToHex(color);
    }

    const rgb = hexToRgb(hexColor);
    if (!rgb) return 255;

    return (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114);
  }

  function checkSystemTheme() {
    try {
      browser.theme.getCurrent().then(theme => {
        if (theme && theme.colors) {
          const bgColor = theme.colors.toolbar || theme.colors.frame || '#ffffff';
          const luminance = getColorLuminance(bgColor);
          const isDark = luminance < 128;

          if (currentSettings.followSystem && isDark !== currentSettings.enabled) {
            saveSettings({ enabled: isDark, systemDark: isDark });
          }
        }
      }).catch(() => { });
    } catch (e) { }
  }

  function handleMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'TOGGLE_DARK_MODE':
        saveSettings({ enabled: !currentSettings.enabled }).then(settings => {
          sendResponse({ success: true, settings });
        });
        return true;

      case 'SET_BG_COLOR':
        saveSettings({ bgColor: message.payload.bgColor }).then(settings => {
          browser.tabs.query({}).then(tabs => {
            tabs.forEach(tab => {
              if (tab.url && tab.url.startsWith('http')) {
                browser.tabs.sendMessage(tab.id, {
                  type: 'SET_BG_COLOR',
                  payload: message.payload.bgColor
                }).catch(() => { });
              }
            });
          });
          sendResponse({ success: true, settings });
        });
        return true;

      case 'SET_BG_DARKNESS':
        saveSettings({ bgDarkness: message.payload.bgDarkness }).then(settings => {
          browser.tabs.query({}).then(tabs => {
            tabs.forEach(tab => {
              if (tab.url && tab.url.startsWith('http')) {
                browser.tabs.sendMessage(tab.id, {
                  type: 'SET_BG_DARKNESS',
                  payload: message.payload.bgDarkness
                }).catch(() => { });
              }
            });
          });
          sendResponse({ success: true, settings });
        });
        return true;

      case 'TOGGLE_FOLLOW_SYSTEM':
        const newFollowSystem = !currentSettings.followSystem;
        if (newFollowSystem) {
          checkSystemTheme();
        }
        saveSettings({ followSystem: newFollowSystem }).then(settings => {
          sendResponse({ success: true, settings });
        });
        return true;

      case 'GET_SETTINGS':
        sendResponse({ success: true, settings: currentSettings });
        break;

      case 'GET_CURRENT_STATE':
        browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
          if (tabs[0]) {
            browser.tabs.sendMessage(tabs[0].id, { type: 'GET_CURRENT_STATE' })
              .then(response => sendResponse(response))
              .catch(() => sendResponse({ type: 'CURRENT_STATE', payload: { enabled: currentSettings.enabled, bgColor: currentSettings.bgColor, bgDarkness: currentSettings.bgDarkness } }));
          } else {
            sendResponse({ type: 'CURRENT_STATE', payload: { enabled: currentSettings.enabled, bgColor: currentSettings.bgColor, bgDarkness: currentSettings.bgDarkness } });
          }
        });
        return true;

      case 'TOGGLE_LIGHTBOX':
        saveSettings({ lightboxEnabled: message.payload.enabled }).then(settings => {
          sendResponse({ success: true, settings });
        });
        return true;

      case 'SET_LIGHTBOX_SIZE':
        saveSettings({ lightboxSize: message.payload.size }).then(settings => {
          browser.tabs.query({}).then(tabs => {
            tabs.forEach(tab => {
              if (tab.url && tab.url.startsWith('http')) {
                browser.tabs.sendMessage(tab.id, {
                  type: 'SET_LIGHTBOX_SIZE',
                  payload: { size: message.payload.size }
                }).catch(() => { });
              }
            });
          });
          sendResponse({ success: true, settings });
        });
        return true;

      case 'SET_BUTTON_SIZE':
        saveSettings({ buttonSize: message.payload.size }).then(settings => {
          browser.tabs.query({}).then(tabs => {
            tabs.forEach(tab => {
              if (tab.url && tab.url.startsWith('http')) {
                browser.tabs.sendMessage(tab.id, {
                  type: 'SET_BUTTON_SIZE',
                  payload: { size: message.payload.size }
                }).catch(() => { });
              }
            });
          });
          sendResponse({ success: true, settings });
        });
        return true;
    }
  }

  browser.runtime.onMessage.addListener(handleMessage);

  browser.theme.onUpdated.addListener(checkSystemTheme);

  browser.storage.local.get(DEFAULT_SETTINGS).then(settings => {
    currentSettings = { ...DEFAULT_SETTINGS, ...settings };
    updateIcon(currentSettings.enabled);

    if (currentSettings.followSystem) {
      checkSystemTheme();
    }
  });

  browser.runtime.onInstalled.addListener(() => {
    browser.storage.local.get(DEFAULT_SETTINGS).then(settings => {
      currentSettings = { ...DEFAULT_SETTINGS, ...settings };
      updateIcon(currentSettings.enabled);
    });
  });
})();
