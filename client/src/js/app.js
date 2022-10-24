/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable no-useless-return */
/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
import API from "./api";
import getLocation from "./getLocation";
import formatDate from "./formatDate";
import formatLocation from "./formatLocation";
import validator from "./validator";
import getTypeFile from "./getTypeFile";
import formatText from "./formatTest";
import userMap from "./myMap";

const timeline = document.querySelector(".timeline");
const inputMessage = document.querySelector("#input-message");
const divInput = document.querySelector(".input-div");
const divMessageList = document.querySelector(".message-list");
const divPopupLocation = document.querySelector(".popup-location");
const divPopupPermission = document.querySelector(".popup-permission");
const divPopupHeader = document.querySelector(".popup-header");
const btnCancel = document.querySelectorAll(".cancel");
const btnConfirm = document.querySelector(".confirm");
const inputPopup = document.querySelector(".input-popup");
const spanError = document.querySelector(".span-error");
const iconMicrophone = document.querySelector(".fa-microphone");
const iconCamera = document.querySelector(".fa-camera");
const iconFile = document.querySelector(".fa-file");
const iconStars = document.querySelectorAll(".star");
const iconDots = document.querySelector(".fa-ellipsis-v");
const inputFile = document.querySelector(".inputFile");
const divMedia = document.querySelector(".media-div");
const record = document.querySelector(".fa-check");
const stop = document.querySelector(".fa-times");
const timer = document.querySelector(".timer");

let interval;
let typeMessage;
let currentContent;

const errors = {
  isRequired: "Поле должно быть заполнено",
  isComma: "Значения должны разделятся запятой",
  isNumber: "Значения должны быть числом",
};

function onClickIconStar(item) {
  if (item.classList.contains("fa-star-o")) {
    item.classList.remove("fa-star-o");
    item.classList.add("fa-star");
  } else {
    item.classList.remove("fa-star");
    item.classList.add("fa-star-o");
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
async function loadNote(fileName, date, content, location, type) {
  const formData = new FormData();
  formData.append("fileName", fileName);
  formData.append("date", date);
  formData.append("content", content);
  formData.append("location", location);
  formData.append("type", type);
  const tmp = await API.createNote(formData);
  console.log(tmp);
}
function renderMessage(fileName, date, content, location) {
  console.log(fileName, date, content, location);

  const divMessage = document.createElement("div");
  divMessage.classList.add("message");

  const headerMessage = document.createElement("div");
  headerMessage.classList.add("header-message");

  const iconStar = document.createElement("i");
  iconStar.classList.add("fa", "fa-star-o", "star");
  iconStar.addEventListener("click", () => onClickIconStar(iconStar));
  headerMessage.append(iconStar);

  const iconPin = document.createElement("i");
  iconPin.classList.add("fa", "fa-thumb-tack");
  iconPin.addEventListener("click", () => onClickIconPin(iconPin));
  headerMessage.append(iconPin);

  const iconDelete = document.createElement("i");
  iconDelete.classList.add("fa", "fa-times");
  headerMessage.append(iconDelete);

  divMessage.append(headerMessage);
  const typeContent = fileName === "text" ? fileName : getTypeFile(fileName);

  switch (typeContent) {
    case "text":
      const divMessageContent = document.createElement("div");
      divMessageContent.classList.add("message-content");
      const tmp = formatText(content);
      divMessageContent.innerHTML = tmp;
      divMessage.append(divMessageContent);
      break;
    case "audio":
      const divAudio = document.createElement("audio");
      divAudio.classList.add("media");
      divAudio.controls = true;
      // divAudio.src = title ? URL.createObjectURL(content) : content;
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

  const spanLocation = document.createElement("span");
  spanLocation.classList.add("location");
  spanLocation.textContent = `[${location}]`;
  divMessage.append(spanLocation);

  const iconEye = document.createElement("i");
  iconEye.classList.add("fa", "fa-eye");
  iconEye.addEventListener("click", () => onClickIconEye(iconEye));
  divMessage.append(iconEye);

  const spanDate = document.createElement("span");
  spanDate.classList.add("date");
  spanDate.textContent = formatDate(date);
  divMessage.append(spanDate);

  divMessageList.append(divMessage);
  window.scrollTo(0, document.body.scrollHeight);
  timeline.classList.remove("drag-active");
  inputPopup.value = "";
  inputMessage.value = "";
  typeMessage = null;
  currentContent = null;
  divMedia.classList.add("hidden");
  divInput.classList.remove("hidden");
}

inputMessage.addEventListener("keydown", async (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    typeMessage = "text";
    let location;
    try {
      location = await getLocation();
    } catch (error) {
      divPopupLocation.classList.remove("hidden");
    }
    renderMessage("text", Date.now(), inputMessage.value, location);
  }
});

btnCancel.forEach((item) => {
  const popup = item.closest(".popup");
  item.addEventListener("click", (e) => {
    inputPopup.value = "";
    spanError.textContent = "";
    popup.classList.add("hidden");
    divMedia.classList.add("hidden");
    divInput.classList.remove("hidden");
    typeMessage = null;
    currentContent = null;
  });
});

btnConfirm.addEventListener("click", (e) => {
  e.preventDefault();
  if (validator("isRequired", inputPopup.value)) {
    spanError.textContent = errors.isRequired;
    return;
  }
  if (validator("isComma", inputPopup.value)) {
    spanError.textContent = errors.isComma;
    return;
  }
  if (validator("isNumber", inputPopup.value)) {
    spanError.textContent = errors.isNumber;
    return;
  }
  const date = Date.now();
  const [latitude, longitude] = formatLocation(inputPopup.value);
  const location = `[${latitude},${longitude}]`;
  renderMessage(date, currentContent, location, typeMessage);
  divPopupLocation.classList.add("hidden");
});

iconMicrophone.addEventListener("click", () => {
  typeMessage = "audio";
  divMedia.classList.remove("hidden");
  divInput.classList.add("hidden");
});

iconCamera.addEventListener("click", () => {
  typeMessage = "video";
  divMedia.classList.remove("hidden");
  divInput.classList.add("hidden");
});

iconDots.addEventListener("click", (e) => {
  e.preventDefault();
  divPopupHeader.classList.toggle("hidden");
});

iconFile.addEventListener("click", (event) => {
  inputFile.dispatchEvent(new MouseEvent("click"));
});

inputFile.addEventListener("change", (e) => {
  const file = inputFile.files && inputFile.files[0];
  if (!file) {
    return;
  }
  loadFile(file);
});

record.addEventListener("click", async () => {
  let stream;
  let videoPlayer;
  switch (typeMessage) {
    case "audio":
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      } catch (error) {
        divPopupPermission.classList.remove("hidden");
      }
      break;

    case "video":
      try {
        videoPlayer = document.createElement("video");
        videoPlayer.classList.add("media");
        videoPlayer.setAttribute("muted", true);
        timeline.append(videoPlayer);

        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        videoPlayer.srcObject = stream;
        videoPlayer.addEventListener("canplay", () => {
          videoPlayer.play();
        });
      } catch (error) {
        divPopupPermission.classList.remove("hidden");
      }
      break;

    default:
      break;
  }

  try {
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.addEventListener("start", () => {
      timer.textContent = "00:00";
      let hour = 0;
      let minutes = 0;
      interval = setInterval(() => {
        const contentHour = hour > 9 ? `${hour}` : `0${hour}`;
        const contentMinutes = minutes > 9 ? `${minutes}` : `0${minutes}`;
        timer.textContent = `${contentHour}:${contentMinutes}`;
        minutes++;
        if (minutes === 60) hour++;
      }, 1000);
    });

    recorder.addEventListener("dataavailable", (event) => {
      chunks.push(event.data);
    });

    recorder.addEventListener("stop", async () => {
      let location;
      clearInterval(interval);
      const content = URL.createObjectURL(new Blob(chunks));
      try {
        location = await getLocation();
      } catch (error) {
        divPopupLocation.classList.remove("hidden");
      }
      renderMessage(null, Date.now(), content, location, typeMessage);
      if (videoPlayer) videoPlayer.remove();
    });

    recorder.start();

    stop.addEventListener("click", () => {
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
      timer.textContent = "";
    });
  } catch (error) {
    console.log(error);
  }
});

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  timeline.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
});

timeline.addEventListener("dragenter", () => {
  timeline.classList.add("drag-active");
});

timeline.addEventListener("dragleave", () => {
  timeline.classList.remove("drag-active");
});

timeline.addEventListener("drop", async (event) => {
  const file = event.dataTransfer.files[0];
  if (!file) {
    return;
  }
  loadFile(file);
});

async function loadFile(file) {
  let location;
  let content = null;
  const formData = new FormData();
  formData.append("file", file);
  const fileName = await API.copyFile(formData);
  try {
    location = await getLocation();
  } catch (error) {
    divPopupLocation.classList.remove("hidden");
  }
  if (getTypeFile(file.name) === "text") {
    content = await preViewText(file);
  }
  renderMessage(fileName, Date.now(), content, location);
}

function preViewText(file) {
  return new Promise((resolve, reject) => {
    let content;
    try {
      const reader = new FileReader();
      reader.addEventListener("load", async (evt) => {
        content = evt.target.result;
        resolve(content);
      });
      reader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });
}
