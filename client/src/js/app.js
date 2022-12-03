/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable no-useless-return */
/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
import API from "./api";
import getLocation from "./getLocation";
import renderNote from "./renderNote";
import getTypeFile from "./getTypeFile";
import listLinks from "./listLinks";

const timeline = document.querySelector(".timeline");
const inputMessage = document.querySelector("#input-message");
const divInput = document.querySelector(".input-div");
const divPopupLocation = document.querySelector(".popup-location");
const divPopupPermission = document.querySelector(".popup-permission");
const divPopupHeader = document.querySelector(".popup-header");
const btnCancel = document.querySelectorAll(".cancel");
const btnConfirm = document.querySelector(".confirm");
const iconMicrophone = document.querySelector(".fa-microphone");
const iconCamera = document.querySelector(".fa-camera");
const iconFile = document.querySelector(".fa-file");
const iconDots = document.querySelector(".fa-ellipsis-v");
const inputFile = document.querySelector(".inputFile");
const divMedia = document.querySelector(".media-div");
const record = document.querySelector(".fa-check");
const stop = document.querySelector(".fa-times");
const timer = document.querySelector(".timer");
const divMessageList = document.querySelector(".message-list");
const iconHome = document.querySelector(".fa-home");

let interval;
let typeNote;
let currentContent;
let indexPart;
let filter;
const partSize = 5;
let loading;

init();

iconHome.addEventListener("click", () => {
  init();
});

async function init() {
  divMessageList.innerHTML = "";
  indexPart = 0;
  filter = "all";
  loading = false;
  const notes = await API.getNotes(indexPart, filter);
  notes.map(async (note) => {
    const divMessage = await renderNote({ ...note });
    divMessageList.prepend(divMessage);
    divMessageList.scrollTop = divMessageList.scrollHeight;
  });
  loading = true;
}
divMessageList.addEventListener("scroll", async () => {
  if (loading) {
    console.log("!!!");
    if (divMessageList.scrollTop === 0) {
      console.log("???");
      const numberNotes = await API.getNumberNotes();
      if (numberNotes > partSize * (indexPart + 1)) {
        loading = false;
        indexPart++;
        console.log("загружено: ", indexPart, "часть");
        const currentScroll = divMessageList.scrollHeight;
        const notes = await API.getNotes(indexPart, filter);
        notes.map(async (note) => {
          const divMessage = await renderNote({ ...note });
          divMessageList.prepend(divMessage);
          divMessageList.scrollTop =
            divMessageList.scrollHeight - currentScroll;
        });
        loading = true;
      }
    }
  }
});

function resetInput() {
  timeline.classList.remove("drag-active");
  inputMessage.value = "";
  divMedia.classList.add("hidden");
  divInput.classList.remove("hidden");
  currentContent = undefined;
  typeNote = undefined;
}

inputMessage.addEventListener("keydown", async (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    try {
      const location = await getLocation();
      const date = Date.now();
      const { id, fileName, selected } = await API.createNote(
        "text",
        inputMessage.value,
        date,
        location
      );
      const divMessage = await renderNote({
        id,
        fileName,
        date,
        location,
        selected,
      });
      divMessageList.append(divMessage);
      resetInput();
    } catch (error) {
      currentContent = inputMessage.value;
      typeNote = "text";
      divPopupLocation.classList.remove("hidden");
    }
    divMessageList.scrollTop = divMessageList.scrollHeight;
  }
});

btnCancel.forEach((item) => {
  const popup = item.closest(".popup");
  item.addEventListener("click", (e) => {
    e.preventDefault();
    popup.classList.add("hidden");
    resetInput();
  });
});

btnConfirm.addEventListener("click", async (e) => {
  e.preventDefault();
  const date = Date.now();
  const { id, fileName, selected } = await API.createNote(
    typeNote,
    currentContent,
    date,
    undefined
  );
  const divMessage = await renderNote({
    id,
    fileName,
    date,
    selected,
  });
  divMessageList.append(divMessage);
  divPopupLocation.classList.add("hidden");
  resetInput();
  divMessageList.scrollTop = divMessageList.scrollHeight;
});

iconMicrophone.addEventListener("click", () => {
  typeNote = "audio";
  divMedia.classList.remove("hidden");
  divInput.classList.add("hidden");
});

iconCamera.addEventListener("click", () => {
  typeNote = "video";
  divMedia.classList.remove("hidden");
  divInput.classList.add("hidden");
});

record.addEventListener("click", async () => {
  let stream;
  let videoPlayer;
  let options = {};
  switch (typeNote) {
    case "audio":
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        options = { type: "audio/mp3" };
      } catch (error) {
        divPopupPermission.classList.remove("hidden");
      }
      break;

    case "video":
      try {
        videoPlayer = document.createElement("video");
        videoPlayer.classList.add("media");
        videoPlayer.muted = true;
        timeline.append(videoPlayer);

        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        options = { type: "video/mp4" };
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

    recorder.addEventListener("dataavailable", async (event) => {
      chunks.push(event.data);
    });

    recorder.addEventListener("stop", async () => {
      clearInterval(interval);
      currentContent = new Blob(chunks, options);
      try {
        const location = await getLocation();
        const date = Date.now();
        const { id, fileName, selected } = await API.createNote(
          typeNote,
          currentContent,
          date,
          location
        );
        const divMessage = await renderNote({
          id,
          fileName,
          date,
          selected,
        });
        divMessageList.append(divMessage);
      } catch (error) {
        divPopupLocation.classList.remove("hidden");
      }
      if (videoPlayer) videoPlayer.remove();
      resetInput();
      divMessageList.scrollTop = divMessageList.scrollHeight;
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
  const type = getTypeFile(file.name);
  try {
    const location = await getLocation();
    const date = Date.now();
    const { id, fileName, selected } = await API.createNote(
      type,
      file,
      date,
      location
    );
    const divMessage = await renderNote({
      id,
      fileName,
      date,
      selected,
    });
    divMessageList.append(divMessage);
    resetInput();
    divMessageList.scrollTop = divMessageList.scrollHeight;
  } catch (error) {
    typeNote = type;
    currentContent = file;
    divPopupLocation.classList.remove("hidden");
  }
}

iconDots.addEventListener("click", (e) => {
  e.preventDefault();
  divPopupHeader.classList.toggle("hidden");
});

divPopupHeader.addEventListener("click", async (e) => {
  e.preventDefault();
  const { target } = e;
  if (target.classList.contains("header-li")) {
    const property = target.className.split(" ")[1];
    divMessageList.innerHTML = "";
    if (property === "links") {
      indexPart = 1000;
      const links = await API.getLinks();
      const divListLinks = listLinks(links);
      divMessageList.append(divListLinks);
    } else {
      filter = property;
      indexPart = 0;
      loading = false;
      console.log("загружено: ", indexPart, "часть");
      const currentScroll = divMessageList.scrollHeight;
      const notes = await API.getNotes(indexPart, filter);
      notes.map(async (note) => {
        const divMessage = await renderNote({ ...note });
        divMessageList.prepend(divMessage);
        divMessageList.scrollTop = divMessageList.scrollHeight - currentScroll;
      });
      loading = true;
    }
    divPopupHeader.classList.add("hidden");
  }
});
