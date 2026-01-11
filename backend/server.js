require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model("User", UserSchema);

// Alert Schema
const AlertSchema = new mongoose.Schema({
  message: String,
  date: { type: Date, default: Date.now }
});

const Alert = mongoose.model("Alert", AlertSchema);

// Twilio
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// REGISTER
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.json({ success: false, msg: "User already exists" });

  await User.create({ name, email, password });
  res.json({ success: true });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });
  if (!user) return res.json({ success: false });

  res.json({ success: true });
});

// SOS
app.post("/sos", async (req, res) => {
  const { message } = req.body;

  await Alert.create({ message });

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP,
    to: process.env.YOUR_WHATSAPP,
    body: message
  });

  res.json({ success: true });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
