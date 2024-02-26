import React, { useState } from 'react';
import Identity from '../components/Identity';
import AllBankAccounts from '../components/BankAccounts';
import CreditHistory from '../components/CreditHistory';
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";

const Dashboard = () => {
  const [sectionIndex, setSectionIndex] = useState(0);
  const sections = [Identity, AllBankAccounts, CreditHistory];
  const CurrentSection = sections[sectionIndex];

  const scrollToNextSection = () => {
    const nextSectionIndex = Math.min(sectionIndex + 1, sections.length - 1);
    setSectionIndex(nextSectionIndex);
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  };

  const scrollToPrevSection = () => {
    const prevSectionIndex = Math.max(sectionIndex - 1, 0);
    setSectionIndex(prevSectionIndex);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="h-screen  flex flex-col justify-center items-center">
      <div className="text-center mb-4">
        <FaChevronCircleUp onClick={scrollToPrevSection} size={36} className="cursor-pointer text-tertiary" />
      </div>
      <div className="bg-headline p-8 shadow-sm md:shadow-md rounded-md text-center w-full md:w-auto">
        <CurrentSection />
      </div>
      <div className="text-center mt-4">
        <FaChevronCircleDown onClick={scrollToNextSection} size={36} className="cursor-pointer text-tertiary" />
      </div>
    </div>
  );
};

export default Dashboard;
