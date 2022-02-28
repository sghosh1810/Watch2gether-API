const chatRoom = require("../models/chatRoomModel");

const roomDeleteCron = async () => {
    try {
        const rooms = await chatRoom.deleteMany({
            createdAt: {
                $lte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000),
            },
        });
        console.log(rooms);
    } catch (e) {}
};
module.exports = roomDeleteCron;
