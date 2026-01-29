const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Reethu06",   
  database: "travel_ai",
  port: 3306
});

// 🔌 Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL error:", err.message);
    return;
  }
  console.log("✅ MySQL Connected");
});

const openai = new OpenAI({
  apiKey: "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"
});


// 📝 Register API
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.send("All fields required");
  }

  const sql =
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err) => {
    if (err) {
      console.error(err);
      return res.send("Registration failed");
    }
    res.send("User registered successfully");
  });
});
// LOGIN API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send("All fields are required");
  }

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.log(err);
      res.send("Login failed");
    } else {
      if (results.length > 0) {
        res.send("Login successful");
      } else {
        res.send("Invalid email or password");
      }
    }
  });
});

app.post("/ai-chat", (req, res) => {
  const { message, location, budget, days, mood } = req.body;

  if (!message) {
    return res.send("Please ask a travel-related question.");
  }

  let response = `✈️ Travel AI Recommendation\n\n`;

  response += `📍 Location: ${location}\n`;
  response += `💰 Budget: ₹${budget}\n`;
  response += `🗓 Days: ${days}\n`;
  response += `😊 Mood: ${mood}\n\n`;

  response += `🗺 Suggested Plan:\n`;

  if (mood === "Family") {
    response +=
      `Day 1: Beach visit + local sightseeing\n` +
      `Day 2: Forts, temples & family-friendly attractions\n` +
      `Day 3: Shopping + relaxation\n`;
  } else if (mood === "Couple") {
    response +=
      `Day 1: Romantic beach sunset\n` +
      `Day 2: Candlelight dinner + cruise\n` +
      `Day 3: Spa & leisure\n`;
  } else {
    response +=
      `Day 1: Explore city\n` +
      `Day 2: Adventure activities\n` +
      `Day 3: Free exploration\n`;
  }

  response += `\n🧠 Your Question:\n"${message}"\n\n`;
  response += `🤖 AI Tip: Travel during off-season to save money.`;

  res.send(response);
});

// 🚀 Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
