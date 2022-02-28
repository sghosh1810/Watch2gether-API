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
        res.status(200).send({ success: "true" });
    } catch (e) {
        return next(new Error(`Failed update playlist of room : ${req.body.roomId}`));
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
        res.status(200).send({ roomId, playList });
    } catch (e) {
        return next(new Error(`Failed to retrieve playlist of room : ${req.query.roomId}`));
    }
});
module.exports = router;
