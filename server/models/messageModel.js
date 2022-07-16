const { Schema, model } = require("mongoose");
const chatModel = require("./chatModel");
const userModel = require("./userModel");

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: userModel },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "chatModel" },
  },
  { timestamps: true }
);

// messageSchema.path("chat").ref(() => chatModel);

const messageModel = model("Message", messageSchema);

module.exports = messageModel;
