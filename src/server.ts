import staticPlugin from "@elysiajs/static";
import { Elysia, t } from "elysia";
import { Pubsub } from "./lib/pubsub";
import { WhisperStream } from "./lib/whisper-stream";

const pubsub = new Pubsub();

const app = new Elysia()
  .use(staticPlugin({
    assets: "dist",
    prefix: "/dist",
  }))
  .ws("/stream", {
    open(ws) {
      pubsub.sub(ws.id, ws.send);
      ws.send(":connected");
    },
    close(ws) {
      pubsub.unsub(ws.id);
    },
    body: t.String(),
    response: t.String(),
  })
  .use(staticPlugin({
    assets: "public",
    prefix: "/",
  }))

app.listen(3000);

const whisper = new WhisperStream("ko");

(async () => {
  for await (const value of whisper.read()) {
    console.log(value);
    pubsub.pub(`:${value}`);
  }
})();

export type App = typeof app;