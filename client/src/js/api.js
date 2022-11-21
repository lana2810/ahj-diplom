const URL = "http://localhost:7070";

export default class API {
  static getNotes(index, property) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${URL}/notes/?index=${index}&property=${property}`);
      xhr.responseType = "json";

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      });
      xhr.send();
    });
  }

  static getNumberNotes() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${URL}/notes/numberNotes`);
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      });
      xhr.send();
    });
  }

  static createNote(type, content, date, location) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${URL}/notes/createNote`);
      xhr.responseType = "json";
      const formData = new FormData();
      formData.append("type", type);
      formData.append("date", date);
      formData.append("location", location);

      switch (type) {
        case "audio":
          if (content.name) {
            formData.append("content", content, `${date}_${content.name}`);
          } else {
            formData.append("content", content, `audio_${date}.mp3`);
          }
          break;
        case "video":
          if (content.name) {
            formData.append("content", content, `${date}_${content.name}`);
          } else {
            formData.append("content", content, `video_${date}.mp4`);
          }
          break;
        case "picture":
          formData.append("content", content, `${date}_${content.name}`);
          break;
        default:
          formData.append("content", content);
          break;
      }
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      });
      xhr.send(formData);
    });
  }

  static getContentText(fileName) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${URL}/notes/getContent`);
      const formData = new FormData();
      formData.append("fileName", fileName);

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      });
      xhr.send(formData);
    });
  }

  static removeNote(id) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("DELETE", `${URL}/notes/?id=${id}`);
      xhr.responseType = "json";

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      });
      xhr.send();
    });
  }

  static selectedNote(id, selected) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PATCH", `${URL}/notes/?id=${id}&selected=${selected}`);
      xhr.responseType = "json";
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      });
      xhr.send();
    });
  }

  static getLinks() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${URL}/links`);
      xhr.responseType = "json";
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      });
      xhr.send();
    });
  }
}
