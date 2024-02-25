import User from '../models/User.js'

export const getIdentityData = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ data: user });
    } catch (error) {
        console.error('Error fetching user information:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

