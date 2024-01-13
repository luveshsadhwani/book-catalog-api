const express = require("express");
const apiRouter = express.Router();
const { books, getBooks, addBook, updateBook, deleteBook } = require("./db");

apiRouter.param("id", (req, res, next, id) => {
    const bookId = Number(id);
    if (isNaN(id)) {
        res.status(400).send(`ID must be a number!`);
    } else {
        req.bookId = bookId;
        next();
    }
});

apiRouter.get("/books", (req, res) => {
    try {
        const books = getBooks();
        if (!books) {
            throw new Error();
        }
        res.send(books);
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send("Oops! Something went wrong");
        }
    }
});

apiRouter.get("/book/:id", (req, res) => {
    try {
        const id = req.bookId;
        const book = books.find((book) => book.id === id);
        if (!book) {
            const e = new Error(`Book with id ${id} not found`);
            e.status = 404;
            throw e;
        }
        res.send(book);
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send("Oops! Something went wrong");
        }
    }
});

apiRouter.post("/books", (req, res) => {
    try {
        const body = req.body;
        const newBook = addBook(body);
        if (!newBook) {
            throw new Error("Book could not be added");
        }
        res.status(201).send(newBook);
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send("Oops! Something went wrong");
        }
    }
});

apiRouter.put("/book/:id", (req, res) => {
    try {
        const body = req.body;
        body.id = req.bookId;

        const updatedBook = updateBook(body);
        if (!updatedBook) {
            throw new Error("Book could not be updated");
        }
        res.status(201).send(updatedBook);
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send("Oops! Something went wrong");
        }
    }
});

apiRouter.delete("/book/:id", (req, res) => {
    try {
        const books = deleteBook(req.bookId);
        if (!books) {
            throw new Error("Book could not be deleted");
        }
        res.status(204).send();
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send("Oops! Something went wrong");
        }
    }
});

module.exports = apiRouter;
