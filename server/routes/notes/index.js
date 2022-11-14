const Router = require("koa-router");
const fs = require("fs");
const uuid = require("uuid");
const partition = require("../../partition");
const findLinks = require("../../findLinks");

const router = new Router();

function getData() {
  const data = fs.readFileSync("./public/notes.json");
  const sortData = JSON.parse(data).sort((a, b) => (a.date > b.date ? -1 : 1));
  return sortData;
}
function pushData(data) {
  fs.writeFileSync("./public/notes.json", JSON.stringify(data));
}
function readFileContent(fileName) {
  return new Promise((resolve) => {
    fs.readFile(`./public/${fileName}`, "utf8", function (error, data) {
      if (error) throw error;
      resolve(data);
    });
  });
}
function addLinks(text) {
  const links = findLinks(text);
  if (links) {
    const data = JSON.parse(fs.readFileSync("./public/links.json"));
    const addNewLinks = [...data, ...links];
    fs.writeFileSync("./public/links.json", JSON.stringify(addNewLinks));
  }
}

router.get("/notes", (ctx) => {
  ctx.response.set("Access-Control-Allow-Origin", "*");
  const { index, property } = ctx.request.query;
  const notes = getData();
  switch (property) {
    case "all":
      ctx.response.body = partition(notes, index);
      ctx.response.status = 200;
      break;
    case "selected":
      const result = getData().filter((note) => note.selected);
      ctx.response.body = partition(result, index);
      ctx.response.status = 200;
      break;
    default:
      const tmp = notes.filter((item) => item.type === property);
      ctx.response.body = partition(tmp, index);
      ctx.response.status = 200;

      break;
  }
});

router.get("/notes/lastIndex", (ctx) => {
  ctx.response.set("Access-Control-Allow-Origin", "*");
  const notes = getData();
  ctx.response.body = notes.length;
  ctx.response.status = 200;
});

router.post("/notes/createNote", async (ctx) => {
  ctx.response.set("Access-Control-Allow-Origin", "*");
  let fileName = "";
  const { type, date, location } = ctx.request.body;
  const { content } = ctx.request.files;
  switch (type) {
    case "text":
      if (content) {
        fileName = `${date}_${content.name}`;
        fs.copyFileSync(content.path, `./public/${fileName}`);
        const contentFile = await readFileContent(fileName);
        addLinks(contentFile);
      } else {
        fileName = `${date}.txt`;
        fs.writeFileSync(`./public/${fileName}`, ctx.request.body.content);
        addLinks(ctx.request.body.content);
      }
      break;
    case "audio":
    case "file":
    case "video":
    case "picture":
      fileName = content.name;
      fs.copyFileSync(content.path, `./public/${fileName}`);
      break;
    default:
      break;
  }
  const newNote = {
    id: uuid.v4(),
    fileName,
    type,
    date,
    location,
    selected: false,
  };
  const notes = getData();
  notes.push(newNote);
  pushData(notes);
  ctx.response.body = newNote;
  ctx.response.status = 200;
});

router.post("/notes/getContent", async (ctx) => {
  ctx.response.set("Access-Control-Allow-Origin", "*");
  const { fileName } = ctx.request.body;
  let res = await readFileContent(fileName);
  ctx.response.body = res;
  ctx.response.status = 200;
});

router.delete("/notes", (ctx) => {
  ctx.response.set("Access-Control-Allow-Origin", "*");
  const { id } = ctx.request.query;
  const notes = getData();
  tmp = notes.filter((item) => item.id.toString() !== id.toString());
  pushData(tmp);
  const fileNameDeleted = notes.find(
    (item) => item.id.toString() === id.toString()
  ).fileName;
  fs.unlinkSync(`./public/${fileNameDeleted}`);

  ctx.response.body = tmp;
  ctx.response.status = 200;
});

router.patch("/notes", (ctx) => {
  ctx.response.set("Access-Control-Allow-Origin", "*");
  const { id, selected } = ctx.request.query;
  let selectedFormated;
  if (selected === "true") selectedFormated = true;
  if (selected === "false") selectedFormated = false;
  const notes = getData();
  const editedNoteIndex = notes.findIndex(
    (item) => item.id.toString() === id.toString()
  );
  notes[editedNoteIndex] = {
    ...notes[editedNoteIndex],
    selected: selectedFormated,
  };
  pushData(notes);
  ctx.response.body = notes;
  ctx.response.status = 200;
});

module.exports = router;
