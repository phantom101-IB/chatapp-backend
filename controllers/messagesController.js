const Message = require("../models/messagesModels.js");
const User = require("../models/userModel.js");
const cloudinary = require("../middlewares/cloudinary.js");
const { getReceiverSocketId, io } = require("../middlewares/socket.js");

const getAllUsers = async (req, res) => {
  const loggedInUserId = req.user._id;
  // console.log(loggedInUserId);
  const filteredUsers = await User.find({
    _id: { $ne: loggedInUserId },
  }).select("-password");

  res.status(200).json(filteredUsers);
};

const getMessages = async (req, res) => {
  const { id: userToChatId } = req.params;
  const userId = req.user._id;

  const message = await Message.find({
    $or: [
      { senderId: userId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: userId },
    ],
  });

  res.status(200).json(message);
};

const sendMessage = async (req, res) => {
  const { id: userToChatId } = req.params;
  const userId = req.user._id;
  const { text } = req.body;
  const imageUrl = req.file?.filename;

  // let imageUrl;

  // if (image) {
  //   const imageResponse = await cloudinary.uploader.upload(image);
  //   imageUrl = imageResponse.secure_url;
  // }

  const newMessage = new Message({
    senderId: userId,
    receiverId: userToChatId,
    text: text,
    picture: imageUrl,
  });

  await newMessage.save();
  //   socket.io goes here
  const receiverSocketId = getReceiverSocketId(userToChatId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.status(200).json(newMessage);
};

module.exports = {
  getAllUsers,
  getMessages,
  sendMessage,
};
