const http = require("http");
const Koa = require("koa");
const koaBody = require("koa-body");
const router = require("./routes");
const koaStatic = require("koa-static");
const path = require("path");

const app = new Koa();
const public = path.join(__dirname, "public");
app.use(koaStatic(public));
app.use(
  koaBody({
    urlencoded: true,
    multipart: true,
    json: true,
  })
);
app.use(async (ctx, next) => {
  const origin = ctx.request.get("Origin");
  if (!origin) {
    return await next();
  }

  const headers = { "Access-Control-Allow-Origin": "*" };

  if (ctx.request.method !== "OPTIONS") {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get("Access-Control-Request-Method")) {
    ctx.response.set({
      ...headers,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH",
    });

    if (ctx.request.get("Access-Control-Request-Headers")) {
      ctx.response.set(
        "Access-Control-Allow-Headers",
        ctx.request.get("Access-Control-Request-Headers")
      );
    }

    ctx.response.status = 204;
  }
});
app.use(router());

const server = http.createServer(app.callback());
const port = process.env.PORT || 7070;
server.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Server is listening to " + port);
});
