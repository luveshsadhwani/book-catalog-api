const express = require("express");
const apiRouter = express.Router();
const {
    getBooks,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
    getBooksFromMock,
    getBookByIdFromMock,
    addBookToMock,
    updateBookFromMock,
    deleteBookFromMock,
} = require("../models/db");

const Books = new BookData();

apiRouter.param("id", (req, res, next, id) => {
    if (!isValidId(id)) {
        res.status(400).send(`Please pass valid book ISBN!`);
    } else {
        next();
    }
});

apiRouter.get("/books", async (req, res) => {
    try {
        const books = await Books._getBooks();
        res.status(200).json(books);
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send("Oops! Something went wrong");
        }
    }
});

apiRouter.get("/books/:id", async (req, res) => {
    try {
        const book = await Books._getBookById(req.params.id);
        if (!book) {
            const e = new Error(`Book with id ${id} not found`);
            e.status = 404;
            throw e;
        }
        res.status(200).json(book);
    } catch (err) {
        console.log(err); // this shows the entire error + stack trace
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send("Oops! Something went wrong");
        }
    }
});

apiRouter.post("/books", async (req, res) => {
    try {
        const bookToUpdate = req.body;
        if (isValidBook(bookToUpdate)) {
            const newBookIsbn = await Books._addBook(bookToUpdate);
            res.status(201).send(`Book added with ISBN ${newBookIsbn}`);
        }
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send("Oops! Something went wrong");
        }
    }
});

apiRouter.put("/book/:id", async (req, res) => {
    try {
        const bookToUpdate = req.body;
        if (isValidBook(bookToUpdate)) {
            const updatedBookId = await Books._updateBook(bookToUpdate);
            res.status(200).send(`Book modified with ISBN ${updatedBookId}`);
        }
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send("Oops! Something went wrong");
        }
    }
});

apiRouter.delete("/book/:id", async (req, res) => {
    try {
        const deletedBookId = await Books._deleteBook(req.params.id);
        res.status(200).send(`Book deleted with ISBN ${deletedBookId}`);
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send("Oops! Something went wrong");
        }
    }
});

const isValidBook = (book) => {
    if (!book.title || typeof book.title !== "string") {
        const e = new Error("Book must have title!");
        e.status = 400;
        throw e;
    }
    if (!book.isbn || typeof book.isbn !== "string") {
        const e = new Error("Book must have isbn!");
        e.status = 400;
        throw e;
    }
    if (book.isbn.length !== 10 && book.isbn.length !== 13) {
        const e = new Error("ISBN must be either 10 or 13 characters long!");
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

class BookData {
    constructor(type = "mock") {
        if (type === "mock") {
            this._getBooks = getBooksFromMock;
            this._getBookById = getBookByIdFromMock;
            this._addBook = addBookToMock;
            this._updateBook = updateBookFromMock;
            this._deleteBook = deleteBookFromMock;
        } else {
            this._getBooks = getBooks;
            this._getBookById = getBookById;
            this._addBook = addBook;
            this._updateBook = updateBook;
            this._deleteBook = deleteBook;
        }
    }
}

module.exports = apiRouter;
