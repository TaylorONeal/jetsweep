import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawn, execFileSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = process.env.JETSWEEP_SCREENSHOT_OUTPUT || fileURLToPath(new URL('../release-assets/screenshots/', import.meta.url));
const previewUrl = process.env.JETSWEEP_PREVIEW_URL || 'http://127.0.0.1:4180';
const server = process.env.JETSWEEP_PREVIEW_URL ? null : spawn(process.execPath, [
  fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url)),
  'preview', '--host', '127.0.0.1', '--port', '4180', '--strictPort',
], { cwd: root, stdio: 'inherit' });
const captures = [];
let browser;
await mkdir(output, { recursive: true });
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server && server.exitCode !== null) throw new Error('Preview server exited before capture.');
    try { if ((await fetch(previewUrl)).ok) break; } catch { /* wait for local preview */ }
    if (attempt === 99) throw new Error('Preview server did not become ready.');
    await delay(100);
  }
  browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 360, height: 640 }, deviceScaleFactor: 3,
    isMobile: true, hasTouch: true, reducedMotion: 'reduce', timezoneId: 'America/New_York',
  });
  const page = await context.newPage();
  await page.clock.setFixedTime(new Date('2030-06-10T09:00:00Z'));
  const capture = async name => {
    await page.evaluate(() => document.fonts.ready);
    const bytes = await page.screenshot({ path: join(output, `${name}.png`), animations: 'disabled' });
    captures.push({ file: `${name}.png`, width: 1080, height: 1920, sha256: createHash('sha256').update(bytes).digest('hex'), scrollY: await page.evaluate(() => window.scrollY) });
  };
  await page.goto(previewUrl);
  await page.getByRole('button', { name: 'Plan my departure' }).waitFor();
  await capture('01-home');
  await page.getByRole('button', { name: 'Plan my departure' }).click();
  await page.getByLabel('Departure airport').selectOption('ATL');
  await page.getByLabel('Departure date', { exact: true }).fill('2030-06-10');
  await page.getByLabel('Departure time', { exact: true }).fill('12:00');
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture('02-flight');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Drive time (minutes)').fill('35');
  await page.getByRole('checkbox', { name: /TSA PreCheck/ }).check();
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture('06-journey-options');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture('03-review');
  await page.getByRole('button', { name: 'Build my departure plan' }).click();
  await page.getByText('Departure plan ready').waitFor();
  await capture('04-plan');
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 40.75, longitude: -73.98, accuracy: 100 });
  await page.reload();
  await page.getByRole('button', { name: 'Plan my departure' }).click();
  await page.getByRole('button', { name: 'Use my location' }).click();
  await page.getByRole('button', { name: /LGA.*LaGuardia/ }).click();
  await page.getByRole('button', { name: 'Make LGA my default' }).click();
  await page.getByRole('button', { name: 'Use my location' }).scrollIntoViewIfNeeded();
  await capture('05-airport-shortcuts');
  await page.goto(new URL('/privacy', page.url()).href);
  await capture('07-privacy');
  await writeFile(join(output, 'manifest.json'), JSON.stringify({
    schemaVersion: 1, provenance: 'mobile-web-preview', nativeCapture: false,
    sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    browser: `Chromium ${browser.version()}`, viewport: { width: 360, height: 640, scale: 3 },
    timezone: 'America/New_York', sampleClock: '2030-06-10T09:00:00Z',
    simulatedLocation: 'Midtown Manhattan', captures,
  }, null, 2) + '\n');
  console.log(`Saved seven 1080×1920 mobile-web draft previews to ${output}`);
} finally {
  await browser?.close();
  server?.kill();
}
