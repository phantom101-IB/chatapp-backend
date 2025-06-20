const express = require("express");
const {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/storage");

const route = express.Router();

route.post("/signup", signup);
route.post("/login", login);
route.post("/logout", logout);

route.put(
  "/update-profile",
  authMiddleware,
  upload.single("image"),
  updateProfile
);
route.get("/check", authMiddleware, checkAuth);

module.exports = route;
