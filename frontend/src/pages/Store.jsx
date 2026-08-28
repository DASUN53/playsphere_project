import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Star, Plus, Search, Filter } from "lucide-react";
import "./CSS/Store.css";
export default function Store() {
  const [games, setGames] = useState([]);
  const [library, setLibrary] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch games
    fetch("http://localhost:5001/api/games")
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
    // Fetch owned library if logged in
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
    } else {
      setLibrary([]);
    }
  }, [token]);
  const isOwned = (gameId) => {
    return library.some((item) => item.game_id === gameId);
  };

  const handleAddToCollection = async (e, gameId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) return alert("Please login first.");
    try {
      const res = await fetch("http://localhost:5001/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gameId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setLibrary([...library, { game_id: gameId }]);
      } else {
        alert(data.error || "Failed to add to collection.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to connect to the server. Is the backend running?");
    }
  };
  // Filter & Sort Logic
  const filteredGames = games
    .filter((game) => {
      const matchSearch =
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.tagline.toLowerCase().includes(searchTerm.toLowerCase());
      const matchGenre =
        selectedGenre === "All" ||
        game.genre.toLowerCase() === selectedGenre.toLowerCase();
      return matchSearch && matchGenre;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.id - a.id; // default: popular/latest
    });
  const genres = [
    "All",
    "Action",
    "RPG",
    "Shooter",
    "Adventure",
    "Racing",
    "Indie",
  ];
  return (
    <div className="store-container">
      {/* Spotlight Cyber Banner */}
      <section
        className="store-hero-banner glass-panel glow-active"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(10, 6, 18, 0.95), rgba(18, 14, 36, 0.4)), url('https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop')`,
        }}
      >
        <div className="banner-content">
          <span className="banner-badge">🎮 DIGITAL GAME CATALOG</span>
          <h1>CYBER RECKONING: NEON PROTOCOL</h1>
          <p>
            Discover the best futuristic digital games. Read reviews, explore
            system requirements, and add them to your collection.
          </p>
          <div className="banner-price-actions">
            <span className="banner-price">$59.99</span>
            {isOwned(1) ? (
              <span className="owned-tag">✓ IN COLLECTION</span>
            ) : (
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="neon-btn-solid"
                  onClick={(e) => handleAddToCollection(e, 1)}
                >
                  ADD TO COLLECTION
                </button>
                <button
                  className="neon-btn"
                  onClick={() => navigate("/store/1")}
                >
                  VIEW DETAILS
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Filters Toolbar */}
      <section className="store-filters-toolbar glass-panel">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search arsenal catalog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-selects">
          <div className="filter-group">
            <Filter className="filter-icon" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="popular">Popularity</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>
      {/* Genre tabs navigation */}
      <div className="genre-tabs">
        {genres.map((g) => (
          <button
            key={g}
            className={`genre-tab-btn ${selectedGenre === g ? "active-genre" : ""}`}
            onClick={() => setSelectedGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>
      {/* Games Catalog Grid */}
      {loading ? (
        <div className="store-loading">Loading arsenal cache...</div>
      ) : (
        <div className="games-grid">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <div
                key={game.id}
                className="game-card glass-panel"
                onClick={() => navigate(`/store/${game.id}`)}
              >
                <div className="card-image-wrapper">
                  <img
                    src={game.image_url}
                    alt={game.title}
                    className="game-card-img"
                  />
                  <span className="game-card-genre">{game.genre}</span>
                </div>
                <div className="game-card-body">
                  <div className="card-header-row">
                    <h3 className="game-card-title">{game.title}</h3>
                    <div className="game-card-rating">
                      <Star className="rating-star" />
                      <span>{game.rating}</span>
                    </div>
                  </div>
                  <p className="game-card-tagline">{game.tagline}</p>
                  <div className="game-card-footer">
                    <span className="game-card-price">${game.price}</span>

                    {isOwned(game.id) ? (
                      <span className="owned-tag">✓ IN COLLECTION</span>
                    ) : (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="buy-card-btn"
                          onClick={(e) => handleAddToCollection(e, game.id)}
                          title="Add to Collection"
                        >
                          <Plus className="btn-cart-icon" />
                          ADD
                        </button>
                        <button
                          className="buy-card-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/store/${game.id}`);
                          }}
                        >
                          DETAILS
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              No weapons matching the search signature found in store.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
