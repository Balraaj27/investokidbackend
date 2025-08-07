const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { createTables, createBlogsTable } = require('./db');
const { blogRouter } = require('./Routes/blogRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Call table creation function
createBlogsTable()

app.get('/', (req, res) => {
  res.send('Hello from PG backend 🚀');
});
app.use('/api/blogs', blogRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});