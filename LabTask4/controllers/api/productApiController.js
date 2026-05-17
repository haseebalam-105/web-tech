const Product = require('../../models/Product');
const mongoose = require('mongoose');

// GET /api/v1/products
// Supports: ?page= ?search= ?category= ?min= ?max= ?sort=
exports.getAllProducts = async (req, res) => {
    try {
        let { page, search, category, min, max, sort } = req.query;

        const query = {};

        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Price range filter
        if (min || max) {
            query.price = {};
            if (min) query.price.$gte = Number(min);
            if (max) query.price.$lte = Number(max);
        }

        // Sorting
        let sortOption = {};
        if (sort === 'price_asc')    sortOption.price  =  1;
        else if (sort === 'price_desc')   sortOption.price  = -1;
        else if (sort === 'rating_desc')  sortOption.rating = -1;
        else sortOption._id = -1;   // default: newest first

        // Pagination
        const limit = 8;
        page = Math.max(1, Number(page) || 1);
        const skip = (page - 1) * limit;

        const totalProducts = await Product.countDocuments(query);
        const totalPages    = Math.ceil(totalProducts / limit) || 1;

        if (page > totalPages) {
            return res.status(400).json({
                success: false,
                message: `Page ${page} does not exist. Total pages: ${totalPages}`,
            });
        }

        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean();

        return res.status(200).json({
            success:     true,
            totalProducts,
            totalPages,
            currentPage: page,
            limit,
            products,
        });

    } catch (err) {
        console.error('API getAllProducts error:', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// GET /api/v1/products/:id
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format.',
            });
        }

        const product = await Product.findById(id).lean();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.',
            });
        }

        return res.status(200).json({
            success: true,
            product,
        });

    } catch (err) {
        console.error('API getProductById error:', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};
