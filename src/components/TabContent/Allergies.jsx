import React, { useContext, useState, useEffect } from 'react';
import { ChevronDown, AlignLeft } from 'lucide-react';
import { MedContext } from '../../context/MedContext';
import { ChatContext } from '../../context/ChatContext';
import { fetchAllergies } from '../../Services/userData';

const Allergies = () => {
  const [filter, setFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allergies, setAllergies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setFollowUpQuestions, setIsLoadingFollowUp, setIsAllergiesBoxSelected, selectedUser } = useContext(MedContext);
  const { addSummaryMessage } = useContext(ChatContext);

  const patientId = selectedUser?.resource?.id;



  useEffect(() => {
    if (patientId) {
      setIsLoading(true);
      const loadAllergies = async () => {
        const allergiesData = await fetchAllergies(patientId);
        if (allergiesData) {
          setAllergies(allergiesData);
          setIsLoading(false);
        }
      };

      loadAllergies();
    }
  }, [patientId]);

  // Extract allergies from the FHIR Bundle
  const processedAllergies = allergies?.entry?.map(entry => {
    const divContent = entry.resource.text?.div;
    // Extract text content from the div
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

  // Apply filter if needed
  const filteredAllergies = filter === 'All'
    ? processedAllergies
    : processedAllergies.filter(allergy =>
      filter === 'Medicine' ? allergy.category === 'medication' :
        filter === 'Food' ? allergy.category === 'food' :
          true
    );

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectFilter = (value) => {
    setFilter(value);
    setIsDropdownOpen(false);
  };

  const handleAllergiesClick = async (allergy) => {
    setIsLoadingFollowUp(true);
    setIsAllergiesBoxSelected(true);

    // Create a copy of the visit data and add the allergy
    const visitWithAllergy = {
      icon: '/Allergies.svg',
      allergies: allergy.name
    };

    addSummaryMessage(patientId, visitWithAllergy);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 bg-white border border-gray-200 rounded-md animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="text-sm text-red-500">{error}</div>
      </div>
    );
  }

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
            className="p-4 text-sm bg-white border cursor-pointer border-gray-200 rounded-sm hover:bg-blue-50 transition-colors"
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