const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("Phantom");
    console.log(token);
    if (!token) {
      return res.status(401).json({ msg: "Login fisrt" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload) {
      return res.status(401).json({ msg: "Session Expired" });
    }
    const userId = payload.userId;
    const user = await User.findById({ _id: userId }).select("-password");

    if (!user || user.length === 0) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = authMiddleware;
