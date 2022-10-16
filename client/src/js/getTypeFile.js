export default function getTypeFile(str) {
  const extention = str.split(".").pop();
  let result;
  if (
    ["jpeg", "jpg", "tiff", "psd", "bmp", "png", "gif"].includes(
      extention.toLowerCase()
    )
  ) {
    result = "picture";
  }
  if (
    ["asf", "avi", "mp4", "m4v", "mov", "mpg", "mpeg"].includes(
      extention.toLowerCase()
    )
  ) {
    result = "video";
  }
  if (["txt", "doc", "rtf"].includes(extention.toLowerCase())) {
    result = "text";
  }
  if (!result) result = "other";
  return result;
}
