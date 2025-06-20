const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const route = express.Router();
const {
  getAllUsers,
  getMessages,
  sendMessage,
} = require("../controllers/messagesController.js");

const upload = require("../middlewares/storage.js");

route.get("/users", authMiddleware, getAllUsers);
route.get("/:id", authMiddleware, getMessages);
route.post("/send/:id", authMiddleware, upload.single("image"), sendMessage);

module.exports = route;
