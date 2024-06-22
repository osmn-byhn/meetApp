const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
  },
  messageDate: {
    type: Date,
    default: Date.now,
  }
});

const chatSchema = new mongoose.Schema({
  chatName: {
    type: String,
    default: '',
  },
  chats: [messagesSchema],
});
const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
