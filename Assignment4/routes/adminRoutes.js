const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const multer = require("multer");
const path = require("path");

// Configure Multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Basic Authentication Middleware
const requireAuth = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        res.redirect("/admin/login");
    }
};

// Admin Auth Routes
router.get("/login", adminController.getLogin);
router.post("/login", adminController.postLogin);
router.get("/logout", adminController.logout);

// Admin Dashboard
router.get("/", requireAuth, adminController.getDashboard);

// CRUD Routes
router.get("/products/new", requireAuth, adminController.getNewProduct);
router.post("/products/new", requireAuth, upload.single("image"), adminController.postNewProduct);

router.get("/products/edit/:id", requireAuth, adminController.getEditProduct);
router.post("/products/edit/:id", requireAuth, upload.single("image"), adminController.postEditProduct);

router.post("/products/delete/:id", requireAuth, adminController.deleteProduct);

module.exports = router;
