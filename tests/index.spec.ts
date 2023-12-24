import { test, expect } from "@playwright/test";

test("Show user info", async ({ page }) => {
  // mock api/user
  await page.route("**/api/user", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "userId1",
        name: "John Doe",
        email: "john.doe@email.com",
      }),
    });
  });

  await page.goto("/");

  expect(page.getByText("John Doe"));
  expect(page.getByText("userId1"));
  expect(page.getByText("john.doe"));
});
