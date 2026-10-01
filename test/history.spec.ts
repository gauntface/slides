import {expect, test} from '@playwright/test';

test('updates the mode and slide when the user goes back', async ({page}) => {
  await page.goto('/demo/');
  const deck = page.locator('gf-slides');
  await expect(deck).toHaveAttribute('is-overview', 'true');

  await page.locator('gf-slide').first().click();
  await expect(deck).toHaveAttribute('is-presenting', 'true');
  await expect(page).toHaveURL(/#0$/);

  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/#1$/);

  await page.goBack();
  await expect(page).toHaveURL(/#0$/);
  await expect(deck).toHaveAttribute('is-presenting', 'true');

  await page.goBack();
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(deck).toHaveAttribute('is-overview', 'true');
});
