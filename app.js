// // import express from "express";
// // import path from "path";
// // import { createServer } from 'http';
// // import { fileURLToPath } from "url";
// // import db from './db/sql_database.js';
// // // db();

// // const port = process.env.PORT || 3000;
// // const app = express();
// // const server = createServer(app);

// // // Fix __dirname for ES modules
// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // // Set EJS
// // app.set('view engine', 'ejs');
// // app.set('views', path.join(__dirname, 'views'));

// // // Serve static files
// // app.use(express.static(path.join(__dirname, 'public')));

// // // Routes
// // app.get('/', (req, res) => {
// //     db.query('SELECT * FROM demo_db', (err, results) => {
// //         if (err) {
// //             return res.status(500).send('Database query failed');
// //         }
// //         res.render('home', { title: 'My Portfolio', data: results });
// //     });
// // });

// // server.listen(port, () => {
// //     console.log(`Server running at http://localhost:${port}`);
// // });


// require("dotenv").config();
// const express = require("express");
// const { Sequelize, DataTypes } = require("sequelize");

// const app = express();
// const port = process.env.PORT || 3000;
// app.use(express.json());

// const sequelize = new Sequelize(process.env.DB_URL, {
//   dialect: "postgres",
//   logging: false,
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// });

// sequelize
//   .sync()
//   .then(() => {
//     console.log("Database connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// //   model schema
// const post = sequelize.define("post", {
//   title: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   content: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.post("/create-post", async (req, res) => {
//   const { title, content } = req.body;
//   try {
//     const newPost = await post.create({ title, content });
//     res.json(newPost);
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.get("/get-posts", async (req, res) => {
//   try {
//     const allPosts = await post.findAll();
//     res.json(allPosts);
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });


import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5432;

// Middleware to parse JSON requests
app.use(express.json());

// Initialize Sequelize with PostgreSQL connection
const sequelize = new Sequelize('postgresql://root:RKOCz9fe3OmmCk6GeVdFkOBhLpSX9meH@dpg-cucvqo1opnds73amuj90-a.oregon-postgres.render.com/example_iyq5', {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Define the Post model
const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Synchronize the model with the database
sequelize
  .sync()
  .then(() => {
    console.log('Database connected and Post model synchronized');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

// Routes

// Create a new post
app.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  try {
    const newPost = await Post.create({ title, content });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Retrieve all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.findAll();
    console.log(posts);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Retrieve a single post by ID
app.get('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Update a post by ID
app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const post = await Post.findByPk(id);
    if (post) {
      post.title = title;
      post.content = content;
      await post.save();
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete a post by ID
app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (post) {
      await post.destroy();
      res.json({ message: 'Post deleted' });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
