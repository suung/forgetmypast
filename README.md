# Link Cleaner PWA

A simple Progressive Web App that cleans tracking parameters from URLs and resolves shortened links.

## Features

- 🔗 **Share Target**: Share links to this app from any other app
- 🧹 **Clean Tracking**: Removes UTM parameters, Facebook tracking, Google tracking, and more
- 🔄 **Resolve Short URLs**: Attempts to resolve bit.ly, t.co, and other shortened URLs
- 📱 **Mobile First**: Designed for mobile devices with a clean, modern UI
- 📤 **Re-share**: Share the cleaned URL back to any app or copy to clipboard
- 🔒 **Privacy Focused**: Everything runs in your browser, no data sent to servers

## How to Use

1. **Install the PWA**:
   - Visit the app on your mobile device
   - Tap the browser menu and select "Add to Home Screen"

2. **Share links to clean**:
   - From any app, tap Share
   - Select "Link Cleaner" from the share menu
   - The app will open with the link already loaded

3. **Clean and re-share**:
   - Tap "Clean Link" to remove tracking parameters
   - Tap "Share Clean" to share the cleaned URL

## Setup for GitHub Pages

This PWA is configured to work on GitHub Pages. Here's how to deploy:

### Option 1: Project Site (recommended for this repo)

1. **Enable GitHub Pages**:
   - Go to your repo Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "main" / "/ (root)"

2. **Create the required icons**:
   - Open `generate-icons.html` in a browser
   - Generate and download the icons
   - Save them as `icons/icon-192.png` and `icons/icon-512.png`

3. **Access your PWA**:
   - Visit `https://YOUR_USERNAME.github.io/forgetmypast/`
   - Add to home screen on your mobile device

### Option 2: User/Organization Site

If you want to use this as your main GitHub Pages site:

1. Rename this repo to `YOUR_USERNAME.github.io`
2. Follow the same setup steps
3. Access at `https://YOUR_USERNAME.github.io/`

## Development

To test locally:

```bash
# Serve the files (Python 3)
python -m http.server 8000

# Or with Node.js
npx serve .

# Then visit http://localhost:8000
```

**Note**: PWA features (service worker, share target) require HTTPS, so they won't work on `http://localhost` but the basic functionality will work for testing.

## Browser Support

- ✅ **Android Chrome/Edge**: Full support including Share Target
- ✅ **iOS Safari**: Works but no Share Target support (iOS limitation)
- ✅ **Desktop**: Works as a regular web app

## Technical Details

- **Framework**: Vanilla JavaScript (no dependencies)
- **Caching**: Service Worker with cache-first strategy
- **Offline**: Basic offline support for cached pages
- **Share Target**: Web Share Target API Level 2
- **Icons**: Requires 192px and 512px PNG icons

## License

MIT License - see LICENSE file
