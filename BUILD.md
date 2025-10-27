# Build Documentation

## Available Build Commands

### Development Build
```bash
npm run build
```
- **Output**: Unminified code in root directory
- **Files**: `content_script_built.js`, `background_script_built.js`
- **Use Case**: Development and debugging
- **Size**: ~29KB

### Production Build
```bash
npm run build:prod
```
- **Output**: Minified, optimized code in `dist/` folder
- **Files**: Complete extension package in `dist/`
- **Use Case**: Production deployment
- **Size**: ~21KB (28% smaller)

### Watch Mode (Development)
```bash
npm run build:watch
```
- **Output**: Auto-rebuilds on file changes
- **Use Case**: Active development
- **Location**: Root directory

## Production Build Details

### What Gets Built
When you run `npm run build:prod`, it:
1. ✅ Creates `dist/` folder
2. ✅ Builds minified `content_script.js` (~21KB)
3. ✅ Copies `background_script.js` (~1.6KB)
4. ✅ Copies all payment scripts
5. ✅ Copies popup files (HTML + JS)
6. ✅ Copies all icons (rail_*.png)
7. ✅ Copies data files (stationlist.json, train_data.js)
8. ✅ Updates manifest.json paths for dist folder

### Folder Structure

```
dist/
├── content_script.js       # Minified production build (21KB)
├── background_script.js    # Background worker (1.6KB)
├── manifest.json           # Extension manifest
├── popup.html              # Extension popup
├── popup.js                # Popup functionality
├── irctc_upi.js            # IRCTC payment script
├── phonepe_upi.js          # PhonePe payment script
├── paytm_upi.js            # PayTM payment script
├── hdfc_pay.js             # HDFC payment script
├── secure_hdfc.js          # Secure HDFC payment script
├── stationlist.json        # Station data
├── train_data.js           # Train data
└── rail_*.png              # Extension icons
```

### Optimizations Applied

1. **Minification**: Code compressed and unreadable
2. **Tree Shaking**: Dead code elimination
3. **No Sourcemaps**: Cleaner production build
4. **Legal Comments Removed**: Smaller file size

### Loading Production Extension

1. Build: `npm run build:prod`
2. Open Chrome: Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the **`dist/`** folder (not the root folder!)

### Development vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| Command | `npm run build` | `npm run build:prod` |
| Location | Root directory | `dist/` folder |
| Code | Readable | Minified |
| Size | ~29KB | ~21KB |
| Sourcemaps | Yes | No |
| Use Case | Debugging | Deployment |

## Notes

- The `dist/` folder is excluded from git (.gitignore)
- Always run production build before deploying
- Production build uses Google Cloud Vision API for OCR
- Add your Cloud Vision Api key at `YOUR_API_KEY` in content_script.js

