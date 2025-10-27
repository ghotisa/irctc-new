# IRCTC Quick-Tatkal Extension

An auto-fill service to help booking train tickets by automating form filling in IRCTC website with OCR captcha solving.

## Features

- ✅ Automatic form filling for train ticket booking
- ✅ OCR-based captcha solving using Google Cloud Vision API
- ✅ Support for multiple payment methods
- ✅ Auto-retry logic for failed captcha recognition

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm
- Add your Cloud Vision Api key at `YOUR_API_KEY` in content_script.js

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Building

The extension uses esbuild to bundle the content script. You need to build before loading it in Chrome:

```bash
# Build for production (minified, optimized)
npm run build:prod

# Build for development (unminified, readable)
npm run build
```

### Loading the Extension

**For Development:**
1. Build the project: `npm run build`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project folder

**For Production:**
1. Build the project: `npm run build:prod`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the **`dist/`** folder

## File Structure

```
├── content_script.js           # Source with Google Cloud Vision API
├── background_script.js        # Background service worker
├── popup.html/js               # Extension popup
├── dist/                       # Production build (generated)
│   ├── content_script.js       # Minified (21KB)
│   ├── background_script.js    # Background (1.6KB)
│   ├── manifest.json           # Extension manifest
│   ├── popup.html/js           # Popup files
│   ├── payment scripts         # Payment integrations
│   ├── stationlist.json        # Station data
│   └── icons                   # Extension icons
└── package.json                # Build scripts
```

## OCR Integration

The extension uses Google Cloud Vision API for automatic captcha solving:

- Captcha images are captured from the page
- OCR processing happens directly in the content script
- Recognized text is automatically filled in the captcha field
- Includes error handling and retry logic

## Build Process

The build process uses esbuild to bundle the content script:

- **Development**: Unminified code in root directory (~29KB)
- **Production**: Minified code in `dist/` folder (~21KB, 28% smaller)
- OCR processing uses Google Cloud Vision API
- API key is needed in content_script.js

## API Key Configuration

To use your own Google Cloud Vision API key:

1. Edit `content_script.js` line 431
2. Replace the API key with your own
3. Build: `npm run build:prod`

Get your API key from: https://console.cloud.google.com/

## Troubleshooting

**Import/Export Errors:**
1. Make sure you've run `npm run build:prod` for production
2. Check that the `dist/` folder contains the built files
3. Reload the extension in Chrome after building

**OCR Not Working:**
1. Check console for API key errors
2. Verify API key is valid
3. Check Google Cloud Vision API quota
4. Default API key has limited usage - get your own key
