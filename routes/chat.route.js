const express = require("express");
require("dotenv").config();
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const messageModel = require("../models/message");
const userModel = require("../models/user");
const converationModel = require("../models/conversation");
const isLoggedIn = require("../middlewares/isLoggedIn");
// console.log(process.env.GEMINI_API_KEY)
const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/newChat", isLoggedIn, async (req, res) => {
  const { title } = req.body;
  const user = await userModel.findOne({ email: req.user.email });
  console.log(user);

  const conversation = await converationModel.create({
    user: user._id,
    title: title,
    isActive: true,
  });

  return res.status(201).send({
    successfull: true,
    message: "converation created successfully",
    conversation: conversation,
  });
});

router.get("/conversations", isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  const conversations = await converationModel.find({ user: user._id });
  return res
    .status(200)
    .send({
      success: true,
      message: "here are the conversations",
      conversations: conversations,
    });
});

// GET /chat/:conversationId
router.get("/:conversationId", isLoggedIn, async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await messageModel.find({
      conversation: conversationId,
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
});

router.post("/:conversationId", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(userMessage);

    const response = result.response.text();

    const message = await messageModel.create({
      conversation: req.params.conversationId,
      text: userMessage,
      role: "user",
    });
    const message2 = await messageModel.create({
      conversation: req.params.conversationId,
      text: response,
      role: "bot",
    });

    res.json({ reply: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
