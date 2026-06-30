const express = require('express');
const app = express();

//In-memory data store for posts
let posts = [];
let nextId = 1;

// ── Middleware ────────────────────────────────────
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//UC-4.1 · Method Override Setup
app.use((req, res, next) => {
  if (req.query._method) req.method = req.query._method.toUpperCase();
  next();
});
// ── Routes ────────────────────────────────────────
app.get('/', (req, res) => {
  const sorted = [...posts].reverse();
  res.render('index', { posts: sorted });
});
app.get('/new', (req, res) => res.render('new-post'));

//UC-4.2 · Edit Post Form (GET /posts/:id/edit)
app.get('/posts/:id/edit', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).send('Post not found');
  res.render('edit-post', { post });
});

app.post('/posts', (req, res) => {
  const { title, content, author } = req.body;
  posts.push({ id: nextId++, title, content, author, createdAt: new Date() });
  res.redirect('/');
});

//Update Post (PUT /posts/:id)
app.put('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).send('Post not found');
  post.title   = req.body.title;
  post.content = req.body.content;
  post.author  = req.body.author;
  res.redirect('/');
});

//UC-4.4 · Delete Post (DELETE /posts/:id)
app.delete('/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  posts = posts.filter(p => p.id !== id);
  res.redirect('/');
});
// ── Start server ──────────────────────────────────
app.listen(3000, () => console.log('Server running on port 3000'));


// Post object shape:
// {
//   id:        Number   — unique auto-increment
//   title:     String   — post headline
//   content:   String   — body text
//   author:    String   — optional display name
//   createdAt: Date     — set at creation time
// }