import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  Shield,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import "./GameDetails.css";
export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const { token } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch game details
    fetch(`http://localhost:5001/api/games/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    // Fetch reviews
    fetch(`http://localhost:5001/api/games/${id}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setReviews(data);
      })
      .catch((err) => console.error(err));

    // Fetch library if logged in
    if (token) {
      fetch("http://localhost:5001/api/collections", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setLibrary(data);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [id, token]);
  const handleAddToCollection = async () => {
    if (!token) return alert("Please login first.");
    try {
      const res = await fetch("http://localhost:5001/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gameId: game.id }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setLibrary([...library, { game_id: game.id }]);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please login first.");
    try {
      const res = await fetch(`http://localhost:5001/api/games/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: reviewRating, comment: reviewText }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setReviewText("");
        // Refetch reviews
        fetch(`http://localhost:5001/api/games/${id}/reviews`)
          .then((r) => r.json())
          .then((d) => {
            if (Array.isArray(d)) setReviews(d);
          });
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isOwned = () => {
    return game && library.some((item) => item.game_id === game.id);
  };
  if (loading)
    return (
      <div className="details-loading">Calibrating weapon telemetry...</div>
    );
  if (!game)
    return (
      <div className="details-error">Game data corrupted or unavailable.</div>
    );
  return (
    <div className="game-details-container">
      {/* Back navigation */}
      <button className="back-btn" onClick={() => navigate("/store")}>
        <ArrowLeft className="back-icon" />
        Back to Catalog
      </button>
      {/* Hero Header */}
      <div
        className="details-hero glass-panel glow-active"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(10, 6, 18, 0.4), rgba(10, 6, 18, 0.95)), url('${game.cover_banner}')`,
        }}
      >
        <div className="details-hero-content">
          <img
            src={game.image_url}
            alt={game.title}
            className="details-cover-image"
          />

          <div className="details-main-info">
            <span className="details-genre">{game.genre}</span>
            <h1 className="details-title">{game.title}</h1>
            <p className="details-tagline">{game.tagline}</p>

            <div className="details-meta-row">
              <div className="rating-badge">
                <Star className="details-star-icon" />
                <span>{game.rating} / 5</span>
              </div>
              <span>Released: {game.release_date}</span>
            </div>
            <div className="details-purchase-row">
              <span className="details-price">${game.price}</span>
              {isOwned() ? (
                <div className="owned-status-badge">
                  <Shield className="shield-icon" />
                  <span>✓ IN COLLECTION</span>
                </div>
              ) : (
                <button
                  className="neon-btn-solid checkout-buy-btn"
                  onClick={handleAddToCollection}
                >
                  ADD TO COLLECTION
                </button>
              )}
              {game.buy_link && (
                <a
                  href={game.buy_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neon-btn checkout-buy-btn"
                  style={{ textDecoration: "none", textAlign: "center" }}
                >
                  <ExternalLink className="buy-btn-icon" />
                  BUY ON {game.buy_platform.toUpperCase()}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Columns: Info and specs */}
      <div className="details-columns">
        <div className="details-col-left glass-panel">
          <h2>MISSION OVERVIEW</h2>
          <p className="game-description">{game.description}</p>
          <div className="additional-images">
            <h2>TACTICAL FEED</h2>
            <div className="images-grid">
              <img
                src={game.cover_banner}
                alt="Screenshot 1"
                className="screenshot-img glass-panel"
              />
              <img
                src={game.image_url}
                alt="Screenshot 2"
                className="screenshot-img glass-panel"
              />
            </div>
          </div>
        </div>
        <div className="details-col-right glass-panel">
          <h2>SPECIFICATIONS</h2>
          <div className="spec-item">
            <span className="spec-label">Publisher</span>
            <span className="spec-val">{game.publisher}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Developer</span>
            <span className="spec-val">{game.developer}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Category</span>
            <span className="spec-val">{game.genre}</span>
          </div>
          <div className="sys-requirements">
            <h2>PC COMPATIBILITY</h2>
            <p className="req-note">
              This is a digital license key — no download from this site.
              Requirements listed for your reference to ensure compatibility
              with the platform where you redeem.
            </p>
            <div className="req-box">
              <h3>MINIMUM</h3>
              <p>{game.sys_req_min}</p>
            </div>
            <div className="req-box recommended">
              <h3>RECOMMENDED</h3>
              <p>{game.sys_req_rec}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="details-columns" style={{ marginTop: "2rem" }}>
        <div className="details-col-left glass-panel" style={{ width: "100%" }}>
          <h2>
            <MessageSquare style={{ marginRight: "10px" }} /> COMMUNITY REVIEWS
          </h2>

          {token ? (
            <form
              onSubmit={handleAddReview}
              style={{
                marginBottom: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <label>Rating:</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  style={{
                    padding: "5px",
                    background: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    border: "1px solid var(--neon-blue)",
                  }}
                >
                  {[5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>
                      {num} Stars
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Leave your review..."
                rows="3"
                style={{
                  padding: "10px",
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  border: "1px solid var(--neon-blue)",
                  resize: "vertical",
                }}
                required
              />
              <button
                type="submit"
                className="neon-btn-solid"
                style={{ alignSelf: "flex-start" }}
              >
                POST REVIEW
              </button>
            </form>
          ) : (
            <p style={{ marginBottom: "2rem", color: "var(--neon-pink)" }}>
              Login to leave a review.
            </p>
          )}

          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <img
                        src={
                          rev.avatar_url ||
                          `https://api.dicebear.com/7.x/pixel-art/svg?seed=${rev.username}`
                        }
                        alt="avatar"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                        }}
                      />
                      <strong style={{ color: "var(--neon-blue)" }}>
                        {rev.username}
                      </strong>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "var(--neon-yellow)",
                      }}
                    >
                      <Star size={16} fill="currentColor" />{" "}
                      <span style={{ marginLeft: "5px" }}>{rev.rating}/5</span>
                    </div>
                  </div>
                  <p style={{ margin: 0, color: "#ccc" }}>{rev.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to deploy a review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
