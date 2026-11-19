import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const paths = ["/", "/my-story", "/music", "/videos", "/shows", "/hire-me-to-sing", "/news", "/store"];

try {
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 850 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));

    for (const path of paths) {
      const response = await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(response.status(), 200, `${path} responds successfully`);
      assert.equal(await page.locator("h1").count(), 1, `${path} has a semantic main heading`);
      const dimensions = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }));
      assert.ok(dimensions.document <= dimensions.viewport + 2, `${path} fits ${width}px viewport (got ${dimensions.document})`);
      const images = await page.locator("img").count();
      assert.ok(images >= (path === "/store" ? 0 : 1), `${path} has artwork where expected`);
    }
    assert.deepEqual(errors, [], `No JavaScript errors at ${width}px`);

    if (width === 1440) {
      await page.goto(base);
      assert.match(await page.locator(".hero-portrait").getAttribute("src"), /dmark-cutout\.webp/, "New supplied portrait is the hero");
      await page.getByRole("button", { name: "Next release" }).click();
      assert.equal(await page.locator(".latest-information h3").innerText(), "Tombawala", "Homepage release carousel advances");
      await page.getByRole("button", { name: "Previous release" }).click();
      assert.equal(await page.locator(".latest-information h3").innerText(), "Jimpe", "Homepage release carousel reverses");
      await page.getByRole("button", { name: "Music submenu" }).click();
      assert.equal(await page.locator(".nav-submenu a").count(), 2, "Music submenu opens");

      await page.goto(`${base}/music`);
      await page.getByRole("button", { name: "2026", exact: true }).click();
      assert.equal(await page.locator(".release-card").count(), 2, "2026 filter");
      await page.getByRole("button", { name: "ALL", exact: true }).click();
      assert.equal(await page.locator(".release-card").count(), 9, "All releases filter");

      await page.goto(`${base}/videos`);
      await page.getByRole("button", { name: "Play Jimpe Official audio" }).click();
      assert.equal(await page.locator(".video-feature iframe").count(), 1, "Featured video starts in-page");
      await page.getByRole("button", { name: "Watch Tombawala" }).click();
      assert.equal(await page.locator(".video-feature .video-poster").count(), 1, "Choosing another video updates poster");

      await page.goto(`${base}/hire-me-to-sing`);
      await page.locator("input[name=name]").fill("Amina");
      await page.locator("input[name=email]").fill("amina@example.com");
      await page.locator("textarea[name=message]").fill("I would love to book a show in Kampala.");
      await page.getByRole("button", { name: "PREPARE MESSAGE" }).click();
      assert.match(await page.locator(".draft-panel textarea").inputValue(), /book a show in Kampala/, "Enquiry composer produces a copyable draft");
      assert.match(await page.locator(".booking-disclaimer").innerText(), /does not send/, "Booking form is honest about delivery");
    }

    if (width === 390) {
      await page.goto(base);
      await page.getByRole("button", { name: "Open menu" }).click();
      assert.equal(await page.locator(".mobile-menu a").count() > 5, true, "Mobile navigation opens");
      await page.locator(".mobile-menu a[href='/my-story']").click();
      assert.equal(new URL(page.url()).pathname, "/my-story", "Mobile navigation works");
      assert.equal(await page.locator(".mobile-menu").count(), 0, "Mobile menu closes after navigation");
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.keyboard.press("Escape");
      assert.equal(await page.locator(".mobile-menu").count(), 0, "Escape closes the menu");
    }

    await page.close();
    console.log(`Passed: ${width}px routes and interactions`);
  }
  console.log("All smoke tests passed.");
} finally {
  await browser.close();
}
