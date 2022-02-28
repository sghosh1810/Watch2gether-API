const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cron = require("node-cron");
const roomDeleteCron = require("./cron/roomDeleteCron");
require("./db/mongoose");
require("dotenv").config();
const chatRoomRouter = require("./routers/chatRoomRouter");

const app = express();
const server = http.createServer(app);

const port = process.env.port || 3000;

app.use(express.json());

app.use("/room", chatRoomRouter);

app.get("/", (req, res) => {
  res.send("chatROOM app is running");
});

app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint doesnt exist",
  });
});

const job = cron.schedule("* * * * Sunday", roomDeleteCron);
server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
