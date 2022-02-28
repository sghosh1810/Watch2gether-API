const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    hostUserId: {
      type: String,
      required: true,
      trim: true,
    },
    roomId: {
      type: String,
      unique: true,
      required: true,
    },
    playList: [
      {
        videoUrl: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const chatRoom = mongoose.model("chatroom", chatRoomSchema);
module.exports = chatRoom;
