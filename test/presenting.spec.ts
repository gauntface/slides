import {expect, test} from '@playwright/test';

test.describe('Present mode', () => {
  test('starts in present mode when the URL has a slide number', async ({
    page,
  }) => {
    await page.goto('/demo/#0');
    await expect(page.locator('body')).toHaveAttribute('is-presenting', 'true');
    await expect(page.locator('gf-slides')).toHaveAttribute(
      'is-presenting',
      'true',
    );
    await expect(page.locator('gf-slide').first()).toBeVisible();
  });

  test('goes to the first slide for a negative slide number', async ({
    page,
  }) => {
    await page.goto('/demo/#-1');
    await expect(page.locator('gf-slides')).toHaveAttribute(
      'is-presenting',
      'true',
    );
    await expect(page).toHaveURL(/#0$/);
  });

  test('goes to the last slide for a slide number that is too large', async ({
    page,
  }) => {
    await page.goto('/demo/#999');
    await expect(page.locator('gf-slides')).toHaveAttribute(
      'is-presenting',
      'true',
    );
    const slideCount = await page.locator('gf-slide').count();
    await expect(page).toHaveURL(new RegExp(`#${String(slideCount - 1)}$`));
  });

  for (const key of ['ArrowRight', 'ArrowDown', 'PageDown', 'Space']) {
    test(`goes to the next slide on ${key}`, async ({page}) => {
      await page.goto('/demo/#0');
      await expect(page.locator('gf-slides')).toHaveAttribute(
        'is-presenting',
        'true',
      );

      await page.keyboard.press(key);
      await expect(page).toHaveURL(/#1$/);
      await expect(page.locator('gf-slides')).toHaveAttribute(
        'is-presenting',
        'true',
      );
    });
  }

  for (const key of ['ArrowLeft', 'ArrowUp', 'PageUp', 'Shift+Space']) {
    test(`goes to the previous slide on ${key}`, async ({page}) => {
      await page.goto('/demo/#1');
      await expect(page.locator('gf-slides')).toHaveAttribute(
        'is-presenting',
        'true',
      );

      await page.keyboard.press(key);
      await expect(page).toHaveURL(/#0$/);
      await expect(page.locator('gf-slides')).toHaveAttribute(
        'is-presenting',
        'true',
      );
    });
  }

  test('goes to the next slide on a click on the slide', async ({page}) => {
    await page.goto('/demo/#0');
    await page.locator('gf-slide[is-visible]').click();
    await expect(page).toHaveURL(/#1$/);
  });

  test('does not change slide on a click on an interactive element', async ({
    page,
  }) => {
    await page.goto('/demo/#0');
    await page
      .locator('gf-slide[is-visible] .gf-slide__wrapper')
      .evaluate((wrapper) => {
        wrapper.append(document.createElement('button'));
      });

    await page.locator('gf-slide[is-visible] button').click();
    await expect(page).toHaveURL(/#0$/);
  });

  for (const key of [
    'Alt+ArrowRight',
    'Control+ArrowRight',
    'Meta+ArrowRight',
  ]) {
    test(`does not change slide on ${key}`, async ({page}) => {
      await page.goto('/demo/#1');
      await expect(page.locator('gf-slides')).toHaveAttribute(
        'is-presenting',
        'true',
      );

      await page.keyboard.press(key);
      await expect(page).toHaveURL(/#1$/);
    });
  }

  test('does not change slide on a key press in an input', async ({page}) => {
    await page.goto('/demo/#0');
    await page
      .locator('gf-slide[is-visible] .gf-slide__wrapper')
      .evaluate((wrapper) => {
        wrapper.append(document.createElement('input'));
      });

    await page.locator('gf-slide[is-visible] input').press('ArrowRight');
    await expect(page).toHaveURL(/#0$/);
  });

  test('builds UI forwards', async ({page}) => {
    await page.goto('/demo/');
    const slide = page.locator('.js-build-up');
    await slide.click();
    await expect(page.locator('gf-slides')).toHaveAttribute(
      'is-presenting',
      'true',
    );

    const buildCount = await slide.locator('[build]').count();
    expect(buildCount).toBeGreaterThanOrEqual(2);
    const slideURL = page.url();

    for (let i = 1; i <= buildCount; i++) {
      await page.keyboard.press('ArrowRight');
      await expect(slide.locator('[build="built"]')).toHaveCount(i);
      expect(page.url()).toBe(slideURL);
    }

    await page.keyboard.press('ArrowRight');
    await expect(page).not.toHaveURL(slideURL);
  });

  test('builds UI backwards', async ({page}) => {
    await page.goto('/demo/');
    const slide = page.locator('.js-build-up');
    await page.locator('.js-build-up + gf-slide').click();
    await expect(page.locator('gf-slides')).toHaveAttribute(
      'is-presenting',
      'true',
    );

    await page.keyboard.press('ArrowLeft');
    const buildCount = await slide.locator('[build]').count();
    expect(buildCount).toBeGreaterThanOrEqual(2);
    await expect(slide.locator('[build="built"]')).toHaveCount(buildCount);
    const slideURL = page.url();

    for (let i = buildCount - 1; i >= 0; i--) {
      await page.keyboard.press('ArrowLeft');
      await expect(slide.locator('[build="built"]')).toHaveCount(i);
      expect(page.url()).toBe(slideURL);
    }

    await page.keyboard.press('ArrowLeft');
    await expect(page).not.toHaveURL(slideURL);
  });
});
