const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    empid: { type: String, unique: true },
    name: String,
    email: String,
    password: String,
    basic: Number,
    hra: Number,
    da: Number,
    salary: Number
});

module.exports = mongoose.model('Employee', employeeSchema);
