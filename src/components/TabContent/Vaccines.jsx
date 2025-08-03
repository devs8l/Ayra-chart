import React, { useContext, useState } from 'react';
import { ChevronDown, AlignLeft } from 'lucide-react';
import { ChatContext } from '../../context/ChatContext';
import { MedContext } from '../../context/MedContext';

const Vaccines = ({patientHistory}) => {
  const [filter, setFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setIsLoadingFollowUp } = useContext(MedContext)
  const { addSummaryMessage } = useContext(ChatContext)
  const patientId = patientHistory?.rawData?._id

  const handleVaccineClick = async (vaccine) => {
    setIsLoadingFollowUp(true);
    console.log("Loading started");
    const visitData = {
      vaccines: {
        name: vaccine.name,
        date: vaccine.date,
        type: vaccine.type,
        status: vaccine.status
      },
      icon:'/Vaccines.svg'
    }
    addSummaryMessage(patientId, visitData, []);
  };
  // Temporary vaccine data
  const tempVaccines = [
    { name: 'COVID-19 Vaccine', date: '2023-01-15', type: 'Viral', status: 'Completed' },
    { name: 'Influenza Vaccine', date: '2023-10-20', type: 'Seasonal', status: 'Completed' },
    { name: 'Tetanus Booster', date: '2022-05-10', type: 'Booster', status: 'Completed' },
    { name: 'HPV Vaccine', date: '2023-03-05', type: 'Preventive', status: 'In Progress' },
    { name: 'Hepatitis B Vaccine', date: '2021-11-30', type: 'Preventive', status: 'Completed' },
  ];

  // Filter vaccines based on selection
  const filteredVaccines = filter === 'All'
    ? tempVaccines
    : tempVaccines.filter(vaccine => vaccine.type === filter || vaccine.status === filter);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectFilter = (value) => {
    setFilter(value);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filter dropdown */}
      <div className="relative w-32">
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-between w-full px-3 py-2 text-sm text-left bg-white border border-gray-200 rounded-md"
        >
          <div className="flex items-center">
            <AlignLeft className="w-4 h-4 mr-2" />
            <span>{filter}</span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-xl">
            <ul>
              <li
                className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => selectFilter('All')}
              >
                All
              </li>
              <li
                className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => selectFilter('Viral')}
              >
                Viral
              </li>
              <li
                className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => selectFilter('Seasonal')}
              >
                Seasonal
              </li>
              <li
                className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => selectFilter('Preventive')}
              >
                Preventive
              </li>
              <li
                className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => selectFilter('Completed')}
              >
                Completed
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Vaccines list */}
      <div className="flex flex-col gap-2">
        {filteredVaccines.map((vaccine, index) => (
          <div
            key={index}
            onClick={() => handleVaccineClick(vaccine)}
            className="flex flex-col p-4 cursor-pointer bg-white border border-gray-200 rounded-md"
          >
            <div className="flex justify-between items-start">
              <div className="text-sm">{vaccine.name}</div>
              <div className="text-sm text-gray-500">
                {new Date(vaccine.date).toLocaleDateString()}
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-sm text-gray-600">Type: {vaccine.type}</span>
              <span className={`text-sm px-2 py-1 rounded-full ${vaccine.status === 'Completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
                }`}>
                {vaccine.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vaccines;