import React, { useContext, useState, useEffect } from 'react';
import { ChevronDown, AlignLeft } from 'lucide-react';
import { ChatContext } from '../../context/ChatContext';
import { MedContext } from '../../context/MedContext';
import { fetchVaccines } from '../../Services/userData'; // Import the API function

const Vaccines = () => {
  const [filter, setFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [vaccines, setVaccines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setIsLoadingFollowUp, selectedUser } = useContext(MedContext);
  const { addSummaryMessage } = useContext(ChatContext);
  const patientId = selectedUser?.resource?.id;

  const handleVaccineClick = async (vaccine) => {
    setIsLoadingFollowUp(true);
    const visitData = {
      vaccines: {
        name: vaccine.name,
        date: vaccine.date,
        type: vaccine.type,
        status: vaccine.status
      },
      icon: '/Vaccines.svg'
    };
    addSummaryMessage(patientId, visitData, []);
  };

  // Fetch vaccines from API
  useEffect(() => {
    const loadVaccines = async () => {
      if (!patientId) return;

      setIsLoading(true);
      setError(null);

      try {
        const vaccinesData = await fetchVaccines(patientId);

        if (vaccinesData) {
          // Process FHIR immunization data
          const vaccinesList = vaccinesData.entry?.map(entry => {
            const resource = entry.resource;

            // Extract vaccine name
            const vaccineName = resource.vaccineCode?.coding?.[0]?.display ||
              resource.vaccineCode?.text ||
              'Unknown vaccine';

            // Extract date
            const date = resource.occurrenceDateTime || resource.recorded || 'Unknown date';

            // Determine vaccine type based on name
            let type = 'Other';
            const vaccineNameLower = vaccineName.toLowerCase();

            if (vaccineNameLower.includes('covid') || vaccineNameLower.includes('corona')) {
              type = 'Viral';
            } else if (vaccineNameLower.includes('influenza') || vaccineNameLower.includes('flu')) {
              type = 'Seasonal';
            } else if (vaccineNameLower.includes('tetanus') || vaccineNameLower.includes('diphtheria') ||
              vaccineNameLower.includes('pertussis') || vaccineNameLower.includes('tdap')) {
              type = 'Booster';
            } else if (vaccineNameLower.includes('hpv') || vaccineNameLower.includes('human papillomavirus')) {
              type = 'Preventive';
            } else if (vaccineNameLower.includes('hepatitis')) {
              type = 'Preventive';
            }

            // Determine status
            const status = resource.status === 'completed' ? 'Completed' :
              resource.status === 'not-done' ? 'Not Done' :
                resource.status || 'Unknown';

            return {
              id: resource.id,
              name: vaccineName,
              date: date,
              type: type,
              status: status,
              lotNumber: resource.lotNumber,
              expirationDate: resource.expirationDate,
              site: resource.site?.coding?.[0]?.display
            };
          }) || [];

          setVaccines(vaccinesList);
        }
      } catch (err) {
        console.error('Error loading vaccines:', err);
        setError('Failed to load vaccines. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadVaccines();
  }, [patientId]);

  // Filter vaccines based on selection
  const filteredVaccines = filter === 'All'
    ? vaccines
    : vaccines.filter(vaccine => vaccine.type === filter || vaccine.status === filter);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectFilter = (value) => {
    setFilter(value);
    setIsDropdownOpen(false);
  };

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
        {filteredVaccines.length > 0 ? (
          filteredVaccines.map((vaccine, index) => (
            <div
              key={vaccine.id || index}
              onClick={() => handleVaccineClick(vaccine)}
              className="flex flex-col p-4 cursor-pointer bg-white border border-gray-200 rounded-md hover:bg-blue-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="text-sm font-medium">{vaccine.name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(vaccine.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-gray-600">Type: {vaccine.type}</span>
                <span className={`text-sm px-2 py-1 rounded-full ${vaccine.status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : vaccine.status === 'Not Done'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {vaccine.status}
                </span>
              </div>
              {vaccine.lotNumber && (
                <div className="text-xs text-gray-500 mt-1">
                  <span className="font-medium">Lot #:</span> {vaccine.lotNumber}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-sm text-center text-gray-500 bg-white border border-gray-200 rounded-md">
            No vaccines found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Vaccines;