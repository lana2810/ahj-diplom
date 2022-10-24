export default function getTypeFile(str) {
  const extention = str.split(".").pop();
  let result = "file";
  if (
    ["jpeg", "jpg", "tiff", "psd", "bmp", "png", "gif"].includes(
      extention.toLowerCase()
    )
  ) {
    result = "picture";
  }
  if (["mp3", "ogg", "wav"].includes(extention.toLowerCase())) {
    result = "audio";
  }
  if (
    ["asf", "avi", "mp4", "m4v", "mov", "mpg", "mpeg"].includes(
      extention.toLowerCase()
    )
  ) {
    result = "video";
  }
  if (["txt", "rtf", "odt"].includes(extention.toLowerCase())) {
    result = "text";
  }
  return result;
}
