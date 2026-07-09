-- Playrunners Database Schema
CREATE DATABASE IF NOT EXISTS playrunners;
USE playrunners;
-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255) DEFAULT NULL,
  rank_name VARCHAR(50) DEFAULT 'Rookie',
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  bio TEXT DEFAULT NULL,
  win_rate INT DEFAULT 0,
  total_hours INT DEFAULT 0,
  matches_played INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Games Table
CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  tagline VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  genre VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  cover_banner VARCHAR(255) NOT NULL,
  rating DECIMAL(3, 1) DEFAULT 0.0,
  release_date VARCHAR(50) DEFAULT NULL,
  publisher VARCHAR(100) DEFAULT NULL,
  developer VARCHAR(100) DEFAULT NULL,
  sys_req_min TEXT NOT NULL,
  sys_req_rec TEXT NOT NULL
);
-- Tournaments Table
CREATE TABLE IF NOT EXISTS tournaments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  subtitle VARCHAR(255) NOT NULL,
  prize_pool VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'upcoming', -- upcoming, ongoing, completed
  start_date VARCHAR(50) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  rulebook TEXT DEFAULT NULL
);
-- Matches Table
CREATE TABLE IF NOT EXISTS matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tournament_id INT NOT NULL,
  team_a VARCHAR(100) NOT NULL,
  team_b VARCHAR(100) NOT NULL,
  team_a_score INT DEFAULT 0,
  team_b_score INT DEFAULT 0,
  team_a_logo VARCHAR(255) DEFAULT NULL,
  team_b_logo VARCHAR(255) DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'upcoming', -- live, upcoming, completed
  match_time VARCHAR(50) NOT NULL,
  round_name VARCHAR(50) NOT NULL,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE
);
-- Tournament Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tournament_id INT NOT NULL,
  team_name VARCHAR(100) NOT NULL,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_tournament (user_id, tournament_id)
);
-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_status VARCHAR(20) DEFAULT 'completed',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  game_id INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);