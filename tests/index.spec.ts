import { test, expect } from "./config";
import { http, delay, HttpResponse } from "msw";
import { defaultUser } from "../mock/mockData";

test("Show default user info", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText(defaultUser.id)).toBeVisible();
  await expect(page.getByText(defaultUser.name)).toBeVisible();
  await expect(page.getByText(defaultUser.email)).toBeVisible();
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

  await expect(page.getByText(targetUser.id)).toBeVisible();
  await expect(page.getByText(targetUser.name)).toBeVisible();
  await expect(page.getByText(targetUser.email)).toBeVisible();
});

test("searched user info with error", async ({ page, worker }) => {
  worker.use(
    http.get("/api/user/:id", async () => {
      return HttpResponse.json(
        {},
        {
          status: 404,
        }
      );
    })
  );

  await page.goto("/");
  await page.getByLabel("User Id Search").fill("noUserId");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("User not found")).toBeVisible({
    timeout: 10000,
  });
});

test("create new user", async ({ page, worker }) => {
  let isVarRight = false;

  worker.use(
    http.post("/api/user", async ({ request }) => {
      const info = (await request.json()) as { name: string; email: string };
      expect(info.name).toEqual("New User");
      expect(info.email).toEqual("new.user@email.com");
      isVarRight = true;
      return HttpResponse.json(
        {},
        {
          status: 200,
        }
      );
    })
  );

  await page.goto("/");

  await page.getByRole("button", { name: "Create" }).click();
  expect(isVarRight).toBeTruthy();
});
