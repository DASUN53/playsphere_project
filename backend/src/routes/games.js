const express = require("express");
const router = express.Router();
const db = require("../config/db");
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
