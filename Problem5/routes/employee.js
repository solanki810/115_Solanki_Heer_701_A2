const express = require("express");
const Employee = require("../models/Employee");
const auth = require("../middleware/auth");

const router = express.Router();

// Get profile
router.get("/profile", auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id).select("-password");
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
