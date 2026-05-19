const User = require('../../models/User');

// GET /api/v1/user/profile   (JWT protected)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.user_id)
            .select('-password')   // never expose password hash
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (err) {
        console.error('API getProfile error:', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};
