import React, { useContext, useState } from 'react';
import { ChevronDown, AlignLeft } from 'lucide-react';
import { MedContext } from '../../context/MedContext';
import { ChatContext } from '../../context/ChatContext';
import { getSummaryFollowUp } from '../../Services/apiService';

const Allergies = ({ patientHistory }) => {
  const [filter, setFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setFollowUpQuestions, setIsLoadingFollowUp, setIsAllergiesBoxSelected, selectedUser } = useContext(MedContext);
  const { addSummaryMessage } = useContext(ChatContext);
  
  const patientId = selectedUser?.resource?.id;

  // Extract allergies from the FHIR Bundle
  const allergies = patientHistory?.entry?.map(entry => {
    const divContent = entry.resource.text?.div;
    // Extract text content from the div (simple approach - might need more robust parsing)
    const allergyName = divContent ? divContent.replace(/<[^>]+>/g, '') : 'Unknown allergy';
    return {
      id: entry.resource.id,
      name: allergyName,
      clinicalStatus: entry.resource.clinicalStatus?.coding?.[0]?.display || 'Unknown status',
      verificationStatus: entry.resource.verificationStatus?.coding?.[0]?.display || 'Unknown verification',
      category: entry.resource.category?.[0] || 'Unknown category',
      criticality: entry.resource.criticality || 'Unknown criticality'
    };
  }) || [];

  const filteredAllergies = allergies; // Filtering logic can be added here if needed

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectFilter = (value) => {
    setFilter(value);
    setIsDropdownOpen(false);
  };

  const handleAllergiesClick = async (allergy) => {
    setIsLoadingFollowUp(true);
    console.log("Loading started");
    setIsAllergiesBoxSelected(true);

    // Create a copy of the visit data and add the allergy
    const visitWithAllergy = {
      icon: '/Allergies.svg',
      allergies: allergy.name // Using the extracted allergy name
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
            key={allergy.id || index}
            onClick={() => handleAllergiesClick(allergy)}
            className="p-4 text-sm bg-white border cursor-pointer border-gray-200 rounded-sm"
          >
            {allergy.name}
          </div>
        ))
      ) : (
        <div className="p-4 text-sm bg-white border border-gray-200 rounded-sm">
          No allergies reported.
        </div>
      )}
    </div>
  );
};

export default Allergies;