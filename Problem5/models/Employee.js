const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  empid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // hashed by admin panel
  basic: { type: Number, default: 0 },
  hra: { type: Number, default: 0 },
  da: { type: Number, default: 0 },
  salary: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema, "employees"); // explicitly use 'employees' collection
