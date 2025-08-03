import React, { useContext, useState } from 'react';
import { ChevronDown, AlignLeft } from 'lucide-react';
import { MedContext } from '../../context/MedContext';
import { ChatContext } from '../../context/ChatContext';
import { getSummaryFollowUp } from '../../Services/apiService';

const Allergies = ({ userData, patientHistory }) => {
  const [filter, setFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const patientId = patientHistory?.rawData?._id
  const { setFollowUpQuestions,setIsLoadingFollowUp, setIsAllergiesBoxSelected} = useContext(MedContext)
  const {addSummaryMessage}=useContext(ChatContext)

  // Assuming userData contains an allergies array
  // If not provided, use empty array as fallback
  const allergies = userData?.allergies || [];

  // Filter allergies based on selection (this would be more complex in a real app)
  // For demo purposes, we're just showing all allergies regardless of filter
  const filteredAllergies = allergies;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectFilter = (value) => {
    setFilter(value);
    setIsDropdownOpen(false);
  };
  console.log(userData);


  const handleAllergiesClick = async (allergy) => {
    setIsLoadingFollowUp(true);
    console.log("Loading started");
    setIsAllergiesBoxSelected(true)

    // Create a copy of the visit data and add the allergy
    const visitWithAllergy = {
      icon:'/Allergies.svg',
      allergies: allergy // or you might want to append to existing allergies if they exist
    };

    addSummaryMessage(patientId, visitWithAllergy);
  };


  return (
    <div className="flex flex-col gap-4">
      {/* Filter dropdown */}
      <div className="relative w-24">
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-between w-full px-3 py-2 text-sm text-left bg-white border border-gray-200 rounded-md "
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
                onClick={() => selectFilter('Food')}
              >
                Food
              </li>
              <li
                className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => selectFilter('Medicine')}
              >
                Medicine
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Allergies list */}
      {filteredAllergies.length > 0 ? (
        filteredAllergies.map((allergy, index) => (
          <div
            key={index}
            onClick={() => handleAllergiesClick(allergy)}
            className="p-4 text-sm bg-white border cursor-pointer border-gray-200 rounded-sm"
          >
            {allergy}
          </div>
        ))
      ) : (
        // Demo data to match the image
        <>
          <div className="p-4 text-sm bg-white border border-gray-200 rounded-sm">
            No allergies reported.
          </div>
        </>
      )}
    </div>
  );
};

export default Allergies;