import React, { useState, useEffect, useContext } from 'react';
import { ChevronDown, AlignLeft } from 'lucide-react';
import { MedContext } from '../../context/MedContext';
import { ChatContext } from '../../context/ChatContext';

const Medicines = ({ patientHistory }) => {
  const [filter, setFilter] = useState('All Medications');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const { setIsLoadingFollowUp } = useContext(MedContext)
  const [categories, setCategories] = useState(['All Medications']);
  const { addSummaryMessage } = useContext(ChatContext)
  const patientId = patientHistory?.rawData?._id

  const handleMedicinesClick = async (medicine) => {
    setIsLoadingFollowUp(true);
    console.log("Loading started");
    const visitData = {
      medicine: medicine,
      icon: '/Medicines.svg',
    };
    addSummaryMessage(patientId, visitData, []);
  };

  // Process patient data to extract medications
  useEffect(() => {
    if (patientHistory?.rawData?.visit_ids) {
      const medicationList = [];

      // Extract medications from each visit
      patientHistory.rawData.visit_ids.forEach(visit => {
        if (visit.prescription_ids?.length > 0) {
          visit.prescription_ids.forEach(prescription => {
            // Determine category based on diagnosis
            let category = 'Other';
            const diagnosis = visit.diagnosis?.toLowerCase() || '';

            if (diagnosis.includes('blood pressure')) {
              category = 'Blood Pressure';
            } else if (diagnosis.includes('blood sugar') || diagnosis.includes('diabetes')) {
              category = 'Blood Sugar';
            } else if (diagnosis.includes('migraine')) {
              category = 'Neurological';
            } else if (diagnosis.includes('anxiety') || diagnosis.includes('depression')) {
              category = 'Mental Health';
            } else if (diagnosis.includes('asthma')) {
              category = 'Respiratory';
            }

            medicationList.push({
              name: prescription.medicine_name,
              dosage: `${prescription.dosage}, ${prescription.route || 'Orally'}`,
              duration: prescription.duration,
              category: category,
              date: visit.visit_date,
              diagnosis: visit.diagnosis
            });
          });
        }
      });

      setMedicines(medicationList);

      // Get unique categories, sorted alphabetically
      const uniqueCategories = ['All Medications', ...new Set(medicationList.map(med => med.category))].sort();
      setCategories(uniqueCategories);
    }
  }, [patientHistory]);

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
  const sortedMedicines = [...filteredMedicines].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

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
              key={index}
              onClick={() => handleMedicinesClick(medicine)}
              className="flex cursor-pointer flex-col px-4 py-4 bg-white border border-gray-200 rounded-md"
            >
              <div className="flex justify-between items-start">
                <div className="text-sm font-medium">{medicine.name}</div>
                <div className="text-xs text-gray-500">
                  {new Date(medicine.date).toLocaleDateString()}
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-1">{medicine.dosage}</div>
              <div className="text-xs text-gray-500 mt-1">
                <span className="font-medium">For:</span> {medicine.diagnosis}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <span className="font-medium">Duration:</span> {medicine.duration}
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-4 text-sm text-center text-gray-500 bg-white border border-gray-200 rounded-md">
            No medications found for this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default Medicines;