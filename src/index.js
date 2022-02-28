const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cron = require("node-cron");
const roomDeleteCron = require("./cron/roomDeleteCron");
require("./db/mongoose");
const chatRoomRouter = require("./routers/chatRoomRouter");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();
const server = http.createServer(app);

const port = process.env.port || 3000;

app.use(express.json());

app.use("/room", chatRoomRouter);

app.use(notFound);
app.use(errorHandler);

const job = cron.schedule("* * * * Sunday", roomDeleteCron);
server.listen(port, () => {
    console.log(`server is up on port ${port}`);
});
