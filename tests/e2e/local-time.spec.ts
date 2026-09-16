import { test, expect } from '@playwright/test';

test.use({ timezoneId: 'America/New_York' });
test('rejects a nonexistent daylight-saving departure time', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Plan my departure' }).click();
  await page.getByLabel('Departure airport').selectOption('JFK');
  await page.getByLabel('Departure date', { exact: true }).fill('2030-03-10');
  await page.getByLabel('Departure time', { exact: true }).fill('02:30');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('alert')).toHaveText('Enter a valid departure date and time.');
  await expect(page.getByRole('heading', { name: 'Where are you taking off?' })).toBeVisible();
});
