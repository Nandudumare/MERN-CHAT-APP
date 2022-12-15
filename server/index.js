const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");
const chatRoutes = require("./routes/chat.routes");
const messageRoutes = require("./routes/message.routes");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
dotenv.config();
connectDB();

app.get("/", (req, res) => {
  return res.send("Hello world!");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log("listening on port 8080");
});

// server.prependListener("request", (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
// });

const io = require("socket.io")(
  server,
  {
    origins: ["hhttps://mern-chat-app-app.vercel.app"],

    handlePreflightRequest: (req, res) => {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "https://mern-chat-app-app.vercel.app",
        "Access-Control-Allow-Methods": "GET,POST",
        "Access-Control-Allow-Headers": "my-custom-header",
        "Access-Control-Allow-Credentials": true,
      });
      res.end();
    },
  }

  // {
  // pingTimeout: 60000,
  // cors: {
  //   //FRONTEND LINK
  //   origin: ["*", "https://mern-chat-app-app.vercel.app"],
  //   methods: ["GET", "POST"],
  //   credentials: true,
  //   allowEIO3: true,
  // },
  // transport: ["websocket"],
  // }
);

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  //something wrong with it

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat[0];
    // console.log('chat:', chat)

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
