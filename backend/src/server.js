const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const db = require("./config/db");
// Import routes
const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/games");
const eventRoutes = require("./routes/events");
const orderRoutes = require("./routes/orders");
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/orders", orderRoutes);
// Root test route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Playrunners E-sports API Portal!",
    status: "online",
    version: "1.0.0",
  });
});
// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});
// Initialize database connection, then start server
db.initDbPool().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Playrunners backend running on port ${PORT}`);
  });
});
