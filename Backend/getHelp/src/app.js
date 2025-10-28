const express = require('express');
const app = express()

const auth = require("./routes/auth.route")
const order = require("./routes/orders.route")
const cookieParser = require("cookie-parser");
const makePayment = require('./routes/makePayment.route');
const otherTest = require("./routes/otherTest.route")
const cors = require("cors");

app.use(cors({
  origin: "https://3446c52dbf2d.ngrok-free.app", 
  origin:"http://127.0.0.1:5500",
  origin: "http://localhost:5500",
  credentials: true,               // cookies/jwt bhejne ke liye
}));

app.use(cookieParser());
app.use(express.json())
app.use("/api/auth", auth)
app.use("/api/orders", order)
app.use("/api/payment/razorpay/", makePayment)

//From Testing Agencyyy
app.use("/api/other", otherTest)
module.exports = app
