export default function listLinks(arr) {
  const divMessage = document.createElement("div");
  divMessage.classList.add("message");
  const divMessageContent = document.createElement("div");
  divMessageContent.classList.add("message-content");
  const formatedArr = arr
    .map((item) => `<a href=${item}>${item}</a>\n\n`)
    .join(" ");
  divMessageContent.innerHTML = formatedArr;
  divMessage.append(divMessageContent);
  return divMessage;
}
