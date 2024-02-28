import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosConfig';
import RingLoader from "react-spinners/RingLoader";
import { BsBank } from "react-icons/bs";
import LinkAccount from '../components/Account';

const AllBankAccounts = () => {
    const [loading, setLoading] = useState(false);
    const [stage, setStage] = useState('initiateBankAccountsFetch');
    const [sessionId, setSessionId] = useState('');
    const [verificationMethods, setVerificationMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [otp, setOtp] = useState('');
    const [userBankAccounts, setUserBankAccounts] = useState('');
    const [message, setMessage] = useState('')
    const [error, setError] = useState('');
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showModal, setShowModal] = useState(false);



    const userId = sessionStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
            const storedData = sessionStorage.getItem('userBankAccounts');
            if (storedData) {
                setUserBankAccounts(JSON.parse(storedData));
            } else {
                await fetchDataFromAPI();
            }
        };

        fetchData();
    }, []);

    const fetchDataFromAPI = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axiosInstance.post('/api/bvn/bank-accounts-fetch', { userId });
            const data = response.data;
            if (data.status === 'successful') {
                setSessionId(data.data.session_id);
                setVerificationMethods(data.data.methods);
                setStage('verify');
            } else {
                setError(data.message || 'Error fetching bank account');
                setStage('initiateBankAccountsFetch');
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
            setError('Error fetching Bank Accounts. Please try again.');
            setStage('initiateBankAccountsFetch');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        sessionStorage.setItem('userBankAccounts', JSON.stringify(userBankAccounts));
    }, [userBankAccounts]);

    const initiateBankAccountsFetch = async () => {
        await fetchDataFromAPI();
    };

    const verifyBVN = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axiosInstance.post('/api/bvn/verify', { method: selectedMethod, sessionId });
            const message = response.data.message;
            setStage('fetch');
            setMessage(message);
        } catch (error) {
            console.error('Error:', error);
            setError('Error verifying BVN. Please try again.');
            setStage('verify');
        } finally {
            setLoading(false);
        }
    };

    const fetchBankAccount = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axiosInstance.post('/api/bvn/bank-accounts-detail', { otp, sessionId, userId });
            const data = response.data.data;
            if (Object.keys(data).length === 0) {
                setError('Error: Empty bank accounts data');
            } else {
                if (Array.isArray(data)) {
                    setUserBankAccounts(data);
                } else {
                    setError('Error: Invalid bank accounts data');
                }
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
            setError('Error fetching Back Accounts Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (stage === 'initiateBankAccountsFetch') {
            await initiateBankAccountsFetch();
        } else if (stage === 'verify') {
            await verifyBVN();
        } else if (stage === 'fetch') {
            await fetchBankAccount();
        }
    };

    const maskAccountNumber = (accountNumber) => {
        const maskedDigits = accountNumber.slice(-3).padStart(accountNumber.length, 'X');
        return maskedDigits;
    };

    const handleAccountClick = (account) => {
        setSelectedAccount(account);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedAccount(null);
        setShowModal(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };



    return (
        <div>
            <h1 className="text-2xl text-center font-bold mb-4 text-tertiary">Bank Accounts Data</h1>
            <div className="container mx-auto flex justify-center items-center "> 
                <div className="bg-white p-6 rounded-lg">
                    {loading ? (
                        <div className="text-center">
                            <RingLoader
                                color={"#1e7234"}
                                loading={loading}
                                size={50}
                                aria-label="Loading Spinner"
                            />
                        </div>
                    ) : (
                        <>
                            {(stage === 'initiateBankAccountsFetch' || error) && userBankAccounts.length === 0 && (
                                <form onSubmit={handleSubmit}>
                                    <button type="submit" className="bg-tertiary hover:bg-primary text-white font-bold py-2 px-4 rounded">Initiate Bank Account Fetch</button>
                                </form>
                            )}
                            {stage === 'verify' && userBankAccounts.length === 0 && (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="verificationMethod" className="block text-sm font-medium text-gray-700">Choose a verification method:</label>
                                        <select id="verificationMethod" value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)} required className="mt-1 p-2 border border-gray-300 rounded-md w-full">
                                            <option value="">Select Method</option>
                                            {verificationMethods.map((method, index) => (
                                                <option key={index} value={method.method}>{method.method}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="bg-tertiary hover:bg-primary text-white font-bold py-2 px-4 rounded">Verify BVN</button>
                                </form>
                            )}

                            {stage === 'fetch' && userBankAccounts.length === 0 && (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        {message &&
                                            <div className='text-sm text-red-600'>
                                                {message}
                                            </div>}
                                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700"></label>
                                        <input type="password" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)}
                                            required className="mt-1 p-2 border border-gray-300 text-center rounded-md w-full" placeholder='Input OTP' />
                                    </div>
                                    <button type="submit" className="bg-tertiary hover:bg-primary text-white font-bold py-2 px-4 rounded">Fetch Bank Accounts</button>
                                </form>
                            )}
                        </>
                    )}
                    {error && <p className="text-red-500">{error}</p>}
                </div>
                {!loading && userBankAccounts && userBankAccounts.length > 0 && (
                    <div className="overflow-y-scroll text-center h-80" style={{ scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}>
                        {userBankAccounts.map((account, index) => (
                            <div key={index} className="flex justify-between text-headline bg-tertiary p-4 rounded-md mb-4 cursor-pointer hover:bg-primary" onClick={() => handleAccountClick(account)}>
                                <div className="flex items-center">
                                    <BsBank />
                                    <div className="ml-2 pr-6">
                                        <p className="text-sm">{account.institution.name}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm">{maskAccountNumber(account.account_number)}</p>
                                </div>
                            </div>
                        ))}
                        {showModal && (
                            <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
                                <div className="bg-white p-8 rounded-md shadow-md">
                                    <button onClick={closeModal} className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800">&times;</button>
                                    <LinkAccount account={selectedAccount} onCloseModal={handleCloseModal} />
                                </div>
                            </div>
                        )}
                    </div>

                )}
            </div>
        </div>
    );
};

export default AllBankAccounts;
