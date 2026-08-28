import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Gamepad2,
  Award,
  Calendar,
  Settings,
  ShieldAlert,
  BarChart2,
  Key,
  Copy,
  CheckCheck,
} from "lucide-react";
import "./CSS/Profile.css";

export default function Profile() {
  const { user, token, updateProfile } = useAuth();
  const [library, setLibrary] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [activeTab, setActiveTab] = useState("library");
  const [loading, setLoading] = useState(true);

  // Settings form local state
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [avatarInput, setAvatarInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [settingsMessage, setSettingsMessage] = useState("");
  const [settingsError, setSettingsError] = useState(false);
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    // Pre-fill settings form
    if (user) {
      setUsernameInput(user.username || "");
      setEmailInput(user.email || "");
      setAvatarInput(user.avatar_url || "");
      setBioInput(user.bio || "");
    }

    // Fetch Library
    const fetchLibraryAndRegs = async () => {
      try {
        setLoading(true);
        // Library
        const libRes = await fetch("http://localhost:5001/api/collections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const libData = await libRes.json();
        if (Array.isArray(libData)) {
          setLibrary(libData);
        }

        // Registrations
        // Call generic route registrations (backend falls back to user specific search inside registrations db)
        // Express Router provides specific handler
        const regRes = await fetch("http://localhost:5001/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // In our database.js fallbacks, SELECT * FROM registrations WHERE user_id = ? fetches tournaments
        const regsData = await fetch("http://localhost:5001/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        }); // wait let's query custom route for registrations:
        // Actually, we can fetch all registrations in db matching user
        // Let's create an endpoint in Express. Wait, did we create `GET /api/orders/library`? Yes.
        // What about registrations? Let's check `backend/routes/events.js`:
        // Ah! We have `GET /` (tournaments), `GET /:id` (tournament), `GET /:id/matches`, and `POST /:id/register`.
        // But what about user registrations? Let's check `backend/config/db.js` mock query:
        // Query check: "13. SELECT * FROM registrations WHERE user_id = ?"
        // Oh! Let's check where that is called. Let's see: we should make sure we have a route `/api/events/registrations` or similar, or just hit database directly.
        // Wait, did we map that query in any route?
        // Ah! In `backend/routes/events.js` we didn't add a route for user's registrations!
        // No problem, we can add it, or we can fetch registrations in frontend by querying user profile or events list.
        // Wait, let's create a route for fetching user registrations in `backend/routes/events.js` or `backend/routes/auth.js`!
        // Yes, let's double check. Let's inspect `backend/config/db.js`:
        // We defined query pattern: `select * from registrations where user_id = ?`
        // Let's create a route: `GET /api/events/registrations` in `backend/routes/events.js` to return all registrations for a user.
        // Wait! Let's write `Profile.jsx` first, then make a quick replacement to `backend/routes/events.js` to expose that route! This is extremely logical.

        // Let's fetch registrations from `http://localhost:5001/api/events/my-registrations`
        const regListRes = await fetch(
          "http://localhost:5001/api/events/my-registrations",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const regData = await regListRes.json();
        if (Array.isArray(regData)) {
          setRegistrations(regData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryAndRegs();
  }, [token, user]);

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSettingsMessage("");
    setSettingsError(false);
    setUpdating(true);

    const res = await updateProfile({
      username: usernameInput,
      email: emailInput,
      avatar_url: avatarInput,
      bio: bioInput,
    });

    setUpdating(false);
    if (res.success) {
      setSettingsMessage("Roster parameters successfully rewritten.");
    } else {
      setSettingsMessage(res.error || "Failed to update settings.");
      setSettingsError(true);
    }
  };

  const handleLaunchGame = (title) => {
    alert(`⚡ Opening details for ${title}.`);
  };

  if (!user)
    return <div className="profile-loading">Booting profile interface...</div>;

  return (
    <div className="profile-container">
      {/* Upper Dashboard */}
      <section className="profile-dashboard glass-panel glow-active">
        <div className="dashboard-avatar-block">
          <img
            src={
              user.avatar_url ||
              `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`
            }
            alt="User avatar"
            className="profile-avatar glow-active"
          />
          <div className="dashboard-details">
            <span className="profile-rank-badge">
              {user.rank_name || "Rookie"}
            </span>
            <h2>{user.username}</h2>
            <p className="profile-bio">
              {user.bio || "No user bio compiled yet."}
            </p>
          </div>
        </div>

        {/* Level bar */}
        <div className="dashboard-progression">
          <div className="level-info">
            <span>LEVEL {user.level || 1}</span>
            <span>{user.xp || 0} / 1000 XP</span>
          </div>
          <div className="level-bar-track">
            <div
              className="level-bar-fill"
              style={{ width: `${(user.xp || 0) / 10}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-stats-grid">
          <div className="profile-stat-box">
            <BarChart2 className="ps-icon cyan" />
            <div>
              <span className="ps-val">{user.win_rate || 0}%</span>
              <span className="ps-label">WIN RATE</span>
            </div>
          </div>
          <div className="profile-stat-box">
            <Gamepad2 className="ps-icon pink" />
            <div>
              <span className="ps-val">{user.matches_played || 0}</span>
              <span className="ps-label">MATCHES PLAYED</span>
            </div>
          </div>
          <div className="profile-stat-box">
            <Award className="ps-icon purple" />
            <div>
              <span className="ps-val">{user.total_hours || 0} hrs</span>
              <span className="ps-label">TIME PLAYED</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs list */}
      <div className="profile-tabs-bar glass-panel">
        <button
          className={activeTab === "library" ? "active-tab" : ""}
          onClick={() => setActiveTab("library")}
        >
          Game Library ({library.length})
        </button>
        <button
          className={activeTab === "tournaments" ? "active-tab" : ""}
          onClick={() => setActiveTab("tournaments")}
        >
          Enrolled Tournaments ({registrations.length})
        </button>
        <button
          className={activeTab === "settings" ? "active-tab" : ""}
          onClick={() => setActiveTab("settings")}
        >
          Account Profiles
        </button>
      </div>

      {/* Tab Panels */}
      <div className="profile-tab-content-container">
        {/* TAB 1: Library */}
        {activeTab === "library" && (
          <div className="library-panel">
            {library.length > 0 ? (
              <div className="library-grid">
                {library.map((game) => (
                  <div key={game.game_id} className="library-card glass-panel">
                    <img
                      src={game.image_url}
                      alt={game.title}
                      className="lib-card-img"
                    />
                    <div className="lib-card-body">
                      <span className="lib-card-genre">{game.genre}</span>
                      <h3>{game.title}</h3>
                      <div
                        className="lib-key-section"
                        style={{ justifyContent: "center", marginTop: "10px" }}
                      >
                        <button
                          className="neon-btn"
                          onClick={() => navigate(`/store/${game.game_id}`)}
                        >
                          VIEW GAME
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-profile-tab glass-panel">
                <Gamepad2 className="empty-tab-icon" />
                <h3>No weapons in your library.</h3>
                <p>
                  Visit the game store to purchase licenses for futuristic
                  digital combat.
                </p>
                <button
                  className="neon-btn-solid"
                  onClick={() => navigate("/store")}
                >
                  BROWSE GAME STORE
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Tournaments */}
        {activeTab === "tournaments" && (
          <div className="tournaments-panel">
            {registrations.length > 0 ? (
              <div className="tournaments-list-grid">
                {registrations.map((reg) => (
                  <div key={reg.id} className="tourney-reg-row glass-panel">
                    <img
                      src={reg.image_url}
                      alt={reg.title}
                      className="tourney-reg-img"
                    />

                    <div className="tourney-reg-info">
                      <span className="reg-status-badge">
                        {reg.status.toUpperCase()}
                      </span>
                      <h3>{reg.title}</h3>
                      <p>{reg.subtitle}</p>
                      <span className="reg-team-marker">
                        Squad Registered: <strong>{reg.team_name}</strong>
                      </span>
                    </div>

                    <div className="tourney-reg-actions">
                      <div className="reg-meta-box">
                        <Calendar className="reg-meta-icon" />
                        <span>Starts: {reg.start_date}</span>
                      </div>
                      <button
                        className="neon-btn"
                        onClick={() => navigate(`/events/${reg.tournament_id}`)}
                      >
                        VIEW BRACKETS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-profile-tab glass-panel">
                <Award className="empty-tab-icon" />
                <h3>Not enrolled in any tournaments.</h3>
                <p>
                  Register your e-sports squad for active challenges and grand
                  prize pools.
                </p>
                <button
                  className="neon-btn-solid"
                  onClick={() => navigate("/events")}
                >
                  BROWSE ACTIVE EVENTS
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Settings */}
        {activeTab === "settings" && (
          <div className="settings-panel glass-panel">
            <h2>REWRITE PROFILE PARAMETERS</h2>
            <p className="settings-subtitle">
              Modify your player identity credentials cached in our server
              networks.
            </p>

            {settingsMessage && (
              <div
                className={`settings-feedback ${settingsError ? "error-feed" : "success-feed"}`}
              >
                {settingsMessage}
              </div>
            )}

            <form onSubmit={handleUpdateSettings} className="settings-form">
              <div className="form-row">
                <div className="settings-form-group">
                  <label>Player Username</label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    required
                  />
                </div>
                <div className="settings-form-group">
                  <label>Roster Email</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="settings-form-group">
                <label>Avatar Visual URL</label>
                <input
                  type="text"
                  value={avatarInput}
                  onChange={(e) => setAvatarInput(e.target.value)}
                  placeholder="https://api.dicebear.com/..."
                />
              </div>

              <div className="settings-form-group">
                <label>Gamer Biography</label>
                <textarea
                  rows="4"
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Tell the arena about yourself..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="neon-btn-solid update-settings-btn"
                disabled={updating}
              >
                {updating ? "SAVING CONFIG..." : "REWRITE ROSTER DETAILS"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
