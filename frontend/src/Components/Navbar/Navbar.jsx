import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <span className="logo">PlaySphere</span>

      <ul className="nav-links">
        <li>Arena</li>
        <li>Tournaments</li>
        <li className="active">Market</li>
        <li>Stream</li>
      </ul>

      <div className="nav-actions">
        <button className="icon-btn" aria-label="Notifications">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <button className="icon-btn" aria-label="Cart">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>

        <button className="go-pro-btn">Go Pro</button>

        <div className="avatar">
          <img src="https://i.pravatar.cc/36?img=8" alt="User avatar" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
