const mysql = require("mysql2/promise");
require("dotenv").config();
// In-memory data store for fallback mode (seeded with default mock data)
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
      bio: "Professional esports enthusiast. Apex drift enthusiast and hacker extra-ordinaire.",
      win_rate: 68,
      total_hours: 1240,
      matches_played: 350,
    },
  ],
  games: [
    {
      id: 1,
      title: "Cyber Reckoning: Neon Protocol",
      tagline: "Unleash cybernetic chaos in the neon-drenched grid.",
      description:
        "Enter a futuristic cityscape ruled by mega-corporations. Play as a rogue hacker-mercenary fighting for survival and digital freedom in this fast-paced action cyber-RPG. Customize your implants, upgrade your arsenal, and rewrite the system.",
      genre: "RPG",
      price: 59.99,
      image_url:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
      cover_banner:
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop",
      rating: 4.8,
      release_date: "2026-03-10",
      publisher: "Nexus Interactive",
      developer: "Neon Void Studios",
      sys_req_min:
        "OS: Windows 10 | CPU: Intel Core i5-8400 | RAM: 8 GB | GPU: GTX 1060 6GB | Storage: 50 GB",
      sys_req_rec:
        "OS: Windows 11 | CPU: Intel Core i7-10700 | RAM: 16 GB | GPU: RTX 3070 | Storage: 50 GB SSD",
    },
    {
      id: 2,
      title: "Shadow Protocol: Apex",
      tagline: "Ghost through the dark. Strike with lethal precision.",
      description:
        "A tactical stealth-action shooter set in geopolitical shadow conflicts. Execute silent takedowns, use high-tech gadgets, and slip through enemy defenses undetected. Coordinate with your team in co-op mode or go lone wolf in the campaign.",
      genre: "Action",
      price: 29.99,
      image_url:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
      cover_banner:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop",
      rating: 4.5,
      release_date: "2025-11-20",
      publisher: "Ghostworks Entertainment",
      developer: "Shadow Lab Labs",
      sys_req_min:
        "OS: Windows 10 | CPU: AMD Ryzen 3 3100 | RAM: 8 GB | GPU: GTX 1050 Ti | Storage: 35 GB",
      sys_req_rec:
        "OS: Windows 10/11 | CPU: AMD Ryzen 5 5600X | RAM: 16 GB | GPU: RTX 2060 | Storage: 35 GB SSD",
    },
    {
      id: 3,
      title: "Xenon Vanguard",
      tagline: "Fast-paced arena shooter with high stakes.",
      description:
        "Dominate the arena in a hero-based tactical shooter. Customize your loadout with futuristic gadgets, weapon modifiers, and coordinate synergy with teammates in standard 5v5 competitive queues or active clan wars.",
      genre: "Shooter",
      price: 39.99,
      image_url:
        "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop",
      cover_banner:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
      rating: 4.2,
      release_date: "2026-01-15",
      publisher: "Playrunners Games",
      developer: "Vector Forge Studio",
      sys_req_min:
        "OS: Windows 10 | CPU: Intel i3-6100 | RAM: 8 GB | GPU: GTX 960 | Storage: 20 GB",
      sys_req_rec:
        "OS: Windows 11 | CPU: Intel i5-11400 | RAM: 16 GB | GPU: GTX 1660 Super | Storage: 20 GB SSD",
    },
    {
      id: 4,
      title: "Star Hunter: Orion",
      tagline: "Explore the uncharted edges of the galaxy.",
      description:
        "An open-world space exploration simulator combined with tactical dogfights and resource trading. Pilot a variety of customizable starships, build space outposts, join factions, and chart new solar systems in a massive multiplayer universe.",
      genre: "Adventure",
      price: 49.99,
      image_url:
        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
      cover_banner:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop",
      rating: 4.6,
      release_date: "2025-08-04",
      publisher: "Starlight Studios",
      developer: "CosmoSoft",
      sys_req_min:
        "OS: Windows 10 | CPU: Intel i5-9600K | RAM: 12 GB | GPU: GTX 1660 | Storage: 60 GB SSD",
      sys_req_rec:
        "OS: Windows 11 | CPU: Intel i7-12700K | RAM: 32 GB | GPU: RTX 3080 | Storage: 60 GB NVMe",
    },
    {
      id: 5,
      title: "Apex Drift: Heat",
      tagline: "Burn rubber and escape the law in street races.",
      description:
        "High-octane arcade racing with stunning visual fidelity and deep vehicle customization. Race through city streets, winding mountains, and seaside highways while dodging rival drivers and high-speed police chases.",
      genre: "Racing",
      price: 19.99,
      image_url:
        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600&auto=format&fit=crop",
      cover_banner:
        "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1200&auto=format&fit=crop",
      rating: 4.4,
      release_date: "2024-05-18",
      publisher: "Drift Nation Inc",
      developer: "Velocity Lab",
      sys_req_min:
        "OS: Windows 10 | CPU: AMD FX-6300 | RAM: 8 GB | GPU: Radeon HD 7850 | Storage: 25 GB",
      sys_req_rec:
        "OS: Windows 10/11 | CPU: AMD Ryzen 5 2600 | RAM: 12 GB | GPU: GTX 1650 Super | Storage: 25 GB SSD",
    },
    {
      id: 6,
      title: "Primal Carnage",
      tagline: "Survive in a world reclaimed by prehistoric beasts.",
      description:
        "A sandbox survival crafting game. Awaken on a mysterious island crawling with dinosaurs and prehistoric monsters. Gather materials, build shelters, craft weapons, domesticate creatures, and form tribes with other survivors to dominate the wilderness.",
      genre: "Indie",
      price: 14.99,
      image_url:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
      cover_banner:
        "https://images.unsplash.com/photo-1500628550463-c8881a54d4d4?q=80&w=1200&auto=format&fit=crop",
      rating: 4.7,
      release_date: "2024-10-02",
      publisher: "Primal Craft Games",
      developer: "Stone Age Studios",
      sys_req_min:
        "OS: Windows 10 | CPU: Intel Core i5-4460 | RAM: 8 GB | GPU: GTX 760 | Storage: 15 GB",
      sys_req_rec:
        "OS: Windows 10/11 | CPU: Intel Core i7-4770 | RAM: 16 GB | GPU: GTX 1060 6GB | Storage: 15 GB SSD",
    },
  ],
  tournaments: [
    {
      id: 1,
      title: "Nexus Champions Invitational",
      subtitle: "The pinnacle of Cyber Reckoning competitive play.",
      prize_pool: "$250,000",
      status: "ongoing",
      start_date: "2026-07-15",
      image_url:
        "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=600&auto=format&fit=crop",
      rulebook:
        "Official rules: 5v5 team format, double elimination bracket. Single-hero lock, standard maps only. All players must check in 30 minutes before match time.",
    },
    {
      id: 2,
      title: "Pro League Championship",
      subtitle: "The official professional tournament for Shadow Protocol.",
      prize_pool: "$100,000",
      status: "upcoming",
      start_date: "2026-08-01",
      image_url:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
      rulebook:
        "Official rules: Squad tactical search and destroy. 4v4 format. Pro league map pool. No glitching, exploits or unapproved scripts.",
    },
    {
      id: 3,
      title: "Clash of Titans: Arena",
      subtitle: "Community showdown for Xenon Vanguard.",
      prize_pool: "$50,000",
      status: "completed",
      start_date: "2026-06-10",
      image_url:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
      rulebook:
        "Community open bracket. Single elimination. Top 3 teams receive cash prizes.",
    },
  ],
  matches: [
    // Quarter Finals (Tourney 1)
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
    // Semi Finals (Tourney 1)
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
      team_b_score: 0,
      team_a_logo: "🌊",
      team_b_logo: "🐉",
      status: "completed",
      match_time: "Completed",
      round_name: "Semifinals",
    },
    // Finals (Tourney 1)
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
      match_time: "July 20, 18:00 UTC",
      round_name: "Finals",
    },
    // Quarter Finals (Tourney 2)
    {
      id: 8,
      tournament_id: 2,
      team_a: "Vitality Tactical",
      team_b: "Faze Clan",
      team_a_score: 0,
      team_b_score: 0,
      team_a_logo: "🐝",
      team_b_logo: "🔴",
      status: "upcoming",
      match_time: "Aug 01, 14:00 UTC",
      round_name: "Quarterfinals",
    },
    {
      id: 9,
      tournament_id: 2,
      team_a: "Navi Shadows",
      team_b: "Astralis Guard",
      team_a_score: 0,
      team_b_score: 0,
      team_a_logo: "🌟",
      team_b_logo: "⭐",
      status: "upcoming",
      match_time: "Aug 01, 16:30 UTC",
      round_name: "Quarterfinals",
    },
    {
      id: 10,
      tournament_id: 2,
      team_a: "T1 Strike",
      team_b: "100 Thieves",
      team_a_score: 0,
      team_b_score: 0,
      team_a_logo: "🎯",
      team_b_logo: "💯",
      status: "upcoming",
      match_time: "Aug 02, 14:00 UTC",
      round_name: "Quarterfinals",
    },
    {
      id: 11,
      tournament_id: 2,
      team_a: "Optic Stealth",
      team_b: "Luminosity",
      team_a_score: 0,
      team_b_score: 0,
      team_a_logo: "👁️",
      team_b_logo: "✨",
      status: "upcoming",
      match_time: "Aug 02, 16:30 UTC",
      round_name: "Quarterfinals",
    },
  ],
  registrations: [],
  orders: [],
  order_items: [],
};
// Auto increment state
let nextIds = {
  users: 2,
  registrations: 1,
  orders: 1,
  order_items: 1,
};
let pool = null;
let useFallback = false;
const initDbPool = async () => {
  // If no env variables, use fallback immediately
  if (!process.env.DB_HOST || !process.env.DB_NAME) {
    console.log(
      "\x1b[33m%s\x1b[0m",
      "⚠️ No MySQL Environment details found. Running in mock/in-memory mode.",
    );
    useFallback = true;
    return;
  }
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
    // Test the pool
    const conn = await pool.getConnection();
    console.log(
      "\x1b[32m%s\x1b[0m",
      "✅ Connected to MySQL database successfully!",
    );
    conn.release();
  } catch (error) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      "❌ MySQL database connection failed: " + error.message,
    );
    console.log(
      "\x1b[33m%s\x1b[0m",
      "⚠️ Defaulting to Mock In-Memory Database Mode.",
    );
    useFallback = true;
  }
};
// Execute SQL in mock DB or real DB
const query = async (sqlText, params = []) => {
  if (!useFallback && pool) {
    try {
      const [rows] = await pool.query(sqlText, params);
      return rows;
    } catch (err) {
      console.error(
        "Real DB Query error, switching fallback for query...",
        err,
      );
      // Fall through to fallback logic for this query if DB has connection issues
    }
  }
  // Fallback evaluation engine
  const sql = sqlText.trim().replace(/\s+/g, " ");
  const normalizedSql = sql.toLowerCase();
  // 1. SELECT * FROM users WHERE email = ?
  if (normalizedSql.startsWith("select * from users where email =")) {
    const email = params[0];
    const user = mockDb.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    return user ? [user] : [];
  }
  // 2. SELECT * FROM users WHERE username = ?
  if (normalizedSql.startsWith("select * from users where username =")) {
    const username = params[0];
    const user = mockDb.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );
    return user ? [user] : [];
  }
  // 3. SELECT * FROM users WHERE id = ?
  if (normalizedSql.startsWith("select * from users where id =")) {
    const id = parseInt(params[0]);
    const user = mockDb.users.find((u) => u.id === id);
    return user ? [user] : [];
  }
  // 4. INSERT INTO users
  if (normalizedSql.startsWith("insert into users")) {
    const newUser = {
      id: nextIds.users++,
      username: params[0],
      email: params[1],
      password_hash: params[2],
      avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${params[0]}`,
      rank_name: "Rookie",
      level: 1,
      xp: 0,
      bio: "New gamer in Playrunners.",
      win_rate: 0,
      total_hours: 0,
      matches_played: 0,
    };
    mockDb.users.push(newUser);
    return { insertId: newUser.id };
  }
  // 5. UPDATE users settings (username, email, avatar_url, bio)
  if (
    normalizedSql.startsWith("update users set username =") &&
    normalizedSql.includes("bio =")
  ) {
    const username = params[0];
    const email = params[1];
    const avatar = params[2];
    const bio = params[3];
    const id = parseInt(params[4]);
    const userIndex = mockDb.users.findIndex((u) => u.id === id);
    if (userIndex !== -1) {
      mockDb.users[userIndex].username = username;
      mockDb.users[userIndex].email = email;
      mockDb.users[userIndex].avatar_url = avatar;
      mockDb.users[userIndex].bio = bio;
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }
  // 6. UPDATE users experience/rank stats
  if (
    normalizedSql.startsWith("update users set avatar_url =") &&
    normalizedSql.includes("matches_played =")
  ) {
    const avatar = params[0];
    const rank = params[1];
    const level = parseInt(params[2]);
    const xp = parseInt(params[3]);
    const bio = params[4];
    const win_rate = parseInt(params[5]);
    const hours = parseInt(params[6]);
    const matches = parseInt(params[7]);
    const id = parseInt(params[8]);
    const userIndex = mockDb.users.findIndex((u) => u.id === id);
    if (userIndex !== -1) {
      mockDb.users[userIndex].avatar_url = avatar;
      mockDb.users[userIndex].rank_name = rank;
      mockDb.users[userIndex].level = level;
      mockDb.users[userIndex].xp = xp;
      mockDb.users[userIndex].bio = bio;
      mockDb.users[userIndex].win_rate = win_rate;
      mockDb.users[userIndex].total_hours = hours;
      mockDb.users[userIndex].matches_played = matches;
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }
  // 7. SELECT * FROM games
  if (normalizedSql === "select * from games") {
    return mockDb.games;
  }
  // 8. SELECT * FROM games WHERE id = ?
  if (normalizedSql.startsWith("select * from games where id =")) {
    const id = parseInt(params[0]);
    const game = mockDb.games.find((g) => g.id === id);
    return game ? [game] : [];
  }
  // 9. SELECT * FROM tournaments
  if (normalizedSql === "select * from tournaments") {
    return mockDb.tournaments;
  }
  // 10. SELECT * FROM tournaments WHERE id = ?
  if (normalizedSql.startsWith("select * from tournaments where id =")) {
    const id = parseInt(params[0]);
    const tourney = mockDb.tournaments.find((t) => t.id === id);
    return tourney ? [tourney] : [];
  }
  // 11. SELECT * FROM matches WHERE tournament_id = ?
  if (normalizedSql.startsWith("select * from matches where tournament_id =")) {
    const tid = parseInt(params[0]);
    return mockDb.matches.filter((m) => m.tournament_id === tid);
  }
  // 12. SELECT * FROM registrations WHERE user_id = ? AND tournament_id = ?
  if (
    normalizedSql.startsWith("select * from registrations where user_id =") &&
    normalizedSql.includes("tournament_id =")
  ) {
    const uid = parseInt(params[0]);
    const tid = parseInt(params[1]);
    const reg = mockDb.registrations.find(
      (r) => r.user_id === uid && r.tournament_id === tid,
    );
    return reg ? [reg] : [];
  }
  // 13. SELECT * FROM registrations WHERE user_id = ?
  if (normalizedSql.startsWith("select * from registrations where user_id =")) {
    const uid = parseInt(params[0]);
    // Join with tournaments for profile view
    const regs = mockDb.registrations.filter((r) => r.user_id === uid);
    return regs.map((r) => {
      const tourney = mockDb.tournaments.find((t) => t.id === r.tournament_id);
      return {
        ...r,
        title: tourney ? tourney.title : "",
        subtitle: tourney ? tourney.subtitle : "",
        prize_pool: tourney ? tourney.prize_pool : "",
        status: tourney ? tourney.status : "",
        start_date: tourney ? tourney.start_date : "",
        image_url: tourney ? tourney.image_url : "",
      };
    });
  }
  // 14. INSERT INTO registrations
  if (normalizedSql.startsWith("insert into registrations")) {
    const uid = parseInt(params[0]);
    const tid = parseInt(params[1]);
    const team = params[2];
    const newReg = {
      id: nextIds.registrations++,
      user_id: uid,
      tournament_id: tid,
      team_name: team,
      registration_date: new Date(),
    };
    mockDb.registrations.push(newReg);
    return { insertId: newReg.id };
  }
  // 15. INSERT INTO orders
  if (normalizedSql.startsWith("insert into orders")) {
    const uid = parseInt(params[0]);
    const total = parseFloat(params[1]);
    const newOrder = {
      id: nextIds.orders++,
      user_id: uid,
      total_amount: total,
      order_date: new Date(),
      payment_status: "completed",
    };
    mockDb.orders.push(newOrder);
    return { insertId: newOrder.id };
  }
  // 16. INSERT INTO order_items
  if (normalizedSql.startsWith("insert into order_items")) {
    const oid = parseInt(params[0]);
    const gid = parseInt(params[1]);
    const price = parseFloat(params[2]);
    const newItem = {
      id: nextIds.order_items++,
      order_id: oid,
      game_id: gid,
      price: price,
    };
    mockDb.order_items.push(newItem);
    return { insertId: newItem.id };
  }
  // 17. GET order items for a user (Owned Library)
  if (
    normalizedSql.includes("join order_items") &&
    normalizedSql.includes("where o.user_id =")
  ) {
    const uid = parseInt(params[0]);
    const userOrders = mockDb.orders.filter((o) => o.user_id === uid);
    const items = [];
    userOrders.forEach((o) => {
      const oItems = mockDb.order_items.filter((oi) => oi.order_id === o.id);
      oItems.forEach((oi) => {
        const game = mockDb.games.find((g) => g.id === oi.game_id);
        if (game) {
          items.push({
            id: o.id,
            user_id: uid,
            total_amount: o.total_amount,
            order_date: o.order_date,
            payment_status: o.payment_status,
            game_id: oi.game_id,
            price: oi.price,
            title: game.title,
            image_url: game.image_url,
            genre: game.genre,
            cover_banner: game.cover_banner,
          });
        }
      });
    });
    return items;
  }
  console.warn("⚠️ MOCK DB UNHANDLED SQL QUERY:", sqlText, "params:", params);
  return [];
};
module.exports = {
  initDbPool,
  query,
};
