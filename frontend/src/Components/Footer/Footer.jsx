import React from "react";
import { Gamepad2 } from "lucide-react";
import "./Footer.css";
export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <Gamepad2 className="logo-icon" />
            <span>
              PLAY<span className="logo-highlight">SPHERE</span>
            </span>
          </div>
          <p className="footer-description">
            The ultimate home for competitive gaming, e-sports action,
            tournament standings, and high-performance game access.
          </p>
        </div>
        <div className="footer-links-grid">
          <div className="footer-column">
            <h4>NAVIGATION</h4>
            <a href="/">Home</a>
            <a href="/store">Game Store</a>
            <a href="/events">E-sports Events</a>
          </div>
          <div className="footer-column">
            <h4>COMMUNITY</h4>
            <a href="https://discord.com" target="_blank" rel="noreferrer">
              Discord Guild
            </a>
            <a href="https://twitch.com" target="_blank" rel="noreferrer">
              Twitch Live
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              Twitter Arena
            </a>
          </div>
          <div className="footer-column">
            <h4>LEGAL</h4>
            <a href="/terms">Terms of Engagement</a>
            <a href="/privacy">Privacy Protocols</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Playrunners Esports. All Rights
          Reserved. Level up responsibly.
        </p>
      </div>
    </footer>
  );
}
