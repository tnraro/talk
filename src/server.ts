import staticPlugin from "@elysiajs/static";
import { Elysia } from "elysia";

const app = new Elysia()
  .use(staticPlugin({
    assets: "dist",
    prefix: "/dist",
  }))
  .use(staticPlugin({
    assets: "public",
    prefix: "/",
  }))

app.listen(3000);

export type App = typeof app;