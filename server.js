const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");

const app = express();

// Add middleware - cors, morgan, body-parser
app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.json());

// Mount router
app.use("/api", apiRouter);

app.get("/", (req, res) => {
    console.log("Hello!");
    res.send();
});

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}
