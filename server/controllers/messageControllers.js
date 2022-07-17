const asyncHandler = require("express-async-handler");
const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = new messageModel(newMessage);
    await message.save();

    // senderDesc = await messageModel.populate("sender", "name pic");
    // console.log('senderDesc:', senderDesc)
    let senderDesc = await messageModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
    ]);

    let ONE = senderDesc;

    // message = await messageModel.populate("chat");

    const chats = await messageModel.aggregate([
      {
        $lookup: {
          from: "chats",
          localField: "chat",
          foreignField: "_id",
          as: "chat",
        },
      },
    ]);

    let TWO = chats;

    for (let i = 0; i < ONE.length; i++) {
      ONE[i].chat = TWO[i].chat;
    }

    for (let j = 0; j < TWO[TWO.length - 1].chat[0].users.length; j++) {
      TWO[TWO.length - 1].chat[0].users[j] = await userModel.findOne({
        _id: TWO[TWO.length - 1].chat[0].users[j],
      });
    }

    //find message._id ==== TWO[i]._id
    // and return that object

    await chatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(TWO[TWO.length - 1]);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await messageModel
      .find({ chat: req.params.chatId })
      .populate("sender", "name pic email");
    //chat bhi chaihiye mujhe

    // let ONE = messages;

    // const chat = await chatModel.findOne({ _id: req.params.chatId });
    // for (let i = 0; i < ONE.length; i++) {
    //   ONE[i].chat = chat;
    // }
    // console.log("ONE:", ONE);

    // const chats = await messageModel.aggregate([
    //   {
    //     $lookup: {
    //       from: "chats",
    //       localField: "chat",
    //       foreignField: "_id",
    //       as: "chat",
    //     },
    //   },
    // ]);

    // let TWO = chats;

    // for (let i = 0; i < ONE.length; i++) {
    //   ONE[i].chat = TWO[i].chat;
    // }

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
