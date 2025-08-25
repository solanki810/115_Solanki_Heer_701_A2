const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Employee = require("../models/Employee");
require("dotenv").config();

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(400).json({ message: "Invalid email or password" });

    const validPass = await bcrypt.compare(password, employee.password);
    if (!validPass) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: employee._id, name: employee.name, email: employee.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
