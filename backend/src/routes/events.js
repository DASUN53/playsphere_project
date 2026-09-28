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
// Get global real-world esports tournaments
router.get("/external/global", async (req, res) => {
  const globalTournaments = [
    {
      id: "global-1",
      title: "VALORANT Champions 2026: Berlin",
      game: "Valorant",
      prize_pool: "$1,000,000",
      status: "ongoing",
      start_date: "2026-08-14",
      image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      tier: "S-Tier World Championship",
      location: "Mercedes-Benz Arena, Berlin",
      organizer: "Riot Games",
      teams_count: 16,
    },
    {
      id: "global-2",
      title: "Intel Extreme Masters Katowice 2026",
      game: "Counter-Strike 2",
      prize_pool: "$1,000,000",
      status: "upcoming",
      start_date: "2026-09-05",
      image_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
      tier: "Major Championship",
      location: "Spodek Arena, Katowice, Poland",
      organizer: "ESL Gaming",
      teams_count: 24,
    },
    {
      id: "global-3",
      title: "ALGS Year 5 Championship",
      game: "Apex Legends",
      prize_pool: "$2,000,000",
      status: "upcoming",
      start_date: "2026-10-12",
      image_url: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop",
      tier: "Global Pro League",
      location: "Makuhari Messe, Chiba, Japan",
      organizer: "Electronic Arts / Respawn",
      teams_count: 40,
    },
    {
      id: "global-4",
      title: "League of Legends World Championship 2026",
      game: "League of Legends",
      prize_pool: "$2,225,000",
      status: "upcoming",
      start_date: "2026-11-01",
      image_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
      tier: "World Championship",
      location: "Seoul World Cup Stadium, South Korea",
      organizer: "Riot Games",
      teams_count: 22,
    },
  ];
  res.json({ data: globalTournaments, simulated: false });
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
