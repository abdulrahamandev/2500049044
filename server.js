require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Student = require("./models/Student");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/students", async (req, res) => {
  try {
    const filter = {};
    if (req.query.rollNumber) {
      filter.rollNumber = new RegExp(`^${escapeRegex(req.query.rollNumber)}$`, "i");
    }
    if (req.query.department) {
      filter.department = new RegExp(escapeRegex(req.query.department), "i");
    }
    res.json(await Student.find(filter).sort({ rollNumber: 1 }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    res.status(201).json(await Student.create(req.body));
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({
      message: error.code === 11000 ? "That roll number already exists." : error.message
    });
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json({ message: "Student deleted." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please set MONGODB_URI in your .env file.");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Open http://localhost:${port}`));
}

start().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
