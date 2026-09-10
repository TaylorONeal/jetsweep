import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const output = fileURLToPath(new URL('../release-assets/screenshots/', import.meta.url));
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 360, height: 640 }, deviceScaleFactor: 3,
    isMobile: true, hasTouch: true, reducedMotion: 'reduce', timezoneId: 'America/New_York',
  });
  const page = await context.newPage();
  await page.clock.setFixedTime(new Date('2030-06-10T09:00:00Z'));
  const capture = name => page.screenshot({ path: join(output, `${name}.png`), animations: 'disabled' });
  await page.goto(process.env.JETSWEEP_PREVIEW_URL ?? 'http://127.0.0.1:4180');
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
  console.log(`Saved five 1080×1920 browser-preview screenshots to ${output}`);
} finally {
  await browser.close();
}
