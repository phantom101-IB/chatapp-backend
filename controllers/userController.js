const User = require("../models/userModel.js");
const cloudinary = require("../middlewares/cloudinary.js");

const signup = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = await user.createJWT(res);
  res.status(200).json({
    id: user._id,
    fullName: user.fullName,
    profilePic: user.profilePic,
    token: token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({ msg: "Email or Password not provided" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ msg: `user: ${email} not found` });
  }

  const correctPassword = await user.comparePassword(password);

  if (!correctPassword) {
    return res.status(404).json({ msg: "Incorrect Passwrd" });
  }

  const token = await user.createJWT(res);

  res.status(200).json({
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
    token: token,
  });
};

const logout = async (req, res) => {
  // console.log("visited");
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({ msg: "Logout Successful" });
};

const updateProfile = async (req, res) => {
  // const { profilePic } = req.body;
  const file = req.file.filename;
  const userId = req.user._id;

  // if (!profilePic) {
  //   return res.status(401).json({ msg: "Profile Picture is required" });
  // }
  // const uploadResponse = await cloudinary.uploader.upload(profilePic);
  // if (!uploadResponse) {
  //   return res.status(404).json({ msg: "Network Error" });
  // }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { profilePic: file },
    { new: true }
  );

  res.status(200).json({ updatedUser });
};

const checkAuth = (req, res) => {
  res.status(200).json(req.user);
};

module.exports = { signup, login, logout, updateProfile, checkAuth };
