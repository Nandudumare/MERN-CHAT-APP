const { Router } = require("express");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const messageRoutes = Router();

messageRoutes.route("/").post(protect, sendMessage);

messageRoutes.route("/:chatId").get(protect, allMessages);

module.exports = messageRoutes;
