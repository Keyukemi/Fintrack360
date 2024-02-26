import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosConfig';
import Select from 'react-select';
import RingLoader from "react-spinners/RingLoader";

const LinkAccount = ({ onCloseModal }) => {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountDetails, setAccountDetails] = useState(null);
  const [error, setError] = useState(null);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await axiosInstance.get('/api/bank-list');
      const options = response.data.map(bank => ({ value: bank, label: bank }));
      setBanks(options);
    } catch (error) {
      console.error('Error fetching banks:', error);
      setError('Error fetching banks. Please try again later.');
    }
  };

  const handleBankSelect = (selectedOption) => {
    setSelectedBank(selectedOption.value);
  };

  const handleAccountNumberLookup = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/account-number', {
        bankName: selectedBank,
        account_number: accountNumber
      });
      setAccountDetails(response.data);
      setVerified(true)
    } catch (error) {
      console.error('Error looking up account number:', error);
      setError('Error looking up account number. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const maskBVN = (bvn) => {
    const visibleDigits = 2;
    const maskedDigits = bvn.length - (visibleDigits * 2);
    return bvn.slice(0, visibleDigits) + '*'.repeat(maskedDigits) + bvn.slice(-visibleDigits);
  };

  const handleContinue = () => {
    setModalOpen(false);
    onCloseModal(); 
  };

  return (
    <div className={`flex justify-center items-center ${modalOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white p-8">
        <h1 className="text-2xl font-bold mb-4">Bank Lookup</h1>
        {!verified && (
          <>
            <div className="mb-4">
              <label htmlFor="bank" className="block mb-2">Select Bank:</label>
              <Select
                id="bank"
                value={banks.find(bank => bank.value === selectedBank)}
                onChange={handleBankSelect}
                options={banks}
                placeholder="Choose your bank"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="accountNumber" className="block mb-2">Enter Account Number:</label>
              <input type="text" id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} 
              className="w-full px-4 py-2 border rounded-md text-center" />
            </div>
            <button onClick={handleAccountNumberLookup} 
            className=" bg-tertiary hover:bg-primary text-center text-white px-4 py-2 rounded-md">
              {loading ? <RingLoader color={"#ffffff"} loading={loading} size={20} /> : "Lookup Account Number"}
            </button>
          </>
        )}

        {error && <div className="text-red-500 mt-4">{error}</div>}
        {verified && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2 text-primary">Account Information Verified</h2>
            <p><strong>Name: </strong>{accountDetails.data.name}</p>
            <p><strong>BVN: </strong>{maskBVN(accountDetails.data.bvn)}</p>
          </div>
        )}
        {verified && (
          <div className="mt-4">
            <button onClick={handleContinue} 
            className="bg-tertiary text-center hover:bg-primary text-white px-4 py-2 rounded-md">Continue</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkAccount;
