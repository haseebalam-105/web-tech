const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Setup Session for Admin Auth
app.use(session({
    secret: "assignment4_secret",
    resave: false,
    saveUninitialized: false
}));

// Database Connection
mongoose.connect("mongodb://127.0.0.1:27017/assignment3")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.use("/", productRoutes);
app.use("/admin", adminRoutes);

// Redirect / to /products
app.get("/", (req, res) => {
    res.redirect("/products");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});