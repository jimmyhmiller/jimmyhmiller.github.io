const {chromium} = require('/tmp/react-article-browser/node_modules/playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({channel:'chrome'});
  try {
    const page = await browser.newPage();
    const url = process.env.REACT_ARTICLE_URL ?? 'http://127.0.0.1:3011';
    await page.goto(`${url}/what-does-the-react-compiler-even-do`);
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+Shift+E');
    await page.getByText(/Copy editor · 0 edits/i).first().waitFor();

    const paragraph = page.locator('article.article > p').first();
    const original = await paragraph.textContent();
    await paragraph.click();
    await page.keyboard.type('A');
    let stored = await page.evaluate(() => JSON.parse(localStorage.getItem('copyeditor.edits.v2')));
    assert.equal(stored.length, 1);
    assert.equal(stored[0].committed, false);
    assert.equal(stored[0].after, `${original}A`);
    await page.keyboard.type('B');
    stored = await page.evaluate(() => JSON.parse(localStorage.getItem('copyeditor.edits.v2')));
    assert.equal(stored[0].after, `${original}AB`, 'The second keystroke is saved before commit');

    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => document.querySelector('article.article > p').textContent.endsWith('AB'));
    await page.getByText(/Copy editor · 1 edit$/i).first().waitFor();
    await paragraph.click();
    await page.keyboard.press('Enter');
    assert.equal(await paragraph.getAttribute('contenteditable'), 'plaintext-only');
    await page.keyboard.press('Meta+Enter');
    stored = await page.evaluate(() => JSON.parse(localStorage.getItem('copyeditor.edits.v2')));
    assert.equal(stored.length, 1, 'Repeated edits to the paragraph remain one diff');
    assert.equal(stored[0].committed, true);

    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => document.querySelector('article.article > p').textContent.includes('AB'));
    await page.keyboard.press('Control+Shift+E');
    await paragraph.click();
    await page.keyboard.type('C');
    await page.keyboard.press('Escape');
    stored = await page.evaluate(() => JSON.parse(localStorage.getItem('copyeditor.edits.v2')));
    assert.equal(stored.length, 1);
    assert.equal(stored[0].committed, true, 'Cancel restores the previous saved edit');
    assert.equal((await paragraph.textContent()).endsWith('C'), false);
    console.log('PASS: per-keystroke autosave, reload recovery, Cmd+Enter commit, coalescing, and cancel');
  } finally {
    await browser.close();
  }
})().catch(error => {console.error(error); process.exit(1);});
