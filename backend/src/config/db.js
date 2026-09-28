const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config();

// Persistent storage file path for JSON database
const DATA_DIR = path.join(__dirname, "../../data");
const DB_FILE = path.join(DATA_DIR, "playsphere_db.json");

// Real Games initial catalog
const defaultGames = [
  {
    id: 1,
    title: "VALORANT",
    tagline: "Defy the limits in a 5v5 character-based tactical shooter.",
    description:
      "Blend your style and tactical combat on a global, competitive stage. You have 13 rounds to attack and defend your side using sharp gunplay and tactical abilities. Take on foes across Competitive, Premier, and Unrated modes.",
    genre: "Tactical FPS",
    price: 0.0,
    image_url:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    cover_banner:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    release_date: "2020-06-02",
    publisher: "Riot Games",
    developer: "Riot Games",
    sys_req_min:
      "OS: Windows 10 64-bit | CPU: Intel Core 2 Duo E8400 | RAM: 4 GB | GPU: Intel HD 4000 | Storage: 20 GB",
    sys_req_rec:
      "OS: Windows 10/11 64-bit | CPU: Intel i3-4150 / Ryzen 3 1200 | RAM: 8 GB | GPU: GTX 730 / AMD R7 240 | Storage: 20 GB SSD",
  },
  {
    id: 2,
    title: "Counter-Strike 2",
    tagline: "The premier competitive tactical shooter evolved on Source 2 engine.",
    description:
      "For over two decades, Counter-Strike has offered an elite competitive experience shaped by millions of players worldwide. Counter-Strike 2 features responsive smoke grenades, sub-tick updates, overhauled audio, and redesigned maps.",
    genre: "Tactical FPS",
    price: 0.0,
    image_url:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
    cover_banner:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    rating: 4.7,
    release_date: "2023-09-27",
    publisher: "Valve",
    developer: "Valve",
    sys_req_min:
      "OS: Windows 10 64-bit | CPU: Intel Core i5 750 (4 threads) | RAM: 8 GB | GPU: 1 GB DirectX 11 compatible | Storage: 85 GB",
    sys_req_rec:
      "OS: Windows 11 64-bit | CPU: Intel Core i7 9700K / Ryzen 7 3700X | RAM: 16 GB | GPU: RTX 2070 / RX 5700 XT | Storage: 85 GB SSD",
  },
  {
    id: 3,
    title: "Apex Legends",
    tagline: "Conquer with character in an award-winning free-to-play Hero shooter.",
    description:
      "Master an ever-growing roster of legendary characters with powerful abilities in strategic squad play. Drop into intense battles, utilize synergies, and claim victory across the Outlands.",
    genre: "Battle Royale",
    price: 0.0,
    image_url:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop",
    cover_banner:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop",
    rating: 4.6,
    release_date: "2019-02-04",
    publisher: "Electronic Arts",
    developer: "Respawn Entertainment",
    sys_req_min:
      "OS: 64-bit Windows 10 | CPU: Intel Core i3-6300 3.8GHz | RAM: 6 GB | GPU: NVIDIA GeForce GT 640 | Storage: 75 GB",
    sys_req_rec:
      "OS: 64-bit Windows 10/11 | CPU: Intel i5 3570K / Ryzen 5 | RAM: 16 GB | GPU: NVIDIA GeForce GTX 970 | Storage: 75 GB SSD",
  },
  {
    id: 4,
    title: "Call of Duty: Warzone",
    tagline: "Massive combat arena with dynamic battlefields and lethal loadouts.",
    description:
      "Welcome to Warzone, the massive free-to-play combat arena featuring Urzikstan and Rebirth Island. Experience top-tier battle royale gameplay with high-impact gun mechanics, killstreaks, and squad-based vehicle combat.",
    genre: "Battle Royale",
    price: 0.0,
    image_url:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop",
    cover_banner:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    rating: 4.4,
    release_date: "2020-03-10",
    publisher: "Activision",
    developer: "Infinity Ward / Raven Software",
    sys_req_min:
      "OS: Windows 10 64 Bit | CPU: Intel Core i5-6600 | RAM: 8 GB | GPU: NVIDIA GeForce GTX 960 | Storage: 125 GB",
    sys_req_rec:
      "OS: Windows 10/11 64 Bit | CPU: Intel Core i7-8700K | RAM: 16 GB | GPU: NVIDIA RTX 3060 / RX 6600XT | Storage: 125 GB SSD",
  },
  {
    id: 5,
    title: "Cyberpunk 2077: Phantom Liberty",
    tagline: "An open-world, action-adventure RPG set in the dark future of Night City.",
    description:
      "Cyberpunk 2077 is an open-world, action-adventure RPG set in Night City. Play as V, a cyberpunk mercenary, and take on the most powerful forces in the city in a fight for glory and survival. Includes the acclaimed spy-thriller expansion Phantom Liberty.",
    genre: "RPG",
    price: 59.99,
    image_url:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    cover_banner:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    release_date: "2023-09-26",
    publisher: "CD PROJEKT RED",
    developer: "CD PROJEKT RED",
    sys_req_min:
      "OS: 64-bit Windows 10 | CPU: Core i7-6700 or Ryzen 5 1600 | RAM: 12 GB | GPU: GeForce GTX 1060 6GB | Storage: 70 GB SSD",
    sys_req_rec:
      "OS: 64-bit Windows 11 | CPU: Core i7-12700 or Ryzen 7 7800X3D | RAM: 16 GB | GPU: GeForce RTX 3080 | Storage: 70 GB NVMe SSD",
  },
  {
    id: 6,
    title: "Elden Ring: Shadow of the Erdtree",
    tagline: "Rise, Tarnished, and be guided by grace to brandish the Elden Ring.",
    description:
      "THE CRITICALLY ACCLAIMED FANTASY ACTION RPG. Journey across the Lands Between and the Realm of Shadow. Unravel mysteries, defeat demi-gods, and master deep magic and swordplay in an interconnected open world crafted by FromSoftware.",
    genre: "RPG",
    price: 59.99,
    image_url:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
    cover_banner:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    release_date: "2024-06-21",
    publisher: "Bandai Namco",
    developer: "FromSoftware Inc.",
    sys_req_min:
      "OS: Windows 10 | CPU: Intel Core i5-8400 | RAM: 12 GB | GPU: GTX 1060 3 GB / RX 580 4 GB | Storage: 80 GB",
    sys_req_rec:
      "OS: Windows 10/11 | CPU: Intel Core i7-8700K | RAM: 16 GB | GPU: GTX 1070 8 GB / RX Vega 56 | Storage: 80 GB SSD",
  },
  {
    id: 7,
    title: "Overwatch 2",
    tagline: "An optimistic future-set free-to-play team-based action game.",
    description:
      "Overwatch 2 is a critically acclaimed, team-based shooter game set in an optimistic future with an evolving roster of heroes. Team up with friends and jump into exhilarating 5v5 shooter combat across iconic global destinations.",
    genre: "Shooter",
    price: 0.0,
    image_url:
      "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=600&auto=format&fit=crop",
    cover_banner:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
    rating: 4.3,
    release_date: "2022-10-04",
    publisher: "Blizzard Entertainment",
    developer: "Blizzard Entertainment",
    sys_req_min:
      "OS: Windows 10 64-bit | CPU: Intel Core i3 | RAM: 6 GB | GPU: NVIDIA GeForce GTX 600 series | Storage: 50 GB",
    sys_req_rec:
      "OS: Windows 10/11 64-bit | CPU: Intel Core i7 | RAM: 16 GB | GPU: GeForce GTX 1060 / RTX 2060 | Storage: 50 GB SSD",
  },
  {
    id: 8,
    title: "EA SPORTS FC 25",
    tagline: "The World's Game powered by FC IQ and hyper-realistic match dynamics.",
    description:
      "EA SPORTS FC 25 gives you more ways to win for the club. Team up in 5v5 Rush, and manage your squad to victory as FC IQ delivers unprecedented tactical control across 19,000 players and 700+ authentic teams.",
    genre: "Sports",
    price: 69.99,
    image_url:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop",
    cover_banner:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
    rating: 4.5,
    release_date: "2024-09-27",
    publisher: "Electronic Arts",
    developer: "EA Vancouver",
    sys_req_min:
      "OS: Windows 10 64-Bit | CPU: AMD Ryzen 5 1600 or Intel Core i5 6600K | RAM: 8 GB | GPU: GTX 1050 Ti | Storage: 100 GB",
    sys_req_rec:
      "OS: Windows 11 64-Bit | CPU: Ryzen 7 2700X or Intel Core i7 6700 | RAM: 16 GB | GPU: GTX 1660 / RX 5600 XT | Storage: 100 GB SSD",
  },
  {
    id: 9,
    title: "League of Legends",
    tagline: "The world's most played competitive multiplayer online battle arena.",
    description:
      "League of Legends is a team-based strategy game where two teams of five champions face off to destroy the opposing Nexus. Choose from over 160 champions to make epic plays and secure victory.",
    genre: "MOBA",
    price: 0.0,
    image_url:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    cover_banner:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    release_date: "2009-10-27",
    publisher: "Riot Games",
    developer: "Riot Games",
    sys_req_min:
      "OS: Windows 10/11 | CPU: Intel Core i3-530 | RAM: 4 GB | GPU: GeForce 9600GT / AMD HD 6570 | Storage: 16 GB",
    sys_req_rec:
      "OS: Windows 10/11 64-bit | CPU: Intel Core i5-3300 | RAM: 8 GB | GPU: GeForce GTX 560 | Storage: 16 GB SSD",
  },
  {
    id: 10,
    title: "Grand Theft Auto V",
    tagline: "Explore the sprawling, sun-soaked metropolis of Los Santos.",
    description:
      "When a young street hustler, a retired bank robber, and a terrifying psychopath get entangled with the criminal underworld, they must pull off a series of dangerous heists to survive in a ruthless city.",
    genre: "Action",
    price: 29.99,
    image_url:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600&auto=format&fit=crop",
    cover_banner:
      "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    release_date: "2015-04-14",
    publisher: "Rockstar Games",
    developer: "Rockstar North",
    sys_req_min:
      "OS: Windows 10 64 Bit | CPU: Intel Core 2 Quad Q6600 @ 2.40GHz | RAM: 8 GB | GPU: NVIDIA 9800 GT 1GB | Storage: 110 GB",
    sys_req_rec:
      "OS: Windows 10/11 64 Bit | CPU: Intel Core i5 3470 @ 3.2GHz | RAM: 16 GB | GPU: NVIDIA GTX 660 2GB | Storage: 110 GB SSD",
  },
];

const defaultTournaments = [
  {
    id: 1,
    title: "VALORANT Champions Tour 2026: Berlin",
    subtitle: "The pinnacle of global VALORANT competitive play.",
    prize_pool: "$1,000,000",
    status: "ongoing",
    start_date: "2026-08-14",
    image_url:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    rulebook:
      "Official rules: 5v5 team format, double elimination bracket. Single-agent lock per team. Standard official competitive maps only. Teams must check in 30 minutes prior to scheduled match time.",
  },
  {
    id: 2,
    title: "IEM Katowice 2026: CS2 Major",
    subtitle: "The official world championship tournament for Counter-Strike 2.",
    prize_pool: "$1,000,000",
    status: "upcoming",
    start_date: "2026-09-05",
    image_url:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
    rulebook:
      "Official rules: 5v5 MR12 competitive rule set. Double elimination playoffs. Anti-cheat client mandatory. Overtime MR3 with $10,000 start cash.",
  },
  {
    id: 3,
    title: "ALGS Year 5 Championship",
    subtitle: "The world apex showdown for the finest trios on the planet.",
    prize_pool: "$2,000,000",
    status: "completed",
    start_date: "2026-06-10",
    image_url:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop",
    rulebook:
      "Official rules: Match point format. First team to reach 50 points and subsequently win a match is crowned World Champion.",
  },
];

const defaultMatches = [
  {
    id: 1,
    tournament_id: 1,
    team_a: "Sentinels Esports",
    team_b: "Cloud9 GenG",
    team_a_score: 2,
    team_b_score: 1,
    team_a_logo: "🌐",
    team_b_logo: "🌀",
    status: "completed",
    match_time: "Completed",
    round_name: "Quarterfinals",
  },
  {
    id: 2,
    tournament_id: 1,
    team_a: "G2 Esports",
    team_b: "Fnatic Gaming",
    team_a_score: 2,
    team_b_score: 0,
    team_a_logo: "⚡",
    team_b_logo: "🔥",
    status: "completed",
    match_time: "Completed",
    round_name: "Quarterfinals",
  },
  {
    id: 3,
    tournament_id: 1,
    team_a: "Team Liquid",
    team_b: "Natus Vincere",
    team_a_score: 2,
    team_b_score: 1,
    team_a_logo: "🌊",
    team_b_logo: "🌟",
    status: "completed",
    match_time: "Completed",
    round_name: "Quarterfinals",
  },
  {
    id: 4,
    tournament_id: 1,
    team_a: "Paper Rex",
    team_b: "DRX Vision",
    team_a_score: 0,
    team_b_score: 2,
    team_a_logo: "🦖",
    team_b_logo: "🐉",
    status: "completed",
    match_time: "Completed",
    round_name: "Quarterfinals",
  },
  {
    id: 5,
    tournament_id: 1,
    team_a: "Sentinels Esports",
    team_b: "G2 Esports",
    team_a_score: 1,
    team_b_score: 2,
    team_a_logo: "🌐",
    team_b_logo: "⚡",
    status: "completed",
    match_time: "Completed",
    round_name: "Semifinals",
  },
  {
    id: 6,
    tournament_id: 1,
    team_a: "Team Liquid",
    team_b: "DRX Vision",
    team_a_score: 2,
    team_b_score: 1,
    team_a_logo: "🌊",
    team_b_logo: "🐉",
    status: "completed",
    match_time: "Completed",
    round_name: "Semifinals",
  },
  {
    id: 7,
    tournament_id: 1,
    team_a: "G2 Esports",
    team_b: "Team Liquid",
    team_a_score: 0,
    team_b_score: 0,
    team_a_logo: "⚡",
    team_b_logo: "🌊",
    status: "upcoming",
    match_time: "Sunday, 18:00 UTC",
    round_name: "Grand Finals",
  },
  {
    id: 8,
    tournament_id: 2,
    team_a: "FaZe Clan",
    team_b: "Team Vitality",
    team_a_score: 0,
    team_b_score: 0,
    team_a_logo: "🔴",
    team_b_logo: "🐝",
    status: "upcoming",
    match_time: "Sep 05, 14:00 UTC",
    round_name: "Quarterfinals",
  },
  {
    id: 9,
    tournament_id: 2,
    team_a: "NaVi",
    team_b: "Astralis Guard",
    team_a_score: 0,
    team_b_score: 0,
    team_a_logo: "🌟",
    team_b_logo: "⭐",
    status: "upcoming",
    match_time: "Sep 05, 17:30 UTC",
    round_name: "Quarterfinals",
  },
  {
    id: 10,
    tournament_id: 2,
    team_a: "MOUZ",
    team_b: "Virtus.pro",
    team_a_score: 0,
    team_b_score: 0,
    team_a_logo: "🐭",
    team_b_logo: "🐻",
    status: "upcoming",
    match_time: "Sep 06, 14:00 UTC",
    round_name: "Quarterfinals",
  },
  {
    id: 11,
    tournament_id: 2,
    team_a: "G2 Esports",
    team_b: "Team Spirit",
    team_a_score: 0,
    team_b_score: 0,
    team_a_logo: "⚡",
    team_b_logo: "🐉",
    status: "upcoming",
    match_time: "Sep 06, 17:30 UTC",
    round_name: "Quarterfinals",
  },
];

const defaultReviews = [
  {
    id: 1,
    game_id: 1,
    user_id: 1,
    rating: 5,
    comment:
      "VALORANT's gunplay and agent abilities hit the absolute sweet spot for tactical FPS lovers. The 128-tick servers are crisp!",
    created_at: "2026-03-12T10:00:00Z",
  },
  {
    id: 2,
    game_id: 2,
    user_id: 1,
    rating: 5,
    comment:
      "Counter-Strike 2 has completely transformed the dynamic smokes and graphics. Best competitive FPS on the market.",
    created_at: "2026-03-15T14:30:00Z",
  },
  {
    id: 3,
    game_id: 5,
    user_id: 1,
    rating: 5,
    comment:
      "Phantom Liberty expansion makes Cyberpunk 2077 one of the greatest sci-fi RPGs of all time. Night City is unbelievable.",
    created_at: "2026-03-20T18:00:00Z",
  },
  {
    id: 4,
    game_id: 6,
    user_id: 1,
    rating: 5,
    comment:
      "Masterpiece. Elden Ring's world design, bosses, and lore are unmatched. Shadow of the Erdtree takes it to another level.",
    created_at: "2026-03-22T20:15:00Z",
  },
];

// Initial mock DB in case no file exists
let mockDb = {
  users: [
    {
      id: 1,
      username: "GamerPro",
      email: "gamer@example.com",
      password_hash:
        "$2a$10$eImiTXuGPur1Yegb3vVbQufx/W5PpxbXNee0xJdGk.43s7U6L3mO2", // 'password' hashed
      avatar_url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=GamerPro",
      rank_name: "Elite Guardian",
      level: 42,
      xp: 750,
      bio: "Professional esports enthusiast. Tactical FPS and Battle Royale competitor on PlaySphere.",
      win_rate: 68,
      total_hours: 1240,
      matches_played: 350,
    },
  ],
  games: defaultGames,
  tournaments: defaultTournaments,
  matches: defaultMatches,
  reviews: defaultReviews,
  collections: [
    { id: 1, user_id: 1, game_id: 1 },
    { id: 2, user_id: 1, game_id: 2 },
  ],
  registrations: [
    {
      id: 1,
      user_id: 1,
      tournament_id: 1,
      team_name: "Shadow Vipers",
      registration_date: "2026-08-01T12:00:00Z",
    },
  ],
  orders: [],
  order_items: [],
};

let nextIds = {
  users: 2,
  reviews: 5,
  collections: 3,
  registrations: 2,
  orders: 1,
  order_items: 1,
};

// Ensure data folder and file persistence
const ensureDbLoaded = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed && parsed.games && parsed.users) {
        mockDb = parsed;
        // recalculate nextIds
        nextIds.users = Math.max(...mockDb.users.map((u) => u.id), 0) + 1;
        nextIds.reviews =
          Math.max(...(mockDb.reviews || []).map((r) => r.id), 0) + 1;
        nextIds.collections =
          Math.max(...(mockDb.collections || []).map((c) => c.id), 0) + 1;
        nextIds.registrations =
          Math.max(...(mockDb.registrations || []).map((r) => r.id), 0) + 1;
        nextIds.orders =
          Math.max(...(mockDb.orders || []).map((o) => o.id), 0) + 1;
        nextIds.order_items =
          Math.max(...(mockDb.order_items || []).map((oi) => oi.id), 0) + 1;
        return;
      }
    }
    saveDb();
  } catch (err) {
    console.error("Error loading database file:", err.message);
  }
};

const saveDb = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(mockDb, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving database file:", err.message);
  }
};

let pool = null;
let useFallback = true;

const initDbPool = async () => {
  ensureDbLoaded();
  if (process.env.DB_HOST && process.env.DB_NAME) {
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      const conn = await pool.getConnection();
      console.log(
        "\x1b[32m%s\x1b[0m",
        "✅ Connected to MySQL database successfully!"
      );
      conn.release();
      useFallback = false;
      return;
    } catch (error) {
      console.log(
        "\x1b[33m%s\x1b[0m",
        "⚠️ MySQL server not reachable (" +
          error.message +
          "). Operating in persistent JSON database engine."
      );
      useFallback = true;
    }
  } else {
    console.log(
      "\x1b[32m%s\x1b[0m",
      "💾 Running with Persistent PlaySphere Database (backend/data/playsphere_db.json)."
    );
    useFallback = true;
  }
};

// SQL Evaluation Engine for Database
const query = async (sqlText, params = []) => {
  if (!useFallback && pool) {
    try {
      const [rows] = await pool.query(sqlText, params);
      return rows;
    } catch (err) {
      console.error("MySQL query error, using persistent store fallback:", err);
    }
  }

  const sql = sqlText.trim().replace(/\s+/g, " ");
  const lower = sql.toLowerCase();

  // 1. SELECT * FROM users WHERE email = ?
  if (lower.startsWith("select * from users where email =")) {
    const email = params[0];
    const user = mockDb.users.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase()
    );
    return user ? [user] : [];
  }

  // 2. SELECT * FROM users WHERE username = ?
  if (lower.startsWith("select * from users where username =")) {
    const username = params[0];
    const user = mockDb.users.find(
      (u) => u.username.toLowerCase() === String(username).toLowerCase()
    );
    return user ? [user] : [];
  }

  // 3. SELECT * FROM users WHERE id = ?
  if (lower.startsWith("select * from users where id =")) {
    const id = parseInt(params[0]);
    const user = mockDb.users.find((u) => u.id === id);
    return user ? [user] : [];
  }

  // 4. INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)
  if (lower.startsWith("insert into users")) {
    const newUser = {
      id: nextIds.users++,
      username: params[0],
      email: params[1],
      password_hash: params[2],
      avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${params[0]}`,
      rank_name: "Rookie",
      level: 1,
      xp: 0,
      bio: "New gamer in PlaySphere.",
      win_rate: 0,
      total_hours: 0,
      matches_played: 0,
    };
    mockDb.users.push(newUser);
    saveDb();
    return { insertId: newUser.id };
  }

  // 5. UPDATE users SET username = ?, email = ?, avatar_url = ?, bio = ? WHERE id = ?
  if (lower.startsWith("update users set username =") && lower.includes("bio =")) {
    const username = params[0];
    const email = params[1];
    const avatar = params[2];
    const bio = params[3];
    const id = parseInt(params[4]);
    const user = mockDb.users.find((u) => u.id === id);
    if (user) {
      user.username = username || user.username;
      user.email = email || user.email;
      user.avatar_url = avatar || user.avatar_url;
      user.bio = bio !== undefined ? bio : user.bio;
      saveDb();
    }
    return { affectedRows: user ? 1 : 0 };
  }

  // 6. UPDATE users SET xp = xp + ... WHERE id = ?
  if (lower.startsWith("update users set") && lower.includes("xp = xp +")) {
    const id = parseInt(params[params.length - 1]);
    const user = mockDb.users.find((u) => u.id === id);
    if (user) {
      if (lower.includes("xp = xp + 350")) user.xp += 350;
      else if (lower.includes("xp = xp + 250")) user.xp += 250;
      else if (lower.includes("xp = xp + 150")) user.xp += 150;
      else if (lower.includes("xp = xp + 500")) user.xp += 500;
      else user.xp += 100;

      if (lower.includes("matches_played = matches_played + 1")) {
        user.matches_played += 1;
      }
      user.level = Math.floor(user.xp / 500) + 1;
      if (user.level >= 25) user.rank_name = "Apex Legend";
      else if (user.level >= 10) user.rank_name = "Master Specialist";
      else if (user.level >= 5) user.rank_name = "Veteran Striker";
      else user.rank_name = "Rookie";
      saveDb();
    }
    return { affectedRows: user ? 1 : 0 };
  }

  // 7. SELECT * FROM games WHERE id = ?
  if (lower.startsWith("select * from games where id =")) {
    const id = parseInt(params[0]);
    const game = mockDb.games.find((g) => g.id === id);
    return game ? [game] : [];
  }

  // 8. SELECT * FROM games
  if (lower.startsWith("select * from games")) {
    return mockDb.games;
  }

  // 9. SELECT * FROM tournaments WHERE id = ?
  if (lower.startsWith("select * from tournaments where id =")) {
    const id = parseInt(params[0]);
    const tourney = mockDb.tournaments.find((t) => t.id === id);
    return tourney ? [tourney] : [];
  }

  // 10. SELECT * FROM tournaments
  if (lower.startsWith("select * from tournaments")) {
    return mockDb.tournaments;
  }

  // 11. SELECT * FROM matches WHERE tournament_id = ?
  if (lower.startsWith("select * from matches where tournament_id =")) {
    const tourneyId = parseInt(params[0]);
    return mockDb.matches.filter((m) => m.tournament_id === tourneyId);
  }

  // 12. SELECT * FROM registrations WHERE user_id = ? AND tournament_id = ?
  if (
    lower.startsWith("select * from registrations where user_id =") &&
    lower.includes("tournament_id =")
  ) {
    const userId = parseInt(params[0]);
    const tournamentId = parseInt(params[1]);
    return mockDb.registrations.filter(
      (r) => r.user_id === userId && r.tournament_id === tournamentId
    );
  }

  // 13. SELECT * FROM registrations WHERE user_id = ?
  if (lower.startsWith("select * from registrations where user_id =")) {
    const userId = parseInt(params[0]);
    return mockDb.registrations
      .filter((r) => r.user_id === userId)
      .map((r) => {
        const tourney = mockDb.tournaments.find((t) => t.id === r.tournament_id);
        return {
          ...r,
          tournament_title: tourney ? tourney.title : "PlaySphere Tournament",
          start_date: tourney ? tourney.start_date : "Upcoming",
          prize_pool: tourney ? tourney.prize_pool : "$50,000",
        };
      });
  }

  // 14. INSERT INTO registrations
  if (lower.startsWith("insert into registrations")) {
    const newReg = {
      id: nextIds.registrations++,
      user_id: parseInt(params[0]),
      tournament_id: parseInt(params[1]),
      team_name: params[2],
      registration_date: new Date().toISOString(),
    };
    mockDb.registrations.push(newReg);
    saveDb();
    return { insertId: newReg.id };
  }

  // 15. SELECT c.*, g... FROM collections c JOIN games g ... WHERE c.user_id = ?
  if (lower.includes("from collections c") && lower.includes("where c.user_id =")) {
    const userId = parseInt(params[0]);
    const userCollections = (mockDb.collections || []).filter(
      (c) => c.user_id === userId
    );
    return userCollections
      .map((c) => {
        const game = mockDb.games.find((g) => g.id === c.game_id);
        if (!game) return null;
        return {
          id: c.id,
          user_id: c.user_id,
          game_id: c.game_id,
          title: game.title,
          tagline: game.tagline,
          image_url: game.image_url,
          cover_banner: game.cover_banner,
          genre: game.genre,
          price: game.price,
          rating: game.rating,
          publisher: game.publisher,
        };
      })
      .filter(Boolean);
  }

  // 16. SELECT * FROM collections WHERE user_id = ? AND game_id = ?
  if (
    lower.startsWith("select * from collections where user_id =") &&
    lower.includes("game_id =")
  ) {
    const userId = parseInt(params[0]);
    const gameId = parseInt(params[1]);
    return (mockDb.collections || []).filter(
      (c) => c.user_id === userId && c.game_id === gameId
    );
  }

  // 17. INSERT INTO collections (user_id, game_id)
  if (lower.startsWith("insert into collections")) {
    if (!mockDb.collections) mockDb.collections = [];
    const newCol = {
      id: nextIds.collections++,
      user_id: parseInt(params[0]),
      game_id: parseInt(params[1]),
    };
    mockDb.collections.push(newCol);
    saveDb();
    return { insertId: newCol.id };
  }

  // 18. SELECT r.*, u.username ... FROM reviews r ... WHERE r.game_id = ?
  if (lower.includes("from reviews r") && lower.includes("where r.game_id =")) {
    const gameId = parseInt(params[0]);
    const gameReviews = (mockDb.reviews || []).filter(
      (r) => r.game_id === gameId
    );
    return gameReviews.map((r) => {
      const user = mockDb.users.find((u) => u.id === r.user_id);
      return {
        ...r,
        username: user ? user.username : "PlaySphereGamer",
        avatar_url: user
          ? user.avatar_url
          : "https://api.dicebear.com/7.x/pixel-art/svg?seed=gamer",
      };
    });
  }

  // 19. INSERT INTO reviews (game_id, user_id, rating, comment)
  if (lower.startsWith("insert into reviews")) {
    if (!mockDb.reviews) mockDb.reviews = [];
    const newRev = {
      id: nextIds.reviews++,
      game_id: parseInt(params[0]),
      user_id: parseInt(params[1]),
      rating: Number(params[2]),
      comment: params[3],
      created_at: new Date().toISOString(),
    };
    mockDb.reviews.unshift(newRev);
    saveDb();
    return { insertId: newRev.id };
  }

  // 20. INSERT INTO orders (user_id, total_amount)
  if (lower.startsWith("insert into orders")) {
    const newOrder = {
      id: nextIds.orders++,
      user_id: parseInt(params[0]),
      total_amount: Number(params[1]),
      order_date: new Date().toISOString(),
      payment_status: "completed",
    };
    mockDb.orders.push(newOrder);
    saveDb();
    return { insertId: newOrder.id };
  }

  // 21. INSERT INTO order_items (order_id, game_id, price)
  if (lower.startsWith("insert into order_items")) {
    const orderId = parseInt(params[0]);
    const gameId = parseInt(params[1]);
    const price = Number(params[2]);
    const newItem = {
      id: nextIds.order_items++,
      order_id: orderId,
      game_id: gameId,
      price: price,
    };
    mockDb.order_items.push(newItem);

    // Also auto-add to collections
    const order = mockDb.orders.find((o) => o.id === orderId);
    if (order) {
      if (!mockDb.collections) mockDb.collections = [];
      const alreadyHas = mockDb.collections.some(
        (c) => c.user_id === order.user_id && c.game_id === gameId
      );
      if (!alreadyHas) {
        mockDb.collections.push({
          id: nextIds.collections++,
          user_id: order.user_id,
          game_id: gameId,
        });
      }
    }
    saveDb();
    return { insertId: newItem.id };
  }

  // 22. SELECT o.*, oi.game_id ... FROM orders o JOIN order_items oi ...
  if (lower.includes("from orders o") && lower.includes("where o.user_id =")) {
    const userId = parseInt(params[0]);
    const userOrders = mockDb.orders.filter((o) => o.user_id === userId);
    const orderIds = userOrders.map((o) => o.id);
    const items = mockDb.order_items.filter((oi) =>
      orderIds.includes(oi.order_id)
    );

    return items
      .map((item) => {
        const order = userOrders.find((o) => o.id === item.order_id);
        const game = mockDb.games.find((g) => g.id === item.game_id);
        if (!game) return null;
        return {
          id: order.id,
          user_id: order.user_id,
          total_amount: order.total_amount,
          order_date: order.order_date,
          payment_status: order.payment_status,
          game_id: game.id,
          price: item.price,
          title: game.title,
          image_url: game.image_url,
          genre: game.genre,
          cover_banner: game.cover_banner,
        };
      })
      .filter(Boolean);
  }

  return [];
};

module.exports = {
  initDbPool,
  query,
};
