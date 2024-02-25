import User from '../models/User.js'
import axios from 'axios';

//Secret Keys
const monoSecretKey = process.env.MONO_SECRET_KEY;
const monoTestKey = process.env.MONO_TEST_KEY;

//Initiate BVN for Bank account lookup
export const initiateBankAccounts = async (req, res) => {
  const {userId} = req.body;

  if (!userId) {
      return res.status(400).json({ error: 'User ID and provider are required.' });
  }

  try {
      
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const bvn = user.bvn; 
      const scope = "bank_accounts"
      const response = await axios.post('https://api.withmono.com/v2/lookup/bvn/initiate', {
          bvn: bvn,
          scope: scope,
        }, {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'mono-sec-key': monoSecretKey,
          },
        });
    
        if (response.data && response.data.status === 'successful') {
          res.status(200).json({ ...response.data, userId: user._id });
        } else {
          res.status(500).json({ error: 'Unexpected response from the BVN service.' });
        }
      } catch (error) {
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
          res.status(error.response.status).json({ error: error.response.data });
        } else if (error.request) {
          console.error('Error request:', error.request);
          res.status(500).json({ error: 'The request was made but no response was received from the BVN service.' });
        } else {
          console.error('Error message:', error.message);
          res.status(500).json({ error: 'Error in setting up the request to the BVN service.' });
        }
      }
}

// Initiate the BVN for identity lookup
export const initiateBVN = async (req, res) => {
  const { bvn, scope, amount } = req.body;
  if (!bvn || !scope) {
    return res.status(400).json({ error: 'BVN and scope are required.' });
  }

  try {
    let user = await User.findOne({ bvn: bvn });

    if (!user) {
      user = new User({ bvn, amount});
      await user.save();
    }

    const response = await axios.post('https://api.withmono.com/v2/lookup/bvn/initiate', {
      bvn: bvn,
      scope: scope,
    }, {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'mono-sec-key': monoSecretKey,
      },
    });

    if (response.data && response.data.status === 'successful') {
      res.status(200).json({ ...response.data, userId: user._id });
    } else {
      res.status(500).json({ error: 'Unexpected response from the BVN service.' });
    }
  } catch (error) {
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      console.error('Error request:', error.request);
      res.status(500).json({ error: 'The request was made but no response was received from the BVN service.' });
    } else {
      console.error('Error message:', error.message);
      res.status(500).json({ error: 'Error in setting up the request to the BVN service.' });
    }
  }
};


//verify the BVN via OTP

export const verifyBVN = async (req, res) => {
  const {method, sessionId } = req.body;
  if (!method) {
    return res.status(400).json({ error: 'method is required.'});
  }

  try {
    const response = await axios.post('https://api.withmono.com/v2/lookup/bvn/verify', {
      method: method
    }, {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'mono-sec-key': monoSecretKey, 
        'x-session-id': sessionId,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred during the verification process.' });
  }
};


//retrieve the details of the BVN


export const fetchBVN = async (req, res) => {
  const { otp, userId, sessionId } = req.body;
  if (!otp || !userId) {
    return res.status(400).json({ error: 'OTP and user ID are required.' });
  }

  try {
    const response = await axios.post('https://api.withmono.com/v2/lookup/bvn/details', {
      otp: otp
    }, {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'mono-sec-key': monoSecretKey,
        'x-session-id': sessionId,
      },
    });

    const userDetails = response.data.data;
    await User.findByIdAndUpdate(userId, { $set: userDetails }, { new: true });
    res.status(200).json({ message: "BVN details successfully fetched and updated.", data: userDetails });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while retrieving BVN details' });
  }
};

export const fetchBankAccounts = async (req, res) => {
  const { otp, userId, sessionId } = req.body;
  if (!otp || !userId) {
    return res.status(400).json({ error: 'OTP and user ID are required.' });
  }

  try {
    const response = await axios.post('https://api.withmono.com/v2/lookup/bvn/details', {
      otp: otp
    }, {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'mono-sec-key': monoSecretKey,
        'x-session-id': sessionId,
      },
    });

    const accountDetails = response.data.data;

    // Find the user document
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Update user document with account details
    await User.findByIdAndUpdate(userId, { $push: { accounts: { $each: accountDetails } } }, { new: true });

    // Return the account details in the response
    res.status(200).json({ message: "Bank account details successfully fetched and updated.", data: accountDetails });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while retrieving bank account details' });
  }
};



