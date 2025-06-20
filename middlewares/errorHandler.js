const errorHandler = async (err, req, res, next) => {
  console.log(err);
  if (err.code && err.code === 11000) {
    return res.status(401).json({ msg: `${err.keyValue.email} already exist` });
  }
  if (err.name === "ValidationError") {
    return res.status(401).json({ msg: "Password must be at least 6 Chars" });
  }
};

module.exports = errorHandler;
