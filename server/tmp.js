const Router = require("koa-router");
const router = new Router();

router.get("/notes", async (ctx) => {
  ctx.response.body = "hello";
});

module.exports = router;

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

// {
//    {
// id: 'f1f34420-35b1-462e-bc50-3659f03ed623',
// type: 'text',
// content: 'Тестовая заметка',
// location: '43.28325,40.26532',
// selected: false,
// date: '1666455994046'
// }
// },
// {
//   id: 2,
//   type: "Переустановить Windows",
//   content: "Кабинет 410",
//   location: [60.9898, 20.3333],
//   selected: false,
//   date: new Date(1663058437641),
// },
// {
//   id: 3,
//   type: "video",
//   content: "Установить обновление на сервере",
//   location: [29.7896, 110.99],
//   selected: false,
//   date: new Date(1663058437641),
// },
