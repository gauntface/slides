import {expect, test} from '@playwright/test';

test.describe('Slide dimensions', () => {
  test('uses 1920x1080 by default', async ({page}) => {
    await page.setViewportSize({width: 1920, height: 1080});
    await page.goto('/demo/#0');

    const box = await page.locator('gf-slide[is-visible]').boundingBox();
    expect(box?.width).toBe(1920);
    expect(box?.height).toBe(1080);
  });

  test('uses the CSS properties in present mode', async ({page}) => {
    await page.goto('/demo/#0');
    await page.addStyleTag({
      content:
        'gf-slides { --gf__slide-width: 1000px; --gf__slide-height: 1000px; }',
    });
    await page.setViewportSize({width: 1200, height: 800});

    const slide = page.locator('gf-slide[is-visible]');
    await expect(async () => {
      const box = await slide.boundingBox();
      expect(box?.width).toBe(800);
      expect(box?.height).toBe(800);
    }).toPass();
  });

  test('uses the CSS properties in overview mode', async ({page}) => {
    await page.goto('/demo/');
    await page.addStyleTag({
      content:
        'gf-slides { --gf__slide-width: 600px; --gf__slide-height: 800px; }',
    });
    await page.setViewportSize({width: 1200, height: 800});

    const slide = page.locator('gf-slide').first();
    await expect(async () => {
      const size = await slide.evaluate((element) => ({
        width: element.clientWidth,
        height: element.clientHeight,
      }));
      expect(size).toEqual({width: 300, height: 400});
    }).toPass();
  });
});
