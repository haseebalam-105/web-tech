const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");
const { isAdmin } = require("../middleware/auth");

// Protect ALL sales routes with isAdmin middleware
router.use(isAdmin);

// GET /sales — Render sales dashboard page
router.get("/", salesController.getSalesDashboard);

// GET /api/sales-data — Return JSON sales statistics
router.get("/api/sales-data", salesController.getSalesData);

module.exports = router;
