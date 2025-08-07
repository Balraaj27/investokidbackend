const express = require('express');
const blogRouter = express.Router();
const pool = require('../db'); // Your PostgreSQL pool

// Get all blogs
blogRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs ORDER BY publish_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).send('Server error');
  }
});

module.exports = {blogRouter};