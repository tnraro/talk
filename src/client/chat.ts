import stringWidth from "string-width";

let id: any;

export const createChat = ($text: HTMLElement, $face: HTMLElement) => (message: string) => {
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