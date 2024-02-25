import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RingLoader from "react-spinners/RingLoader";
import CreditHistoryTable from "../components/CreditHistortTable";

const CreditHistory = () => {
    const [creditData, setCreditData] = useState(null);
    const [provider, setProvider] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedCreditData = sessionStorage.getItem('creditData');
        if (storedCreditData) {
            setCreditData(JSON.parse(storedCreditData));
        } else {
            fetchCreditData();
        }

        return () => {
            sessionStorage.setItem('creditData', JSON.stringify(creditData));
        };
    }, []);

    const fetchCreditData = async () => {
        setLoading(true);
        try {
            const userId = sessionStorage.getItem('userId');

            if (!userId) {
                throw new Error('User ID not found in sessionStorage');
            }

            const response = await axios.post('/api/credit-history', { userId, provider });
            const data = response.data;

            if (data.status === 'successful') {
                setCreditData(data.data);
                setError('');
            } else {
                setError(data.message || 'Error fetching credit data');
                setCreditData(null);
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
            setError('Error fetching credit data. Please try again.');
            setCreditData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleProviderChange = (event) => {
        setProvider(event.target.value);
    };

    const handleSubmit = () => {
        fetchCreditData();
    };

    return (
        <div className="bg-white p-6 rounded-lg">
            <h1 className="text-2xl text-center font-bold mb-4 text-tertiary">Credit History</h1> 
            {loading && !creditData && (
                <div className="inset-0 flex justify-center items-center"> 
                    <RingLoader
                        color={"#1e7234"}
                        loading={loading}
                        size={50}
                        aria-label="Loading Spinner"
                    />
                </div>
            )}
            {!loading && !creditData && (
                <>
                    <div className="mb-4 text-center">
                        <label htmlFor="provider" className="block mb-2"></label>
                        <select id="provider" value={provider} onChange={handleProviderChange} className="mt-1 p-2 text-center border border-gray-300 rounded-md inline-block">
                            <option value="">Select Provider</option>
                            <option value="xds">XDS</option>
                            <option value="crc">CRC</option>
                            <option value="all">BOTH</option>
                        </select>
                    </div>
                    <div className='text-center'>
                        <button onClick={handleSubmit} className="bg-tertiary hover:bg-primary text-headline px-4 py-2 rounded-md">Submit</button>
                    </div>
                </>
            )}
            {creditData && (
                <CreditHistoryTable creditHistory={creditData.credit_history} /> 
            )}
            {error && !loading && !creditData && (
                <p className='mt-4 text-red-500'>{error || 'Submit to fetch credit data'}</p>
            )}
        </div>
    );
};

export default CreditHistory;
