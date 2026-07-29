CREATE TABLE books(
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	author TEXT,
	first_publish_year INTEGER,
	cover_url TEXT,
	rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
	date_read DATE NOT NULL,
	notes TEXT,
	created_at TIMESTAMP DEFAULT NOW()
);