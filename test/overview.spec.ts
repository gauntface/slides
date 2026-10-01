import {expect, test} from '@playwright/test';

test.describe('Overview mode', () => {
  test('opens the demo page', async ({page}) => {
    await page.goto('/demo/');
    await expect(page).toHaveTitle('<gf-slide>');
  });

  test('starts in overview mode', async ({page}) => {
    await page.goto('/demo/');
    await expect(page.locator('body')).toHaveAttribute('is-overview', 'true');
    await expect(page.locator('gf-slides')).toHaveAttribute(
      'is-overview',
      'true',
    );
  });

  test('goes to present mode after a click on a slide', async ({page}) => {
    await page.goto('/demo/');
    await page.locator('gf-slide').first().click();
    await expect(page.locator('body')).toHaveAttribute('is-presenting', 'true');
    await expect(page.locator('gf-slides')).toHaveAttribute(
      'is-presenting',
      'true',
    );
  });

  test('stays in overview mode on arrow keys', async ({page}) => {
    await page.goto('/demo/');
    const deck = page.locator('gf-slides');
    await expect(deck).toHaveAttribute('is-overview', 'true');

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');
    await expect(deck).toHaveAttribute('is-overview', 'true');
    await expect(page).toHaveURL(/\/demo\/$/);
  });

  test('goes to overview mode from present mode on escape', async ({page}) => {
    await page.goto('/demo/#0');
    const deck = page.locator('gf-slides');
    await expect(deck).toHaveAttribute('is-presenting', 'true');

    await page.keyboard.press('Escape');
    await expect(deck).toHaveAttribute('is-overview', 'true');
  });

  test('toggles between overview and present mode on escape', async ({
    page,
  }) => {
    await page.goto('/demo/#1');
    const deck = page.locator('gf-slides');
    await expect(deck).toHaveAttribute('is-presenting', 'true');

    await page.keyboard.press('Escape');
    await expect(deck).toHaveAttribute('is-overview', 'true');

    await page.keyboard.press('Escape');
    await expect(deck).toHaveAttribute('is-presenting', 'true');
    await expect(page).toHaveURL(/#1$/);
  });
});
