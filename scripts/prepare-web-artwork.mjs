import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
const svg = await readFile('release-assets/store/icon-source.svg', 'utf8');
await writeFile('public/favicon.svg', svg);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  for (const size of [32, 192, 512]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<style>body{margin:0;background:#0b1014}svg{width:100vw;height:100vh}</style>${svg}`);
    const png = await page.screenshot();
    if (size === 32) {
      // ICO supports an embedded PNG; supply a conventional fallback for browsers.
      const header = Buffer.alloc(22);
      header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
      header[6] = 32; header[7] = 32;
      header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
      header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
      await writeFile('public/favicon.ico', Buffer.concat([header, png]));
    } else await writeFile(`public/pwa-${size}x${size}.png`, png);
  }
  const card = await readFile('release-assets/store/feature-graphic.html', 'utf8');
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(`${card}<style>body{width:1200px;height:630px;padding:100px}</style>`);
  await page.screenshot({ path: 'public/og-image.png' });
} finally { await browser.close(); }
