const Router = require("koa-router");
const fs = require("fs");
const path = require("path");
const public = require("../../server");
const uuid = require("uuid");
let notes = [];

const router = new Router();
router.get("/notes", (ctx) => {
  ctx.response.set("Access-Control-Allow-Origin", "*");
  ctx.response.body = notes;
});

router.post("/notes/addNote", (ctx) => {
  ctx.response.set("Access-Control-Allow-Origin", "*");
  const { type, content, location, selected, date } = ctx.request.body;
  const newNote = {
    id: uuid.v4(),
    type,
    content,
    location,
    selected: false,
    date,
  };

  notes.push(newNote);
  console.log(notes);
  ctx.response.body = newNote;
});

router.post("/notes/addFile", async (ctx) => {
  ctx.response.set("Access-Control-Allow-Origin", "*");
  const { file } = ctx.request.files;
  const res = await loadfile(file);
  ctx.response.body = res;
  ctx.response.status = 200;
});

function loadfile(file) {
  return new Promise((resolve) => {
    let fileName;
    const subfolder = uuid.v4().slice(0, 5);
    const uploadFolder = "./public/" + subfolder;
    fs.mkdirSync(uploadFolder);
    fs.copyFileSync(file.path, uploadFolder + "/" + file.name);
    fileName = subfolder + "/" + file.name;
    resolve(fileName);
  });
}

module.exports = router;
