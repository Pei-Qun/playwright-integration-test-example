import { test, expect } from "./config";
import { http, delay, HttpResponse } from "msw";
import { defaultUser } from "../mock/mockData";

test("Show default user info", async ({ page }) => {
  await page.goto("/");

  expect(page.getByText(defaultUser.id));
  expect(page.getByText(defaultUser.name));
  expect(page.getByText(defaultUser.email));
});

test("searched user info", async ({ page, worker }) => {
  const targetUser = {
    id: "userId2",
    name: "Same Smith",
    email: "same.smith@mail.com",
  };

  worker.use(
    http.get("/api/user/:id", async ({ params }) => {
      expect(params.id).toEqual(targetUser.id);
      await delay(500);
      return HttpResponse.json(targetUser, {
        status: 200,
      });
    })
  );

  await page.goto("/");

  await page.getByLabel("User Id Search").fill(targetUser.id);
  await page.getByRole("button", { name: "Search" }).click();

  expect(page.getByText(targetUser.id));
  expect(page.getByText(targetUser.name));
  expect(page.getByText(targetUser.email));
});
