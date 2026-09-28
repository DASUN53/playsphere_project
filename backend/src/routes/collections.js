const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/auth");

// GET /api/collections - Get user's collected games
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const items = await db.query(
      "SELECT c.*, g.title, g.tagline, g.image_url, g.cover_banner, g.genre, g.price, g.rating, g.publisher FROM collections c JOIN games g ON c.game_id = g.id WHERE c.user_id = ?",
      [userId]
    );
    res.json(items);
  } catch (error) {
    console.error("Fetch collection error:", error);
    res.status(500).json({ error: "Failed to fetch collection." });
  }
});

// POST /api/collections - Add game to user's collection
router.post("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { gameId } = req.body;
  if (!gameId) {
    return res.status(400).json({ error: "Game ID is required." });
  }
  try {
    // Check if already in collection
    const existing = await db.query(
      "SELECT * FROM collections WHERE user_id = ? AND game_id = ?",
      [userId, gameId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "Game is already in your collection!" });
    }
    // Insert into collection
    await db.query(
      "INSERT INTO collections (user_id, game_id) VALUES (?, ?)",
      [userId, gameId]
    );
    // Award 350 XP
    await db.query(
      "UPDATE users SET xp = xp + 350 WHERE id = ?",
      [userId]
    );
    res.status(201).json({ message: "Game successfully added to your PlaySphere collection!" });
  } catch (error) {
    console.error("Add to collection error:", error);
    res.status(500).json({ error: "Failed to add game to collection." });
  }
});

module.exports = router;
