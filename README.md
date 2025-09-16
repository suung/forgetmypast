# Link Cleaner

A simple Progressive Web App that removes tracking parameters from URLs and resolves shortened links.

## 🚀 Try it now

**Live app**: https://suung.github.io/forgetmypast/

## ✨ Features

- **Share from any app** - Share links directly to Link Cleaner from Twitter, Reddit, news apps, etc.
- **Remove tracking** - Strips UTM parameters, Facebook tracking, Google Analytics, and more
- **Resolve short URLs** - Expands bit.ly, t.co, and other shortened links when possible  
- **Clean interface** - Simple, mobile-first design that works offline
- **Privacy focused** - Everything runs in your browser, no data sent to servers
- **Re-share easily** - Share the cleaned URL or copy to clipboard

## 📱 How to use

### On mobile (recommended):
1. **Install**: Visit the app and tap "Add to Home Screen" 
2. **Share**: From any app, tap Share → "Link Cleaner"
3. **Clean**: The app opens with your link ready to clean
4. **Re-share**: Tap "Share Clean" to share the cleaned URL

### On desktop:
1. **Visit**: Go to the app URL
2. **Paste**: Paste any messy URL into the text box
3. **Clean**: Click "Clean Link" to remove tracking
4. **Copy**: Copy the clean URL to use anywhere

## 🔧 What gets cleaned

The app removes common tracking parameters including:
- UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, etc.)
- Facebook tracking (`fbclid`)
- Google tracking (`gclid`, `_ga`, `_gid`)
- Twitter tracking (`twclid`)
- Instagram tracking (`igshid`)
- Email marketing tracking (`mc_cid`, `mc_eid`)
- And many more...

## 🌐 Browser support

- ✅ **Android Chrome/Edge**: Full support including Share Target
- ✅ **iOS Safari**: Works but no Share Target support (iOS limitation)  
- ✅ **Desktop browsers**: Works as a regular web app

---

## 🛠 Development

### Local development

```bash
# Clone the repository
git clone https://github.com/suung/forgetmypast.git
cd forgetmypast

# Serve locally (choose one):
python -m http.server 8000
# or
npx serve .

# Visit http://localhost:8000
```

**Note**: PWA features (service worker, share target) require HTTPS, so they won't work on localhost but the basic functionality will work for testing.

### Project structure

```
forgetmypast/
├── index.html          # Main app
├── sw.js              # Service worker
├── manifest.webmanifest # PWA manifest
├── icons/             # App icons
│   ├── icon-192.png
│   └── icon-512.png
└── README.md
```

### Technical details

- **Framework**: Vanilla JavaScript (no dependencies)
- **Caching**: Service Worker with cache-first strategy
- **Offline**: Basic offline support for cached pages
- **Share Target**: Web Share Target API Level 2
- **Icons**: 192px and 512px PNG icons for PWA installation

### Deployment

This app is configured for GitHub Pages. To deploy your own:

1. Fork this repository
2. Go to Settings → Pages → Deploy from branch → main
3. Your app will be live at `https://yourusername.github.io/forgetmypast/`

## 📄 License

MIT License - see LICENSE file