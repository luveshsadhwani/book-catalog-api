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

// Goals
const availableGoalStatus = {
    ONGOING: "ongoing",
    COMPLETED: "completed",
};
const GOALS_MOCK = [
    {
        id: 1,
        start_reading_date: new Date("2024-04-21"),
        completed_reading_date: null,
        book_isbn: "123456789",
        target_complete_date: new Date("2024-05-21"),
        status: availableGoalStatus.ONGOING,
        user_id: 1,
    },
    {
        id: 2,
        start_reading_date: new Date("2024-04-14"),
        completed_reading_date: new Date("2024-04-25"),
        book_isbn: "123456788",
        target_complete_date: new Date("2024-04-30"),
        status: availableGoalStatus.COMPLETED,
        user_id: 1,
    },
];

const getOngoingGoalsFromMock = (userId) => {
    const goals = GOALS_MOCK.filter((goal) => goal.user_id === userId).filter(
        (goal) => goal.status === availableGoalStatus.ONGOING
    );

    // mocking joins
    return goals.forEach((goal) => {
        const book = BOOKS_MOCK.find(
            (book) => book.isbn === goal.book_isbn
        ) || {
            title: "Default",
            isbn: "9999999999999",
            genre: "Genre",
            number_of_pages: 300,
            publication_year: 2020,
        };

        return {
            ...goal,
            ...book,
        };
    });
};

const getGoalByIdFromMock = (userId, goalId) => {
    return (
        GOALS_MOCK.find(
            (goal) => goal.id === goalId && goal.user_id === userId
        ) || undefined
    );
};

const getCompletedGoalsFromMock = (userId) => {
    const goals = GOALS_MOCK.filter((goal) => goal.user_id === userId).filter(
        (goal) => goal.status === availableGoalStatus.COMPLETED
    );

    // mocking joins
    return goals.forEach((goal) => {
        const book = BOOKS_MOCK.find(
            (book) => book.isbn === goal.book_isbn
        ) || {
            title: "Default",
            isbn: "9999999999999",
            genre: "Genre",
            number_of_pages: 300,
            publication_year: 2020,
        };

        return {
            ...goal,
            ...book,
        };
    });
};

const addGoalToMock = ({
    start_reading_date,
    book_isbn,
    target_complete_date,
    user_id,
}) => {
    GOALS_MOCK.push({
        id: GOALS_MOCK.length + 1,
        start_reading_date,
        completed_reading_date: null,
        book_isbn,
        target_complete_date,
        status: availableGoalStatus.ONGOING,
        user_id,
    });
    return book_isbn;
};

const completeGoalFromMock = (goalId, userId) => {
    const goalIndex = GOALS_MOCK.findIndex(
        (goal) => goal.id === goalId && goal.user_id === userId
    );
    GOALS_MOCK[goalIndex].status = availableGoalStatus.COMPLETED;
    return goalId;
};

const deleteGoalFromMock = (id) => {
    const index = GOALS_MOCK.findIndex((book) => book.isbn === id);
    GOALS_MOCK.splice(index, 1);
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
    getOngoingGoalsFromMock,
    getCompletedGoalsFromMock,
    getGoalByIdFromMock,
    addGoalToMock,
    completeGoalFromMock,
    deleteGoalFromMock,
};
