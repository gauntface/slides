import {expect, test} from '@playwright/test';

test('back from a corrected slide number leaves the deck', async ({page}) => {
  await page.goto('/demo/');
  await page.goto('/demo/#-1');
  await expect(page).toHaveURL(/#0$/);

  await page.goBack();
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.locator('gf-slides')).toHaveAttribute(
    'is-overview',
    'true',
  );
});

test('stays in overview mode for a hash that is not a number', async ({
  page,
}) => {
  await page.goto('/demo/#contact');
  await expect(page.locator('gf-slides')).toHaveAttribute(
    'is-overview',
    'true',
  );
  await expect(page).toHaveURL(/#contact$/);
});

test('stays on the slide for a hash that is not a number', async ({page}) => {
  await page.goto('/demo/#1');
  await page.evaluate(() => {
    window.location.hash = 'contact';
  });
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('gf-slides')).toHaveAttribute(
    'is-presenting',
    'true',
  );
  await expect(page.locator('gf-slide').nth(1)).toHaveAttribute('is-visible');
});

test('fits the slide when the deck changes size', async ({page}) => {
  await page.setViewportSize({width: 1920, height: 1080});
  await page.goto('/demo/#0');
  await page.addStyleTag({content: 'gf-slides { width: 960px !important; }'});

  const slide = page.locator('gf-slide[is-visible]');
  await expect(async () => {
    const box = await slide.boundingBox();
    expect(box?.width).toBe(960);
    expect(box?.height).toBe(540);
  }).toPass();
});
