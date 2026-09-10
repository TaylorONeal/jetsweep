import { startStaticServer } from "../helpers/staticServer";
import { test, expect } from "@playwright/test";
test("plan, edit, reopen saved trip, and navigate back on mobile", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Plan my departure" }).click();
  await page.getByLabel("Departure airport").selectOption("JFK");
  await page.getByLabel("Departure date", { exact: true }).fill("2030-06-10");
  await page.getByLabel("Departure time", { exact: true }).fill("12:00");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Drive time (minutes)").fill("55");
  await page.getByRole("checkbox", { name: /Checking a bag/ }).check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Build my departure plan" }).click();
  await expect(page.getByText("Departure plan ready")).toBeVisible();
  await expect(
    page.getByText("Baggage Check-in", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit Details" }).click();
  await expect(page.getByLabel("Departure airport")).toHaveValue("JFK");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByLabel("Drive time (minutes)")).toHaveValue("55");
  await expect(
    page.getByRole("checkbox", { name: /Checking a bag/ }),
  ).toBeChecked();
  await page.getByRole("button", { name: "Home" }).click();
  await page.getByRole("button", { name: /JFK/ }).click();
  await expect(page.getByLabel("Departure date", { exact: true })).toHaveValue(
    "2030-06-10",
  );
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByLabel("Drive time (minutes)")).toHaveValue("55");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/${test.info().project.name}-journey.png`,
    fullPage: true,
    animations: "disabled",
  });
  await page.goBack();
  await expect(
    page.getByRole("button", { name: "Plan my departure" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("reloads and calculates with the origin server shut down", async ({ page }) => {
  const origin = await startStaticServer();
  try {
    await page.goto(origin.url);
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) {
        await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener(
          "controllerchange", () => resolve(), { once: true },
        ));
      }
    });
    // Real origin failure; WebKit's context.setOffline breaks service-worker navigation
    // even on a minimal cache-only page on this host.
    await origin.stop();
    await expect.poll(async () => {
      try { await fetch(origin.url); return true; } catch { return false; }
    }).toBe(false);
    await page.reload();
    await page.getByRole("button", { name: "Plan my departure" }).click();
    await page.getByLabel("Departure airport").selectOption("LAX");
    await page.getByLabel("Departure date", { exact: true }).fill("2030-06-10");
    await page.getByLabel("Departure time", { exact: true }).fill("12:00");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Build my departure plan" }).click();
    await expect(page.getByText("Departure plan ready")).toBeVisible();
  } finally {
    await origin.stop();
  }
});

test('remembers default and most recent airports across reloads', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Plan my departure' }).click();
  await page.getByLabel('Departure airport').selectOption('LAX');
  await page.getByRole('button', { name: 'Make LAX my default' }).click();
  await page.getByLabel('Departure airport').selectOption('JFK');
  await page.reload();
  await page.getByRole('button', { name: 'Plan my departure' }).click();
  await expect(page.getByLabel('Departure airport')).toHaveValue('LAX');
  await page.getByRole('button', { name: 'Remove LAX as default' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Plan my departure' }).click();
  await expect(page.getByLabel('Departure airport')).toHaveValue('JFK');
});

test('suggests nearby airports only after location is requested', async ({ page, context }) => {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 40.75, longitude: -73.98, accuracy: 100 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Plan my departure' }).click();
  await page.getByLabel('Departure airport').selectOption('LAX');
  await page.getByRole('button', { name: 'Use my location' }).click();
  await expect(page.getByRole('button', { name: /LGA.*LaGuardia/ })).toBeVisible();
  await expect(page.getByLabel('Departure airport')).toHaveValue('LAX');
  await page.getByRole('button', { name: /LGA.*LaGuardia/ }).click();
  await expect(page.getByLabel('Departure airport')).toHaveValue('LGA');
});
