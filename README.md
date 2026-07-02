# Dark Mode Switch - Firefox Extension

A Firefox extension that converts web pages to dark mode for better ergonomic viewing experience.

## Features

- **One-click Dark Mode**: Toggle dark mode on/off with a single click
- **Color Depth Control**: Adjust the darkness level (Mild/Medium/Deep)
- **System Theme Sync**: Automatically follow system theme changes
- **Custom Colors**: Personalize background and text colors
- **Media Protection**: Images, videos, and canvas elements are preserved
- **Performance Optimized**: Uses CSS filter for instant conversion
- **Settings Persistence**: Your preferences are saved automatically

## Installation

### Method 1: Temporary Loading (Recommended for Testing)
This is the easiest way to test the extension without modifying browser settings. The extension will be removed when Firefox restarts.

1. Open Firefox
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Find the **"Temporary Extensions"** section
4. Click **"Load Temporary Add-on..."**
5. Select the `manifest.json` file from the project directory
6. The extension icon will appear in the toolbar immediately

### Method 2: Install from XPI File (Requires Developer Edition)
To install permanently, you need to disable signature verification or use a special Firefox version.

1. **Install Firefox Developer Edition**
   - Download from: https://www.mozilla.org/zh-CN/firefox/developer/
   
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
Once the extension is signed by Mozilla, you can install it directly from the Firefox Add-ons Store.

### About Firefox Extension Signing
Firefox requires most extensions to be digitally signed by Mozilla before installation. This helps protect users from malicious extensions that might hijack the browser, steal information, or inject spam.

**Why signing is required:**
- Prevents unauthorized changes to browser settings
- Blocks adware, trackers, and toolbar installations
- Protects browsing data and login credentials

**How to use unsigned extensions:**
1. **Temporary Loading**: Use `about:debugging` (Method 1 above)
2. **Firefox Developer Edition**: Disable signature verification in `about:config`
3. **Firefox ESR**: Also supports disabling signature verification
4. **Submit to AMO**: For permanent distribution, submit to https://addons.mozilla.org/ for review and signing

## Usage

### Basic Controls
- Click the extension icon in the toolbar to open the popup
- Click the "Enable Dark Mode" button to toggle dark mode
- Use the slider to adjust color depth (10%-100%)
- Click preset buttons for quick settings (Mild/Medium/Deep)
- Enable "Follow System Theme" to sync with your OS theme

### Custom Colors
1. Click "Custom Colors Settings" in the popup
2. Choose your preferred background and text colors
3. Enable "Enable Custom Colors" to apply your settings
4. Click "Save Changes" to apply

## Technical Details

### Architecture
- **Manifest V3**: Uses the latest Firefox extension standard
- **Content Scripts**: Injects CSS and handles page-level logic
- **Background Script**: Manages settings and system theme detection
- **Popup UI**: Provides user controls
- **Options Page**: Advanced customization

### CSS Implementation
The extension uses CSS `filter: invert()` combined with `hue-rotate()` for efficient color inversion:
- `color-scheme: dark` ensures proper form element rendering
- Images, videos, and canvas elements use `filter: invert(100%) hue-rotate(180deg)` to counteract the parent inversion
- Custom colors use CSS variables for dynamic application

### Browser Compatibility
- **Firefox**: Version 109 or higher
- **Manifest Version**: V3

## Permissions Required

- `storage`: Save user preferences
- `activeTab`: Access current tab
- `theme`: Detect system theme changes
- `<all_urls>`: Apply dark mode to all websites

## Project Structure

```
TurnOffLight/
├── manifest.json          # Extension configuration
├── DarkModeSwitch.xpi     # Packaged extension
├── background/
│   └── background.js      # Background script
├── content_scripts/
│   ├── dark-mode.css      # Dark mode styles
│   └── dark-mode.js       # Content script logic
├── popup/
│   ├── popup.html         # Popup UI
│   ├── popup.css          # Popup styles
│   └── popup.js           # Popup logic
├── options/
│   ├── options.html       # Options page
│   ├── options.css        # Options styles
│   └── options.js         # Options logic
├── icons/                 # Extension icons
└── README.md              # This file
```

## Development

### Prerequisites
- Firefox 109 or higher
- Basic understanding of WebExtensions API

### Building
Run `python build_xpi.py` to create the XPI package.

### Testing
1. Load the extension temporarily in Firefox
2. Test on various websites (Google, Wikipedia, GitHub, etc.)
3. Verify all features work as expected

## License

This project is open source and available for personal and commercial use.

## Support

If you encounter any issues or have suggestions, please report them through the GitHub issues page.
