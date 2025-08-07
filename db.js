const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createBlogsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        excerpt TEXT,
        content TEXT,
        author VARCHAR(255),
        category VARCHAR(255),
        status VARCHAR(50),
        publish_date DATE,
        read_time VARCHAR(50),
        views INT DEFAULT 0,
        tags TEXT[],
        content_blocks JSONB
      );
    `);
    console.log("✅ 'blogs' table checked/created successfully");
  } catch (err) {
    console.error("❌ Error creating 'blogs' table:", err.message);
  }
};

module.exports = { pool, createBlogsTable };