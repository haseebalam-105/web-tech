const Order   = require('../../models/Order');
const Product = require('../../models/Product');
const mongoose = require('mongoose');

// POST /api/v1/orders   (JWT protected)
exports.createOrder = async (req, res) => {
    try {
        const { items } = req.body;

        // Validate items array
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order must include at least one item. Expected: { items: [{ product, quantity }] }',
            });
        }

        // Validate each item and calculate total
        let totalPrice = 0;
        const validatedItems = [];

        for (const item of items) {
            if (!item.product || !item.quantity || item.quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Each item must have a valid product ID and quantity >= 1.',
                });
            }

            if (!mongoose.Types.ObjectId.isValid(item.product)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid product ID: ${item.product}`,
                });
            }

            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`,
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
                });
            }

            validatedItems.push({
                product: product._id,
                quantity: item.quantity,
                price:    product.price,
            });
            totalPrice += product.price * item.quantity;
        }

        // Create order linked to JWT user
        const order = await Order.create({
            user:       req.user.user_id,
            items:      validatedItems,
            totalPrice,
        });

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully.',
            order,
        });

    } catch (err) {
        console.error('API createOrder error:', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};
