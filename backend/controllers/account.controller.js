import axios from 'axios';

const monoSecretKey = process.env.MONO_SECRET_KEY;

export const bankLookup = async (req, res) => {
    try {
        const response = await axios.get('https://api.withmono.com/v3/lookup/banks',{
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'mono-sec-key': monoSecretKey,
            },
        });

        const bankNames = response.data.data.banks.map(bank => bank.name);

        res.status(200).json(bankNames);
    } catch (error) {
        console.error('Error fetching banks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const accountNumberLookup = async (req, res) => {
    const { bankName } = req.body;

    if (!bankName) {
        return res.status(400).json({ error: 'Bank name is required.' });
    }

    try {
        const response = await axios.get('https://api.withmono.com/v3/lookup/banks',{
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'mono-sec-key': monoSecretKey,
            },
        });

        const selectedBank = response.data.data.banks.find(bank => bank.name === bankName);
        if (!selectedBank) {
            return res.status(404).json({ error: 'Bank not found' });
        }

        const nipCode = selectedBank.nip_code;

        const accountLookupResponse = await axios.post('https://api.withmono.com/v3/lookup/account-number', {
            nip_code: nipCode,
            account_number: req.body.account_number
        }, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'mono-sec-key': monoSecretKey,
            },
        });

        res.status(200).json(accountLookupResponse.data);
    } catch (error) {
        console.error('Error looking up account number:', error);
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data.message || 'Error fetching account number details from Mono API' });
        } else if (error.request) {
            res.status(500).json({ error: 'The request to Mono API was made but no response was received' });
        } else {
            res.status(500).json({ error: 'An error occurred while setting up the request to Mono API' });
        }
    }
};
