# Skill: Remove Lovable Dependencies & Prepare for Independent Hosting

## Purpose

This skill removes all Lovable platform-specific code, tooling, and branding from a React/Vite/TypeScript project bootstrapped or developed on Lovable.dev. It leaves a clean, portable codebase that can be self-hosted on Vercel, Netlify, Cloudflare Pages, AWS, or any static host, and optionally wrapped as a native iOS/Android app via Capacitor.

---

## What Lovable Injects

When you build on Lovable, the following artifacts are added and must be cleaned up:

### 1. `lovable-tagger` npm package
- **Where:** `package.json` → `devDependencies`
- **What it does:** Instruments React components during development for Lovable's internal analytics/tracking.
- **Action:** Remove the `"lovable-tagger": "x.x.x"` entry from `devDependencies`.

### 2. `componentTagger()` Vite plugin
- **Where:** `vite.config.ts`
- **What it does:** Calls into `lovable-tagger` during dev builds to tag components.
- **Action:**
  - Remove `import { componentTagger } from "lovable-tagger"`
  - Remove `mode === "development" && componentTagger()` from the plugins array
  - If the plugins array uses `.filter(Boolean)` solely because of this conditional, replace with a plain array `[]`
  - If `mode` is no longer used after this removal, rename the destructured param to `_mode` or remove it entirely

### 3. Lovable OpenGraph & Twitter meta tags
- **Where:** `index.html`
- **What they look like:**
  ```html
  <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
  <meta name="twitter:site" content="@Lovable" />
  <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
  ```
- **Action:**
  - Replace the `og:image` and `twitter:image` content values with `/og-image.png` (a self-hosted asset)
  - Remove `<meta name="twitter:site" content="@Lovable" />` or update with the project's own Twitter handle
  - Add a proper `og-image.png` to `/public/` (copy the PWA 512×512 icon as a placeholder, then replace with a real social card later)

### 4. Lovable skills directory
- **Where:** `skills/taste-skill/SKILL.md` (or similar path)
- **What it is:** A Lovable platform design-system skill file used to prompt Lovable's AI agents.
- **Action:** Delete the directory. It has no effect outside Lovable's platform.

---

## Step-by-Step Execution

### Step 1 – `package.json`

```diff
- "name": "vite_react_shadcn_ts",
+ "name": "your-project-name",

  "scripts": {
    "dev": "vite",
    "build": "vite build",
+   "cap:sync": "npm run build && cap sync",
+   "cap:ios": "npm run build && cap sync ios && cap open ios",
+   "cap:android": "npm run build && cap sync android && cap open android"
  },

  "dependencies": {
+   "@capacitor/core": "^7.0.0",
    ...
  },

  "devDependencies": {
-   "lovable-tagger": "^1.1.13",
+   "@capacitor/android": "^7.0.0",
+   "@capacitor/cli": "^7.0.0",
+   "@capacitor/ios": "^7.0.0",
    ...
  }
```

### Step 2 – `vite.config.ts`

```diff
- import { componentTagger } from "lovable-tagger";

- export default defineConfig(({ mode }) => ({
+ export default defineConfig(({ mode: _mode }) => ({
    plugins: [
      react(),
-     mode === "development" && componentTagger(),
      VitePWA({ ... }),
-   ].filter(Boolean),
+   ],
```

### Step 3 – `index.html`

```diff
- <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
+ <meta property="og:image" content="/og-image.png" />

- <meta name="twitter:site" content="@Lovable" />
- <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
+ <meta name="twitter:image" content="/og-image.png" />
```

Then add `public/og-image.png` (at minimum, copy `pwa-512x512.png`; replace with a proper 1200×630 social card before launch).

> **Note on OG image URLs:** Social crawlers require absolute URLs for `og:image`. At deploy time, either set a `VITE_BASE_URL` env var and reference it in `index.html`, or use your hosting platform's "set meta tags per environment" feature.

### Step 4 – `capacitor.config.ts` (new file at project root)

```typescript
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.yourcompany.yourapp",   // ← update this
  appName: "Your App Name",            // ← update this
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  ios: {
    contentInset: "always",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: "#000000",      // ← match your theme color
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#000000",      // ← match your theme color
    },
  },
};

export default config;
```

### Step 5 – Remove Lovable skills

```bash
rm -rf skills/taste-skill
```

---

## Running the Result

### Web (PWA)
```bash
npm install
npm run build
npm run preview   # or deploy /dist to any static host
```

### iOS (requires macOS + Xcode)
```bash
npm install
npx cap add ios        # first time only
npm run cap:ios        # builds, syncs, opens Xcode
```

### Android (requires Android Studio)
```bash
npm install
npx cap add android    # first time only
npm run cap:android    # builds, syncs, opens Android Studio
```

---

## Deployment Targets

| Platform | Command / Method |
|---|---|
| Vercel | `vercel --prod` or connect repo; build cmd `npm run build`, output dir `dist` |
| Netlify | Connect repo; build cmd `npm run build`, publish dir `dist` |
| Cloudflare Pages | Connect repo; build cmd `npm run build`, output dir `dist` |
| AWS S3 + CloudFront | `aws s3 sync dist/ s3://your-bucket --delete` |
| GitHub Pages | Use `gh-pages` package or GitHub Actions to deploy `dist/` |
| Self-hosted (nginx) | Serve `dist/` with `try_files $uri /index.html` for SPA routing |
| iOS App Store | Archive from Xcode after `npm run cap:ios` |
| Google Play Store | Generate signed APK/AAB from Android Studio after `npm run cap:android` |

---

## Checklist

- [ ] `lovable-tagger` removed from `package.json`
- [ ] `componentTagger()` import and usage removed from `vite.config.ts`
- [ ] `og:image` and `twitter:image` point to self-hosted asset
- [ ] `twitter:site` updated or removed
- [ ] `public/og-image.png` added (placeholder or real 1200×630 image)
- [ ] `package.json` `name` updated from `vite_react_shadcn_ts` to the real app name
- [ ] Lovable skills directory deleted
- [ ] `@capacitor/core` in dependencies, `@capacitor/cli/ios/android` in devDependencies
- [ ] `capacitor.config.ts` created with correct `appId` and `appName`
- [ ] `cap:sync`, `cap:ios`, `cap:android` scripts added to `package.json`
- [ ] `npm run build` succeeds with zero errors
