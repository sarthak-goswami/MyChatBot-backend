const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
    index: true,
  },
  role: {
    type : String,
    required : true,
  },
  text: {
    type : String,
    required: true,
  }
},{timestamps:true});

module.exports =  mongoose.model("Message", messageSchema);


