var crypto = require("crypto");
const express = require("express");
const chatRoom = require("../models/chatRoomModel");

const router = new express.Router();

router.post("/create", async (req, res) => {
  var id = crypto.randomBytes(5).toString("hex");
  const roomId = id.slice(0, 3) + "-" + id.slice(3, 7) + "-" + id.slice(7);
  const videoUrls = [];
  if (req.body.hasOwnProperty("viedoUrl"))
    videoUrls.push({ videoUrl: req.body.viedoUrl });

  const chatroom = new chatRoom({
    hostUserId: req.body.hostUserId,
    roomId,
    playList: videoUrls,
  });
  try {
    await chatroom.save();
    res.status(201).send({ roomId: chatroom.roomId });
  } catch (e) {
    res.status(500).send(e);
  }
});
/**
 * verity whether a RoomId exist or not,
 */
router.get("/verify", async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const room = await chatRoom.findOne({
      roomId,
    });
    if (!room) {
      return res.status(403).send({ message: "Invalid RoomId" });
    }
    res.status(200).send({ message: "sucess" });
  } catch (e) {
    res.status(500).send({ message: "internal server error" });
  }
});

router.post("/updatePlaylist", async (req, res) => {
  try {
    const videoUrls = req.body.playList.map((url) => ({
      videoUrl: url,
    }));
    await chatRoom.findOneAndUpdate({ roomId: req.body.roomId }, { playList: videoUrls});
    res.status(200).send({ success: "true" });
  } catch (e) {
    res.status(500).send({ message: "internal server error" });
  }
});

router.get("/getPlaylist", async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const room = await chatRoom.findOne({
      roomId,
    });
    if (!room) {
      return res.status(404).send({ message: "Invalid RoomId" });
    }
    const videoUrls = room.playList.map(({ videoUrl, _id }) => videoUrl);
    res.status(200).send({ playList: videoUrls});
  } catch (e) {
    res.status(500).send();
  }
});
module.exports = router;
