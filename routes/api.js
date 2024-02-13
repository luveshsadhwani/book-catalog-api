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

apiRouter.put("/book/:id", async (req, res) => {
    try {
        const body = req.body;
        body.id = req.bookId;
        const updatedBookId = await updateBook(body);
        res.status(200).send(`Book modified with ISBN ${updatedBookId}`);
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
        const deletedBookId = await deleteBook(req.bookId);
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

module.exports = apiRouter;
