/* eslint-disable no-console */
/* eslint-disable no-case-declarations */
import getLocation from "./getLocation";
import getTypeFile from "./getTypeFile";
import formatText from "./formatTest";
import formatDate from "./formatDate";
import userMap from "./myMap";
import API from "./api";

export default async function renderNote({
  id,
  fileName,
  date,
  location,
  selected,
}) {
  const divPopupLocation = document.querySelector(".popup-location");
  async function onClickIconStar(item) {
    if (item.classList.contains("fa-star-o")) {
      item.classList.remove("fa-star-o");
      item.classList.add("fa-star");
      await API.selectedNote(id, true);
    } else {
      item.classList.remove("fa-star");
      item.classList.add("fa-star-o");
      await API.selectedNote(id, false);
    }
  }

  function onClickIconPin(item) {
    const currentMessage = item.closest(".message");
    currentMessage.classList.toggle("pinned");
  }

  function onClickIconEye(item) {
    getLocation()
      .then((res) => {
        userMap(res);
      })
      .catch(() => divPopupLocation.classList.remove("hidden"));
  }

  async function onClickDelete(item) {
    const currentNote = item.closest(".message");
    currentNote.remove();
    const tmp = await API.removeNote(id);
    console.log(tmp);
  }

  const divMessage = document.createElement("div");
  divMessage.classList.add("message");

  const divId = document.createElement("div");
  divId.classList.add("hidden", "id-note");
  divId.textContent = id;
  divMessage.append(divId);

  const headerMessage = document.createElement("div");
  headerMessage.classList.add("header-message");

  const iconStar = document.createElement("i");
  const classIconStar = selected
    ? iconStar.classList.add("fa", "fa-star", "star")
    : iconStar.classList.add("fa", "fa-star-o", "star");
  iconStar.classList.add(classIconStar);
  iconStar.addEventListener("click", () => onClickIconStar(iconStar));
  headerMessage.append(iconStar);

  const iconPin = document.createElement("i");
  iconPin.classList.add("fa", "fa-thumb-tack");
  iconPin.addEventListener("click", () => onClickIconPin(iconPin));
  headerMessage.append(iconPin);

  const iconDelete = document.createElement("i");
  iconDelete.classList.add("fa", "fa-times");
  iconDelete.addEventListener("click", () => onClickDelete(iconDelete));
  headerMessage.append(iconDelete);

  divMessage.append(headerMessage);
  const typeContent = getTypeFile(fileName);

  switch (typeContent) {
    case "text":
      const divMessageContent = document.createElement("div");
      divMessageContent.classList.add("message-content");
      const contentTextFile = await API.getContentText(fileName);
      const formattedContentTextFile = formatText(contentTextFile);
      divMessageContent.innerHTML = formattedContentTextFile;
      divMessage.append(divMessageContent);
      break;
    case "audio":
      const divAudio = document.createElement("audio");
      divAudio.classList.add("media");
      divAudio.controls = true;
      divAudio.src = "http://localhost:7070/" + fileName;
      divMessage.append(divAudio);
      break;
    case "video":
      const divVideo = document.createElement("video");
      divVideo.classList.add("media");
      divVideo.controls = true;
      divVideo.src = "http://localhost:7070/" + fileName;
      divMessage.append(divVideo);
      break;
    case "picture":
      const imgPicture = document.createElement("img");
      imgPicture.classList.add("media");
      imgPicture.src = "http://localhost:7070/" + fileName;
      imgPicture.alt = "картинка пользователя";
      divMessage.append(imgPicture);
      break;
    case "file":
      const iconFileUser = document.createElement("i");
      iconFileUser.classList.add("fa", "fa-file-o", "media");
      iconFileUser.style.fontSize = "3rem";
      divMessage.append(iconFileUser);
      break;
    default:
      break;
  }

  const divTitle = document.createElement("div");
  divTitle.textContent = fileName;
  divTitle.classList.add("message-title");
  divMessage.append(divTitle);

  const divFooterMessage = document.createElement("div");
  divFooterMessage.classList.add("footer-message");

  const divLocation = document.createElement("div");

  if (location) {
    const spanLocation = document.createElement("span");
    spanLocation.classList.add("location");
    spanLocation.textContent = `[${location}]`;
    divLocation.append(spanLocation);

    const iconEye = document.createElement("i");
    iconEye.classList.add("fa", "fa-eye");
    iconEye.addEventListener("click", () => onClickIconEye(iconEye));
    divLocation.append(iconEye);
  }
  divFooterMessage.append(divLocation);

  const spanDate = document.createElement("span");
  spanDate.classList.add("date");
  spanDate.textContent = formatDate(date);
  divFooterMessage.append(spanDate);
  divMessage.append(divFooterMessage);

  return divMessage;
}
