const mongoose = require("mongoose");

const conn = mongoose.createConnection(process.env.MONGO_URL);

let gfs;

conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db);
});

const imageSouce = async (req, res) => {
  // console.log(req.params.filename);
  gfs.openDownloadStreamByName(req.params.filename).pipe(res);
};

module.exports = imageSouce;
