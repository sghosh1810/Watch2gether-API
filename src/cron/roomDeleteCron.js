const chatRoom = require("../models/chatRoomModel");

const roomDeleteCron = async () => {
    try {
        const rooms = await chatRoom.deleteMany({
            createdAt: {
                // $gt: ISODate("2020-01-21"),  new Date(new Date() - 7 * 60 * 60 * 24 * 1000)
                $lte: new Date(new Date() - 1 * 1 * 1000),
            },
        });
        console.log(rooms);
    } catch (e) {}
};
module.exports = roomDeleteCron;
