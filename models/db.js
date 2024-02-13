const { pool } = require("../db/index");

const books = [
    {
        id: 1,
        title: "ABC",
        author: "Me",
        genre: "Thriller",
        status: "Reading",
    },
    {
        id: 2,
        title: "DEF",
        author: "You",
        genre: "Comedy",
        status: "Read",
    },
];

let lastId = 2;

const bookStatus = ["to read", "reading", "read"];

const isValidBook = (book) => {
    if (!book.title || typeof book.title !== "string") {
        const e = new Error("Book must have title!");
        e.status = 400;
        throw e;
    }
    if (!book.author || typeof book.author !== "string") {
        const e = new Error("Book must have author!");
        e.status = 400;
        throw e;
    }
    if (!book.genre || typeof book.genre !== "string") {
        const e = new Error("Book must have genre!");
        e.status = 400;
        throw e;
    }
    if (!book.number_of_pages || isNaN(Number(book.number_of_pages))) {
        const e = new Error("Number of pages must be a number!");
        e.status = 400;
        throw e;
    }
    if (!book.publication_year || isNaN(Number(book.publication_year))) {
        const e = new Error("Publication year must be a number!");
        e.status = 400;
        throw e;
    }
    if (!book.publication_year > new Date().getFullYear) {
        const e = new Error("Publication year cannot be in the future!");
        e.status = 400;
        throw e;
    }
    return true;
};

const isValidId = (id) => {
    return id.length <= 13;
};

const getBooks = async () => {
    const result = await pool.query("SELECT * FROM books");
    return result.rows;
};

const getBookById = async (id) => {
    if (!id) {
        throw new Error("Missing ID!");
    }
    const result = await pool.query("SELECT * FROM books WHERE isbn = $1", [
        id,
    ]);
    return result.rows;
};

const addBook = async (book) => {
    if (isValidBook(book)) {
        const {
            title,
            isbn,
            author,
            genre,
            number_of_pages,
            publication_year,
        } = book;
        const result = await pool.query(
            "INSERT INTO books (title, isbn, author, genre, number_of_pages, publication_year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [title, isbn, author, genre, number_of_pages, publication_year]
        );
        return result.rows[0].isbn;
    }
};

const updateBook = (bookToUpdate) => {
    const index = books.findIndex((book) => book.id === bookToUpdate.id);
    if (index === -1) {
        const e = new Error(`Book with id ${id} not found`);
        e.status = 404;
        throw e;
    }
    if (isValidBook(bookToUpdate)) {
        books[index] = bookToUpdate;
        return bookToUpdate;
    }
};

const deleteBook = (id) => {
    const index = books.findIndex((book) => book.id === id);
    if (index === -1) {
        const e = new Error(`Book with id ${id} not found`);
        e.status = 404;
        throw e;
    }
    books.splice(index, 1);
    return books;
};

module.exports = {
    books,
    getBooks,
    addBook,
    updateBook,
    deleteBook,
    isValidId,
    getBookById,
};
