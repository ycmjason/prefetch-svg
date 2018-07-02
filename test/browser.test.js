const { readFileSync } = require('fs');

const puppeteer = require('puppeteer');

describe('prefetch-svg (browser side)', () => {
  let browser;
  let page;

  beforeAll(async () => browser = await puppeteer.launch());
  beforeEach(async () => {
    page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36');
    await page.goto('about:blank');
  });

  afterEach(async () => await page.close());
  afterAll(async () => await browser.close());

  it('umd should replace @import() with the link content', async () => {
    await page.addScriptTag({
      path: require.resolve('../dist/prefetchSvg.umd.js')
    });

    const input = readFileSync(require.resolve('./svg1.input.svg'), 'utf8');
    const output = readFileSync(require.resolve('./svg1.output.svg'), 'utf8');
    expect(await page.evaluate(input => prefetchSvg(input), input)).toEqual(output);
  });
});
