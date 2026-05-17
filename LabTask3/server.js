const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");    // named import — required for v5/v6
const flash = require("connect-flash");

const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const MONGO_URI = "mongodb://127.0.0.1:27017/assignment3";

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Session — stored persistently in MongoDB
app.use(session({
    secret: process.env.SESSION_SECRET || "assignment4_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        collectionName: "sessions",
        ttl: 60 * 60 * 4,   // 4 hours
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
    res.locals.flashSuccess = req.flash("success");   // consumed once here
    res.locals.flashError = req.flash("error");     // consumed once here
    next();
});

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Routes — auth FIRST, then existing routes
app.use("/", authRoutes);
app.use("/", productRoutes);
app.use("/admin", adminRoutes);

// Root redirect
app.get("/", (req, res) => {
    res.redirect("/products");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});