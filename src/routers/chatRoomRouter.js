var crypto = require("crypto");
const express = require("express");
const chatRoom = require("../models/chatRoomModel");

const router = new express.Router();

router.post("/create", async (req, res, next) => {
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
        return next(new Error(`Unable to create room with id: ${roomId}`));
    }
});
router.get("/verifyRoomInfo", async (req, res, next) => {
    try {
        const roomId = req.body.roomId;
        const room = await chatRoom.findOne({
            roomId,
        });
        if (!room) {
            res.status(404);
            return next(new Error("Room ID not found in our records."));
        }
        res.send({ message: "Room ID found." });
    } catch (e) {
        res.status(500);
        return next(new Error("Server failed to parse room info."));
    }
});
router.post("/updateRoomInfo", async (req, res, next) => {
    try {
        const roomId = req.body.roomId;
        const room = await chatRoom.findOne({
            roomId,
        });
        if (!room) {
            res.status(404);
            return next(new Error("Room ID not found in our records."));
        }
        const playList = req.body.playList.map((url) => ({
            videoUrl: url,
        }));
        await chatRoom.findOneAndUpdate({ roomId: req.body.roomId }, { playList });
        res.status(204).send({ message: "Updated room info successfully." });
    } catch (e) {
        return next(new Error(`Failed to update playlist of room : ${req.body.roomId}`));
    }
});

router.get("/getRoomInfo", async (req, res, next) => {
    try {
        const roomId = req.query.roomId;
        const room = await chatRoom.findOne({
            roomId,
        });
        if (!room) {
            res.status(404);
            return next(new Error("Room ID not found in our records."));
        }
        const playList = room.playList.map(({ videoUrl, _id }) => videoUrl);
        res.send({ roomId, playList });
    } catch (e) {
        return next(new Error(`Failed to retrieve playlist of room : ${req.query.roomId}`));
    }
});
module.exports = router;
