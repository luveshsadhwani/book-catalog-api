const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const apiRouter = require("./routes/api");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

const app = express();

const PORT = process.env.PORT || 3000;

// Add middleware - cors, morgan, body-parser
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

// configure passport strategy to use google auth 2.0
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        (accessToken, refreshToken, profile, cb) => {
            return cb(null, profile);
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

// Deserialize the user from the session
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

app.use(
    session({
        secret: "secret",
        resave: false, // generally keep this to false
        saveUninitialized: true,
    })
);

// session management - once oauth verification is complete, we now need to store session data
app.use(passport.initialize());
app.use(passport.session());

// Mount router
app.use("/api", apiRouter);

app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect("/");
    }
);

app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`Hello, ${req.user.displayName}!`);
    } else {
        res.send("Please log in.");
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
