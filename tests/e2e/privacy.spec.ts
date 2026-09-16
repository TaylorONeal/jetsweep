import { test, expect } from '@playwright/test';

test('privacy controls clear saved airports and plans across reloads', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Plan my departure' }).click();
  await page.getByLabel('Departure airport').selectOption('JFK');
  await page.getByRole('button', { name: 'Make JFK my default' }).click();
  await page.getByLabel('Departure date', { exact: true }).fill('2030-06-10');
  await page.getByLabel('Departure time', { exact: true }).fill('12:00');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Build my departure plan' }).click();
  await expect(page.getByText('Departure plan ready')).toBeVisible();
  await page.goto('/privacy');
  await page.getByRole('button', { name: 'Clear recent plans', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Recent plans cleared' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear saved airport preferences' }).click();
  await expect(page.getByText('Saved airport preferences cleared.')).toBeVisible();
  await page.reload();
  expect(await page.evaluate(() => [localStorage.getItem('jetsweep_recent_searches'), localStorage.getItem('jetsweep_airport_preferences')])).toEqual([null, null]);
  await page.goto('/');
  await page.getByRole('button', { name: 'Plan my departure' }).click();
  await expect(page.getByLabel('Departure airport')).toHaveValue('');
});

test('location denial preserves the airport and permits manual planning', async ({ page }) => {
  // Deterministic denied-permission response, not a native permission-dialog test.
  await page.addInitScript(() => {
    Object.defineProperty(navigator.geolocation, 'getCurrentPosition', {
      value: (_success: unknown, failure: PositionErrorCallback) => failure({ code: 1, message: 'Denied' } as GeolocationPositionError),
    });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Plan my departure' }).click();
  await page.getByLabel('Departure airport').selectOption('LAX');
  await page.getByRole('button', { name: 'Use my location' }).click();
  await expect(page.getByText(/Location permission was denied/)).toBeVisible();
  await expect(page.getByLabel('Departure airport')).toHaveValue('LAX');
  await expect(page.getByRole('button', { name: 'Use my location' })).toBeEnabled();
  await page.getByLabel('Departure date', { exact: true }).fill('2030-06-10');
  await page.getByLabel('Departure time', { exact: true }).fill('12:00');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByLabel('Drive time (minutes)')).toBeVisible();
});
