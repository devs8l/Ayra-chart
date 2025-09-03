import React, { useState, useEffect, useContext } from 'react';
import { ChevronDown, AlignLeft } from 'lucide-react';
import { MedContext } from '../../context/MedContext';
import { ChatContext } from '../../context/ChatContext';
import { fetchMedications } from '../../Services/userData'; // Import the API function

const Medicines = () => {
  const [filter, setFilter] = useState('All Medications');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setIsLoadingFollowUp, selectedUser } = useContext(MedContext);
  const [categories, setCategories] = useState(['All Medications']);
  const { addSummaryMessage } = useContext(ChatContext);

  const patientId = selectedUser?.resource?.id;

  const handleMedicinesClick = async (medicine) => {
    setIsLoadingFollowUp(true);
    const visitData = {
      medicine: medicine,
      icon: '/Medicines.svg',
    };
    addSummaryMessage(patientId, visitData, []);
  };

  // Fetch medications from API
  useEffect(() => {
    const loadMedications = async () => {
      if (!patientId) return;

      setIsLoading(true);
      setError(null);

      try {
        const medicationsData = await fetchMedications(patientId);

        if (medicationsData) {
          // Process FHIR medication data
          const medicationList = medicationsData.entry?.map(entry => {
            const resource = entry.resource;

            // Extract medication name
            const medicationName = resource.medicationCodeableConcept?.text || 'Unknown medication';

            // Extract date
            const date = resource.authoredOn ? new Date(resource.authoredOn).toLocaleDateString() : 'Unknown date';

            // Determine category based on medication name
            let category = 'Other';
            const medName = medicationName.toLowerCase();

            if (medName.includes('metformin') || medName.includes('glucophage') ||
              medName.includes('insulin') || medName.includes('glipizide')) {
              category = 'Blood Sugar';
            } else if (medName.includes('lisinopril') || medName.includes('amlodipine') ||
              medName.includes('atenolol') || medName.includes('hydrochlorothiazide')) {
              category = 'Blood Pressure';
            } else if (medName.includes('sumatriptan') || medName.includes('rizatriptan') ||
              medName.includes('topiramate')) {
              category = 'Neurological';
            } else if (medName.includes('sertraline') || medName.includes('fluoxetine') ||
              medName.includes('escitalopram') || medName.includes('duloxetine')) {
              category = 'Mental Health';
            } else if (medName.includes('albuterol') || medName.includes('inhaler') ||
              medName.includes('montelukast')) {
              category = 'Respiratory';
            }

            return {
              id: resource.id,
              name: medicationName,
              dosage: 'Dosage not specified', // FHIR data may not include dosage
              duration: 'Duration not specified', // FHIR data may not include duration
              category: category,
              date: date,
              diagnosis: 'Diagnosis not specified' // FHIR data may not include diagnosis
            };
          }) || [];

          setMedicines(medicationList);

          // Get unique categories, sorted alphabetically
          const uniqueCategories = ['All Medications', ...new Set(medicationList.map(med => med.category))].sort();
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error('Error loading medications:', err);
        setError('Failed to load medications. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMedications();
  }, [patientId]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectFilter = (value) => {
    setFilter(value);
    setIsDropdownOpen(false);
  };

  // Filter medicines based on selected category
  const filteredMedicines = filter === 'All Medications'
    ? medicines
    : medicines.filter(med => med.category === filter);

  // Sort medicines by date (newest first)
  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    // Handle cases where date might be 'Unknown date'
    if (a.date === 'Unknown date') return 1;
    if (b.date === 'Unknown date') return -1;
    return new Date(b.date) - new Date(a.date);
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 bg-white border border-gray-200 rounded-md animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
      <div className="relative w-auto">
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-between px-4 py-2 text-sm text-left bg-white border border-gray-200 rounded-md shadow-sm"
        >
          <div className="flex items-center">
            <AlignLeft className="w-4 h-4 mr-2" />
            <span className="font-medium">{filter}</span>
          </div>
          <ChevronDown className="w-4 h-4 ml-2" />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-sm">
            <ul>
              {categories.map((category, index) => (
                <li
                  key={index}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectFilter(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Medicines list */}
      <div className="flex flex-col gap-2">
        {sortedMedicines.length > 0 ? (
          sortedMedicines.map((medicine, index) => (
            <div
              key={medicine.id || index}
              onClick={() => handleMedicinesClick(medicine)}
              className="flex cursor-pointer flex-col px-4 py-4 bg-white border border-gray-200 rounded-md hover:bg-blue-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="text-sm font-medium">{medicine.name}</div>
                <div className="text-xs text-gray-500">
                  {medicine.date}
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-1">{medicine.dosage}</div>
              <div className="text-xs text-gray-500 mt-1">
                <span className="font-medium">Category:</span> {medicine.category}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <span className="font-medium">Duration:</span> {medicine.duration}
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-4 text-sm text-center text-gray-500 bg-white border border-gray-200 rounded-md">
            No medications found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Medicines;