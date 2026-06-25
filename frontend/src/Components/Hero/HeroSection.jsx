import React from "react";
import "./Hero.css";

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const Hero = () => (
  <section className="hero">
    {/* Cyberpunk city background via gradient overlay + unsplash */}
    <div className="hero-bg">
      <img
        src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&q=80"
        alt="Cyberpunk city"
        className="hero-img"
      />
      <div className="hero-overlay" />
    </div>

    <div className="hero-content">
      <div className="hero-badges">
        <span className="badge badge-purple">TACTICAL ACTION</span>
        <span className="badge badge-cyan">LIVE TOURNAMENT</span>
      </div>

      <h1 className="hero-title">
        Shadow Protocol:
        <br />
        <span className="title-accent">Apex</span>
      </h1>

      <p className="hero-desc">
        Enter the war-shattered battlefield where strategy meets raw,
        high-frequency combat. Master the art of digital warfare in the world's
        most advanced simulation.
      </p>

      <div className="hero-ctas">
        <button className="btn-primary">Buy Now — $29.99</button>
        <button className="btn-ghost">
          <PlayIcon /> Watch Trailer
        </button>
      </div>
    </div>
  </section>
);

export default Hero;
