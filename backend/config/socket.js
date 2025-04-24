import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  const userSockets = new Map();
  const userActivities = new Map();

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    socket.on("user_connected", (userID) => {
      userSockets.set(userID, socket.id);
      userActivities.set(userID, "Idle");

      io.emit("user_connected", userID);
      socket.emit("user_online", Array.from(userSockets.keys()));
      io.emit("activities", Array.from(userActivities.entries()));
    });

    socket.on("update_activity", ({ userID, activity }) => {
      console.log("activity updated", userID, activity);
      userActivities.set(userID, activity);
      io.emit("activity_updated", { userID, activity });
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderID, receiverID, content } = data;

        const message = await Message.create({
          senderID,
          receiverID,
          content,
        });

        // send to receiver in realtime, if they're online
        const receiverSocketId = userSockets.get(receiverID);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", message);
        }

        socket.emit("message_sent", message);
      } catch (error) {
        console.error("Message error:", error);
        socket.emit("message_error", error.message);
      }
    });

    socket.on("disconnect", () => {
      let disconnectedUserID;
      for (const [userID, socketID] of userSockets.entries()) {
        // find disconnected user
        if (socketID === socket.id) {
          disconnectedUserID = userID;
          userSockets.delete(userID);
          userActivities.delete(userID);
          break;
        }
      }
      if (disconnectedUserID) {
        io.emit("user_disconnected", disconnectedUserID);
      }
    });
  });
};
