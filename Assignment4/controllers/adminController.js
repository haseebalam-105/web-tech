const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

exports.getLogin = (req, res) => {
    res.render("admin/login", { error: null });
};

exports.postLogin = (req, res) => {
    const { password } = req.body;
    if (password === "admin123") {
        req.session.isAdmin = true;
        res.redirect("/admin");
    } else {
        res.render("admin/login", { error: "Invalid password" });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect("/admin/login");
};

exports.getDashboard = async (req, res) => {
    try {
        const products = await Product.find().sort({ _id: -1 });
        res.render("admin/dashboard", { products });
    } catch (error) {
        res.status(500).send("Error loading dashboard");
    }
};

//Open the forms for teh admin to add a new product or edit an existing product.

exports.getNewProduct = (req, res) => {
    res.render("admin/new", { error: null });
};


exports.postNewProduct = async (req, res) => {
    try {
        const { name, price, category, rating, stock } = req.body;
        
        if (!name || !price || !category || !rating || !stock) {
            return res.render("admin/new", { error: "All fields are required" });
        }

        const newProduct = new Product({
            name,
            price,
            category,
            rating,
            stock,
            image: req.file ? "/uploads/" + req.file.filename : ""
        });

        await newProduct.save();
        res.redirect("/admin");
    } catch (error) {
        res.render("admin/new", { error: "Failed to create product" });
    }
};

exports.getEditProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send("Product not found");
        res.render("admin/edit", { product, error: null });
    } catch (error) {
        res.status(500).send("Invalid Product ID");
    }
};

exports.postEditProduct = async (req, res) => {
    try {
        const { name, price, category, rating, stock } = req.body;
        
        if (!name || !price || !category || !rating || !stock) {
            const product = await Product.findById(req.params.id);
            return res.render("admin/edit", { product, error: "All fields are required" });
        }

        const updateData = { name, price, category, rating, stock };
        
        if (req.file) {
            updateData.image = "/uploads/" + req.file.filename;
        }

        await Product.findByIdAndUpdate(req.params.id, updateData);
        res.redirect("/admin");
    } catch (error) {
        res.status(500).send("Failed to update product");
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect("/admin");
    } catch (error) {
        res.status(500).send("Failed to delete product");
    }
};
