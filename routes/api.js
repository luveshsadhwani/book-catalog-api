const express = require("express");
const apiRouter = express.Router();
const {
    getBooks,
    addBook,
    updateBook,
    deleteBook,
    isValidId,
    getBookById,
} = require("../models/db");

apiRouter.param("id", (req, res, next, id) => {
    if (!isValidId(id)) {
        res.status(400).send(`Please pass valid book ISBN!`);
    } else {
        req.bookId = id;
        next();
    }
});

apiRouter.get("/books", async (req, res) => {
    try {
        const books = await getBooks();
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
        const id = req.bookId;
        const book = await getBookById(id);
        if (!book) {
            const e = new Error(`Book with id ${id} not found`);
            e.status = 404;
            throw e;
        }
        res.status(200).json(book);
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send("Oops! Something went wrong");
        }
    }
});

apiRouter.post("/books", async (req, res) => {
    try {
        const body = req.body;
        const newBookIsbn = await addBook(body);
        res.status(201).send(`Book added with ISBN ${newBookIsbn}`);
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
