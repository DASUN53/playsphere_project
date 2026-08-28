import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Users,
  HelpCircle,
  ShieldAlert,
  CheckCircle,
  Disc,
  User,
  Mail,
} from "lucide-react";
import AuthModal from "../components/AuthModal/AuthModal";
import "./CSS/EventDetails.css";

export default function EventDetails() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [discordId, setDiscordId] = useState("");
  const [roster, setRoster] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredTeam, setRegisteredTeam] = useState("");
  const [registeredDetails, setRegisteredDetails] = useState(null);
  const [registerError, setRegisterError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeTab, setActiveTab] = useState("bracket");
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Tournament Metadata
    fetch(`http://localhost:5001/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTournament(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
    // Fetch Matches
    fetch(`http://localhost:5001/api/events/${id}/matches`)
      .then((res) => res.json())
      .then((data) => {
        setMatches(data);
      })
      .catch((err) => console.error(err));
    // Check if user is registered
    if (token) {
      checkRegistration();
    }
  }, [id, token]);

  const checkRegistration = async () => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/events/${id}/register-status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (res.ok && data.registered) {
        setIsRegistered(true);
        setRegisteredTeam(data.team_name);
        setRegisteredDetails({
          captain_name: data.captain_name,
          roster: data.roster,
          discord_id: data.discord_id,
        });
      } else {
        setIsRegistered(false);
        setRegisteredTeam("");
        setRegisteredDetails(null);
      }
    } catch (e) {
      console.error("Error checking tournament registration:", e);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    if (!token) {
      setShowAuthModal(true);
      return;
    }
    if (!teamName) {
      setRegisterError("Team name is required.");
      return;
    }
    if (!captainName) {
      setRegisterError("Captain name/tag is required.");
      return;
    }
    if (!discordId) {
      setRegisterError("Discord ID is required for tournament communications.");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5001/api/events/${id}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            team_name: teamName,
            captain_name: captainName,
            roster: roster,
            discord_id: discordId,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      setIsRegistered(true);
      setRegisteredTeam(teamName);
      setRegisteredDetails({
        captain_name: captainName,
        roster: roster,
        discord_id: discordId,
      });
      setShowSuccessModal(true);
    } catch (err) {
      setRegisterError(err.message);
    }
  };

  if (loading)
    return (
      <div className="event-details-loading">Calibrating bracket nodes...</div>
    );
  if (!tournament)
    return <div className="event-details-error">Tournament node offline.</div>;
  // Filter matches into Quarter, Semi, Finals
  const qfMatches = matches.filter(
    (m) => m.round_name.toLowerCase() === "quarterfinals",
  );
  const sfMatches = matches.filter(
    (m) => m.round_name.toLowerCase() === "semifinals",
  );
  const fMatches = matches.filter(
    (m) => m.round_name.toLowerCase() === "finals",
  );
  return (
    <div className="event-details-container">
      <button className="back-btn" onClick={() => navigate("/events")}>
        <ArrowLeft className="back-icon" />
        Back to Events
      </button>
      {/* Header Banner */}
      <section
        className="event-banner glass-panel glow-active"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(10, 6, 18, 0.95), rgba(18, 14, 36, 0.3)), url('${tournament.image_url}')`,
        }}
      >
        <div className="event-banner-content">
          <span className="banner-badge">
            {tournament.status.toUpperCase()}
          </span>
          <h1>{tournament.title}</h1>
          <p>{tournament.subtitle}</p>
          <div className="event-banner-meta">
            <div className="eb-meta-box">
              <Trophy className="eb-icon pink" />
              <div>
                <span className="eb-label">PRIZE POOL</span>
                <span className="eb-val">{tournament.prize_pool}</span>
              </div>
            </div>
            <div className="eb-meta-box">
              <Calendar className="eb-icon cyan" />
              <div>
                <span className="eb-label">START DATE</span>
                <span className="eb-val">{tournament.start_date}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Main Sections (Bracket, Standings, Register) */}
      <div className="event-tabs-bar glass-panel">
        <button
          className={activeTab === "bracket" ? "active-tab" : ""}
          onClick={() => setActiveTab("bracket")}
        >
          Visual Tournament Bracket
        </button>
        <button
          className={activeTab === "rules" ? "active-tab" : ""}
          onClick={() => setActiveTab("rules")}
        >
          Tournament Rulebook
        </button>
        <button
          className={activeTab === "register" ? "active-tab" : ""}
          onClick={() => setActiveTab("register")}
        >
          Register Squad
        </button>
      </div>
      <div className="tab-content-container">
        {/* TAB 1: Bracket */}
        {activeTab === "bracket" && (
          <div className="bracket-tab-content glass-panel">
            <h2>TOURNAMENT BRACKET</h2>
            <p className="bracket-desc">
              Follow live match progression from quarterfinals down to the grand
              finals champion.
            </p>

            {matches.length > 0 ? (
              <div className="bracket-container">
                {/* Quarterfinals Column */}
                <div className="bracket-column">
                  <h3 className="column-round-title">Quarterfinals</h3>
                  <div className="bracket-matches-list">
                    {qfMatches.map((m) => (
                      <div
                        key={m.id}
                        className="bracket-match-card glass-panel"
                      >
                        <div
                          className={`bracket-team ${m.team_a_score > m.team_b_score ? "winner" : ""}`}
                        >
                          <span>
                            {m.team_a_logo} {m.team_a}
                          </span>
                          <span className="score">{m.team_a_score}</span>
                        </div>
                        <div
                          className={`bracket-team ${m.team_b_score > m.team_a_score ? "winner" : ""}`}
                        >
                          <span>
                            {m.team_b_logo} {m.team_b}
                          </span>
                          <span className="score">{m.team_b_score}</span>
                        </div>
                        <div className="match-status-label">
                          {m.status.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Semifinals Column */}
                <div className="bracket-column">
                  <h3 className="column-round-title">Semifinals</h3>
                  <div className="bracket-matches-list sf-list">
                    {sfMatches.map((m) => (
                      <div
                        key={m.id}
                        className="bracket-match-card glass-panel"
                      >
                        <div
                          className={`bracket-team ${m.team_a_score > m.team_b_score ? "winner" : ""}`}
                        >
                          <span>
                            {m.team_a_logo} {m.team_a}
                          </span>
                          <span className="score">{m.team_a_score}</span>
                        </div>
                        <div
                          className={`bracket-team ${m.team_b_score > m.team_a_score ? "winner" : ""}`}
                        >
                          <span>
                            {m.team_b_logo} {m.team_b}
                          </span>
                          <span className="score">{m.team_b_score}</span>
                        </div>
                        <div className="match-status-label">
                          {m.status.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Finals Column */}
                <div className="bracket-column">
                  <h3 className="column-round-title">Grand Finals</h3>
                  <div className="bracket-matches-list f-list">
                    {fMatches.map((m) => (
                      <div
                        key={m.id}
                        className="bracket-match-card glass-panel-pink"
                      >
                        <div className="bracket-team">
                          <span>
                            {m.team_a_logo} {m.team_a}
                          </span>
                          <span className="score">{m.team_a_score}</span>
                        </div>
                        <div className="bracket-team">
                          <span>
                            {m.team_b_logo} {m.team_b}
                          </span>
                          <span className="score">{m.team_b_score}</span>
                        </div>
                        <div className="match-status-label final-status">
                          {m.status.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="no-bracket-data">
                No brackets generated for this tournament format yet.
              </p>
            )}
          </div>
        )}
        {/* TAB 2: Rules */}
        {activeTab === "rules" && (
          <div className="rules-tab-content glass-panel">
            <h2>OFFICIAL ENGAGEMENT PROTOCOLS</h2>
            <div className="rulebook-text">
              <p>
                {tournament.rulebook ||
                  "No rules configured for this tournament. Play fair and have fun!"}
              </p>
            </div>
            <div className="rules-warning glass-panel-pink">
              <ShieldAlert className="warning-icon" />
              <div>
                <h4>ANTI-CHEAT REGULATION</h4>
                <p>
                  All players must use verified client nodes. Script files,
                  external overlay applications, or packet injections will
                  result in instant team DQ and hardware-id server bans.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* TAB 3: Register */}
        {activeTab === "register" && (
          <div className="register-tab-content glass-panel">
            <h2>REGISTER YOUR SQUAD</h2>

            {tournament.status === "completed" ? (
              <div className="registration-closed">
                <p>Registration closed. This tournament is completed.</p>
              </div>
            ) : isRegistered ? (
              <div className="registration-success-msg glass-panel glow-active">
                <CheckCircle className="success-icon-badge" />
                <h3>SQUAD REGISTERED IN PROTOCOL</h3>
                <p className="success-tagline">
                  Your team registration has been logged in the secure
                  tournament nodes.
                </p>

                <div className="registration-receipt glass-panel">
                  <div className="receipt-row">
                    <span className="receipt-label">Squad Team Name:</span>
                    <span className="receipt-val">{registeredTeam}</span>
                  </div>
                  {registeredDetails?.captain_name && (
                    <div className="receipt-row">
                      <span className="receipt-label">Squad Captain:</span>
                      <span className="receipt-val">
                        {registeredDetails.captain_name}
                      </span>
                    </div>
                  )}
                  {registeredDetails?.discord_id && (
                    <div className="receipt-row">
                      <span className="receipt-label">Discord Contact:</span>
                      <span className="receipt-val code-style">
                        {registeredDetails.discord_id}
                      </span>
                    </div>
                  )}
                  {registeredDetails?.roster && (
                    <div className="receipt-row roster-row">
                      <span className="receipt-label">Registered Roster:</span>
                      <span className="receipt-val roster-val">
                        {registeredDetails.roster}
                      </span>
                    </div>
                  )}
                </div>
                <span className="profile-hint">
                  To coordinate updates or check brackets, verify details in
                  your User Profile.
                </span>
              </div>
            ) : (
              <div className="registration-form-container">
                <p className="reg-description">
                  Provide your competitive clan details to register for this Sri
                  Lanka Tournament. All team info is saved securely.
                </p>

                {registerError && (
                  <div className="reg-error">{registerError}</div>
                )}

                <form onSubmit={handleRegister} className="reg-form">
                  <div className="reg-form-group">
                    <label>Squad Team Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Sentinels Sri Lanka"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="reg-form-grid">
                    <div className="reg-form-group">
                      <label>Team Captain Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Ruwan Silva / RuwanX"
                        value={captainName}
                        onChange={(e) => setCaptainName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="reg-form-group">
                      <label>Discord ID * (for coordinates)</label>
                      <input
                        type="text"
                        placeholder="e.g. gamer#1234 or gamer_sl"
                        value={discordId}
                        onChange={(e) => setDiscordId(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="reg-form-group">
                    <label>
                      Active Roster (names/usernames, comma separated)
                    </label>
                    <textarea
                      placeholder="e.g. GamerSL1, HackerPro, DriftMaster, NinjaCyber, ApexPlayer"
                      value={roster}
                      onChange={(e) => setRoster(e.target.value)}
                      rows="3"
                    />
                  </div>

                  {token ? (
                    <button
                      type="submit"
                      className="neon-btn-solid reg-submit-btn"
                    >
                      REGISTER TEAM (+250 XP)
                    </button>
                  ) : (
                    <div className="reg-signin-warning">
                      <p>You must login to register a team.</p>
                      <button
                        type="button"
                        className="neon-btn-solid"
                        onClick={() => setShowAuthModal(true)}
                      >
                        SIGN IN / SIGN UP
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom Neon Success Modal */}
      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal glass-panel glow-active">
            <CheckCircle className="modal-success-icon" />
            <h2>REGISTRATION CONFIRMED</h2>
            <p className="modal-desc">
              Your squad has been enrolled successfully in the tournament grid.
            </p>

            <div className="modal-receipt">
              <div className="mr-row">
                <span>Tournament:</span>
                <strong>{tournament.title}</strong>
              </div>
              <div className="mr-row">
                <span>Team Name:</span>
                <strong>{teamName}</strong>
              </div>
              <div className="mr-row">
                <span>Reward Gained:</span>
                <span className="xp-reward text-gradient-cyan">+250 XP</span>
              </div>
            </div>

            <button
              className="neon-btn-solid modal-close-btn"
              onClick={() => setShowSuccessModal(false)}
            >
              ACKNOWLEDGE & ACCESS BRACKETS
            </button>
          </div>
        </div>
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
