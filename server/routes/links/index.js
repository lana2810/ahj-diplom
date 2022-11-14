const Router = require("koa-router");
const fs = require("fs");

const router = new Router();

router.get("/links", (ctx) => {
  ctx.response.set("Access-Control-Allow-Origin", "*");
  const links = JSON.parse(fs.readFileSync("./public/links.json"));
  ctx.response.body = links;
  ctx.response.status = 200;
});

module.exports = router;
