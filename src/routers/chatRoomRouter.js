var crypto = require("crypto");
const express = require("express");
const chatRoom = require("../models/chatRoomModel");

const router = new express.Router();

router.post("/create", async (req, res) => {
    var cryptoId = crypto.randomBytes(5).toString("hex");
    const roomId = cryptoId.slice(0, 3) + "-" + cryptoId.slice(3, 7) + "-" + cryptoId.slice(7);
    const videoUrls = [];
    if (req.body.hasOwnProperty("videoUrl")) videoUrls.push({ videoUrl: req.body.videoUrl });

    const chatroom = new chatRoom({
        hostUserId: req.body.hostUserId,
        roomId,
        playList: videoUrls,
    });
    try {
        await chatroom.save();
        res.status(201).send({ roomId: chatroom.roomId });
    } catch (e) {
        throw new Error(`Unable to create room with id: ${roomId}`);
    }
});
/**
 * verity whether a RoomId exist or not,
 */
router.get("/verify", async (req, res) => {
    try {
        const roomId = req.query.roomId;
        const room = await chatRoom.findOne({
            roomId,
        });
        if (!room) {
            return res.status(403).send({ message: "Invalid RoomId" });
        }
        res.status(200).send({ message: "sucess" });
    } catch (e) {
        throw new Error("Invalid RoomId");
    }
});

router.post("/updatePlaylist", async (req, res) => {
    try {
        const roomId = req.body.roomId;
        const room = await chatRoom.findOne({
            roomId,
        });
        if (!room) {
            return res.status(404).send({ message: "Invalid RoomId" });
        }
        const playList = req.body.playList.map((url) => ({
            videoUrl: url,
        }));
        await chatRoom.findOneAndUpdate({ roomId: req.body.roomId }, { playList });
        res.status(200).send({ success: "true" });
    } catch (e) {
        throw new Error(`Failed update playlist of room : ${req.body.roomId}`);
    }
});

router.get("/getPlaylist", async (req, res) => {
    try {
        const roomId = req.query.roomId;
        const room = await chatRoom.findOne({
            roomId,
        });
        if (!room) {
            return res.status(404).send({ message: "Invalid RoomId" });
        }
        const playList = room.playList.map(({ videoUrl, _id }) => videoUrl);
        res.status(200).send({ playList });
    } catch (e) {
        throw new Error(`Failed to retrieve playlist of room : ${req.query.roomId}`);
    }
});
module.exports = router;
