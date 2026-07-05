import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  Gamepad2,
  ChevronDown,
} from "lucide-react";
import AuthModal from "../AuthModal";
import "./Navbar.css";
export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };
  return (
    <nav className="navbar-container glass-panel">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <Gamepad2 className="logo-icon" />
          <span>
            PLAY<span className="logo-highlight">RUNNERS</span>
          </span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/store" className="nav-link">
            Game Store
          </Link>
          <Link to="/events" className="nav-link">
            Events
          </Link>
        </div>
        <div className="navbar-actions">
          <Link to="/cart" className="cart-badge-container">
            <ShoppingCart className="action-icon" />
            {cart.length > 0 && (
              <span className="cart-count">{cart.length}</span>
            )}
          </Link>
          {user ? (
            <div className="user-dropdown-container">
              <button
                className="user-profile-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={
                    user.avatar_url ||
                    `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`
                  }
                  alt="avatar"
                  className="navbar-avatar"
                />
                <span className="navbar-username">{user.username}</span>
                <ChevronDown
                  className={`chevron ${dropdownOpen ? "rotated" : ""}`}
                />
              </button>
              {dropdownOpen && (
                <div className="navbar-dropdown glass-panel">
                  <div className="dropdown-header">
                    <span className="dropdown-rank">
                      {user.rank_name || "Rookie"}
                    </span>
                    <span className="dropdown-level">
                      LVL {user.level || 1}
                    </span>
                  </div>
                  <hr className="dropdown-divider" />
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="dropdown-item-icon" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout-btn"
                  >
                    <LogOut className="dropdown-item-icon" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="neon-btn" onClick={() => setShowAuthModal(true)}>
              Sign In
            </button>
          )}
        </div>
      </div>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </nav>
  );
}
