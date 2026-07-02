<div align="center">

# 🌙 Dark Mode Switch

**A Firefox extension that converts web pages to dark mode for better ergonomic viewing experience.**

[![Version][version-badge]][version-link]
[![License][license-badge]][license-link]
[![Firefox][firefox-badge]][firefox-link]
[![PRs Welcome][prs-badge]][prs-link]

[version-badge]: https://img.shields.io/badge/version-1.0.0-blue?style=flat-square
[version-link]: #
[license-badge]: https://img.shields.io/badge/license-MIT-green?style=flat-square
[license-link]: #license
[firefox-badge]: https://img.shields.io/badge/Firefox-109%2B-orange?style=flat-square&logo=firefox
[firefox-link]: #
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square
[prs-link]: #contributing

[Key Features](#key-features) • [Installation](#installation) • [Usage](#usage) • [Contributing](#contributing) • [License](#license)

</div>

---

## ✨ Key Features

- **One-click Toggle** — Enable/disable the extension with a single click from the toolbar
- **Custom Dark Mode** — Personalize background color and darkness level to your preference
- **System Theme Sync** — Automatically follow your OS theme changes
- **Lightbox Viewer** — Built-in image lightbox with gallery support
- **Media Protection** — Images, videos, and canvas elements are preserved from inversion
- **Performance Optimized** — Uses CSS filters for instant, smooth conversion
- **Bilingual Support** — English and Chinese (Simplified) interface, auto-detects system language
- **Settings Persistence** — Your preferences are saved automatically across sessions

## 🚀 Installation

### Method 1: Temporary Loading (Recommended for Testing)

The easiest way to test without modifying browser settings. The extension will be removed when Firefox restarts.

1. Open Firefox
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Find the **Temporary Extensions** section
4. Click **Load Temporary Add-on...**
5. Select the `manifest.json` file from the project directory
6. The extension icon will appear in the toolbar immediately

### Method 2: Install from XPI File (Requires Developer Edition)

For permanent installation, use Firefox Developer Edition with signature verification disabled.

1. **Install Firefox Developer Edition**
   - Download: [mozilla.org/firefox/developer](https://www.mozilla.org/en-US/firefox/developer/)

2. **Disable signature verification**
   - Open `about:config`
   - Click "Accept the Risk and Continue"
   - Search for `xpinstall.signatures.required`
   - Set the value to `false`

3. **Install the extension**
   - Navigate to `about:addons`
   - Click the gear icon → "Install Add-on From File..."
   - Select `DarkModeSwitch.xpi`

### Method 3: Firefox Add-ons Store (Coming Soon)

Once signed by Mozilla, install directly from the Firefox Add-ons Store.

## 📖 Usage

### Quick Start

1. Click the extension icon in the Firefox toolbar
2. Toggle **Enable Extension** to activate the extension
3. On any web page, two floating buttons appear in the bottom-right:
   - 🖼️ **Lightbox button** — Click to open the image lightbox viewer
   - ⚙️ **Settings button** — Click to open the settings panel

### Settings Panel

Access all customization options through the gear button on web pages:

| Setting | Description |
|---------|-------------|
| **Enable Dark Mode** | Toggle dark mode effect on/off |
| **Background Color** | Choose custom background color |
| **Darkness** | Adjust darkness level (0-100%) |
| **Follow System Theme** | Auto-sync with OS theme |
| **Enable Lightbox Viewer** | Toggle the image lightbox feature |
| **Lightbox Size** | Adjust lightbox size (Compact / Standard / Spacious / Immersive) |

### Keyboard Shortcuts (Lightbox)

| Key | Action |
|-----|--------|
| `Esc` | Close lightbox |
| `←` / `→` | Previous / Next image |
| `+` / `-` | Zoom in / out |
| `Space` | Play / pause (video) |
| `f` | Toggle fullscreen |
| `m` | Mute / unmute |

## 🛠️ Technical Details

### Architecture

```
TurnOffLight/
├── manifest.json          # Extension configuration
├── _locales/              # Internationalization files
│   ├── en/messages.json   # English strings
│   └── zh_CN/messages.json # Simplified Chinese strings
├── background/
│   └── background.js      # Background script (settings, theme detection)
├── content_scripts/
│   ├── dark-mode.css      # Dark mode styles
│   ├── dark-mode.js       # Dark mode logic
│   ├── lightbox.css       # Lightbox styles
│   └── lightbox.js        # Lightbox & settings panel logic
├── popup/
│   ├── popup.html         # Popup UI
│   ├── popup.css          # Popup styles
│   └── popup.js           # Popup logic
├── options/
│   ├── options.html       # Options page
│   ├── options.css        # Options styles
│   └── options.js         # Options logic
├── icons/                 # Extension icons
└── build_xpi.py           # XPI build script
```

### Technologies

- **Manifest V3** — Latest Firefox extension standard
- **CSS Filters** — Efficient color inversion with `filter: invert()` + `hue-rotate()`
- **WebExtensions API** — `browser.storage`, `browser.theme`, `browser.i18n`
- **Vanilla JavaScript** — No framework dependencies, lightweight and fast

### Browser Compatibility

| Browser | Minimum Version |
|---------|----------------|
| Firefox | 109+ |
| Manifest | V3 |

## 🔒 Permissions Required

| Permission | Purpose |
|------------|---------|
| `storage` | Save user preferences locally |
| `activeTab` | Access current tab for lightbox interaction |
| `theme` | Detect system theme changes |
| `<all_urls>` | Apply dark mode to all websites |

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository** and create your branch
2. **Make your changes** — add features, fix bugs, improve docs
3. **Test thoroughly** on multiple websites
4. **Submit a Pull Request** with a clear description

### Development Setup

```bash
# Clone the repository
git clone https://github.com/NARCSSU/TurnOffLight.git
cd TurnOffLight

# Build XPI package
python build_xpi.py

# Load in Firefox (temporary)
# about:debugging#/runtime/this-firefox → Load Temporary Add-on → select manifest.json
```

### Adding New Languages

1. Create a new directory under `_locales/` (e.g., `_locales/ja/`)
2. Copy `_locales/en/messages.json` as a template
3. Translate all message values
4. Test by changing your Firefox UI language

## 📝 Changelog

### v1.0.0
- Initial release
- Dark mode toggle with custom colors
- System theme sync
- Lightbox image viewer
- Bilingual (English / Chinese) support
- Extension master toggle

## 📄 License

This project is open source and available for personal and commercial use.

---

<div align="center">

Made with ❤️ for better eye health

[**Report Bug**][issues-link] · [**Request Feature**][issues-link]

[issues-link]: https://github.com/NARCSSU/TurnOffLight/issues

</div>
