const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/auth");

// Get all games
router.get("/", async (req, res) => {
  try {
    const games = await db.query("SELECT * FROM games");
    res.json(games);
  } catch (error) {
    console.error("Fetch games error:", error);
    res.status(500).json({ error: "Server error retrieving games library." });
  }
});

// Get reviews for a game
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await db.query(
      "SELECT r.*, u.username, u.avatar_url FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.game_id = ? ORDER BY r.id DESC",
      [req.params.id]
    );
    res.json(reviews);
  } catch (error) {
    console.error("Fetch reviews error:", error);
    res.status(500).json({ error: "Server error retrieving reviews." });
  }
});

// Post review for a game
router.post("/:id/reviews", authMiddleware, async (req, res) => {
  const { rating, comment } = req.body;
  const gameId = req.params.id;
  const userId = req.user.id;
  if (!rating || !comment) {
    return res.status(400).json({ error: "Rating and comment are required." });
  }
  try {
    await db.query(
      "INSERT INTO reviews (game_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
      [gameId, userId, rating, comment]
    );
    // Reward 150 XP for contributing a review
    await db.query("UPDATE users SET xp = xp + 150 WHERE id = ?", [userId]);
    res.status(201).json({ message: "Review posted successfully! +150 XP gained." });
  } catch (error) {
    console.error("Post review error:", error);
    res.status(500).json({ error: "Server error posting review." });
  }
});

// Get game by ID
router.get("/:id", async (req, res) => {
  try {
    const games = await db.query("SELECT * FROM games WHERE id = ?", [
      req.params.id,
    ]);
    if (games.length === 0) {
      return res.status(404).json({ error: "Game not found." });
    }
    res.json(games[0]);
  } catch (error) {
    console.error("Fetch game by ID error:", error);
    res.status(500).json({ error: "Server error retrieving game details." });
  }
});

module.exports = router;
