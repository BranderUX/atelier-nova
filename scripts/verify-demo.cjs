/**
 * Headless verification driver for the demo. Loads the site, optionally types
 * a query, optionally clicks inside a rendered element, and screenshots.
 *
 * Playwright is NOT a dependency of this repo — point PLAYWRIGHT_DIR at any
 * checkout that has it (e.g. the BranderUX client repo).
 *
 * Usage:
 *   PLAYWRIGHT_DIR=../BranderUX-client node scripts/verify-demo.cjs \
 *     [--url http://localhost:3001] [--query "text"] [--click "TEXT IN ELEMENT"] \
 *     [--frame-has "Order this look"] [--wait 40000] [--out shot.png]
 *
 * `--frame-has` disambiguates WHICH element iframe to click in — history keeps
 * previous screens' frames alive, so match on text unique to the target screen.
 */
const path = require("node:path");

const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  args[process.argv[i].replace(/^--/, "")] = process.argv[i + 1];
}

const playwrightDir = process.env.PLAYWRIGHT_DIR || "../BranderUX-client";
const { chromium } = require(
  path.resolve(process.cwd(), playwrightDir, "node_modules/playwright")
);

const URL = args.url || "http://localhost:3001";
const WAIT = Number(args.wait || 40000);
const OUT = args.out || "verify-shot.png";

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await (await browser.newContext({ viewport: { width: 1512, height: 900 } })).newPage();
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(WAIT);

  if (args.query) {
    const embed = page.frames().find((f) => f.url().includes("/embed"));
    if (!embed) throw new Error("embed frame not found");
    const input = embed.locator('input[placeholder*="Ask"], textarea[placeholder*="Ask"]').last();
    await input.click();
    await input.fill(args.query);
    await input.press("Enter");
    console.log(`query sent: ${args.query}`);
    await page.waitForTimeout(WAIT);
  }

  if (args.click) {
    let clicked = false;
    for (const f of page.frames()) {
      if (!f.url().includes("element-sandbox")) continue;
      try {
        if (args["frame-has"] && !(await f.locator(`text=${args["frame-has"]}`).count())) continue;
        const target = f.locator(`text=${args.click}`).first();
        if (await target.count()) {
          await target.click({ force: true });
          clicked = true;
          console.log(`clicked: ${args.click}`);
          await page.waitForTimeout(2000);
          break;
        }
      } catch {
        // frame detached mid-scan — keep looking
      }
    }
    if (!clicked) console.warn(`NOT FOUND: ${args.click}`);
  }

  await page.screenshot({ path: OUT });
  console.log(`screenshot: ${OUT}`);
  await browser.close();
})();
