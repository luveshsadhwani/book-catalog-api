const { pool } = require("../db/index");

// Books
const getBooks = async () => {
    const result = await pool.query("SELECT * FROM books");
    return result.rows;
};

const getBookById = async (id) => {
    const result = await pool.query("SELECT * FROM books WHERE isbn = $1", [
        id,
    ]);
    return result.rows[0];
};

const addBook = async ({
    title,
    isbn,
    author,
    genre,
    number_of_pages,
    publication_year,
}) => {
    const result = await pool.query(
        "INSERT INTO books (title, isbn, author, genre, number_of_pages, publication_year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [title, isbn, author, genre, number_of_pages, publication_year]
    );
    return result.rows[0].isbn;
};

const updateBook = async ({
    title,
    isbn,
    author,
    genre,
    number_of_pages,
    publication_year,
}) => {
    const result = await pool.query(
        "UPDATE books SET title = $1, author = $2, genre = $3, number_of_pages = $4, publication_year = $5 WHERE isbn = $6 RETURNING *",
        [title, author, genre, number_of_pages, publication_year, isbn]
    );
    return result.rows[0].isbn;
};

const deleteBook = async (id) => {
    await pool.query("DELETE FROM books WHERE isbn = $1", [id]);
    return id;
};

const BOOKS_MOCK = [
    {
        title: "Hello",
        isbn: "123456789",
        genre: "Thriller",
        number_of_pages: 300,
        publication_year: 2020,
    },
    {
        title: "World",
        isbn: "123456788",
        genre: "Action",
        number_of_pages: 250,
        publication_year: 2010,
    },
];

const getBooksFromMock = () => {
    return BOOKS_MOCK;
};

const getBookByIdFromMock = (id) => {
    return BOOKS_MOCK.find((book) => book.isbn === id) || undefined;
};

const addBookToMock = ({
    title,
    isbn,
    author,
    genre,
    number_of_pages,
    publication_year,
}) => {
    BOOKS_MOCK.push({
        title,
        isbn,
        author,
        genre,
        number_of_pages,
        publication_year,
    });
    return isbn;
};

const updateBookFromMock = ({
    title,
    isbn,
    author,
    genre,
    number_of_pages,
    publication_year,
}) => {
    const index = BOOKS_MOCK.findIndex((book) => book.isbn === isbn);
    BOOKS_MOCK[index] = {
        title,
        isbn,
        author,
        genre,
        number_of_pages,
        publication_year,
    };
    return isbn;
};

const deleteBookFromMock = (id) => {
    const index = BOOKS_MOCK.findIndex((book) => book.isbn === id);
    BOOKS_MOCK.splice(index, 1);
    return id;
};

module.exports = {
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    getBooksFromMock,
    getBookByIdFromMock,
    addBookToMock,
    updateBookFromMock,
    deleteBookFromMock,
};
