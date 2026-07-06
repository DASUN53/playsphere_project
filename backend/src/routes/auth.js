const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const authMiddleware = require("../middleware/auth");
const JWT_SECRET = process.env.JWT_SECRET || "playrunners_secret_key";
// Register User
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Please enter all fields." });
  }
  try {
    // Check if user exists
    const existingEmail = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingEmail.length > 0) {
      return res.status(400).json({ error: "Email already registered." });
    }
    const existingUsername = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
    );
    if (existingUsername.length > 0) {
      return res.status(400).json({ error: "Username already taken." });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // Insert user
    const result = await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hash],
    );
    // Fetch newly created user details (sans hash)
    const users = await db.query("SELECT * FROM users WHERE id = ?", [
      result.insertId,
    ]);
    const user = users[0];
    delete user.password_hash;
    // Create Token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.status(201).json({ token, user });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration." });
  }
});
// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please enter all fields." });
  }
  try {
    // Check user
    const users = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(400).json({ error: "Invalid credentials." });
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }
    // Remove hash
    delete user.password_hash;
    // Token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login." });
  }
});
// Get Current User Info
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const users = await db.query("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    const user = users[0];
    delete user.password_hash;
    res.json(user);
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({ error: "Server error fetching profile." });
  }
});
// Update Profile settings
router.put("/settings", authMiddleware, async (req, res) => {
  const { username, email, avatar_url, bio } = req.body;
  if (!username || !email) {
    return res.status(400).json({ error: "Username and Email are required." });
  }
  try {
    // Validate username duplicates if changed
    const existingUsername = await db.query(
      "SELECT * FROM users WHERE username = ? AND id != ?",
      [username, req.user.id],
    );
    if (existingUsername.length > 0) {
      return res.status(400).json({ error: "Username already taken." });
    }
    const existingEmail = await db.query(
      "SELECT * FROM users WHERE email = ? AND id != ?",
      [email, req.user.id],
    );
    if (existingEmail.length > 0) {
      return res.status(400).json({ error: "Email already registered." });
    }
    await db.query(
      "UPDATE users SET username = ?, email = ?, avatar_url = ?, bio = ? WHERE id = ?",
      [username, email, avatar_url || null, bio || null, req.user.id],
    );
    const users = await db.query("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);
    const updatedUser = users[0];
    delete updatedUser.password_hash;
    res.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Server error updating profile settings." });
  }
});
// Update Stats / Gain XP (simulated level ups)
router.put("/stats", authMiddleware, async (req, res) => {
  const { xp_gain, hours_gain, matches_gain } = req.body;
  try {
    const users = await db.query("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    const user = users[0];
    let newXp = (user.xp || 0) + (xp_gain || 0);
    let newLevel = user.level || 1;
    let newHours = (user.total_hours || 0) + (hours_gain || 0);
    let newMatches = (user.matches_played || 0) + (matches_gain || 0);

    // Level up mechanic: 1000 XP per level
    while (newXp >= 1000) {
      newXp -= 1000;
      newLevel += 1;
    }
    // Rank milestones
    let newRank = user.rank_name || "Rookie";
    if (newLevel >= 40) newRank = "Elite Guardian";
    else if (newLevel >= 25) newRank = "Master Challenger";
    else if (newLevel >= 15) newRank = "Veteran Scout";
    else if (newLevel >= 5) newRank = "Active Recruit";
    await db.query(
      "UPDATE users SET avatar_url = ?, rank_name = ?, level = ?, xp = ?, bio = ?, win_rate = ?, total_hours = ?, matches_played = ? WHERE id = ?",
      [
        user.avatar_url,
        newRank,
        newLevel,
        newXp,
        user.bio,
        user.win_rate || 50,
        newHours,
        newMatches,
        user.id,
      ],
    );
    const updatedUsers = await db.query("SELECT * FROM users WHERE id = ?", [
      user.id,
    ]);
    const updatedUser = updatedUsers[0];
    delete updatedUser.password_hash;
    res.json(updatedUser);
  } catch (error) {
    console.error("Stats update error:", error);
    res.status(500).json({ error: "Server error updating stats." });
  }
});
module.exports = router;
