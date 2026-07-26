import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Star, ShoppingCart, ArrowLeft, Shield } from "lucide-react";
import "./CSS/GameDetails.css";

export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
}

return (
  <div className="game-details-container">
    <button className="back-btn" onClick={() => navigate("/store")}>
      <ArrowLeft className="back-icon" />
      Back to Catalog
    </button>
  </div>
);
