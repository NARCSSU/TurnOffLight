(function () {
  const bgColorInput = document.getElementById('bg-color');
  const bgColorHex = document.getElementById('bg-color-hex');
  const textColorInput = document.getElementById('text-color');
  const textColorHex = document.getElementById('text-color-hex');
  const useCustomColors = document.getElementById('use-custom-colors');
  const previewBox = document.getElementById('preview-box');
  const previewHeader = previewBox.querySelector('.preview-header');
  const previewBody = previewBox.querySelector('.preview-body');
  const previewBtn = previewBox.querySelector('.preview-btn');
  const presetCards = document.querySelectorAll('.preset-card');
  const resetBtn = document.getElementById('reset-btn');
  const saveBtn = document.getElementById('save-btn');
  const statusMessage = document.getElementById('status-message');

  const DEFAULT_SETTINGS = {
    customBgColor: '#1a1a2e',
    customTextColor: '#e0e0e0',
    useCustomColors: false
  };

  let currentSettings = { ...DEFAULT_SETTINGS };

  function updatePreview() {
    previewBox.style.backgroundColor = bgColorInput.value;
    previewHeader.style.backgroundColor = adjustColor(bgColorInput.value, -20);
    previewHeader.style.color = textColorInput.value;
    previewBody.style.color = textColorInput.value;
    previewBtn.style.backgroundColor = textColorInput.value;
    previewBtn.style.color = bgColorInput.value;
  }

  function adjustColor(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  function validateHex(color) {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
  }

  function updateUI(settings) {
    bgColorInput.value = settings.customBgColor;
    bgColorHex.value = settings.customBgColor;
    textColorInput.value = settings.customTextColor;
    textColorHex.value = settings.customTextColor;
    useCustomColors.checked = settings.useCustomColors;
    updatePreview();
  }

  function sendMessage(type, payload = {}) {
    return browser.runtime.sendMessage({ type, payload });
  }

  bgColorInput.addEventListener('input', (e) => {
    bgColorHex.value = e.target.value;
    updatePreview();
  });

  bgColorHex.addEventListener('input', (e) => {
    if (validateHex(e.target.value)) {
      bgColorInput.value = e.target.value;
      updatePreview();
    }
  });

  textColorInput.addEventListener('input', (e) => {
    textColorHex.value = e.target.value;
    updatePreview();
  });

  textColorHex.addEventListener('input', (e) => {
    if (validateHex(e.target.value)) {
      textColorInput.value = e.target.value;
      updatePreview();
    }
  });

  useCustomColors.addEventListener('change', () => {
    currentSettings.useCustomColors = useCustomColors.checked;
  });

  presetCards.forEach(card => {
    card.addEventListener('click', () => {
      const bg = card.dataset.bg;
      const text = card.dataset.text;

      bgColorInput.value = bg;
      bgColorHex.value = bg;
      textColorInput.value = text;
      textColorHex.value = text;

      updatePreview();
    });
  });

  resetBtn.addEventListener('click', () => {
    bgColorInput.value = DEFAULT_SETTINGS.customBgColor;
    bgColorHex.value = DEFAULT_SETTINGS.customBgColor;
    textColorInput.value = DEFAULT_SETTINGS.customTextColor;
    textColorHex.value = DEFAULT_SETTINGS.customTextColor;
    useCustomColors.checked = DEFAULT_SETTINGS.useCustomColors;
    currentSettings.useCustomColors = DEFAULT_SETTINGS.useCustomColors;
    updatePreview();
  });

  saveBtn.addEventListener('click', () => {
    sendMessage('SET_CUSTOM_COLORS', {
      useCustomColors: useCustomColors.checked,
      customBgColor: bgColorInput.value,
      customTextColor: textColorInput.value
    }).then(response => {
      if (response.success) {
        statusMessage.textContent = 'Settings saved successfully!';
        statusMessage.classList.add('show');
        setTimeout(() => {
          statusMessage.classList.remove('show');
        }, 3000);
      }
    });
  });

  sendMessage('GET_SETTINGS').then(response => {
    if (response.success) {
      currentSettings = { ...DEFAULT_SETTINGS, ...response.settings };
      updateUI(currentSettings);
    }
  });
})();
