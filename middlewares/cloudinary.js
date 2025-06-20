const { v2: cloudinary } = require("cloudinary");
const { config } = require("dotenv");

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEYS,
  api_secret: process.env.CLOUDINARY_SECRET,
});

module.exports = cloudinary;
