const http = require("http");
const Koa = require("koa");
const koaBody = require("koa-body");
const uuid = require("uuid");

let tickets = [
  {
    id: 1,
    name: "Поменять краску в принтере",
    description: "Принтер HP LJ 1210,картриджи на складе",
    status: true,
    created: new Date(1663058437641),
  },
  {
    id: 2,
    name: "Переустановить Windows",
    description: "Кабинет 410",
    status: false,
    created: new Date(1663058437641),
  },
  {
    id: 3,
    name: "Установить обновление КВ-ХХХ",
    description: "Установить обновление на сервере",
    status: true,
    created: new Date(1663058437641),
  },
];

const app = new Koa();

app.use(
  koaBody({
    urlencoded: true,
    multipart: true,
    json: true,
  })
);

app.use((ctx, next) => {
  if (ctx.request.method !== "OPTIONS") {
    next();
    return;
  }
  ctx.response.set("Access-Control-Allow-Origin", "*");
  ctx.response.set(
    "Access-Control-Allow-Methods",
    "DELETE, PUT, PATCH, GET, POST"
  );
  ctx.response.status = 204;
  next();
});

app.use((ctx, next) => {
  if ((ctx.request.method !== "GET") & (ctx.request.method !== "POST")) {
    next();
    return;
  }
  ctx.response.set("Access-Control-Allow-Origin", "*");
  const { method, id } = ctx.request.query;
  const { name, description, status } = ctx.request.body;
  switch (method) {
    case "allTickets":
      const rez = tickets.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        status: item.status,
        created: item.created,
      }));
      ctx.response.body = rez;
      next();
      return;
    case "ticketById":
      const ticket = tickets.find(
        (item) => item.id.toString() === id.toString()
      );
      ctx.response.body = ticket;
      next();
      return;
    case "createTicket":
      const newTicket = {
        id: uuid.v4(),
        name,
        description,
        status: false,
        created: Date.now(),
      };
      tickets.push(newTicket);
      ctx.response.body = newTicket;
      next();
      return;
    default:
      ctx.response.status = 404;
      next();
      return;
  }
});

app.use((ctx, next) => {
  if (ctx.request.method !== "DELETE") {
    next();
    return;
  }
  const { id } = ctx.request.query;
  tickets = tickets.filter((item) => item.id.toString() !== id.toString());
  ctx.response.set("Access-Control-Allow-Origin", "*");
  ctx.response.body = tickets;
  next();
});

app.use((ctx, next) => {
  if (ctx.request.method !== "PATCH") {
    next();
    return;
  }
  ctx.response.set("Access-Control-Allow-Origin", "*");
  const { id } = ctx.request.query;
  const { name, description, status } = ctx.request.body;
  const editedTicket = tickets.find(
    (item) => item.id.toString() === id.toString()
  );
  if (!editedTicket) ctx.response.body = null;
  if (name) editedTicket.name = name;
  if (description) editedTicket.description = description;
  if (status) {
    editedTicket.status = status === "false" ? false : true;
  }
  tickets = tickets.map((item) =>
    item.id.toString() === id.toString() ? editedTicket : item
  );
  ctx.response.body = editedTicket;
  next();
});

const server = http.createServer(app.callback());
const port = process.env.PORT || 7070;
server.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Server is listening to " + port);
});
