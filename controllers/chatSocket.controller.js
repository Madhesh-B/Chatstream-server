import User from "./../models/user.model.js";

const chatSocketListener = (chatSocket) => {
  return (socket) => {
    console.log("connected!");

    socket.on("disconnect", () => {
      console.log("User Disconnected");
    })
  }
}

export default chatSocketListener;