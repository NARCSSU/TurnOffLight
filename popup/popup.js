(function () {
  const toggleBtn = document.getElementById('toggle-btn');
  const bgColorPicker = document.getElementById('bg-color-picker');
  const bgDarknessSlider = document.getElementById('bg-darkness-slider');
  const bgDarknessValue = document.getElementById('bg-darkness-value');
  const followSystem = document.getElementById('follow-system');
  const enableLightbox = document.getElementById('enable-lightbox');
  const lightboxSizeSlider = document.getElementById('lightbox-size-slider');
  const lightboxSizeValue = document.getElementById('lightbox-size-value');
  const lightboxSizeBtns = document.querySelectorAll('.lightbox-size-btn');
  const buttonSizeSlider = document.getElementById('button-size-slider');
  const buttonSizeValue = document.getElementById('button-size-value');

  function updateUI(settings) {
    if (settings.enabled) {
      toggleBtn.classList.add('active');
      toggleBtn.textContent = 'ON';
    } else {
      toggleBtn.classList.remove('active');
      toggleBtn.textContent = 'OFF';
    }

    const bgColor = settings.bgColor !== undefined ? settings.bgColor : '#1a1a2e';
    bgColorPicker.value = bgColor;

    const bgDarkness = settings.bgDarkness !== undefined ? settings.bgDarkness : 80;
    bgDarknessSlider.value = bgDarkness;
    bgDarknessValue.textContent = `${bgDarkness}%`;

    followSystem.checked = settings.followSystem;
    enableLightbox.checked = settings.lightboxEnabled !== false;

    const lightboxSize = settings.lightboxSize !== undefined ? settings.lightboxSize : 40;
    lightboxSizeSlider.value = lightboxSize;
    lightboxSizeValue.textContent = `${lightboxSize}%`;

    lightboxSizeBtns.forEach(btn => {
      if (parseInt(btn.dataset.size) === lightboxSize) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const buttonSize = settings.buttonSize !== undefined ? settings.buttonSize : 48;
    buttonSizeSlider.value = buttonSize;
    buttonSizeValue.textContent = `${buttonSize}px`;
  }

  function sendMessage(type, payload = {}) {
    return browser.runtime.sendMessage({ type, payload });
  }

  toggleBtn.addEventListener('click', () => {
    sendMessage('TOGGLE_DARK_MODE').then(response => {
      if (response.success) {
        updateUI(response.settings);
      }
    });
  });

  bgColorPicker.addEventListener('change', (e) => {
    sendMessage('SET_BG_COLOR', { bgColor: e.target.value });
  });

  bgDarknessSlider.addEventListener('input', (e) => {
    const darkness = parseInt(e.target.value);
    bgDarknessValue.textContent = `${darkness}%`;
    sendMessage('SET_BG_DARKNESS', { bgDarkness: darkness });
  });

  followSystem.addEventListener('change', (e) => {
    sendMessage('TOGGLE_FOLLOW_SYSTEM').then(response => {
      if (response.success) {
        updateUI(response.settings);
      }
    });
  });

  enableLightbox.addEventListener('change', (e) => {
    sendMessage('TOGGLE_LIGHTBOX', { enabled: e.target.checked });
  });

  lightboxSizeSlider.addEventListener('input', (e) => {
    const size = parseInt(e.target.value);
    lightboxSizeValue.textContent = `${size}%`;

    lightboxSizeBtns.forEach(btn => {
      if (parseInt(btn.dataset.size) === size) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    sendMessage('SET_LIGHTBOX_SIZE', { size: size });
  });

  lightboxSizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const size = parseInt(btn.dataset.size);
      lightboxSizeSlider.value = size;
      lightboxSizeValue.textContent = `${size}%`;

      lightboxSizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      sendMessage('SET_LIGHTBOX_SIZE', { size: size });
    });
  });

  buttonSizeSlider.addEventListener('input', (e) => {
    const size = parseInt(e.target.value);
    buttonSizeValue.textContent = `${size}px`;
    sendMessage('SET_BUTTON_SIZE', { size: size });
  });

  sendMessage('GET_SETTINGS').then(response => {
    if (response.success) {
      updateUI(response.settings);
    }
  });

  browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      if (changes.bgColor) {
        bgColorPicker.value = changes.bgColor.newValue;
      }
      if (changes.bgDarkness) {
        const newDarkness = changes.bgDarkness.newValue;
        bgDarknessSlider.value = newDarkness;
        bgDarknessValue.textContent = `${newDarkness}%`;
      }
      if (changes.lightboxSize) {
        const newSize = changes.lightboxSize.newValue;
        lightboxSizeSlider.value = newSize;
        lightboxSizeValue.textContent = `${newSize}%`;
        lightboxSizeBtns.forEach(btn => {
          if (parseInt(btn.dataset.size) === newSize) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }
      if (changes.buttonSize) {
        const newSize = changes.buttonSize.newValue;
        buttonSizeSlider.value = newSize;
        buttonSizeValue.textContent = `${newSize}px`;
      }
    }
  });
})();
