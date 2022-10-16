/* eslint-disable no-useless-escape */
export default function formatText(text) {
  const regexp =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return text.replace(regexp, "<a href='$1'>$1</a>");
}
