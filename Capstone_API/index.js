import express from 'express';
import axios from 'axios';

const app = express();
const PORT = 3000;
const URL = 'https://api.animechan.io/v1';

app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(URL + '/quotes/random');
        const { content, character, anime } = response.data.data;
        res.render("index.ejs", { quote: content,
            character: character.name,
            anime: anime.name
         });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});