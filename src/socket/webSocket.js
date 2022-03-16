const roomInfo = {};

const socketToRoomMap = {};
const webSocket = (io) => {
    io.on("connection", (socket) => {
        socket.on("createRoom", (username, roomId, videoUrl) => {
            if (roomInfo.hasOwnProperty(roomId)) {
                return socket.emit("error", "RoomId already exists");
            }
            if (typeof videoUrl !== "undefined" && videoUrl) {
                var playList = [videoUrl];
            } else {
                playList = [];
            }
            var roomInfoObject = {
                host: {
                    hostSocketId: socket.id,
                    hostUserName: username,
                },
                playList,
                peerList: [
                    // {
                    //     socketId: socket.id,
                    //     peerName: username,
                    // },
                ],
                timestamp: new Date(),
            };
            socketToRoomMap[socket.id] = roomId;
            roomInfo[roomId] = roomInfoObject;
            socket.join(roomId);
        });

        socket.on("joinRoom", (username, roomId) => {
            if (!roomInfo.hasOwnProperty(roomId)) {
                return socket.emit("error", "RoomId does not exist");
            }
            roomInfo[roomId].peerList.push({
                socketId: socket.id,
                peerName: username,
            });
            socketToRoomMap[socket.id] = roomId;
            var data = {
                peerList: roomInfo[roomId].peerList,
                playList: roomInfo[roomId].playList,
            };
            socket.join(roomId);
            socket.emit("joinRoom", { data });
            socket.to(roomId).emit("updatePeerList", roomInfo[roomId].peerList);
        });

        socket.on("roomAction", (roomId, action, param) => {
            switch (action) {
                case "addVideo":
                    roomInfo[roomId].playList.push(param);
                    var data = roomInfo[roomId].playList;
                    break;
                case "deleteVideo":
                    let updatedPlayList = roomInfo[roomId].playList.filter((videoUrl) => videoUrl !== param);
                    roomInfo[roomId].playList = updatedPlayList;
                    var data = updatedPlayList;
                    break;
                case "pause":
                case "play":
                    var data = {};
                    break;
            }
            io.to(roomId).emit("roomAction", { actionType: action, data });
        });
        socket.on("disconnect", () => {
            var roomId = socketToRoomMap[socket.id];
            if (roomInfo[roomId]) {
                var newPeerList = roomInfo[roomId].peerList.filter((item) => item.socketId !== socket.id);
                roomInfo[roomId].peerList = newPeerList;
                io.to(roomId).emit("updatePeerList", roomInfo[roomId].peerList);
            }
        });
    });
};
module.exports = webSocket;
