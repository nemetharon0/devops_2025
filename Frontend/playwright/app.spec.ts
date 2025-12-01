import { test, expect } from "@playwright/test";

test("shows weather and outfit suggestion", async ({ page }) => {
  await page.route("**/api/weather**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        city: "Berlin",
        country: "Germany",
        tempCelsius: 15,
        condition: "partly cloudy",
        outfit: "light_jacket"
      })
    });
  });

  await page.goto("/");

  const input = page.getByPlaceholder(/enter city/i);
  await input.fill("Berlin");
  await page.getByRole("button", { name: /check/i }).click();

  await expect(page.getByText("Berlin")).toBeVisible();
  await expect(page.getByText(/Temperature:/)).toContainText("15");
  await expect(page.getByText(/Suggested outfit:/)).toContainText("light_jacket");
});
