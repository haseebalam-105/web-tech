const express    = require("express");
const router     = express.Router();
const adminController = require("../controllers/adminController");
const multer     = require("multer");
const path       = require("path");
const { isAdmin } = require("../middleware/auth");

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

// Protect ALL admin routes with isAdmin — one line does it all
// /login and /logout now live in authRoutes.js
router.use(isAdmin);

// Admin Dashboard
router.get("/", adminController.getDashboard);

// CRUD Routes
router.get("/products/new",         adminController.getNewProduct);
router.post("/products/new",        upload.single("image"), adminController.postNewProduct);

router.get("/products/edit/:id",    adminController.getEditProduct);
router.post("/products/edit/:id",   upload.single("image"), adminController.postEditProduct);

router.post("/products/delete/:id", adminController.deleteProduct);

module.exports = router;
