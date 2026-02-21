const request = require("supertest");
const app = require("../server");

// ISBNs that exist in the mock data
const EXISTING_ISBN_1 = "9780000000001"; // "Hello"
const EXISTING_ISBN_2 = "9780000000002"; // "World"
// A valid ISBN that does not exist in the mock data
const NONEXISTENT_ISBN = "9780000000099";
// A new book for POST / PUT tests
const NEW_ISBN = "9780000000003";

const validBook = {
    title: "New Book",
    isbn: NEW_ISBN,
    author: "Test Author",
    genre: "Fiction",
    number_of_pages: 200,
    publication_year: 2022,
};

describe("GET /api/books", () => {
    it("returns 200 with an array", async () => {
        const res = await request(app).get("/api/books");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("returns books with expected fields", async () => {
        const res = await request(app).get("/api/books");
        expect(res.status).toBe(200);
        const book = res.body[0];
        expect(book).toHaveProperty("title");
        expect(book).toHaveProperty("isbn");
        expect(book).toHaveProperty("author");
        expect(book).toHaveProperty("genre");
        expect(book).toHaveProperty("number_of_pages");
        expect(book).toHaveProperty("publication_year");
    });

    it("returns at least the two seeded books", async () => {
        const res = await request(app).get("/api/books");
        expect(res.body.length).toBeGreaterThanOrEqual(2);
    });
});

describe("GET /api/books/:id", () => {
    it("returns 200 with the correct book when found", async () => {
        const res = await request(app).get(`/api/books/${EXISTING_ISBN_1}`);
        expect(res.status).toBe(200);
        expect(res.body.isbn).toBe(EXISTING_ISBN_1);
        expect(res.body.title).toBe("Hello");
    });

    it("returns 200 with a different book by its ISBN", async () => {
        const res = await request(app).get(`/api/books/${EXISTING_ISBN_2}`);
        expect(res.status).toBe(200);
        expect(res.body.isbn).toBe(EXISTING_ISBN_2);
    });

    it("returns 404 when the ISBN is valid but no book exists for it", async () => {
        const res = await request(app).get(`/api/books/${NONEXISTENT_ISBN}`);
        expect(res.status).toBe(404);
    });

    it("returns 400 when the ISBN is too short", async () => {
        const res = await request(app).get("/api/books/123");
        expect(res.status).toBe(400);
    });

    it("returns 400 when the ISBN is not 10 or 13 characters", async () => {
        const res = await request(app).get("/api/books/12345678901"); // 11 chars
        expect(res.status).toBe(400);
    });
});

describe("POST /api/books", () => {
    it("returns 201 and confirms the ISBN when a valid book is added", async () => {
        const res = await request(app).post("/api/books").send(validBook);
        expect(res.status).toBe(201);
        expect(res.text).toContain(NEW_ISBN);
    });

    it("returns 400 when title is missing", async () => {
        const { title, ...body } = validBook;
        const res = await request(app).post("/api/books").send(body);
        expect(res.status).toBe(400);
    });

    it("returns 400 when author is missing", async () => {
        const { author, ...body } = validBook;
        const res = await request(app).post("/api/books").send(body);
        expect(res.status).toBe(400);
    });

    it("returns 400 when genre is missing", async () => {
        const { genre, ...body } = validBook;
        const res = await request(app).post("/api/books").send(body);
        expect(res.status).toBe(400);
    });

    it("returns 400 when number_of_pages is missing", async () => {
        const { number_of_pages, ...body } = validBook;
        const res = await request(app).post("/api/books").send(body);
        expect(res.status).toBe(400);
    });

    it("returns 400 when publication_year is missing", async () => {
        const { publication_year, ...body } = validBook;
        const res = await request(app).post("/api/books").send(body);
        expect(res.status).toBe(400);
    });

    it("returns 400 when ISBN is not 10 or 13 characters", async () => {
        const res = await request(app)
            .post("/api/books")
            .send({ ...validBook, isbn: "123" });
        expect(res.status).toBe(400);
    });

    it("returns 400 when isbn is missing", async () => {
        const { isbn, ...body } = validBook;
        const res = await request(app).post("/api/books").send(body);
        expect(res.status).toBe(400);
    });
});

describe("PUT /api/book/:id", () => {
    const updatedBook = {
        title: "Hello Updated",
        isbn: EXISTING_ISBN_1,
        author: "Author A Updated",
        genre: "Mystery",
        number_of_pages: 320,
        publication_year: 2021,
    };

    it("returns 200 and confirms the ISBN when a book is updated", async () => {
        const res = await request(app)
            .put(`/api/book/${EXISTING_ISBN_1}`)
            .send(updatedBook);
        expect(res.status).toBe(200);
        expect(res.text).toContain(EXISTING_ISBN_1);
    });

    it("reflects the update when fetched afterwards", async () => {
        const res = await request(app).get(`/api/books/${EXISTING_ISBN_1}`);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe("Hello Updated");
        expect(res.body.genre).toBe("Mystery");
    });

    it("returns 400 when the path ISBN is invalid", async () => {
        const res = await request(app)
            .put("/api/book/bad-isbn")
            .send(updatedBook);
        expect(res.status).toBe(400);
    });

    it("returns 400 when a required body field is missing", async () => {
        const { title, ...body } = updatedBook;
        const res = await request(app)
            .put(`/api/book/${EXISTING_ISBN_1}`)
            .send(body);
        expect(res.status).toBe(400);
    });
});

describe("DELETE /api/book/:id", () => {
    it("returns 200 and confirms the ISBN when a book is deleted", async () => {
        const res = await request(app).delete(`/api/book/${EXISTING_ISBN_2}`);
        expect(res.status).toBe(200);
        expect(res.text).toContain(EXISTING_ISBN_2);
    });

    it("book is no longer returned after deletion", async () => {
        const res = await request(app).get(`/api/books/${EXISTING_ISBN_2}`);
        expect(res.status).toBe(404);
    });

    it("returns 400 when the ISBN is invalid", async () => {
        const res = await request(app).delete("/api/book/bad-isbn");
        expect(res.status).toBe(400);
    });
});
