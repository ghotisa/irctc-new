# IRCTC Quick-Tatkal Extension

An auto-fill service to help booking train tickets by automating form filling in IRCTC website with OCR captcha solving.

## Features

- ✅ Automatic form filling for train ticket booking
- ✅ OCR-based captcha solving using Tesseract.js
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

```

### Loading the Extension

1. Build the project: `npm run build`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project folder

## File Structure

```
├── background_script.js          # Source background script (simple)
├── background_script_built.js    # Built background script (generated)
├── content_script.js             # Source content script with Google Cloud Vision API
├── content_script_built.js       # Built content script (generated)
├── manifest.json                 # Extension manifest
└── package.json                  # Build scripts
```

## OCR Integration

The extension uses Google Cloud Vision API for automatic captcha solving:

- Captcha images are captured from the page
- OCR processing happens directly in the content script
- Recognized text is automatically filled in the captcha field
- Includes error handling and retry logic

## Build Process

The build process uses esbuild to bundle the content script:

- **Content Script**: `content_script.js` → `content_script_built.js` (29KB, uses Google Cloud Vision API)
- **Background Script**: `background_script.js` → `background_script_built.js` (1.8KB, simple copy)
- OCR processing happens in content script using Google Cloud Vision API

## Troubleshooting

If you encounter import/export errors:
1. Make sure you've run `npm run build`
2. Check that the `dist/` folder contains the built files
3. Reload the extension in Chrome after building
