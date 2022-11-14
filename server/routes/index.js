const combineRouters = require("koa-combine-routers");
const notes = require("./notes/index");
const links = require("./links/index");

const router = combineRouters(notes, links);

module.exports = router;
