import express from "express";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: "Romibest.135",
  port: 5432,
});
db.connect();


//Display books (first version, as simple list)
app.get('/', async (req, res) => {
   try {
    const result = await db.query("SELECT * FROM books ORDER BY id ASC");
    const books = result.rows;
    res.render('index', { books });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong loading your books.");
  }
});

app.get('/books/new', (req, res) => {
  res.render('partials/new');
});

app.get('/books/search', async (req, res) => {
  const query = req.query.q;

  // Guard against an empty/missing search — avoid calling the API with nothing
  if (!query) {
    return res.redirect('/books/new');
  }

  try {
    const response = await axios.get('https://openlibrary.org/search.json', {
      params: {
        q: query,
        fields: 'title,author_name,first_publish_year,cover_i',
        limit: 10
      }
    });

    // Map raw API results into a clean shape for the view,
    // building the cover URL here so the EJS file stays simple
    const results = response.data.docs.map((book) => ({
      title: book.title,
      author: book.author_name ? book.author_name[0] : 'Unknown author',
      year: book.first_publish_year || 'Unknown year',
      coverUrl: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null
    }));

    res.render('partials/search-results', { results, query });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong searching for books.");
  }
});

app.post('/books', async (req, res) => {
  const { title, author, first_publish_year, cover_url, rating, date_read, notes } = req.body;

  try {
    await db.query(
      `INSERT INTO books (title, author, first_publish_year, cover_url, rating, date_read, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [title, author, first_publish_year, cover_url, rating, date_read, notes]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong adding the book.");
  }
});

app.get('/books/:id/edit', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).send("Book not found.");
    }

    const book = result.rows[0];
    res.render('partials/edit', { book });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong loading this book.");
  }
});

app.post('/books/:id', async (req, res) => {
  const { id } = req.params;
  const { rating, date_read, notes } = req.body;

  try {
    await db.query(
      `UPDATE books
       SET rating = $1, date_read = $2, notes = $3
       WHERE id = $4`,
      [rating, date_read, notes, id]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong updating the book.");
  }
});

app.post('/books/:id/delete', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM books WHERE id = $1", [id]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong deleting the book.");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
