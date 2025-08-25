import React, { useContext, useRef, useState, useEffect } from 'react';
import { ChevronRight, Edit, TrendingUp, TrendingDown, GripVertical } from 'lucide-react';
import { ChatContext } from '../context/ChatContext';
import { MedContext } from '../context/MedContext';
import { generatePatientPDF } from '../Services/pdfGenerator';
import { getPatientComprehensive } from '../Services/dashapi';

const MedicalDashboard = ({ isChartSelected, setIsChartSelected, setViewMode }) => {
  const { addSummaryMessage } = useContext(ChatContext);
  const { selectedUser, isGeneratePreChartClicked, setIsGeneratePreChartClicked } = useContext(MedContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const patientId = selectedUser?._id || '12345';
  const [isChartGenerated, setIsChartGenerated] = useState(false);
  const pdfRef = useRef();

  useEffect(() => {
    if (isChartSelected && !dashboardData && !isChartGenerated) {
      fetchDashboardData();
    }
  }, [dashboardData, isChartSelected,isChartGenerated]);
  

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await getPatientComprehensive('asdad');
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(sampleData);
    } finally {
      setLoading(false);
      setIsChartGenerated(true);
    }
  };

  const handleGeneratePreChartNotes = () => {
    setIsGeneratePreChartClicked(true);
    setViewMode('notes');
  };

  const handleDownloadPDF = async () => {
    if (!dashboardData) return;

    const patientData = {
      name: dashboardData.patientInfo.name,
      age: dashboardData.patientInfo.age,
      gender: dashboardData.patientInfo.gender,
      diagnosis: dashboardData.patientInfo.diagnosis,
      // Add other necessary fields
    };

    const pdf = await generatePatientPDF(patientData);
    pdf.save(`${patientData.name}_medical_report.pdf`);
  };

  const handleSummaryClick = async (sectionData, sectionType) => {
    console.log("Loading started");

    const visitData = {
      visitType: 'chart',
      noteType: sectionType,
      date: new Date().toISOString().split('T')[0],
      notes: `${sectionType} data: ${Object.entries(sectionData)
        .map(([key, val]) => `${key}: ${val}`)
        .join(', ')}`,
      icon: '/Summaries.svg',
    };

    addSummaryMessage(patientId, visitData, []);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-[#dc2626] bg-[#fef2f2]';
      case 'normal': return 'text-[#059669] bg-[#f0fdf4]';
      case 'Critical': return 'text-[#dc2626]';
      case 'Normal': return 'text-[#059669]';
      case 'Non-Critical': return 'text-[#ca8a04]';
      case 'warning': return 'text-[#ca8a04] bg-[#fefce8]';
      default: return 'text-[#4b5563]';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Critical':
      case 'critical': return 'bg-[#ef4444]';
      case 'Normal':
      case 'normal': return 'bg-[#10b981]';
      case 'Non-Critical':
      case 'warning': return 'bg-[#eab308]';
      default: return 'bg-[#9ca3af]';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-[#10b981]" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-[#ef4444]" />;
    return null; // For stable or unknown trends
  };

  const renderSection = (section) => {
    switch (section.uiType) {
      case 'cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {section.content.cards.map((item, index) => (
              <div key={index} className={`p-4 rounded-t-2xl mb-13 rounded-l-2xl relative ${item.status === 'critical' ? 'bg-[#fef2f2]' : item.status === 'warning' ? 'bg-[#fefce8]' : 'bg-[#43A55F0D]'}`}>
                <div onClick={() => handleSummaryClick(item, section.sectionTitle)} className={`absolute bottom-[-44px] cursor-pointer p-3 right-0 bg-[#f9fafb] rounded-b-xl`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M6.4 18L5 16.6L14.6 7H6V5H18V17H16V8.4L6.4 18Z" fill="#3472C9" />
                  </svg>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-[#111827]">{item.name}</h3>
                  {getTrendIcon(item.trend)}
                </div>
                <p className="text-md text-[#111827] mb-2">{item.value}</p>
                <p className="text-sm text-[#4b5563]">{item.referenceRange}</p>
              </div>
            ))}
          </div>
        );

      case 'table':
        return (
          <div className="border border-[#e5e7eb] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb]">
                  {section.content.tableHeaders.map((header, index) => (
                    <th key={index} className="text-left py-3 px-4 font-medium text-[#4b5563] text-sm border-r border-[#e5e7eb] border-b border-[#e5e7eb]">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.content.tableData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-[#e5e7eb] last:border-b-0">
                    {section.content.tableHeaders.map((header, cellIndex) => (
                      <td key={cellIndex} className="py-3 px-4 text-[#111827] text-sm border-r border-[#e5e7eb]">
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'text':
        return (
          <div className="bg-[#f9fafb] flex flex-col p-4 rounded-l-2xl rounded-t-2xl relative">
            <div
              onClick={() => handleSummaryClick(section.content, section.sectionTitle)}
              className="absolute bottom-[-40px] cursor-pointer p-3 right-0 bg-[#f9fafb] rounded-b-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6.4 18L5 16.6L14.6 7H6V5H18V17H16V8.4L6.4 18Z" fill="#3472C9" />
              </svg>
            </div>

            {/* Summary */}
            <p className="text-[#374151] mb-4">
              {section.content.summary}
            </p>

            {/* Key Points */}
            {section.content.keyPoints && section.content.keyPoints.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {section.content.keyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-center bg-[#e9e9e9] rounded-2xl px-3 py-1 text-sm text-[#374151]"
                  >
                    {/* <div className="w-2 h-2 bg-[#595a5c] rounded-full mr-2"></div> */}
                    {point}
                  </div>
                ))}
              </div>
            )}


            {/* Metrics (if provided) */}
            {section.content.metrics && Object.keys(section.content.metrics).length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-[#111827] mb-2">Metrics</h4>
                <ul className="text-sm text-[#4b5563] space-y-1">
                  {Object.entries(section.content.metrics).map(([key, val], idx) => (
                    <li key={idx}>
                      <span className="font-medium">{key}:</span> {val}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className='bg-[#f9fafb] flex flex-col p-4 rounded-l-2xl rounded-t-2xl relative'>
            <div onClick={() => handleSummaryClick(section.content, section.sectionTitle)} className='absolute bottom-[-40px] cursor-pointer p-3 right-0 bg-[#f9fafb] rounded-b-xl'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6.4 18L5 16.6L14.6 7H6V5H18V17H16V8.4L6.4 18Z" fill="#3472C9" />
              </svg>
            </div>
            <p className="text-[#374151]">
              {typeof section.content === 'string'
                ? section.content
                : JSON.stringify(section.content)}
            </p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center flex-col justify-center h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-12 object-cover mt-[-40px]"
          src="/loading-star.mkv"
        ></video>
        <p>Generating Pre-Chart...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {isChartSelected ? (
        dashboardData ? (
          <div ref={pdfRef} className="overflow-y-auto p-6 space-y-6">
            {/* Patient Overview */}
            <div className="bg-[#ffffff] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#111827] flex items-center">
                  <GripVertical className='text-[#d1d5db] ml-[-20px] mr-[20px]' />
                  Patient Overview
                </h2>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center bg-[#f9fafb] rounded-2xl px-2">
                  <div className="w-2 h-2 bg-[#10b981] rounded-full mr-2"></div>
                  <span className="text-sm text-[#059669]">All normal</span>
                </div>
                <div className="flex items-center bg-[#f9fafb] rounded-2xl px-2">
                  <div className="w-2 h-2 bg-[#eab308] rounded-full mr-2"></div>
                  <span className="text-sm text-[#ca8a04]">Warnings present</span>
                </div>
              </div>

              <div className='bg-[#f9fafb] flex flex-col p-4 rounded-l-2xl rounded-t-2xl relative'>
                <div onClick={() => handleSummaryClick(dashboardData.patientInfo, 'Patient Overview')} className='absolute bottom-[-40px] cursor-pointer p-3 right-0 bg-[#f9fafb] rounded-b-xl'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M6.4 18L5 16.6L14.6 7H6V5H18V17H16V8.4L6.4 18Z" fill="#3472C9" />
                  </svg>
                </div>
                <p className="text-[#374151] mb-4">
                  A {dashboardData.patientInfo.age}-year-old {dashboardData.patientInfo.gender},
                  is presenting for evaluation. Primary diagnosis: {dashboardData.patientInfo.diagnosis}.
                </p>
                <p className="text-[#4b5563] text-sm">
                  Last updated: {new Date(dashboardData.metadata.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Render each section from API data */}
            {dashboardData.sections.map((section, index) => (
              <div key={index} className="bg-[#ffffff] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#111827] flex items-center">
                    <GripVertical className='text-[#d1d5db] ml-[-20px] mr-[20px]' />
                    {section.sectionTitle}
                  </h2>
                </div>

                {/* Status indicators */}
                {section.statusIndicators && section.statusIndicators.length > 0 && (
                  <div className="flex items-center space-x-4 mb-6">
                    {section.statusIndicators.map((indicator, idx) => (
                      <div key={idx} className="flex items-center bg-[#f9fafb] rounded-2xl px-2">
                        <div className={`w-2 h-2 rounded-full mr-2 bg-${indicator.color}-500`}></div>
                        <span className={`text-sm text-${indicator.color}-500`}>
                          {indicator.count} {indicator.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Section content */}
                {renderSection(section)}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>No data available. Please try again.</p>
          </div>
        )
      ) : (
        <div className='flex items-center justify-center h-full'>
          <h1>Click 'Generate Pre-Chart' to Start.</h1>
        </div>
      )}

      {/* Download as PDF Button - Fixed at bottom */}
      <div className=" p-4 flex justify-end border-t border-[#e5e7eb] mt-auto">
        {isChartSelected ? (
          <div className='flex items-center gap-4'>
            <button
              onClick={handleGeneratePreChartNotes}
              className="border-[#1A73E8] border flex items-center justify-center gap-3 cursor-pointer text-xs  text-[#1A73E8] font-medium py-2 px-6 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 18 16" fill="none">
                <path d="M0 10V8H7V10H0ZM0 6V4H11V6H0ZM0 2V0H11V2H0ZM9 16V12.925L14.525 7.425C14.675 7.275 14.8417 7.16667 15.025 7.1C15.2083 7.03333 15.3917 7 15.575 7C15.775 7 15.9667 7.0375 16.15 7.1125C16.3333 7.1875 16.5 7.3 16.65 7.45L17.575 8.375C17.7083 8.525 17.8125 8.69167 17.8875 8.875C17.9625 9.05833 18 9.24167 18 9.425C18 9.60833 17.9667 9.79583 17.9 9.9875C17.8333 10.1792 17.725 10.35 17.575 10.5L12.075 16H9ZM10.5 14.5H11.45L14.475 11.45L14.025 10.975L13.55 10.525L10.5 13.55V14.5ZM14.025 10.975L13.55 10.525L14.475 11.45L14.025 10.975Z" fill="#3472C9" />
              </svg>
              Generate Pre-Chart Notes
            </button>
            <button
              onClick={handleDownloadPDF}
              className="bg-[#1A73E8] flex items-center gap-3 cursor-pointer text-xs hover:bg-[#1a56cb] text-[#ffffff] font-medium py-2 px-8 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 17 17" fill="none">
                <path d="M8.5 12.5L3.5 7.5L4.9 6.05L7.5 8.65V0.5H9.5V8.65L12.1 6.05L13.5 7.5L8.5 12.5ZM2.5 16.5C1.95 16.5 1.47917 16.3042 1.0875 15.9125C0.695833 15.5208 0.5 15.05 0.5 14.5V11.5H2.5V14.5H14.5V11.5H16.5V14.5C16.5 15.05 16.3042 15.5208 15.9125 15.9125C15.5208 16.3042 15.05 16.5 14.5 16.5H2.5Z" fill="white" />
              </svg>
              Download as PDF
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsChartSelected(true)}
            className="bg-[#1A73E8] flex items-center gap-3 cursor-pointer text-xs hover:bg-[#1a56cb] text-white font-medium py-2 px-8 rounded-md"
          >
            Generate Pre-Chart
          </button>
        )}
      </div>
    </div>
  );
};

// Sample data structure for fallback
const sampleData = {
  patientInfo: {
    name: "Jane Doe",
    age: 35,
    gender: "female",
    diagnosis: "Breast Cancer",
  },
  sections: [
    {
      sectionTitle: "Vitals",
      uiType: "cards",
      content: {
        cards: [
          {
            name: "BP",
            value: "120/80 mmHg",
            status: "normal",
            trend: "up",
            referenceRange: "Normal"
          },
          {
            name: "Sugar",
            value: "95 mg/dL",
            status: "normal",
            trend: "up",
            referenceRange: "Normal"
          }
        ]
      },
      statusIndicators: [
        {
          label: "Normal",
          color: "normal",
          count: 2
        }
      ]
    }
  ],
  metadata: {
    lastUpdated: new Date().toISOString()
  }
};

export default MedicalDashboard;