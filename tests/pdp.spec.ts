import { expect, test, type Page } from "@playwright/test";
import path from "node:path";

const FIXTURES = [
  "public/images/product/dress-front.jpeg",
  "public/images/product/dress-back.jpeg",
  "public/images/product/dress-detail-front.jpeg",
  "public/images/product/dress-detail-back.jpeg",
  "public/images/product/dress-detail-hem.jpeg",
  "public/images/recommendations/big-collar-shirt.jpeg",
].map((file) => path.resolve(file));

async function openStudio(page: Page) {
  await page
    .getByRole("button", { name: /upload your images|edit your images/i })
    .first()
    .click();
  await expect(page.getByTestId("studio-dialog")).toBeVisible();
}

async function addImages(page: Page, count = 1) {
  await page.locator('input[type="file"]').first().setInputFiles(FIXTURES.slice(0, count));
  await expect(page.getByRole("button", { name: new RegExp(`add ${count} image`, "i") })).toBeEnabled();
}

async function applyImages(page: Page, count = 1) {
  await page.getByRole("button", { name: new RegExp(`add ${count} image`, "i") }).click();
  await expect(page.getByTestId("studio-dialog")).toHaveCount(0);
}

test.describe("PDP", () => {
  test("loads clean with no console or page errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Racer back mini dress");
    await expect(page.getByText("You may also like")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("default gallery is one enlarged image plus a two-up grid", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop gallery geometry");
    await page.goto("/");

    const gallery = page.getByTestId("pdp-gallery");
    await expect(
      gallery.locator('img[alt="Black racer back mini dress, front view"]:visible').first(),
    ).toBeVisible();
    await expect(gallery.locator("figure:visible")).toHaveCount(4);

    const hero = await gallery.locator("div.border:visible").first().boundingBox();
    const tile = await gallery.locator("figure:visible").first().boundingBox();
    expect(hero?.width).toBeGreaterThan(tile?.width ?? 0);
  });

  test("size selection, add to bag, checkout feedback", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "M", exact: true }).click();
    const addToBag = page.getByRole("button", { name: "Add to bag" });
    await expect(addToBag).toBeEnabled();
    await addToBag.click();

    const bag = page.getByTestId("bag-drawer");
    await expect(bag).toBeVisible();
    await expect(bag.getByText("Racer back mini dress").first()).toBeVisible();

    await bag.getByRole("button", { name: "Proceed to checkout" }).click();
    await expect(page.getByRole("status")).toContainText(/demonstration store/i);
  });

  test("size guide opens, closes with Escape and unlocks scroll", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /size recommendation/i }).click();
    await expect(page.getByRole("dialog", { name: "Size guide" })).toBeVisible();
    await expect(page.getByText("Measurements are body measurements")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Size guide" })).toHaveCount(0);
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe("");
  });

  test("accordions expand and collapse", async ({ page }) => {
    await page.goto("/");
    const details = page.locator("details").filter({ hasText: "Satin-matte finish" });
    await page.getByText("Details", { exact: true }).click();
    await expect(details).toHaveAttribute("open", "");
    await page.getByText("Details", { exact: true }).click();
    await expect(details).not.toHaveAttribute("open", "");
  });

  test("search opens from the header and resolves a result", async ({ page }, testInfo) => {
    await page.goto("/");
    if (testInfo.project.name === "mobile") {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.getByRole("button", { name: "Search", exact: true }).click();
    } else {
      await page.getByRole("button", { name: "Search", exact: true }).click();
    }

    const overlay = page.getByTestId("search-overlay");
    await expect(overlay).toBeVisible();
    await overlay.getByPlaceholder("Search the collection").fill("racer");
    await overlay.getByRole("button", { name: /Racer back mini dress/i }).click();
    await expect(overlay).toHaveCount(0);
  });

  test("wishlist toggles its count", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop-only control");
    await page.goto("/");
    const wishlist = page.getByRole("button", { name: /^Wishlist/i });
    await wishlist.click();
    await expect(wishlist).toContainText("(1)");
    await wishlist.click();
    await expect(wishlist).not.toContainText("(1)");
  });

  test("desktop category and help panels open", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop-only controls");
    await page.goto("/");
    await page.getByRole("button", { name: "Woman" }).click();
    await expect(page.getByTestId("info-sheet")).toContainText("Shop woman");
    await page.getByTestId("info-sheet").getByRole("button", { name: "Close panel" }).click();

    await page.getByRole("button", { name: "Help", exact: true }).first().click();
    await expect(page.getByTestId("info-sheet")).toContainText("client advisors");
    await page.getByTestId("info-sheet").getByRole("button", { name: "Close panel" }).click();
    await expect(page.getByTestId("info-sheet")).toHaveCount(0);
  });

  test("footer policy panel and newsletter work", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Privacy", exact: true }).click();
    await expect(page.getByTestId("info-sheet")).toContainText("Try-on images stay in your browser");
    await page.getByTestId("info-sheet").getByRole("button", { name: "Close panel" }).click();

    await page.getByLabel("Your e-mail").fill("test@example.com");
    await page.getByRole("button", { name: "Subscribe" }).click();
    await expect(page.getByText("Thank you — you are on the list.")).toBeVisible();
  });

  test("mobile recommendations show exactly two cards and scroll", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile scroller");
    await page.goto("/");
    const track = page.getByTestId("recommendations-track");
    const metrics = await track.evaluate((element) => {
      const cards = Array.from(element.children).map((child) => (child as HTMLElement).offsetWidth);
      return { count: cards.length, cards, clientWidth: element.clientWidth, scrollWidth: element.scrollWidth };
    });
    expect(metrics.count).toBe(4);
    expect(metrics.cards[0]).toBe(195);
    expect(metrics.cards[1]).toBe(195);
    expect(metrics.clientWidth / metrics.cards[0]).toBe(2);
    expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);

    await track.evaluate((element) => {
      element.scrollLeft = element.clientWidth;
    });
    await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  });

  test("mobile menu opens and closes from a link", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile menu");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "Dresses" }).click();
    await expect(menu).toHaveCount(0);
    await expect(page.locator("#product")).toBeVisible();
  });

  test("uploading one image replaces the hero and resets", async ({ page }) => {
    await page.goto("/");
    await openStudio(page);
    await addImages(page, 1);
    await expect(page.getByText("Your image · enlarged")).toBeVisible();
    await applyImages(page, 1);

    await expect(page.locator('img[alt*="Your uploaded"]:visible').first()).toBeVisible();

    await openStudio(page);
    await page.getByRole("button", { name: "Reset to product photos" }).click();
    await expect(page.getByTestId("studio-dialog")).toHaveCount(0);
    await expect(page.locator('img[alt*="Your uploaded"]:visible')).toHaveCount(0);
  });

  test("bulk uploads five images, promotes one to hero and applies", async ({ page }) => {
    await page.goto("/");
    await openStudio(page);
    await addImages(page, 5);

    await expect(page.locator('[data-testid="studio-dialog"] li')).toHaveCount(5);
    await page.getByRole("button", { name: "Make image 3 the hero" }).click();
    await expect(page.locator('[data-testid="studio-dialog"] li').first()).toContainText("Hero · enlarged");

    await page.getByRole("button", { name: "Move image 2 down" }).click();
    await expect(page.locator('[data-testid="studio-dialog"] li')).toHaveCount(5);

    await applyImages(page, 5);
    await expect(page.locator('img[alt*="Your uploaded"]:visible').first()).toBeVisible();

    if ((await page.viewportSize())?.width === 390) {
      await expect(page.getByTestId("pdp-gallery").locator("figure:visible")).toHaveCount(5);
    }
  });

  test("studio scrolls on desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop dialog scroll");
    await page.goto("/");
    await openStudio(page);
    await addImages(page, 5);

    const dialog = page.getByTestId("studio-dialog");
    expect(
      await dialog.evaluate((element) => element.scrollHeight > element.clientHeight),
    ).toBe(true);

    await dialog.evaluate((element) => {
      element.scrollTop = 400;
    });
    await expect.poll(() => dialog.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  });

  test("mobile studio scrolls, applies, then the page scrolls again", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile dialog scroll");
    await page.goto("/");
    await openStudio(page);
    await addImages(page, 5);

    const dialog = page.getByTestId("studio-dialog");
    expect(
      await dialog.evaluate((element) => element.scrollHeight > element.clientHeight),
    ).toBe(true);
    await dialog.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    await expect.poll(() => dialog.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);

    await applyImages(page, 5);
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 900);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
  });

  test("accepts more than five images and grows the two-up grid", async ({ page }, testInfo) => {
    await page.goto("/");
    await openStudio(page);
    await addImages(page, 6);
    await expect(page.locator('[data-testid="studio-dialog"] li')).toHaveCount(6);

    await applyImages(page, 6);
    await expect(page.locator('img[alt*="Your uploaded"]:visible')).toHaveCount(6);

    if (testInfo.project.name === "desktop") {
      await expect(page.getByTestId("pdp-gallery").locator("figure:visible")).toHaveCount(5);
    }
  });

  test("uploaded images are contained, not cropped", async ({ page }, testInfo) => {
    await page.goto("/");
    await openStudio(page);
    await addImages(page, 3);
    await applyImages(page, 3);

    const images = page.locator('img[alt*="Your uploaded"]:visible');
    const fits = await images.evaluateAll((nodes) =>
      nodes.map((node) => getComputedStyle(node).objectFit),
    );
    expect(fits.length).toBeGreaterThan(0);
    for (const fit of fits) expect(fit).toBe("contain");

    if (testInfo.project.name === "desktop") {
      expect(fits.length).toBe(3);
    }
  });

  test("every visible button is named and no link is a dead '#'", async ({ page }) => {
    await page.goto("/");
    const unnamed = await page.locator("button").evaluateAll((buttons) =>
      buttons
        .filter((button) => (button as HTMLElement).offsetParent !== null)
        .filter((button) => !(button.textContent ?? "").trim() && !button.getAttribute("aria-label"))
        .length,
    );
    expect(unnamed).toBe(0);

    const dead = await page.locator('a[href="#"]').count();
    expect(dead).toBe(0);
  });
});
