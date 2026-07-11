import chats from "../models/chats.model.js";
import User from "./../models/user.model.js";

const chatSocketListener = (chatSocket) => {
  return (socket) => {
    console.log("connected!");

    socket.on('join_chat', async ({ chatId, senderId }) => {
      socket.chatId = chatId;
      try {
        const senderName = await User.findOne({ uid: senderId }).select("userName");
        if (!senderName) return chatSocket.to(socket.id).emit("error_message", { message: "User Not Exist!" });
        socket.join(chatId);
        chatSocket.to(socket.id).emit("set_sender_info", { name: senderName.userName, chatId });
        let chatMessages = await chats.findOne({ chatId }).select("chats");
        if (!chatMessages) chatMessages = await chats.create({ chatId, chats: [] });
        chatSocket.to(socket.id).emit("prev_chat", { chats: chatMessages.chats });
      } catch (error) {
        console.log(error);
        chatSocket.to(socket.id).emit("error_message", { message: "Error in joining the Room!" });
      }
    });

    socket.on("send_message", async ({ id, content, senderId, timestamp }) => {
      if (!socket.chatId) return;
      try {
        await chats.findOneAndUpdate({ chatId: socket.chatId }, {
          $push: {
            chats: {
              id,
              content,
              senderId,
              timestamp,
            }
          }
        });

      } catch (error) {
        console.log(error);
        chatSocket.to(socket.id).emit("error_message", { message: "Error in Sending the Message!" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected");
    });
  }
}

export default chatSocketListener;