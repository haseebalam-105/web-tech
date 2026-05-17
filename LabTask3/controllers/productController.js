const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
    try {
        let { page, search, category, min, max, sort } = req.query;
        
        let query = {};
        
        // Search
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }
        
        // Category Filter
        if (category) {
            query.category = category;
        }
        
        // Price Filter
        if (min || max) {
            query.price = {};
            if (min) query.price.$gte = Number(min);
            if (max) query.price.$lte = Number(max);
        }
        
        // Sorting
        let sortOption = {};
        if (sort === "price_asc") sortOption.price = 1;
        else if (sort === "price_desc") sortOption.price = -1;
        else if (sort === "rating_desc") sortOption.rating = -1;

        // Pagination
        const limit = 8;
        page = Number(page) || 1;
        const skip = (page - 1) * limit;

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        if (page > totalPages && totalPages > 0) {
            return res.status(404).render("error", { message: "Invalid page" });
        }

        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        res.render("index", {
            products,
            currentPage: page,
            totalPages,
            search: search || "",
            category: category || "",
            min: min || "",
            max: max || "",
            sort: sort || ""
        });
    } catch (error) {
        console.error(error);
        res.status(500).render("error", { message: "Database Error" });
    }
};
