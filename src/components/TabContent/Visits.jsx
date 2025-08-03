import React, { useContext, useState } from 'react';
import { ChevronDown, AlignLeft, Calendar, Stethoscope, Clock, ClipboardList, Pill } from 'lucide-react';
import { ChatContext } from '../../context/ChatContext';
import { MedContext } from '../../context/MedContext';

const Visits = ({ patientHistory }) => {
  const [filter, setFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedVisit, setExpandedVisit] = useState(null);
  const { setIsLoadingFollowUp } = useContext(MedContext)
  const { addSummaryMessage } = useContext(ChatContext)
  const patientId = patientHistory?.rawData?._id

  const handleVisitClick = async (visit) => {
    setIsLoadingFollowUp(true);

    // Structure all relevant visit data
    const visitData = {
      visitType: 'medicalVisit',
      icon:'/Visits.svg',
      date: visit.visit_date,
      formattedDate: formatDate(visit.visit_date),
      doctor: {
        name: visit.doctor_id.name,
        specialization: visit.doctor_id.specialization
      },
      diagnosis: visit.diagnosis,
      notes: visit.notes,
      duration: getVisitDuration(visit.visit_date),
      prescriptions: visit.prescription_ids?.map(p => ({
        medicine: p.medicine_name,
        dosage: p.dosage,
        duration: p.duration
      })),
      treatments: visit.treatment_ids?.map(t => ({
        procedure: t.procedure,
        result: t.result
      }))
    };

    addSummaryMessage(patientId, visitData, []);
  };
  // Extract visits from patientHistory
  const visits = patientHistory?.rawData?.visit_ids || [];

  // Get unique specializations for filter options
  const specializations = ['All', ...new Set(
    visits.map(visit => visit.doctor_id.specialization)
  )];

  // Filter visits based on selection
  const filteredVisits = filter === 'All'
    ? visits
    : visits.filter(visit => visit.doctor_id.specialization === filter);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectFilter = (value) => {
    setFilter(value);
    setIsDropdownOpen(false);
  };

  const toggleVisitExpansion = (visitId) => {
    setExpandedVisit(expandedVisit === visitId ? null : visitId);
  };

  // Format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Calculate duration between visit date and now
  const getVisitDuration = (visitDate) => {
    const now = new Date();
    const visit = new Date(visitDate);
    const diff = Math.floor((now - visit) / (1000 * 60)); // in minutes
    return diff > 60 ? `${Math.floor(diff / 60)}h ${diff % 60}m` : `${diff}m`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filter dropdown */}
      <div className="relative w-40">
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
              {specializations.map((spec, index) => (
                <li
                  key={index}
                  className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectFilter(spec)}
                >
                  {spec}
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
              key={visit._id} onClick={() => handleVisitClick(visit)}
              className="p-4 bg-white border cursor-pointer border-gray-200 rounded-md"
            >
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(visit.visit_date)}</span>
              </div>

              <div className="flex items-center gap-2 font-medium mb-1">
                <Stethoscope className="w-4 h-4 text-blue-500" />
                <span>{visit.doctor_id.name}</span>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                {visit.doctor_id.specialization} • {visit.diagnosis}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Clock className="w-4 h-4" />
                <span>{getVisitDuration(visit.visit_date)} consultation</span>
              </div>

              <button
                onClick={() => toggleVisitExpansion(visit._id)}
                className="text-sm text-blue-600 hover:text-blue-800 mb-2"
              >
                {expandedVisit === visit._id ? 'Show less' : 'Show details'}
              </button>

              {expandedVisit === visit._id && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="mb-3">
                    <h4 className="flex items-center gap-2 text-sm font-medium mb-1">
                      <ClipboardList className="w-4 h-4" />
                      <span>Notes</span>
                    </h4>
                    <p className="text-sm text-gray-600">{visit.notes}</p>
                  </div>

                  {visit.prescription_ids?.length > 0 && (
                    <div className="mb-3">
                      <h4 className="flex items-center gap-2 text-sm font-medium mb-1">
                        <Pill className="w-4 h-4" />
                        <span>Prescriptions</span>
                      </h4>
                      <ul className="text-sm text-gray-600">
                        {visit.prescription_ids.map(prescription => (
                          <li key={prescription._id} className="mb-1">
                            {prescription.medicine_name} - {prescription.dosage} for {prescription.duration}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {visit.treatment_ids?.length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-medium mb-1">
                        <ClipboardList className="w-4 h-4" />
                        <span>Treatments</span>
                      </h4>
                      <ul className="text-sm text-gray-600">
                        {visit.treatment_ids.map(treatment => (
                          <li key={treatment._id} className="mb-1">
                            {treatment.procedure}: {treatment.result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 bg-white border border-gray-200 rounded-md">
            No visits found
          </div>
        )}
      </div>
    </div>
  );
};

export default Visits;