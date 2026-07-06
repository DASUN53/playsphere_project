const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/auth");
// Checkout Cart
router.post("/checkout", authMiddleware, async (req, res) => {
  const { cartItems, totalAmount } = req.body;
  const userId = req.user.id;
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: "Cart is empty." });
  }
  try {
    // 1. Create order
    const orderResult = await db.query(
      "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
      [userId, totalAmount],
    );
    const orderId = orderResult.insertId;
    // 2. Add order items
    for (const item of cartItems) {
      await db.query(
        "INSERT INTO order_items (order_id, game_id, price) VALUES (?, ?, ?)",
        [orderId, item.id, item.price],
      );
    }
    // 3. Reward user with XP and Level progress! (500 XP)
    await db.query("UPDATE users SET xp = xp + 500 WHERE id = ?", [userId]);
    res
      .status(201)
      .json({ message: "Purchase successful! Welcome to the arena.", orderId });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ error: "Server error processing checkout." });
  }
});
// Get User's Library (owned games)
router.get("/library", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const libraryItems = await db.query(
      "SELECT o.*, oi.game_id, oi.price, g.title, g.image_url, g.genre, g.cover_banner FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN games g ON oi.game_id = g.id WHERE o.user_id = ?",
      [userId],
    );

    // De-duplicate in case user bought same game twice, although normally they'd own it once
    const ownedMap = {};
    libraryItems.forEach((item) => {
      if (!ownedMap[item.game_id]) {
        ownedMap[item.game_id] = {
          game_id: item.game_id,
          title: item.title,
          image_url: item.image_url,
          genre: item.genre,
          cover_banner: item.cover_banner,
          purchase_date: item.order_date,
        };
      }
    });
    res.json(Object.values(ownedMap));
  } catch (error) {
    console.error("Fetch library error:", error);
    res
      .status(500)
      .json({ error: "Server error retrieving owned games library." });
  }
});
module.exports = router;
