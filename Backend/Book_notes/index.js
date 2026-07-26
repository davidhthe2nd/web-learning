import express from "express";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

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




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
