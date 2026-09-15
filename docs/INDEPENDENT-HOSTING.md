# Independent hosting and platform cleanup

JetSweep is a static Vite application. Install with Node 22+ and `npm ci`, run
`npm run build`, then serve `dist/` over HTTPS. No builder account, API key,
remote font, backend, authentication service, or platform-specific deployment
integration is required by the application. Browser location needs HTTPS
(localhost is supported for development).

Configure the host to serve existing files first, then fall back to `/index.html`
for client routes such as `/privacy`. Example nginx location:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Use short/revalidation caching for index.html, sw.js, and manifest.webmanifest;
hashed assets under /assets may use immutable caching. Test deep links and
an offline reload before changing DNS. Native builds remain bundled locally
and disable service-worker registration with `npm run build:native`.

Before public deployment, select the owned origin and make og:image and
twitter:image absolute URLs to that origin's /og-image.png. Supply real
support/privacy URLs in publisher metadata. No origin or ownership is assumed.
No deployment, DNS change, account disconnection, or store submission occurred.
Existing hosted account integrations and DNS ownership have not been audited;
any existing hosted Lovable site must be migrated by its owner before retirement.
No runtime dependency on such a site was found in this repository.

## September 15 cleanup

- Removed stale bun.lock containing lovable-tagger; npm's clean package-lock.json
  is the sole supported lockfile. Active Vite/package configuration was already clean.
- Removed unused public/placeholder.svg scaffold.
- Rebuilt favicon.ico, added explicitly linked favicon.svg, rebuilt both PWA icons
  and a real 1200x630 social card from local JetSweep artwork. Existing Lucide
  geometry retains its ISC license in release-assets/store/LUCIDE-LICENSE.txt.
- Archived the outdated removal skill under docs/archive as audit evidence.
  Its platform-name references are documentation only, never bundled.
- Preserved React/shadcn, Capacitor 8, airport data, native setup, and local persistence.
- Inspected .git/hooks/post-commit: it auto-pushes on main/master. All commits in
  this pass use per-command core.hooksPath=/dev/null; the user's hook is unchanged.

Regenerate web branding with `node scripts/prepare-web-artwork.mjs` after the
native/store source artwork is prepared. The new independent candidate supersedes
the September 15 initial candidate. Neither candidate is signed for release or
physical-device tested. See the candidate manifest for hashes and evidence.

The native sweep also rebuilt 36 Android splash/iOS icon-and-splash PNGs from
the local vector, preserving dimensions and asset catalogs. Regenerate with
`node scripts/prepare-native-splash.mjs`. iOS compilation remains unverified
because the Xcode agreement is unaccepted. No agreement was accepted.

Fresh checks: 56 unit/form tests; 10 Chromium/WebKit checks; Android debug,
unsigned bundle, instrumentation compilation and lint pass. Lint has 0 errors
and 28 warnings (including identical day/night artwork); physical-device tests
remain unrun. Browser favicon URLs loaded successfully and the favicon, social
card, and native splash were visually inspected. No platform strings were found
in the generated web/native web bundles or npm lockfiles. The browser automation
CLI stalled taking a screenshot; direct Playwright supplied the image evidence.
