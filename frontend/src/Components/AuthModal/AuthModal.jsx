import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { X } from "lucide-react";
import "./AuthModal.css";
export default function AuthModal({ onClose }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);
    if (isLoginTab) {
      const res = await login(email, password);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || "Invalid credentials.");
      }
    } else {
      if (!username) {
        setErrorMessage("Username is required.");
        setSubmitting(false);
        return;
      }
      const res = await register(username, email, password);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || "Registration failed.");
      }
    }
    setSubmitting(false);
  };
  return (
    <div className="modal-overlay">
      <div className="auth-modal-content glass-panel glow-active">
        <button className="close-modal-btn" onClick={onClose}>
          <X className="close-icon" />
        </button>
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLoginTab ? "active-tab" : ""}`}
            onClick={() => {
              setIsLoginTab(true);
              setErrorMessage("");
            }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${!isLoginTab ? "active-tab" : ""}`}
            onClick={() => {
              setIsLoginTab(false);
              setErrorMessage("");
            }}
          >
            Join Arena
          </button>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {errorMessage && <div className="auth-error">{errorMessage}</div>}
          {!isLoginTab && (
            <div className="form-group">
              <label>Gamer Tag</label>
              <input
                type="text"
                placeholder="e.g. ShroudClone"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="gamer@playrunners.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="neon-btn-solid submit-auth-btn"
            disabled={submitting}
          >
            {submitting
              ? "Connecting..."
              : isLoginTab
                ? "ENTER ARENA"
                : "CREATE ACCOUNT"}
          </button>
        </form>
      </div>
    </div>
  );
}
