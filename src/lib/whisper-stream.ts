import { env, spawn } from "bun";

const overfittingWords = new Set(["감사합니다.", "네."]);

export class WhisperStream {
  #done = false;
  #process
  constructor(lang = "auto") {
    this.#process = spawn([env.WHISPER_STREAM!,
      "-m", env.WHISPER_MODEL!,
      "-l", lang,
      "--threads", "16",
      "--step", "0",
      "--length", "2000",
      "-vth", "0.7",
    ]);
  }
  async *read() {
    const reader = this.#process.stdout.getReader();
    const decoder = new TextDecoder();
    const reLastScript = /(?<=\n\[\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}\.\d{3}\]\s*)\S.*(?=\n\n### Transcription \d+ END)/g;
    const reBrackets = /\[[^\]]+\]|\([^)]+\)|《[^》]+》/gu;
    while (!this.#done) {
      const c = await reader.read();
      if (c.done) break;
      const value = decoder.decode(c.value);
      const m = value.match(reLastScript);
      const message = m?.[0].replaceAll(reBrackets, "").trim();
      if (message != null && message.length > 0 && !overfittingWords.has(message)) {
        console.log(value)
        yield message;
      } else {
        console.error(value);
      }
    }
    this.close();
  }
  close() {
    this.#done = true;
    process.kill(1);
  }
  [Symbol.dispose]() {
    this.close();
  }
}