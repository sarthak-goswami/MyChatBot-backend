const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { default: mongoose } = require("mongoose");
const userRouter = require("./routes/user.route")
const chatRouter = require('./routes/chat.route');
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser())

function MongoDbConnection() {
  mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => {
      console.log("mongo db connected sucessfully");
    })
    .catch((err) => console.log(err));
}
MongoDbConnection();

app.use("/user",userRouter);
app.use("/chat",chatRouter)




app.listen(5000, console.log("the app is working on port 5000"));
