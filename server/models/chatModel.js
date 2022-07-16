const { Schema, model } = require("mongoose");
const userModel = require("./userModel");
const messageModel = require("./messageModel");

const chatSchema = new Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: userModel,
      },
    ],
    latestMessage: [{ type: Schema.Types.ObjectId, ref: messageModel }],
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: userModel,
    },
  },
  {
    timestamps: true,
  }
);

const chatModel = model("Chat", chatSchema);

module.exports = chatModel;
