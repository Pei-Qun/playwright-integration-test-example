import { http, delay, HttpResponse } from "msw";
import { defaultUser } from "./mockData";

export const handlers = [
  http.get("/api/user", async () => {
    await delay(500);
    return HttpResponse.json(defaultUser, {
      status: 200,
    });
  }),
];
