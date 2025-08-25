require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/employee", require("./routes/employee"));
app.use("/api/leave", require("./routes/leave"));

// Connect to admin panel database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to existing ERP database"))
  .catch(err => console.error(err));

// Default redirect
app.get("/", (req, res) => res.redirect("login.html"));

app.listen(process.env.PORT, () => console.log(`🚀 Server running at http://localhost:${process.env.PORT}`));
