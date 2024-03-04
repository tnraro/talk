import stringWidth from "string-width";

const $text = document.querySelector<HTMLElement>("#text")!;
const $face = document.querySelector(".subtitle__face")!;

// @ts-expect-error use SpeechRecognition
const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;

let id: any;

const chat = (message: string) => {
  let runes = [...message];
  const delay = 50;
  const html = runes.map((x, i) => `<span style="animation-delay: ${i * delay}ms">${x.replaceAll(/\s+/g, "&nbsp;")}</span>`).join("")

  $text.innerHTML = html;
  $face.classList.add("subtitle__face--talking");
  $text.lastChild!.addEventListener("animationend", () => {
    $face.classList.remove("subtitle__face--talking");
  }, { once: true });
  $text.style.display = "flex";

  const width = stringWidth(message);

  $text.style.fontSize = `${Math.min(3, 3 / (width / 19.2))}rem`;
  console.log($text.style.fontSize);

  clearTimeout(id);
  id = setTimeout(() => {
    $text.style.display = "none";
  }, 3000);
}

const sr = new SpeechRecognition();
sr.continuous = true;
sr.addEventListener("result", (e: any) => {
  const results = e.results;
  const lastResult = results[results.length - 1][0];
  const transcript = lastResult.transcript;
  chat(transcript.trim());
});
const log = (e: any) => console.log(e);
sr.addEventListener("audiostart", () => {
  $face.classList.remove("subtitle__face--closed");
  chat("connected");
});
sr.addEventListener("audioend", log);
sr.addEventListener("end", () => {
  $face.classList.add("subtitle__face--closed");
});
sr.addEventListener("error", (e: any) => {
  chat(e.error);
});
sr.addEventListener("nomatch", log);
sr.addEventListener("soundstart", log);
sr.addEventListener("soundend", log);
sr.start();