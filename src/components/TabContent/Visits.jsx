import React, { useContext, useState, useEffect } from 'react';
import { ChevronDown, AlignLeft, Calendar, Stethoscope, Clock, ClipboardList, Pill } from 'lucide-react';
import { ChatContext } from '../../context/ChatContext';
import { MedContext } from '../../context/MedContext';
import { fetchVisits } from '../../Services/userData';

const Visits = () => {
  const [filter, setFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedVisit, setExpandedVisit] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setIsLoadingFollowUp, selectedUser } = useContext(MedContext);
  const { addSummaryMessage } = useContext(ChatContext);
  
  const patientId = selectedUser?.resource?.id;

  // Parse FHIR encounter data into a more usable format
  const parseFHIRVisits = (bundle) => {
    if (!bundle || !bundle.entry) return [];

    return bundle.entry.map(entry => {
      const resource = entry.resource;
      return {
        id: resource.id,
        status: resource.status,
        type: resource.type?.coding?.[0]?.display || 'Medical Visit',
        startDate: resource.period?.start,
        endDate: resource.period?.end,
        reason: resource.reasonCode?.[0]?.text || 'No reason provided',
        location: resource.location?.[0]?.location?.display || 'Unknown location',
        serviceProvider: resource.serviceProvider?.display || 'Unknown provider'
      };
    });
  };

  useEffect(() => {
    const loadVisits = async () => {
      if (!patientId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchVisits(patientId);
        const parsedVisits = parseFHIRVisits(data);
        setVisits(parsedVisits);
      } catch (err) {
        console.error('Error loading visits:', err);
        setError('Failed to load visits. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadVisits();
  }, [patientId]);

  const handleVisitClick = async (visit) => {
    setIsLoadingFollowUp(true);

    const visitData = {
      visitType: 'medicalVisit',
      icon: '/Visits.svg',
      date: visit.startDate,
      formattedDate: formatDate(visit.startDate),
      type: visit.type,
      reason: visit.reason,
      location: visit.location,
      provider: visit.serviceProvider,
      status: visit.status
    };

    addSummaryMessage(patientId, visitData, []);
  };

  // Get unique visit types for filter options
  const visitTypes = ['All', ...new Set(visits.map(visit => visit.type))];

  // Filter visits based on selection
  const filteredVisits = filter === 'All'
    ? visits
    : visits.filter(visit => visit.type === filter);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectFilter = (value) => {
    setFilter(value);
    setIsDropdownOpen(false);
  };

  const toggleVisitExpansion = (visitId, e) => {
    e.stopPropagation(); // Prevent triggering the visit click
    setExpandedVisit(expandedVisit === visitId ? null : visitId);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate duration between start and end dates
  const getVisitDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Duration not available';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.floor((end - start) / (1000 * 60)); // in minutes
    
    if (diff < 60) return `${diff} minutes`;
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  if (loading) {
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
        <div className="p-4 text-center text-red-500 bg-white border border-red-200 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filter dropdown */}
      <div className="relative w-48">
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-between w-full px-3 py-2 text-sm text-left bg-white border border-gray-200 rounded-md shadow-sm"
        >
          <div className="flex items-center">
            <AlignLeft className="w-4 h-4 mr-2" />
            <span className="font-medium">{filter}</span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-xl">
            <ul>
              {visitTypes.map((type, index) => (
                <li
                  key={index}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectFilter(type)}
                >
                  {type}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Visits list */}
      <div className="flex flex-col gap-3">
        {filteredVisits.length > 0 ? (
          filteredVisits.map((visit) => (
            <div
              key={visit.id}
              onClick={() => handleVisitClick(visit)}
              className="p-4 bg-white border cursor-pointer border-gray-200 rounded-md hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {formatDate(visit.startDate)}
                  {visit.startDate && formatTime(visit.startDate) && ` at ${formatTime(visit.startDate)}`}
                </span>
              </div>

              <div className="flex items-center gap-2 font-medium mb-1">
                <Stethoscope className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{visit.type}</span>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                Status: <span className="capitalize">{visit.status}</span>
                {visit.location && ` • ${visit.location}`}
              </div>

              {visit.startDate && visit.endDate && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{getVisitDuration(visit.startDate, visit.endDate)}</span>
                </div>
              )}

              <button
                onClick={(e) => toggleVisitExpansion(visit.id, e)}
                className="text-sm text-blue-600 hover:text-blue-800 mb-2"
              >
                {expandedVisit === visit.id ? 'Show less' : 'Show details'}
              </button>

              {expandedVisit === visit.id && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="mb-3">
                    <h4 className="flex items-center gap-2 text-sm font-medium mb-1">
                      <ClipboardList className="w-4 h-4" />
                      <span>Reason for Visit</span>
                    </h4>
                    <p className="text-sm text-gray-600">{visit.reason}</p>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p><strong>Provider:</strong> {visit.serviceProvider}</p>
                    {visit.endDate && (
                      <p><strong>Ended:</strong> {formatDate(visit.endDate)} {formatTime(visit.endDate)}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 bg-white border border-gray-200 rounded-md">
            No visits found for this patient
          </div>
        )}
      </div>
    </div>
  );
};

export default Visits;