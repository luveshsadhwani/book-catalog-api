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
    if (!book.status || !bookStatus.includes(book.status)) {
        const e = new Error(
            "Book status must be either to read, reading or read!"
        );
        e.status = 400;
        throw e;
    }
    return true;
};

const getBooks = () => books;

const addBook = (book) => {
    if (isValidBook(book)) {
        lastId++;
        const bookToAdd = {
            id: lastId,
            ...book,
        };
        books.push(bookToAdd);
        return bookToAdd;
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
};
