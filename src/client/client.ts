import { createChat } from "./chat";

const $text = document.querySelector<HTMLElement>("#text")!;
const $face = document.querySelector<HTMLElement>(".subtitle__face")!;
const chat = createChat($text, $face);
chat(".");

const worker = new SharedWorker(new URL("./ws-worker.js", import.meta.url));
worker.port.addEventListener("message", (event) => {
  const { type, message } = event.data;

  switch (type) {
    case "message": {
      console.log(message)
      const value = message.slice(1).replaceAll(/(?:(\S{2,})\s*(?=\s*\1)){3,}|\s*\.$/g, "");
      console.log(value);

      chat(value);
      return;
    }
    case "open": {
      return $face.classList.remove("subtitle__face--closed");
    }
    case "close": {
      return $face.classList.add("subtitle__face--closed");
    }
  }
});
worker.port.start();
