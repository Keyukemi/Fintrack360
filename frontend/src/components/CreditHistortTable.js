import React from 'react';
import { MdCancel } from "react-icons/md";
import { IoMdArrowRoundForward } from "react-icons/io";

const CreditHistoryTable = ({ creditHistory }) => {

  let openCount = 0;
  let closedCount = 0;


  creditHistory.forEach(institution => {
    institution.history.forEach(historyItem => {
      if (historyItem.loan_status === 'open') {
        openCount++;
      } else if (historyItem.loan_status === 'closed') {
        closedCount++;
      }
    });
  });

  const isEligible = closedCount > openCount;

  return (
    <div className="mt-8">
      {creditHistory.map((institution, index) => (
        <div key={index} className="mb-8">
          <div className='text-center md:text-left ml-4'>
            <h3 className="text-lg font-semibold mb-2 underline text-tertiary ">{institution.institution}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Performance Status</th>
                  
                  <th className="px-4 py-2">Date Opened</th>
                  <th className="px-4 py-2">Closed Date</th>
                  <th className="px-4 py-2">Loan Status</th>
                  <th className="px-4 py-2">Repayment Amount</th>
                  
                </tr>
              </thead>
              <tbody>
                {institution.history.map((historyItem, index) => (
                  <tr key={index} className=''>
                    <td className="border px-4 py-2">{historyItem.performance_status}</td>
                    <td className="border px-4 py-2">{historyItem.date_opened}</td>
                    <td className="border px-4 py-2">{historyItem.closed_date}</td>
                    <td className="border px-4 py-2">{historyItem.loan_status}</td>
                    <td className="border px-4 py-2">{historyItem.repayment_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {/* Conditional rendering of the eligibility button */}
      <div className="text-center">
        <div className="flex justify-center">
          {isEligible ? (
            <button className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4">
              <IoMdArrowRoundForward size={20} className='mr-2' /> Eligible for Loan
            </button>
          ) : (

            <button className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4">
              <MdCancel size={20} className='mr-2' />
              Ineligible for Loan
            </button>

          )}
        </div>
      </div>
    </div>
  );
};

export default CreditHistoryTable;
