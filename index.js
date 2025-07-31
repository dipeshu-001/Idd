const puppeteer = require("puppeteer");
const fs = require("fs");

const delay = ms => new Promise(res => setTimeout(res, ms));

async function scrape() {
  try {
    let allIDs = [];

    if (fs.existsSync("data.json")) {
      allIDs = JSON.parse(fs.readFileSync("data.json"));
    }

    allIDs = [...new Set(allIDs)];

    const browser = await puppeteer.launch({ headless: true });

    for (let i = 1; i <= 100; i++) {
      const page = await browser.newPage();
      const url = `https://shoob.gg/cards?page=${i}`;
      console.log(`🌐 Visiting ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });

      try {
        await page.waitForSelector('.card', { timeout: 10000 });
        const ids = await page.$$eval('a[href^="/cards/"]', links =>
          links.map(link => link.href.split('/').pop())
        );
        allIDs.push(...ids);
        allIDs = [...new Set(allIDs)];
        console.log(`✅ Page ${i} — Found: ${ids.length} cards`);
        fs.writeFileSync("data.json", JSON.stringify(allIDs, null, 2));
      } catch (err) {
        console.warn(`⚠️ Skipped page ${i} (no cards found or timed out)`);
      }

      await page.close();
    }

    await browser.close();
    console.log(`🎉 Done. Total unique card IDs: ${allIDs.length}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

(async () => {
  while (true) {
    await scrape();
    console.log("⏳ Waiting 12 hours before next run...");
    await delay(12 * 60 * 60 * 1000); // 12 hours
  }
})();
