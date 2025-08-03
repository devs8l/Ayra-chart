import React, { useContext, useState } from 'react';
import { ChevronDown, AlignLeft } from 'lucide-react';
import { MedContext } from '../../context/MedContext';
import { ChatContext } from '../../context/ChatContext';

const Problems = ({ userData,patientHistory }) => {
  const [filter, setFilter] = useState('Blood Pressure');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setIsLoadingFollowUp } = useContext(MedContext)
  const { addSummaryMessage } = useContext(ChatContext)
  const patientId = patientHistory?.rawData?._id

  const handleMedicinesClick = async (medicine) => {
    setIsLoadingFollowUp(true);
    console.log("Loading started");
    addSummaryMessage(patientId, medicine, []);
  };
  // Example problems data based on uploaded JSON
  // In a real app, you would extract this from userData
  const problems = [
    {
      type: 'High Blood Pressure',
      firstDetected: '19/04/2022',
      pcp: 'Aron Paul, MS',
      medicine: 'Losartan 0.5mg, Ipsum 1mg',
      latestReadings: '120/80 mmHg (15/04/2025)'
    },
    {
      type: 'High Blood Sugar',
      firstDetected: '27/02/2024',
      pcp: 'Aron Paul, MS',
      medicine: 'Metformin 0.2mg, Sulfonylureas 0.3mg',
      latestReadings: '95 mg/dL (03/04/2025)'
    }
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectFilter = (value) => {
    setFilter(value);
    setIsDropdownOpen(false);
  };

  // Filter problems based on selected filter
  const filteredProblems = filter === 'All Conditions'
    ? problems
    : problems.filter(p => p.type.includes(filter.replace('Blood ', '')));

  return (
    <div className="flex flex-col gap-4">
      {/* Filter dropdown */}
      <div className="relative w-auto">
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-between px-4 py-2 text-sm text-left bg-white border border-gray-200 rounded-md "
        >
          <div className="flex items-center">
            <AlignLeft className="w-4 h-4 mr-2" />
            <span className="font-medium">{filter}</span>
          </div>
          <ChevronDown className="w-4 h-4 ml-2" />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-xl">
            <ul>
              <li
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => selectFilter('Blood Pressure')}
              >
                Blood Pressure
              </li>
              <li
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => selectFilter('Blood Sugar')}
              >
                Blood Sugar
              </li>
              <li
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => selectFilter('All Conditions')}
              >
                All Conditions
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Problems list */}
      <div className="flex flex-col rounded-md overflow-hidden">
        {filteredProblems.map((problem, index) => (
          <div key={index} className="flex flex-col border border-gray-200 rounded-md mb-1 overflow-hidden">
            {/* Problem header */}
            <div className="px-4 py-4 bg-white border-b border-gray-200">
              <h3 className="text-sm font-medium">{problem.type}</h3>
            </div>

            {/* Problem details */}
            <div className="px-4 py-4 bg-white">
              <p className="text-sm mb-1">First Detected: {problem.firstDetected}</p>
              <p className="text-sm mb-1">PCP: {problem.pcp}</p>
              <p className="text-sm mb-1">Medicine Ongoing: {problem.medicine}</p>
              <p className="text-sm">Lates Readings: {problem.latestReadings}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Problems;