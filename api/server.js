const express = require("express");
const { verifyUser } = require("./posts/post_middleware");
const userRouter = require("./auth/auth_router");
const postRouter = require("./posts/post_router");
const server = express();

server.use(express.json());

server.use("/api/users", userRouter);
server.use("/api/post", verifyUser, postRouter);

server.use((err, req, res) => {
  res.status(err.status || 500).json({
    message: err.message,
    customMessage: "Server.js tarafından handle edildi bu hata",
  });
});

module.exports = server;
