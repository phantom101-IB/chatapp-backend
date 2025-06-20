require("dotenv").config();
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const path = require("path");

console.log(process.env.MONGO_URL);
const storage = new GridFsStorage({
  url: process.env.MONGO_URL,
  file: (req, file) => {
    return {
      filename: "file_" + Date.now() + path.extname(file.originalname),
      // bucketName: "upload",
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
