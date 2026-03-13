# JetSweep

JetSweep is a planning-first airport timing application designed to help travelers determine **when to leave for the airport** based on realistic operational friction rather than optimistic averages or real-time predictions.

The core problem JetSweep addresses is **risk management**, not route optimization.  
Arriving early is inexpensive. Missing a flight is not.

JetSweep is intentionally conservative, deterministic, and explainable.

---

## Problem

Most travel applications attempt to answer questions such as:

- What is the fastest route to the airport?
- What time should I arrive?

These answers typically rely on:
- optimistic traffic assumptions
- narrow TSA wait estimates
- single-point arrival times

They fail to account for:
- curb congestion
- security volatility
- terminal scale and layout
- airport-specific failure modes that experienced travelers recognize

JetSweep answers a different question:

> When should I leave so that I arrive at my gate with sufficient margin, given how airports actually behave?

---

## Design Principles

- **Planning over prediction**  
  JetSweep does not attempt to forecast real-time conditions.

- **Buffers over averages**  
  All time values are modeled as ranges intended to absorb variability.

- **Explainability over precision**  
  If the recommendation is wrong, the reason should be understandable.

- **Asymmetric risk awareness**  
  The cost of being early is small; the cost of missing a flight is high.

---

## Architecture Overview

JetSweep uses a layered, deterministic timing model.

### 1. Airport Tier Model (Backbone)

All U.S. airports are categorized into four tiers based on scale and operational complexity:

- MEGA
- LARGE
- MEDIUM
- GENERIC

Each tier defines default planning ranges for:

- curb-to-gate walk time
- curb congestion overhead
- parking-to-terminal time
- rideshare pickup overhead
- security variability
- checked baggage overhead
- typical off-peak drive time from city center

These values are **planning buffers**, not historical averages.

---

### 2. Exception Airport Overrides

A small, fixed set of airports consistently violate tier assumptions due to layout, access constraints, or operational behavior.

For these airports, JetSweep applies **surgical overrides** that:

- adjust only the relevant timing parameters
- preserve all other tier defaults

---

## Development Setup

```bash
npm install
npm run dev       # start local dev server at http://localhost:8080
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

---

## Deployment

### Web (PWA)

The app builds to a static `dist/` directory and can be deployed to any static host.

| Platform | Steps |
|---|---|
| **Vercel** | Connect repo; build command `npm run build`, output directory `dist` |
| **Netlify** | Connect repo; build command `npm run build`, publish directory `dist` |
| **Cloudflare Pages** | Connect repo; build command `npm run build`, output directory `dist` |
| **AWS S3 + CloudFront** | `aws s3 sync dist/ s3://your-bucket --delete` |
| **GitHub Pages** | Deploy `dist/` via `gh-pages` package or GitHub Actions |
| **Self-hosted (nginx)** | Serve `dist/` with `try_files $uri /index.html` for SPA routing |

The app is a PWA — users on any platform can install it to their home screen directly from the browser.

---

### iOS (Native App)

Requires macOS with Xcode installed.

```bash
npx cap add ios        # first time only — scaffolds the Xcode project
npm run cap:ios        # builds the web app, syncs to Xcode, and opens the project
```

From Xcode: select a simulator or connected device and press **Run**, or **Archive** to submit to the App Store.

**Before submitting to the App Store:**
- Update `appId` in `capacitor.config.ts` to match your Apple Developer bundle ID
- Add app icons to the Xcode project (replace the default Capacitor icons)
- Replace `public/og-image.png` with a real 1200×630 social sharing image
- Set your deployment target and signing certificate in Xcode project settings

---

### Android (Native App)

Requires Android Studio installed.

```bash
npx cap add android        # first time only — scaffolds the Android project
npm run cap:android        # builds the web app, syncs to Android Studio, and opens the project
```

From Android Studio: run on an emulator or connected device, or **Build → Generate Signed Bundle/APK** for Play Store submission.

**Before submitting to Google Play:**
- Update `appId` in `capacitor.config.ts` to match your Play Store application ID
- Add app icons via Android Studio's Asset Studio (replace the default Capacitor icons)
- Generate a signed release keystore and configure it in `android/app/build.gradle`

---

### Syncing Web Changes to Native

After any code change, re-sync the web build into the native projects:

```bash
npm run cap:sync       # builds and syncs to both iOS and Android
```

---

## OG / Social Image

`public/og-image.png` is currently a placeholder (copy of the PWA icon). Before launch:

1. Create a 1200×630 PNG with your app branding
2. Replace `public/og-image.png`
3. If your host doesn't inject absolute URLs automatically, update `index.html` to use a full URL:

```html
<meta property="og:image" content="https://yourdomain.com/og-image.png" />
<meta name="twitter:image" content="https://yourdomain.com/og-image.png" />
```
