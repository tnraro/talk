import { createChat } from "./chat";

const $text = document.querySelector<HTMLElement>("#text")!;
const $face = document.querySelector<HTMLElement>(".subtitle__face")!;

const chat = createChat($text, $face);

// @ts-expect-error use SpeechRecognition
const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;

if (SpeechRecognition == null) {
  chat("SpeechRecognition is null");
  throw new Error("53");
}
chat("loading...");

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