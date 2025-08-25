const express = require("express");
const Leave = require("../models/Leave");
const auth = require("../middleware/auth");

const router = express.Router();

// Apply leave
router.post("/", auth, async (req, res) => {
  try {
    const { date, reason } = req.body;
    const leave = new Leave({ employee: req.user.id, date, reason });
    await leave.save();
    res.json({ message: "Leave applied successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// List leaves
router.get("/", auth, async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user.id });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
