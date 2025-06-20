const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      maxlength: 50,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      maxlength: 50,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "password is required"],
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.createJWT = function (res) {
  const token = jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFE }
  );
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_DEV !== "development",
  });
  return token;
};

UserSchema.methods.comparePassword = async function (providedPassword) {
  const isMatched = await bcrypt.compare(providedPassword, this.password);
  return isMatched;
};
module.exports = mongoose.model("User", UserSchema);
