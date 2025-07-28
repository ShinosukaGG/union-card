// api/search.js
const { chromium } = require('playwright');

module.exports = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://union-build-leaderboard.vercel.app', { waitUntil: 'networkidle' });

  await page.waitForSelector("input[type='search']");
  await page.fill("input[type='search']", username);
  await page.waitForTimeout(1500);

  const result = await page.evaluate(() => {
    const row = document.querySelector('tbody tr');
    if (!row) return null;

    const cells = row.querySelectorAll('td');
    return {
      rank: cells[0]?.innerText.trim(),
      title: cells[1]?.innerText.trim(),
      username: cells[2]?.innerText.trim(),
      xp: cells[3]?.innerText.trim(),
      level: cells[4]?.innerText.trim()
    };
  });

  await browser.close();

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json({ error: 'No match found' });
  }
};
