import React, { useState, useEffect } from 'react';
import Identity from '../components/Identity';
import AllBankAccounts from '../components/BankAccounts';
import CreditHistory from '../components/CreditHistory';

const Dashboard = () => {
  const [showCreditHistory, setShowCreditHistory] = useState(false);
  const [showBankAccounts, setShowBankAccounts] = useState(false);
  const [bankAccountsFetched, setBankAccountsFetched] = useState(false);
  const [creditHistoryFetched, setCreditHistoryFetched] = useState(false);

  const handleBankAccountsFetch = () => {
    setBankAccountsFetched(true);
  };

  const handleCreditHistoryFetch = () => {
    setCreditHistoryFetched(true);
  };

  useEffect(() => {
    if (bankAccountsFetched) {
      setShowBankAccounts(true);
    }
  }, [bankAccountsFetched]);

  useEffect(() => {
    if (creditHistoryFetched) {
      setShowCreditHistory(true);
    }
  }, [creditHistoryFetched]);

  return (
    <div className="container mx-auto mt-10 bg-headline min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4">
        <div className="bg-white p-4  shadow-sm md:shadow-md rounded-md ">
          <Identity />
        </div>

        <div className="bg-white p-4 shadow-sm md:shadow-md rounded-md text-center">
          <h2 className="text-tertiary text-center mb-4 font-bold text-2xl">Bank Account</h2>
          {!bankAccountsFetched && (
            <button onClick={handleBankAccountsFetch} className="bg-primary text-white px-4 py-2 rounded-md mb-4">
              Show Bank Accounts
            </button>
          )}
          {showBankAccounts && <AllBankAccounts />}
        </div>
      </div>
      
      <div className="mt-8 text-center ">
        {!creditHistoryFetched && (
          <button 
            className="bg-tertiary hover:bg-primary text-center text-white font-bold py-2 px-4 rounded"
            onClick={handleCreditHistoryFetch}
          >
            Show Credit History
          </button>
        )}
        {showCreditHistory && <CreditHistory />}
      </div>
    </div>
  );
};

export default Dashboard;
