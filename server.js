const fs = require("fs");
const uploadDir = path.join(__dirname, "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

// ===========================
// MIDDLEWARE
// ===========================
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Serve frontend files
app.use(express.static("public"));

// ===========================
// MONGODB CONNECTION
// ===========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected ✅"))
  .catch(err => console.error("MongoDB connection error:", err));

// ===========================
// SCHEMA
// ===========================
const ReferenceSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  createdAt: { type: Date, default: Date.now }
});

const Reference = mongoose.model("Reference", ReferenceSchema);

// ===========================
// FILE STORAGE (MULTER)
// ===========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });

// ===========================
// UPLOAD API
// ===========================
app.post("/uploadRef", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  await Reference.create({
    fileName: req.file.originalname,
    filePath: req.file.filename
  });

  res.json({ message: "Uploaded Successfully" });
});

// ===========================
// GET FILES API
// ===========================
app.get("/references", async (req, res) => {
  const files = await Reference.find().sort({ createdAt: -1 });
  res.json(files);
});

// ===========================
// VIEW FILE INLINE
// ===========================
app.get("/view/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

// ===========================
// START SERVER
// ===========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
