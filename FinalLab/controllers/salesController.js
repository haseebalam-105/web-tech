const Order = require("../models/Order");
const Product = require("../models/Product");

/**
 * Calculate total revenue from all delivered orders
 * @returns {Promise<number>} Total revenue
 */
async function calculateTotalRevenue() {
    try {
        const result = await Order.aggregate([
            { $match: { status: { $ne: "cancelled" } } },  // Exclude cancelled orders
            { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
        ]);
        return result.length > 0 ? result[0].totalRevenue : 0;
    } catch (error) {
        console.error("Error calculating total revenue:", error);
        return 0;
    }
}

/**
 * Calculate total number of orders (excluding cancelled)
 * @returns {Promise<number>} Total orders count
 */
async function calculateTotalOrders() {
    try {
        const count = await Order.countDocuments({ status: { $ne: "cancelled" } });
        return count;
    } catch (error) {
        console.error("Error calculating total orders:", error);
        return 0;
    }
}

/**
 * Find the top-selling product by quantity ordered
 * @returns {Promise<string>} Product name of the top seller
 */
async function getTopSellingProduct() {
    try {
        const result = await Order.aggregate([
            { $match: { status: { $ne: "cancelled" } } },  // Exclude cancelled orders
            { $unwind: "$items" },                           // Flatten items array
            { $group: {
                _id: "$items.product",
                totalQuantity: { $sum: "$items.quantity" }
            }},
            { $sort: { totalQuantity: -1 } },               // Sort by quantity descending
            { $limit: 1 },                                   // Get top 1
            { $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails"
            }},
            { $unwind: "$productDetails" }
        ]);

        if (result.length > 0) {
            return result[0].productDetails.name;
        }
        return "N/A";
    } catch (error) {
        console.error("Error getting top-selling product:", error);
        return "N/A";
    }
}

/**
 * GET /sales — Render sales dashboard page with initial server-side data
 */
exports.getSalesDashboard = async (req, res) => {
    try {
        const totalRevenue = await calculateTotalRevenue();
        const totalOrders = await calculateTotalOrders();
        const topProduct = await getTopSellingProduct();

        res.render("sales", {
            totalRevenue,
            totalOrders,
            topProduct
        });
    } catch (error) {
        console.error("Error loading sales dashboard:", error);
        res.status(500).send("Error loading dashboard");
    }
};

/**
 * GET /api/sales-data — Return JSON sales statistics for AJAX polling
 */
exports.getSalesData = async (req, res) => {
    try {
        const totalRevenue = await calculateTotalRevenue();
        const totalOrders = await calculateTotalOrders();
        const topProduct = await getTopSellingProduct();

        res.json({
            totalRevenue,
            totalOrders,
            topProduct
        });
    } catch (error) {
        console.error("Error fetching sales data:", error);
        res.status(500).json({ error: "Failed to fetch sales data" });
    }
};
