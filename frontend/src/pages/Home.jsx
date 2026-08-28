import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Calendar, Play, Trophy, Users, Star } from "lucide-react";
import AuthModal from "../components/AuthModal/AuthModal";
import "./CSS/Home.css";
export default function Home() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch featured games
    fetch("http://localhost:5000/api/games")
      .then((res) => res.json())
      .then((data) => {
        setFeaturedGames(data.slice(0, 3));
      })
      .catch((err) => console.error(err));
    // Fetch matches from Nexus Invitational (ID 1)
    fetch("http://localhost:5000/api/events/1/matches")
      .then((res) => res.json())
      .then((data) => {
        setUpcomingMatches(data.slice(4, 7)); // get a mix of matches
      })
      .catch((err) => console.error(err));
  }, []);
  const handleHeroClick = () => {
    if (user) {
      navigate("/store");
    } else {
      setShowAuthModal(true);
    }
  };
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Level Up Your <br />
            <span className="text-gradient-cyan">Gaming Experience</span>
          </h1>
          <p className="hero-description">
            Join the premium community of e-sports competitors, download
            next-generation shooters, track live bracket standings, and build
            your digital arsenal.
          </p>
          <div className="hero-actions">
            <button className="neon-btn-solid" onClick={handleHeroClick}>
              {user ? "EXPLORE STORE" : "JOIN ARENA"}
            </button>
            <button
              className="neon-btn-pink"
              onClick={() => navigate("/events")}
            >
              VIEW EVENTS
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-orb glow-active"></div>
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop"
            alt="Cyber Esports Hero"
            className="hero-image glass-panel"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card glass-panel">
          <Users className="stat-icon cyan" />
          <div className="stat-value">1.2M+</div>
          <div className="stat-label">Active Players</div>
        </div>
        <div className="stat-card glass-panel-pink">
          <Trophy className="stat-icon pink" />
          <div className="stat-value">$500K+</div>
          <div className="stat-label">Prize Pools</div>
        </div>
        <div className="stat-card glass-panel">
          <Play className="stat-icon purple" />
          <div className="stat-value">150+</div>
          <div className="stat-label">Daily Live Tourneys</div>
        </div>
      </section>

      {/* News / Features section */}
      <section className="highlights-section">
        <h2 className="section-title">Esports Spotlights</h2>
        <div className="highlights-grid">
          <div className="highlight-card glass-panel">
            <img
              src="https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=600&auto=format&fit=crop"
              alt="News 1"
            />
            <div className="highlight-content">
              <span className="card-badge cyan-bg">TOURNAMENT</span>
              <h3>Nexus Champions Invitational: G2 vs Liquid Finals!</h3>
              <p>
                The Grand Finals of the year are set for July 20th. Watch G2
                lock horns with Liquid in a five-map thriller.
              </p>
              <button
                className="text-btn"
                onClick={() => navigate("/events/1")}
              >
                View Event &rarr;
              </button>
            </div>
          </div>
          <div className="highlight-card glass-panel-pink">
            <img
              src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop"
              alt="News 2"
            />
            <div className="highlight-content">
              <span className="card-badge pink-bg">UPDATE</span>
              <h3>Shadow Protocol v2.4 Cyber-Armor Balance Changelog</h3>
              <p>
                Developers tweak defensive shield values and boost silent steps
                range for tactical matches.
              </p>
              <button className="text-btn" onClick={() => navigate("/store")}>
                Check Game &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Matches schedule widget */}
      <section className="matches-section">
        <div className="matches-grid-container">
          <div className="matches-info">
            <h2 className="section-title">Match Calendar</h2>
            <p className="matches-desc">
              Follow local squad fixtures, active matches, and scoreboard
              statistics live.
            </p>
            <button
              className="neon-btn-solid"
              onClick={() => navigate("/events")}
            >
              ALL TOURNAMENTS
            </button>
          </div>
          <div className="matches-list glass-panel">
            <h3>UPCOMING SQUAD FIXTURES</h3>
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((m) => (
                <div key={m.id} className="match-row">
                  <div className="match-team team-a">
                    <span className="team-logo">{m.team_a_logo}</span>
                    <span className="team-name">{m.team_a}</span>
                  </div>
                  <div className="match-vs">VS</div>
                  <div className="match-team team-b">
                    <span className="team-logo">{m.team_b_logo}</span>
                    <span className="team-name">{m.team_b}</span>
                  </div>
                  <div className="match-meta">
                    <Calendar className="meta-icon" />
                    <span>{m.match_time}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-matches">
                No active fixtures seeded. Check later!
              </p>
            )}
          </div>
        </div>
      </section>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
