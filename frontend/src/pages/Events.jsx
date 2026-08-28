import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Trophy,
  Calendar,
  Users,
  Eye,
  Globe,
  Flag,
  Play,
  AlertCircle,
} from "lucide-react";
import "./CSS/Events.css";

export default function Events() {
  const [tournaments, setTournaments] = useState([]);
  const [globalTournaments, setGlobalTournaments] = useState([]);
  const [activeTab, setActiveTab] = useState("srilanka"); // 'srilanka' or 'global'
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch local platform tournaments (including Sri Lanka seeded ones)
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5001/api/events")
      .then((res) => res.json())
      .then((data) => {
        setTournaments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Fetch global tournaments when the tab is clicked
  useEffect(() => {
    if (activeTab === "global" && globalTournaments.length === 0) {
      setGlobalLoading(true);
      fetch("http://localhost:5001/api/events/external/global")
        .then((res) => res.json())
        .then((data) => {
          setGlobalTournaments(data.data || []);
          setIsSimulated(data.simulated || false);
          setGlobalLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setGlobalLoading(false);
        });
    }
  }, [activeTab, globalTournaments]);

  const getStatusClass = (status) => {
    if (status === "ongoing" || status === "running")
      return "status-ongoing glow-active";
    if (status === "upcoming") return "status-upcoming";
    return "status-completed";
  };

  // Filter local Sri Lankan tournaments
  const srilankaTournaments = tournaments.filter(
    (t) => t.region === "Sri Lanka",
  );
  const filteredSriLanka = srilankaTournaments.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
  });

  // We spotlight SLESA National Esports Championship 2026 (ID 4) for Sri Lanka, or choose first ongoing
  const spotlightEvent =
    srilankaTournaments.find((t) => t.id === 4) || srilankaTournaments[0];

  return (
    <div className="events-container">
      {/* Top Navigation Mode Selector */}
      <div className="events-mode-nav glass-panel">
        <button
          className={`mode-btn ${activeTab === "srilanka" ? "active-mode" : ""}`}
          onClick={() => setActiveTab("srilanka")}
        >
          <Flag className="mode-icon flag-icon-sri" />
          <span>SRI LANKA TOURNAMENTS</span>
          <span className="mode-badge count-badge cyan-bg">
            {srilankaTournaments.length}
          </span>
        </button>
        <button
          className={`mode-btn ${activeTab === "global" ? "active-mode" : ""}`}
          onClick={() => setActiveTab("global")}
        >
          <Globe className="mode-icon globe-icon-glob" />
          <span>GLOBAL PRO ARENA</span>
          <span className="mode-badge count-badge pink-bg">PRO</span>
        </button>
      </div>

      {activeTab === "srilanka" ? (
        <>
          {/* Featured SL Event Banner */}
          {spotlightEvent && (
            <section className="featured-event-banner glass-panel glow-active">
              <div className="featured-event-info">
                <span className="featured-badge glow-active">
                  LOCAL SPOTLIGHT
                </span>
                <h1>{spotlightEvent.title}</h1>
                <p className="featured-subtitle">{spotlightEvent.subtitle}</p>
                <div className="featured-meta">
                  <div className="feat-meta-box">
                    <Trophy className="feat-meta-icon text-gradient-cyan" />
                    <div>
                      <span className="feat-meta-label">PRIZE POOL</span>
                      <span className="feat-meta-val">
                        {spotlightEvent.prize_pool}
                      </span>
                    </div>
                  </div>
                  <div className="feat-meta-box">
                    <Users className="feat-meta-icon text-gradient-pink" />
                    <div>
                      <span className="feat-meta-label">REGION</span>
                      <span className="feat-meta-val">
                        {spotlightEvent.region}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="neon-btn-solid view-featured-btn"
                  onClick={() => navigate(`/events/${spotlightEvent.id}`)}
                >
                  <Eye className="view-icon" />
                  VIEW BRACKETS & REGISTER
                </button>
              </div>
              <img
                src={spotlightEvent.image_url}
                alt={spotlightEvent.title}
                className="featured-event-img glass-panel"
              />
            </section>
          )}

          {/* Filter Tabs */}
          <div className="events-filter-bar glass-panel">
            <span className="filter-title">SRI LANKA NATIONAL LEAGUE</span>
            <div className="filter-buttons">
              <button
                className={filter === "all" ? "active-filter" : ""}
                onClick={() => setFilter("all")}
              >
                ALL MATCHES
              </button>
              <button
                className={filter === "ongoing" ? "active-filter" : ""}
                onClick={() => setFilter("ongoing")}
              >
                LIVE / ONGOING
              </button>
              <button
                className={filter === "upcoming" ? "active-filter" : ""}
                onClick={() => setFilter("upcoming")}
              >
                UPCOMING PROTOCOLS
              </button>
              <button
                className={filter === "completed" ? "active-filter" : ""}
                onClick={() => setFilter("completed")}
              >
                COMPLETED SESSIONS
              </button>
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="events-loading">
              Syncing local tournament node feeds...
            </div>
          ) : filteredSriLanka.length > 0 ? (
            <div className="events-grid">
              {filteredSriLanka.map((t) => (
                <div
                  key={t.id}
                  className={`event-card glass-panel ${t.status === "ongoing" ? "glow-active" : ""}`}
                  onClick={() => navigate(`/events/${t.id}`)}
                >
                  <div className="event-img-wrapper">
                    <img
                      src={t.image_url}
                      alt={t.title}
                      className="event-img"
                    />
                    <span
                      className={`event-status-badge ${getStatusClass(t.status)}`}
                    >
                      {t.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="event-card-body">
                    <h3>{t.title}</h3>
                    <p className="event-subtitle">{t.subtitle}</p>
                    <div className="event-meta-footer">
                      <div className="event-prize">
                        <Trophy className="prize-icon" />
                        <span>{t.prize_pool}</span>
                      </div>
                      <div className="event-date">
                        <Calendar className="date-icon" />
                        <span>Starts: {t.start_date}</span>
                      </div>
                    </div>
                    <button className="neon-btn event-action-btn">
                      {t.status === "completed"
                        ? "VIEW STANDINGS"
                        : "VIEW BRACKETS & REGISTER"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-events-found glass-panel">
              <h3>No tournaments match the selected status filters.</h3>
              <p>Check back later or register an upcoming protocol.</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Simulated warning banner if active */}
          {isSimulated && (
            <div className="simulated-warning-banner glass-panel-pink">
              <AlertCircle className="warning-icon animate-pulse" />
              <div>
                <h4>Pro Demo Feed Active</h4>
                <p>
                  This feed displays simulated pro tournaments. Add a valid{" "}
                  <code>PANDASCORE_API_KEY</code> in the backend{" "}
                  <code>.env</code> to synchronize real-time global feeds.
                </p>
              </div>
            </div>
          )}

          {globalLoading ? (
            <div className="events-loading">
              Querying PandaScore Global Match Nodes...
            </div>
          ) : globalTournaments.length > 0 ? (
            <div className="events-grid">
              {globalTournaments.map((m) => (
                <div
                  key={m.id}
                  className={`pro-card glass-panel ${m.status === "running" ? "glow-active-pink" : ""}`}
                >
                  <div className="pro-header">
                    <span className="pro-game-tag">{m.videogame.name}</span>
                    <span
                      className={`pro-status-badge ${getStatusClass(m.status)}`}
                    >
                      {m.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="pro-body">
                    <h3 className="pro-league-title">{m.league.name}</h3>
                    <p className="pro-tourney-name">{m.name}</p>

                    {m.teams && m.teams.length > 0 ? (
                      <div className="pro-matchup">
                        <div className="pro-team">
                          <img
                            src={m.teams[0].image_url}
                            alt={m.teams[0].name}
                            className="pro-team-logo"
                          />
                          <span className="pro-team-name">
                            {m.teams[0].name}
                          </span>
                        </div>
                        <div className="pro-vs">VS</div>
                        <div className="pro-team">
                          <img
                            src={
                              m.teams[1]?.image_url ||
                              "https://api.dicebear.com/7.x/identicon/svg?seed=placeholder"
                            }
                            alt={m.teams[1]?.name || "TBD"}
                            className="pro-team-logo"
                          />
                          <span className="pro-team-name">
                            {m.teams[1]?.name || "TBD"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="pro-no-teams">
                        Qualifiers Bracket / Open Entry
                      </div>
                    )}
                  </div>

                  <div className="pro-footer">
                    <div className="pro-meta-info">
                      <Trophy className="pro-icon prize" />
                      <span>Prize Pool: {m.prize_pool}</span>
                    </div>
                    <div className="pro-meta-info">
                      <Calendar className="pro-icon date" />
                      <span>
                        Date: {new Date(m.begin_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {m.status === "running" ? (
                    <a
                      href={m.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neon-btn-solid-pink watch-stream-btn"
                    >
                      <Play className="watch-icon" />
                      WATCH LIVE STREAM
                    </a>
                  ) : (
                    <button className="neon-btn disabled-btn" disabled>
                      {m.status === "upcoming"
                        ? "UPCOMING BROADCAST"
                        : "BROADCAST CONCLUDED"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-events-found glass-panel">
              <h3>Unable to retrieve Global Pro Esports feeds.</h3>
              <p>Check backend logging nodes and API key integrations.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
