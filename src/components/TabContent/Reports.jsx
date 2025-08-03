import React, { useContext, useState } from 'react';
import { MedContext } from '../../context/MedContext';
import { ChatContext } from '../../context/ChatContext';

const Reports = ({ patientHistory }) => {
  console.log("Patient History:", patientHistory);

  const [selectedMetric, setSelectedMetric] = useState('Blood Pressure');
  const { setIsLoadingFollowUp } = useContext(MedContext)
  const { addSummaryMessage } = useContext(ChatContext)
  const patientId = patientHistory?.rawData?._id

  const handleReportClick = async (report) => {
    setIsLoadingFollowUp(true);
    console.log("Loading started");
    const visitData = {
      healthMetrics: {
        metric: selectedMetric,
        value: report.reading,
        date: report.date.toISOString()
      },
      icon:'/Reports.svg'
    };
    addSummaryMessage(patientId, visitData, []);
  };

  const metrics = [
    'Blood Pressure',
    'Heart Rate',
    'Respiratory Rate',
    'Body Temperature',
    'Oxygen Saturation'
  ];

  // Extract data from healthMetrics based on selected metric
  const getFilteredData = () => {
    if (!patientHistory?.rawData?.healthMetrics) return [];

    const data = patientHistory.rawData.healthMetrics
      .map(metric => {
        const date = new Date(metric.date);

        let value;
        let unit;

        switch (selectedMetric) {
          case 'Blood Pressure':
            value = `${metric.bp?.systolic || 0}/${metric.bp?.diastolic || 0}`;
            unit = 'mmHg';
            break;
          case 'Heart Rate':
            value = metric.heartRate;
            unit = 'bpm';
            break;
          case 'Respiratory Rate':
            value = metric.respiratoryRate;
            unit = 'breaths/min';
            break;
          case 'Body Temperature':
            value = metric.bodyTemperature;
            unit = '°C';
            break;
          case 'Oxygen Saturation':
            value = metric.oxygenSaturation;
            unit = '%';
            break;
          default:
            value = '';
            unit = '';
        }

        return {
          date,
          value,
          reading: `${value} ${unit}`
        };
      })
      // Sort by date (newest first)
      .sort((a, b) => b.date - a.date);

    return data;
  };

  const filteredData = getFilteredData();

  // Format date as DD/MM/YYYY
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };

  return (
    <div className="w-full">
      {/* Dropdown selector */}
      <div className="w-full  py-4">
        <div className="relative inline-block w-full max-w-xs">
          <div className="flex items-center justify-between border border-gray-300 rounded px-4 py-2 bg-white">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span>{selectedMetric}</span>
            </div>
            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <select
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            {metrics.map((metric) => (
              <option key={metric} value={metric}>
                {metric}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data display */}
      <div className="w-full">
        {filteredData.length > 0 ? (
          filteredData.map((reading, index) => (
            <div key={index} onClick={() => handleReportClick(reading)} className="flex cursor-pointer justify-between items-center p-6 border mb-2 rounded-sm border-gray-200">
              <span className="text-base">
                {formatDate(reading.date)}
              </span>
              <span className="text-base text-gray-500">
                {reading.reading}
              </span>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">No data available</div>
        )}
      </div>
    </div>
  );
};

export default Reports;