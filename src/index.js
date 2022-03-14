const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cron = require("node-cron");
const cors = require("cors");

const roomDeleteCron = require("./cron/roomDeleteCron");
const chatRoomRouter = require("./routers/chatRoomRouter");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

require("./db/mongoose");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
    },
});
require("./socket/webSocket")(io);

const port = process.env.port || 3000;

app.use(express.json());
app.disable("x-powered-by");
app.use(cors({ origin: process.env.CORS || "*" }));

app.use("/room", chatRoomRouter);

app.use(notFound);
app.use(errorHandler);

const job = cron.schedule("* * * * Sunday", roomDeleteCron);
server.listen(port, () => {
    console.log(`server is up on port ${port}`);
});
