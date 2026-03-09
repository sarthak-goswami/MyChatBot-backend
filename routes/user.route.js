const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const conversationModel = require("../models/conversation");
const cors = require("cors");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/profile", isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  const convos = await conversationModel.find({ user: user._id });
  const totalConvos = await conversationModel.find();

  return res.send({
    successfull: true,
    user: user,
    convos: convos.length,
    totalConvos: totalConvos.length,
  });
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res
      .status(400)
      .send({ successfull: false, message: "Incomepete registeration" });

  const user = await userModel.findOne({ email });
  if (user)
    return res
      .status(400)
      .send({ successfull: false, message: "user already exist" });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await userModel.create({
        username,
        email,
        password: hash,
      });

      const token = jwt.sign({ email }, process.env.JWT_SECRET);

      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: false, // true in production (HTTPS)
          sameSite: "lax",
          path: "/",
        })
        .send({
          successfull: true,
          message: "user created successfully",
          user: createdUser,
        });
    });
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .send({ successfull: false, message: "Incomplete information" });
  const user = await userModel.findOne({ email });
  if (!user)
    return res
      .status(404)
      .send({ successfull: false, message: "user does not exist" });

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET);
      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: false, // true in production (HTTPS)
          sameSite: "lax",
          path: "/",
        })
        .status(200)
        .send({
          successfull: true,
          message: "Login successfull",
          user: user,
        });
    } else {
      return res.status(400).send({
        successfull: false,
        message: "Wrong password",
      });
    }
  });
});

module.exports = router;
