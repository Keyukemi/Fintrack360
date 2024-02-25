// identity.controller.js
import axios from 'axios';
import User from '../models/User.js';
import Report from '../models/CreditHistory.js';

const monoSecretKey = process.env.MONO_SECRET_KEY;

export const fetchCreditHistory = async (req, res) => {
    const { userId, provider } = req.body;

    if (!userId || !provider) {
        return res.status(400).json({ error: 'User ID and provider are required.' });
    }

    try {
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const bvn = user.bvn; 

        const response = await axios.post(`https://api.withmono.com/v3/lookup/credit-history/${provider}`, {
            bvn: bvn
        }, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'mono-sec-key': monoSecretKey,
            },
        });

        
        const reportData = response.data;
        const report = new Report(reportData);
        await report.save();

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error:', error);
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data.message || 'Error fetching credit history from Mono API' });
        } else if (error.request) {
            res.status(500).json({ error: 'The request to Mono API was made but no response was received' });
        } else {
            res.status(500).json({ error: 'An error occurred while setting up the request to Mono API' });
        }
    }
};
