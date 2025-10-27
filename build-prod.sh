#!/bin/bash

# Production Build Script
# Creates a complete production-ready extension in the 'dist' folder

echo "🚀 Building production version..."

# Create dist directory
mkdir -p dist

# Build minified content script
echo "📦 Building content script..."
esbuild content_script.js \
  --bundle \
  --outfile=dist/content_script.js \
  --platform=browser \
  --format=esm \
  --minify \
  --tree-shaking=true \
  --legal-comments=none

# Copy background script
echo "📦 Copying background script..."
cp background_script.js dist/background_script.js

# Copy manifest and fix paths
echo "📋 Copying manifest..."
cp manifest.json dist/manifest.json
sed -i 's|\./background_script_built\.js|background_script.js|g' dist/manifest.json
sed -i 's|content_script_built\.js|content_script.js|g' dist/manifest.json

# Copy popup files
echo "📄 Copying popup files..."
cp popup.html dist/ 2>/dev/null || true
cp popup.js dist/ 2>/dev/null || true

# Copy icons
echo "🎨 Copying icons..."
cp rail_*.png dist/ 2>/dev/null || true

# Copy payment scripts
echo "💳 Copying payment scripts..."
cp irctc_upi.js dist/ 2>/dev/null || true
cp phonepe_upi.js dist/ 2>/dev/null || true
cp paytm_upi.js dist/ 2>/dev/null || true
cp hdfc_pay.js dist/ 2>/dev/null || true
cp secure_hdfc.js dist/ 2>/dev/null || true

# Copy data files
echo "📊 Copying data files..."
cp stationlist.json dist/ 2>/dev/null || true
cp train_data.js dist/ 2>/dev/null || true

echo "✅ Production build complete in dist/ folder"
echo "📁 Load the extension from: dist/"

