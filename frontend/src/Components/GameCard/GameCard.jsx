import React, { useState } from "react";
import "./GameCard.css";

const screenshots = [
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=75",
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=75",
  "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=75",
];

const features = [
  {
    icon: "⚡",
    label: "Zero Latency Combat",
    desc: "Sub-8ms response times across all global servers.",
  },
  {
    icon: "🧠",
    label: "Neural Customization",
    desc: "Adapt HUD, controls, and AI difficulty in real time.",
  },
  {
    icon: "🎯",
    label: "Dynamic Arenas",
    desc: "32 procedurally generated maps that shift mid-match.",
  },
  {
    icon: "🎮",
    label: "Cross-Play Ready",
    desc: "Full parity across PC, console, and cloud platforms.",
  },
];

const CheckIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--cyan)"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const GameDetail = () => {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <section className="game-detail">
      <div className="gd-left">
        {/* Main screenshot */}
        <div className="gd-main-img">
          <img src={screenshots[activeImg]} alt="Screenshot" />
        </div>

        {/* Thumbnails */}
        <div className="gd-thumbs">
          {screenshots.map((src, i) => (
            <button
              key={i}
              className={`thumb ${i === activeImg ? "active" : ""}`}
              onClick={() => setActiveImg(i)}
            >
              <img src={src} alt={`Screenshot ${i + 1}`} />
            </button>
          ))}
        </div>

        {/* Mission Briefing */}
        <div className="mission-brief">
          <h2 className="section-title">Mission Briefing</h2>
          <p>
            Shadow Protocol: Apex is a high-fidelity tactical simulation
            designed for the elite. Set in the year 2089, you take control of an
            Apex Specter — a cybernetically enhanced operator tasked with
            disrupting the invisible web of corporate espionage and
            techno-terrorism.
          </p>
          <p>
            Powered by the "Athena-v3" combat engine, achive your reaction times
            are enhanced by a real-time AI assistant, allowing for
            guerrilla-satisfying maneuvers and split-second tactical decisions
            that determine the fate of entire sectors.
          </p>
        </div>
      </div>
      {/* Key Features */}
      <div className="gd-right">
        <div className="features-panel">
          <h3 className="panel-title">Key Features</h3>
          <ul className="features-list">
            {features.map((f, i) => (
              <li key={i} className="feature-item">
                <span className="feature-icon">{f.icon}</span>
                <div>
                  <div className="feature-label">{f.label}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Purchase Panel */}
        <div className="purchase-panel">
          <div className="purchase-header">
            <span className="purchase-label">Standard Edition</span>
            <span className="purchase-price">$59.99</span>
          </div>

          <ul className="purchase-includes">
            {[
              "Full base game",
              "Day-1 weapon skin pack",
              "Ranked season pass",
              "Cloud save support",
            ].map((item, i) => (
              <li key={i}>
                <CheckIcon /> {item}
              </li>
            ))}
          </ul>

          <button className="btn-buy">Add to Cart</button>
          <button className="btn-wishlist">Add to Wishlist</button>
        </div>
      </div>
    </section>
  );
};

export default GameDetail;
