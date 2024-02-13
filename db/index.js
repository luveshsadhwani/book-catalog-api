const Pool = require("pg").Pool;

const pool = new Pool({
    user: "luvesh",
    host: "localhost",
    database: "book_catalog",
    password: "",
    port: 5432,
});

module.exports = { pool };
