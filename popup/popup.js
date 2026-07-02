(function () {
  const pluginToggle = document.getElementById('plugin-toggle');

  function i18n(key) {
    try {
      return browser.i18n.getMessage(key) || key;
    } catch (e) {
      return key;
    }
  }

  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = i18n(key);
      if (text && text !== key) el.textContent = text;
    });
  }

  applyI18n();

  function updateUI(settings) {
    if (settings.pluginEnabled !== undefined) {
      if (settings.pluginEnabled) {
        pluginToggle.classList.add('active');
        pluginToggle.textContent = i18n('on');
      } else {
        pluginToggle.classList.remove('active');
        pluginToggle.textContent = i18n('off');
      }
    }
  }

  function sendMessage(type, payload = {}) {
    return browser.runtime.sendMessage({ type, payload });
  }

  pluginToggle.addEventListener('click', () => {
    sendMessage('TOGGLE_PLUGIN').then(response => {
      if (response.success) {
        updateUI(response.settings);
      }
    });
  });

  sendMessage('GET_SETTINGS').then(response => {
    if (response.success) {
      updateUI(response.settings);
    }
  });

  browser.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes.pluginEnabled) {
      updateUI({ pluginEnabled: changes.pluginEnabled.newValue });
    }
  });
})();
