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
    getCompletedGoalsFromMock,
    getOngoingGoalsFromMock,
    addGoalToMock,
    deleteGoalFromMock,
    completeGoalFromMock,
    getGoalByIdFromMock,
} = require("../models/db");

// books
const Books = new BookData();
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
        const isbn = req.params.id;
        validateBookIsbn(isbn);
        const book = await Books._getBookById(isbn);
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
        validateBook(bookToUpdate);
        const newBookIsbn = await Books._addBook(bookToUpdate);
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
        const isbn = req.params.id;
        validateBookIsbn(isbn);
        const bookToUpdate = req.body;
        validateBook(bookToUpdate);
        const updatedBookId = await Books._updateBook(bookToUpdate);
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
        const isbn = req.params.id;
        validateBookIsbn(isbn);
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

// Goals
const Goals = new GoalData();
class GoalData {
    constructor(type = "mock") {
        this._getOngoingGoals = getOngoingGoalsFromMock;
        this._getCompletedGoals = getCompletedGoalsFromMock;
        this._getGoalById = getGoalByIdFromMock;
        this._addGoal = addGoalToMock;
        this._updateGoal = completeGoalFromMock;
        this._deleteGoal = deleteGoalFromMock;
    }
}

apiRouter.get("/goals/ongoing", async (req, res) => {
    try {
        const goals = await Goals._getOngoingGoals();
        res.status(200).json(goals);
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send("Oops! Something went wrong");
        }
    }
});

apiRouter.get("/goals/completed", async (req, res) => {
    try {
        const goals = await Goals._getCompletedGoals();
        res.status(200).json(goals);
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send("Oops! Something went wrong");
        }
    }
});

apiRouter.get("/goals/:id", async (req, res) => {
    try {
        const id = req.params.id;
        validateId(id);
        const goal = await Goals._getGoalById(id);
        if (!goal) {
            const e = new Error(`Book with id ${id} not found`);
            e.status = 404;
            throw e;
        }
        res.status(200).json(goal);
    } catch (err) {
        console.log(err); // this shows the entire error + stack trace
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send("Oops! Something went wrong");
        }
    }
});

apiRouter.post("/goals", async (req, res) => {
    try {
        const goalToAdd = req.body;
        validateGoalToAdd(goalToAdd);
        const newGoalId = await Goals._addGoal(goalToAdd);
        res.status(201).send(`Goal added with ID ${newGoalId}`);
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send("Oops! Something went wrong");
        }
    }
});

apiRouter.put("/goals/ongoing/:id", async (req, res) => {
    try {
        const goalId = req.params.id;
        validateId(goalId);
        const userId = req.body.userId;
        validateId(userId);
        const updatedGoalID = await Goals._updateGoal(goalId, userId);
        res.status(200).send(`Goal completed with ID ${updatedGoalID}`);
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send("Oops! Something went wrong");
        }
    }
});

apiRouter.delete("/goals/:id", async (req, res) => {
    try {
        const id = req.params.id;
        validateId(id);
        const deletedGoalId = await Goals._deleteGoal(id);
        res.status(200).send(`Goal deleted with ID ${deletedGoalId}`);
    } catch (err) {
        console.log(err);
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send("Oops! Something went wrong");
        }
    }
});

const validateBookIsbn = (isbn) => {
    if (isbn.length !== 13 || isbn.length !== 10) {
        const e = new Error("ISBN must be either 10 or 13 characters long!");
        e.status = 400;
        throw e;
    }
};

const validateId = (idStr) => {
    if (!isNaN(Number(idStr))) {
        const e = new Error("ID must be a number!");
        e.status = 400;
        throw e;
    }
};

const validateGoalToAdd = (goal) => {
    validateId(goal.id);
    validateBookIsbn(goal.book_isbn);
    if (!goal.start_reading_date || isDateValid(goal.start_reading_date)) {
        const e = new Error("Goal must have start date!");
        e.status = 400;
        throw e;
    }
    if (!goal.target_complete_date || isDateValid(goal.target_complete_date)) {
        const e = new Error("Goal must have target date!");
        e.status = 400;
        throw e;
    }
};

const validateBook = (book) => {
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
    validateBookIsbn(book.isbn);
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
};

function isDateValid(dateStr) {
    return !isNaN(new Date(dateStr));
}

module.exports = apiRouter;
