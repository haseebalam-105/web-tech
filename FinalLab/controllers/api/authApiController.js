const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../../models/User');

// POST /api/v1/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 400 — missing fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.',
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        // Compare password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        // Sign JWT — expires in 1 hour
        const token = jwt.sign(
            { user_id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            success: true,
            token,
        });

    } catch (err) {
        console.error('API login error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
        });
    }
};
