require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Employee = require("./models/Employee");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Employee.deleteMany({});
    const hashedPassword = await bcrypt.hash("password123", 10);

    const emp = new Employee({
      empid: "EMP1001",
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      basic: 20000,
      hra: 8000,
      da: 5000,
      salary: 33000
    });

    await emp.save();
    console.log("✅ Sample employee created: john@example.com / password123");
    process.exit();
  } catch (err) {
    console.error(err); process.exit(1);
  }
}
seed();
