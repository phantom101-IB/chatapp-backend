require("dotenv").config();
const express = require("express");
const cookies = require("cookie-parser");
const connectDB = require("./db/db");
const { app, server } = require("./middlewares/socket.js");
const userRoute = require("./routes/userRoutes.js");
const messageRoute = require("./routes/messagesRoute.js");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler.js");
const imgDownload = require("./middlewares/imgDownload");
// external middleware

app.use(express.json());
app.use(cookies());
app.use(
  cors({
    // origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/messages", messageRoute);
app.use("/api/v1/profile/:filename", imgDownload);

app.use(errorHandler);

const PORT = 3000 || process.env.PORT;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    server.listen(PORT, () => {
      console.log(`Port ${PORT} is live`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
