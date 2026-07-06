const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/auth");
// Get all tournaments
router.get("/", async (req, res) => {
  try {
    const tournaments = await db.query("SELECT * FROM tournaments");
    res.json(tournaments);
  } catch (error) {
    console.error("Fetch tournaments error:", error);
    res.status(500).json({ error: "Server error retrieving tournaments." });
  }
});
// Get current user's registrations
router.get("/my-registrations", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const regs = await db.query(
      "SELECT * FROM registrations WHERE user_id = ?",
      [userId],
    );
    res.json(regs);
  } catch (error) {
    console.error("Fetch my registrations error:", error);
    res
      .status(500)
      .json({ error: "Server error retrieving your registrations." });
  }
});
// Check registration status for a single tournament
router.get("/:id/register-status", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const tournamentId = req.params.id;
  try {
    const existing = await db.query(
      "SELECT * FROM registrations WHERE user_id = ? AND tournament_id = ?",
      [userId, tournamentId],
    );
    if (existing.length > 0) {
      return res.json({ registered: true, team_name: existing[0].team_name });
    }
    res.json({ registered: false });
  } catch (error) {
    console.error("Registration status check error:", error);
    res.status(500).json({ error: "Server error check." });
  }
});
// Get tournament by ID
router.get("/:id", async (req, res) => {
  try {
    const tournaments = await db.query(
      "SELECT * FROM tournaments WHERE id = ?",
      [req.params.id],
    );
    if (tournaments.length === 0) {
      return res.status(404).json({ error: "Tournament not found." });
    }
    res.json(tournaments[0]);
  } catch (error) {
    console.error("Fetch tournament error:", error);
    res
      .status(500)
      .json({ error: "Server error retrieving tournament details." });
  }
});
// Get tournament matches (brackets / schedule)
router.get("/:id/matches", async (req, res) => {
  try {
    const matches = await db.query(
      "SELECT * FROM matches WHERE tournament_id = ?",
      [req.params.id],
    );
    res.json(matches);
  } catch (error) {
    console.error("Fetch tournament matches error:", error);
    res
      .status(500)
      .json({ error: "Server error retrieving tournament matches." });
  }
});
// Register user/team for tournament
router.post("/:id/register", authMiddleware, async (req, res) => {
  const { team_name } = req.body;
  const tournamentId = req.params.id;
  const userId = req.user.id;
  if (!team_name) {
    return res.status(400).json({ error: "Team name is required." });
  }
  try {
    // Check if tournament exists
    const tournaments = await db.query(
      "SELECT * FROM tournaments WHERE id = ?",
      [tournamentId],
    );
    if (tournaments.length === 0) {
      return res.status(404).json({ error: "Tournament not found." });
    }
    if (tournaments[0].status === "completed") {
      return res
        .status(400)
        .json({ error: "This tournament is already completed." });
    }
    // Check if user already registered
    const existing = await db.query(
      "SELECT * FROM registrations WHERE user_id = ? AND tournament_id = ?",
      [userId, tournamentId],
    );
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: "You are already registered for this tournament." });
    }
    // Register
    await db.query(
      "INSERT INTO registrations (user_id, tournament_id, team_name) VALUES (?, ?, ?)",
      [userId, tournamentId, team_name],
    );
    // Reward XP for tournament signup! (250 XP)
    await db.query(
      "UPDATE users SET xp = xp + 250, matches_played = matches_played + 1 WHERE id = ?",
      [userId],
    );
    res
      .status(201)
      .json({
        message: "Successfully registered for the tournament!",
        team_name,
      });
  } catch (error) {
    console.error("Tournament registration error:", error);
    res.status(500).json({ error: "Server error during registration." });
  }
});
module.exports = router;
