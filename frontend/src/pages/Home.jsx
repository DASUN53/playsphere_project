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
          <span className="hero-subtitle glow-active">THE ARENA AWAITS</span>
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
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
