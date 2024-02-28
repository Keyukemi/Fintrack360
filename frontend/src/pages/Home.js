import React, { useState } from 'react';
import axiosInstance from '../config/axiosConfig';
import RingLoader from "react-spinners/RingLoader";
import { useNavigate } from 'react-router-dom';
import Logo from "../images/fintrack360-logo.png"
import { TbCurrencyNaira } from "react-icons/tb"
import { MdOutlineNumbers } from "react-icons/md";

const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [bvn, setBvn] = useState('');
    const [amount, setAmount] = useState('');
    const [stage, setStage] = useState('initiateBVN');
    const [sessionId, setSessionId] = useState('');
    const [verificationMethods, setVerificationMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState('');
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        const errors = {};
        let isValid = true;

        if (!/^\d{11}$/.test(bvn)) {
            errors.bvn = 'BVN must be an 11-digit number';
            isValid = false;
        }

        if (!amount) {
            errors.amount = 'Please enter the loan amount';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const initiateBVN = async () => {
        setLoading(true);
        const scope = "identity";
        try {
            const response = await axiosInstance.post('/api/bvn/initiate', { bvn, amount, scope });
            setSessionId(response.data.data.session_id);
            setVerificationMethods(response.data.data.methods);
            setUserId(response.data.userId);
            sessionStorage.setItem('userId', response.data.userId);
            setStage('verifyBVN');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false)
        }
    };

    const verifyBVN = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/api/bvn/verify', { method: selectedMethod, sessionId });
            const message = response.data.message;
            setStage('fetchBVN');
            setMessage(message);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false)
        }
    };

    const fetchBVN = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/api/bvn/details', { otp, sessionId, userId });
            console.log(response.data)
            navigate('/dashboard');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false)
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateInputs()) return;

        if (stage === 'initiateBVN') {
            initiateBVN();
        } else if (stage === 'verifyBVN') {
            verifyBVN();
        } else if (stage === 'fetchBVN') {
            fetchBVN();
        }
    };

    return (
        <div className="bg-white px-6 flex flex-col min-h-screen items-start">
            <div className="p-4 flex justify-between items-end">
                <img src={Logo} alt="" className='h-12' />
                <p className='text-2xl'>FinTrack<strong className='text-primary'>360</strong></p>
            </div>
            <div className="text-center grid grid-cols-1 md:grid-cols-2 mt-10 md:mt-20" >
                <div className='flex flex-col w-full text-center text-sm md:text-left p-4 md:p-10' id="CTA">
                    <div className='mb-4 p-4 bg-white rounded-lg shadow-md'>
                        <h1 className='text-xl md:text-2xl font-bold mb-2'>Connect your BVN with Fintrack360</h1>
                        <p className=''>
                            Connect a BVN to retrieve identity information
                        </p>
                    </div>
                    <div className='mb-4 p-4 bg-white rounded-lg shadow-md'>
                        <h1 className='text-xl md:text-2xl font-bold mb-2'>Verify your Bank Account</h1>
                        <p className=''>
                            Choose your primary bank account and validate ownership
                        </p>
                    </div>
                    <div className='mb-4 p-4 bg-white rounded-lg shadow-md'>
                        <h1 className='text-xl md:text-2xl font-bold mb-2'>Retrieve your Credit History</h1>
                        <p className=''>
                            Confirm credit worthiness and eligibility for loan application
                        </p>
                    </div>
                    <p className='mt-auto mb-2 text-xs md:mb-4 md:text-sm text-gray-500'>
                        Kindly note: This isn't a mono consumer product but a demo app created to showcase how to use the mono
                        lookup APIs for building better credit decision making products
                    </p>
                </div>


                <div className="flex justify-center items-center h-full" id='BVN'>
                    <div className="bg-white p-6 rounded-lg">
                        <h1 className="text-center text-4xl font-bold mb-6">Create an Account</h1>
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <RingLoader
                                    color={"#1e7234"}
                                    loading={loading}
                                    size={100}
                                    aria-label="Loading Spinner"
                                />
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="w-full max-w-md">
                                {stage === 'initiateBVN' && (
                                    <>
                                        <div className="mb-4">
                                            <label htmlFor="bvn" className="block text-sm font-medium text-gray-700">BVN i.e 11 digits</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <MdOutlineNumbers size={24} className='text-tertiary' />
                                                </div>
                                                <input type="password" id="bvn" value={bvn} onChange={(e) => setBvn(e.target.value)}
                                                    required className="pl-12 pr-4 py-4 border border-gray-300 rounded-md w-full text-center" />
                                                {errors.bvn && <p className="text-red-500">{errors.bvn}</p>}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Loan Amount</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <TbCurrencyNaira size={24} className='text-tertiary' />
                                                </div>
                                                <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)}
                                                    required className="pl-12 pr-4 py-4 border border-gray-300 rounded-md w-full text-center" />
                                                {errors.amount && <p className="text-red-500">{errors.amount}</p>}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {stage === 'verifyBVN' && (
                                    <div className="mb-4">
                                        <label htmlFor="verificationMethod" className="block text-sm font-medium text-gray-700">Choose a verification method:</label>
                                        <select id="verificationMethod" value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}
                                            required className="mt-1 p-4 border border-gray-300 rounded-md w-full">
                                            <option value="">Select Method</option>
                                            {verificationMethods.map((method, index) => (
                                                <option key={index} value={method.method}>{method.method}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {stage === 'fetchBVN' && (
                                    <div className="mb-4">
                                        {message && <div className='text-sm mb-2 text-red-600'>{message}</div>}
                                        <input type="password" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required
                                            className="mt-1 p-4 text-center border border-gray-300 rounded-md w-full" placeholder='Input OTP' />
                                    </div>
                                )}
                                <button type="submit" className="text-xl bg-tertiary hover:bg-primary text-white font-bold py-3 px-6 rounded">Submit</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
