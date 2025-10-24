CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    avatar_url TEXT,
    balance INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS user_id_seq START WITH 10000;

CREATE TABLE IF NOT EXISTS user_inventory (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    item_id VARCHAR(100) NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    item_rarity VARCHAR(20) NOT NULL,
    item_emoji VARCHAR(10) NOT NULL,
    item_price INTEGER NOT NULL,
    obtained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_inventory_user_id ON user_inventory(user_id);