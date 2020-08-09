const puppeteer = require('puppeteer');
const fs = require('fs').promises;

var args = process.argv.slice(2);

if (args.length === 0) {
  console.error(
    'Missing argument: path to JSON file of pages data\n  e.g. node index.js ./pages.json'
  );
  process.exit(1);
}

// Only expecting one argument that is a path to a JSON file.
const jsonFilePath = args[0];

const viewportSettings = {
  mobile: {
    width: 375,
    height: 667,
    isMobile: true,
  },
  desktop: {
    width: 1024,
    height: 768,
    isMobile: false,
  },
};

const iPhone8 = puppeteer.devices['iPhone 8'];

const buildPath = (prefix, label) =>
  `./captures/${prefix}-${label.replace(/[\W]/gi, '-')}.jpg`;

(async () => {
  const data = await fs.readFile(require.resolve(jsonFilePath));
  const pages = JSON.parse(data).pages;

  if (pages === undefined) return;

  const browser = await puppeteer.launch({
    ignoreDefaultArgs: [
      '--disable-dev-shm-usage',
    ] /* turn off dev shared memory limitations */,
    headless: true /* false if you wanna watch :P */,
  });

  let page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0); // set to zero to see if it speeds up.

  /**
   * Capture desktop versions
   */
  await page.setViewport(viewportSettings.desktop);

  for (let p = 0, len = pages.length; p < len; p++) {
    console.log(`[Desktop] Capturing: ${pages[p].url}`);
    console.log('\tNavigating...');
    await page.goto(pages[p].url, { waitUntil: 'networkidle2' });
    console.log('\tSaving screenshot...');
    await page.screenshot({
      path: buildPath('desktop', pages[p].label),
      fullPage: true,
    });
  }

  /**
   * Capture mobile versions
   * -----
   * It's better to do these separately from desktop so
   * that we only need to instruct the page to `emulate` the device one. (This is 
   * faster that switching back and forth between viewports.)
   */
  await page.emulate(iPhone8);

  for (let p = 0, len = pages.length; p < len; p++) {
    console.log(`[Mobile] Capturing: ${pages[p].url}`);
    console.log('\tNavigating...');
    await page.goto(pages[p].url, { waitUntil: 'networkidle2' });
    console.log('\tSaving screenshot...');
    await page.screenshot({
      path: buildPath('mobile', pages[p].label),
      fullPage: true,
    });
  }

  await browser.close();
  console.log('Done.');
})();
