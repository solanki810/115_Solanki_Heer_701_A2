const express = require("express");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");
const path = require("path");

const app = express();

// Redis client
let redisClient = createClient();
redisClient.connect().catch(console.error);

// Session middleware
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60000 },
  })
);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  if (req.session.username) {
    res.redirect("/dashboard");
  } else {
    res.render("login");
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    req.session.username = username;
    res.redirect("/dashboard");
  } else {
    res.send("Invalid username or password");
  }
});

app.get("/dashboard", (req, res) => {
  if (req.session.username) {
    res.render("dashboard", { user: req.session.username });
  } else {
    res.redirect("/");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
