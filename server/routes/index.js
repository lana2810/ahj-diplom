const combineRouters = require("koa-combine-routers");
const notes = require("./notes/index");

const router = combineRouters(notes);

module.exports = router;
