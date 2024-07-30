import {test, expect} from '@playwright/test';

test('has title', async ({page}) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({page}) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', {name: 'Get started'}).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', {name: 'Installation'})).toBeVisible();
});

test('gets bun version', async ({page}) => {
  await page.goto('http://localhost:3000/');
  await page.screenshot({path: 'screenshot.png'});
  // Using getByText instead of page.locator('button:text("Button Text Here")')
  // because Shoelace buttons do not use a button element.
  const button = await page.getByText('Get Bun Version');
  button.click();
  //await page.waitForTimeout(1000);
  await expect(page.getByText('v1.1.21')).toBeVisible();
});
