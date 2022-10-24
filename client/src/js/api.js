const URL = "http://localhost:7070";
export default class API {
  static getAllNotes() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${URL}/notes`);
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

  static getNotesById(id) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${URL}/notes/?id=${id}`);
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

  static createNote(body) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${URL}/notes/addNote`);
      xhr.responseType = "json";

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      });
      xhr.send(body);
    });
  }

  static copyFile(body) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${URL}/notes/addFile`);

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      });
      xhr.send(body);
    });
  }

  static removeNote(id) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("DELETE", `${URL}/?id=${id}`);
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
