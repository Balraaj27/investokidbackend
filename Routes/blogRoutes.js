const express = require('express');
const blogRouter = express.Router();
const {pool}=require("../db")

// 🔍 GET all blogs
blogRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs ORDER BY publish_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).send('Server error');
  }
});

// 🔍 GET a single blog by ID
blogRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Blog not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching blog:', err);
    res.status(500).send('Server error');
  }
});

// ➕ CREATE a blog
blogRouter.post('/', async (req, res) => {
  const {
    title,
    excerpt,
    content,
    author,
    category,
    status,
    publishDate,
    readTime,
    views,
    tags,
    contentBlocks
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO blogs (
        title, excerpt, content, author, category, status,
        publish_date, read_time, views, tags, content_blocks
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11
      ) RETURNING *`,
      [
        title,
        excerpt,
        content,
        author,
        category,
        status,
        publishDate,
        readTime,
        views || 0,
        tags,
        JSON.stringify(contentBlocks)
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).send('Server error');
  }
});

// ✏️ UPDATE a blog by ID
blogRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    title,
    excerpt,
    content,
    author,
    category,
    status,
    publishDate,
    readTime,
    views,
    tags,
    contentBlocks
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE blogs SET
        title = $1,
        excerpt = $2,
        content = $3,
        author = $4,
        category = $5,
        status = $6,
        publish_date = $7,
        read_time = $8,
        views = $9,
        tags = $10,
        content_blocks = $11
      WHERE id = $12 RETURNING *`,
      [
        title,
        excerpt,
        content,
        author,
        category,
        status,
        publishDate,
        readTime,
        views,
        tags,
        JSON.stringify(contentBlocks),
        id
      ]
    );
    if (result.rows.length === 0) return res.status(404).send('Blog not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).send('Server error');
  }
});

// ❌ DELETE a blog
blogRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('Blog not found');
    res.send('Blog deleted successfully');
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).send('Server error');
  }
});

module.exports = { blogRouter };