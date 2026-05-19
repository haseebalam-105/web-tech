require('dotenv').config();                          // ADDED — load .env first

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").MongoStore;    // named import — required for v5/v6
const flash = require("connect-flash");

const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/api/index"); // ADDED — JWT API layer
const salesRoutes = require("./routes/salesRoutes"); // ADDED — Sales Dashboard

const app = express();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/assignment3";

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());                             // ADDED — parse JSON bodies for API

// Session — stored persistently in MongoDB
app.use(session({
    secret: process.env.SESSION_SECRET || "assignment4_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        collectionName: "sessions",
        ttl: 60 * 60 * 4,
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 4 },
}));

// Flash messages
app.use(flash());

// Global locals — available in every EJS view automatically
app.use((req, res, next) => {
    res.locals.currentUser = req.session.userId ? {
        id: req.session.userId,
        name: req.session.userName,
        role: req.session.userRole,
    } : null;
    res.locals.isAdmin = req.session.userRole === "admin";
    res.locals.flashSuccess = req.flash("success");
    res.locals.flashError = req.flash("error");
    next();
});

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// ── ROUTES ──────────────────────────────────────────────
// API routes (JWT) — completely separate from EJS session routes
app.use("/api/v1", apiRoutes);                       // ADDED

// EJS session routes — untouched
app.use("/", authRoutes);
app.use("/", productRoutes);
app.use("/admin", adminRoutes);
app.use("/sales", salesRoutes);                      // ADDED — Sales Dashboard

// Root redirect
app.get("/", (req, res) => {
    res.redirect("/products");
});
// ────────────────────────────────────────────────────────

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
