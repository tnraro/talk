import { edenTreaty } from "@elysiajs/eden"
import type { App } from "./server"
import stringWidth from "string-width";

// @ts-expect-error DOM
const $text = document.querySelector("#text")
// @ts-expect-error DOM
const $subtitle = document.querySelector("#subtitle")
// @ts-expect-error DOM
const $face = document.querySelector(".subtitle__face");

// @ts-expect-error DOM
const app = edenTreaty<App>(location.origin);

const stream = app.stream.subscribe();

let id: any;

const chat = (message: string) => {
  let runes = [...message];
  const delay = 50;
  const html = runes.map((x, i) => `<span style="animation-delay: ${i * delay}ms">${x.replaceAll(/\s+/g, "&nbsp;")}</span>`).join("")

  $text.innerHTML = html;
  $face.classList.add("subtitle__face--talking");
  $text.lastChild.addEventListener("animationend", () => {
    $face.classList.remove("subtitle__face--talking");
  }, { once: true});
  $text.style.display = "flex";

  const width = stringWidth(message);

  $text.style.fontSize = `${Math.min(3, 3 / (width / 19.2))}rem`;
  console.log($text.style.fontSize);

  clearTimeout(id);
  id = setTimeout(() => {
    $text.style.display = "none";
  }, 3000);
}

stream.subscribe((message) => {
  console.log(message)
  const value = message.data.slice(1).replaceAll(/(?:(\S{2,})\s*(?=\s*\1)){3,}|\s*\.$/g, "");
  console.log(value);

  chat(value);
});

stream.on("open", (e) => {
  $face.classList.remove("subtitle__face--closed");
})
stream.on("close", (e) => {
  $face.classList.add("subtitle__face--closed");
})