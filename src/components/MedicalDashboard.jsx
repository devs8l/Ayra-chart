import React, { useContext } from 'react';
import { ChevronRight, Edit, TrendingUp, TrendingDown, GripVertical } from 'lucide-react';
import { ChatContext } from '../context/ChatContext';
import { MedContext } from '../context/MedContext';

const MedicalDashboard = () => {
  const { addSummaryMessage } = useContext(ChatContext)
  // Temporary data
  const { selectedUser } = useContext(MedContext);
  const patientId = selectedUser?._id || '12345';
  const patientData = {
    name: selectedUser?.name || "Jane Doe",
    age: 35,
    gender: selectedUser?.gender || "female",
    visitReason: "pre-chemo checkup prior to her 3rd cycle",
    previousCycles: 2,
    medications: ["Doxorubicin", "Cyclophosphamide"],
    diagnosis: "Breast Cancer",
    sideEffects: "Moderate nausea, moderate fatigue & severe hair loss"
  };
  const handleSummaryClick = async (sectionData, sectionType) => {
    console.log("Loading started");

    const visitData = {
      visitType: 'chart',
      noteType: sectionType,
      date: new Date().toISOString().split('T')[0], // Current date
      notes: `${sectionType} data: ${Object.entries(sectionData)
        .map(([key, val]) => `${key}: ${val}`)
        .join(', ')}`,
      icon: '/Summaries.svg',
    };

    addSummaryMessage(patientId, visitData, []);
  };

  const bloodEssentials = [
    { name: "WBC", value: "4.2 x 10³/μL", status: "normal", trend: "up" },
    { name: "RBC", value: "4.5 x 10¹²/L", status: "normal", trend: "up" },
    { name: "Hemoglobin", value: "10.2 g/dL", status: "critical", trend: "down" },
    { name: "PLT", value: "145 x 10³/μL", status: "normal", trend: "up" },
    { name: "CA 15-3", value: "35 U/mL", status: "critical", trend: "down" },
    { name: "NT-proBNP", value: "420 pg/mL", status: "critical", trend: "down" },
    { name: "LVEF", value: "49%", status: "normal", trend: "up" }
  ];

  const medications = [
    { name: "Doxorubicin", dose: "60 mg/m²" },
    { name: "Cyclophosphamide", dose: "600 mg/m²" },
    { name: "Ondansetron", dose: "8 mg" },
    { name: "Vitamin B12", dose: "1000 mcg" }
  ];

  const vitals = [
    { name: "BP", value: "120/80 mmHg", status: "normal", trend: "up" },
    { name: "Sugar", value: "95 mg/dL", status: "normal", trend: "up" },
    { name: "Blood (O2)", value: "97%", status: "normal", trend: "up" },
    { name: "Heart Rate", value: "72 bpm", status: "normal", trend: "up" }
  ];

  const vitalStatusTags = [
    { vital: "WBC", value: "4.2 x 10³/μL", period: "1 mo", status: "Normal" },
    { vital: "ANC", value: "2.7 x 10³/μL", period: "1 mo", status: "Normal" },
    { vital: "Hemoglobin", value: "10.2 g/dL", period: "1 mo", status: "Critical" },
    { vital: "Platelets", value: "220 x 10³/μL", period: "1 mo", status: "Non-Critical" },
    { vital: "WBC Nadir (Cycle 1)", value: "1.8 x 10³/μL", period: "3w (post-C1)", status: "Normal" },
    { vital: "ANC Nadir (Cycle 2)", value: "0.9 x 10³/μL", period: "1w (post-C2)", status: "Normal" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'normal': return 'text-green-600 bg-green-50';
      case 'Critical': return 'text-red-600';
      case 'Normal': return 'text-green-600';
      case 'Non-Critical': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Critical': return 'bg-red-500';
      case 'Normal': return 'bg-green-500';
      case 'Non-Critical': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable content area */}
      <div className=" overflow-y-auto p-6 space-y-6">
        {/* Clinical Overview */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <GripVertical className='text-gray-300 ml-[-20px] mr-[20px]' />
              Clinical Overview
            </h2>
            <div className="flex items-center space-x-4">
              <Edit className="w-4 h-4 text-gray-400 cursor-pointer" />
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4 ">
            <div className="flex items-center bg-gray-50 rounded-2xl px-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-green-600">All normal</span>
            </div>
            <div className="flex items-center bg-gray-50 rounded-2xl px-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-yellow-600">Side-effects reported</span>
            </div>
          </div>
          <div className='bg-gray-50 flex flex-col p-4 rounded-l-2xl rounded-t-2xl relative'>
            <div onClick={() => handleSummaryClick(patientData, 'Clinical Overview')} className='absolute bottom-[-40px] cursor-pointer p-3 right-0 bg-gray-50 rounded-b-xl'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6.4 18L5 16.6L14.6 7H6V5H18V17H16V8.4L6.4 18Z" fill="#3472C9" />
              </svg>
            </div>
            <p className="text-gray-700 mb-4">
              {patientData.name}, a {patientData.age}-year-old {patientData.gender}, is presenting for her {patientData.visitReason}. She
              has previously tolerated {patientData.previousCycles} cycles of chemotherapy ({" "}
              <span className="text-blue-600">{patientData.medications.join(" and ")}</span>). Her
              primary diagnosis is {patientData.diagnosis}.
            </p>

            <p className="text-gray-700 mb-4">
              Side effects reported: {patientData.sideEffects}
            </p>

            <p className="text-gray-600 text-sm">
              No critical alerts are recorded at this time, though continuous monitoring is recommended.
            </p>
          </div>
        </div>

        {/* Blood Essentials */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <GripVertical className='text-gray-300 ml-[-20px] mr-[20px]' />
              Blood Essentials
            </h2>
          </div>

          <div className="flex items-center space-x-6 mb-6 text-sm">
            <div className="flex items-center bg-gray-50 rounded-2xl px-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span className="text-red-600">3 Critical Concerns</span>
            </div>
            <div className="flex items-center bg-gray-50 rounded-2xl px-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-yellow-600">2 Non-Critical Concern</span>
            </div>
            <div className="flex items-center bg-gray-50 rounded-2xl px-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-green-600">2 Positive Progress</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {bloodEssentials.map((item, index) => (
              <div key={index} className={`p-4 rounded-t-2xl mb-13 rounded-l-2xl relative ${item.status === 'critical' ? 'bg-red-50 ' : 'bg-[#43A55F0D] '}`}>
                <div onClick={() => handleSummaryClick(item, 'Blood Essentials')} className={`absolute bottom-[-44px] cursor-pointer p-3 right-0 bg-gray-50 rounded-b-xl`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M6.4 18L5 16.6L14.6 7H6V5H18V17H16V8.4L6.4 18Z" fill="#3472C9" />
                  </svg>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  {getTrendIcon(item.trend)}
                </div>
                <p className="text-md  text-gray-900 mb-2">{item.value}</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3.37995 2.71442V6.67925V6.66659V13.2854V2.71442ZM4.66545 9.34525H7.02261C7.13328 9.07636 7.26728 8.82614 7.42461 8.59459C7.58184 8.36303 7.76334 8.14886 7.96911 7.95209H4.66545V9.34525ZM4.66545 12.0119H6.76211C6.71189 11.779 6.68045 11.5461 6.66778 11.3133C6.65512 11.0805 6.66389 10.849 6.69412 10.6188H4.66545V12.0119ZM3.37995 14.8021C2.96017 14.8021 2.60245 14.6543 2.30678 14.3586C2.01111 14.0629 1.86328 13.7052 1.86328 13.2854V2.71442C1.86328 2.29464 2.01111 1.93692 2.30678 1.64125C2.60245 1.34559 2.96017 1.19775 3.37995 1.19775H8.72128L12.8009 5.27742V7.01192C12.5606 6.9097 12.3134 6.83159 12.0593 6.77759C11.8052 6.72359 11.5468 6.69081 11.2843 6.67925V6.04775H7.95095V2.71442H3.37995V13.2854H7.26111C7.43623 13.5893 7.64223 13.8711 7.87912 14.1308C8.11589 14.3904 8.37956 14.6142 8.67012 14.8021H3.37995ZM11.0854 12.6666C11.5262 12.6666 11.8991 12.5144 12.2041 12.2101C12.509 11.9058 12.6614 11.5333 12.6614 11.0926C12.6614 10.6518 12.5093 10.279 12.2049 9.97409C11.9006 9.66909 11.5281 9.51659 11.0874 9.51659C10.6467 9.51659 10.2738 9.66875 9.96895 9.97309C9.66395 10.2774 9.51145 10.6499 9.51145 11.0906C9.51145 11.5314 9.66362 11.9042 9.96795 12.2091C10.2723 12.5141 10.6448 12.6666 11.0854 12.6666ZM14.4864 15.5564L12.6704 13.7406C12.4371 13.8881 12.1861 13.9988 11.9174 14.0726C11.6487 14.1464 11.3717 14.1833 11.0864 14.1833C10.2277 14.1833 9.49773 13.8827 8.89662 13.2816C8.29539 12.6804 7.99478 11.9504 7.99478 11.0916C7.99478 10.2328 8.29539 9.50281 8.89662 8.90159C9.49773 8.30048 10.2277 7.99992 11.0864 7.99992C11.9452 7.99992 12.6752 8.30048 13.2764 8.90159C13.8776 9.50281 14.1781 10.2328 14.1781 11.0916C14.1781 11.3768 14.1412 11.6538 14.0674 11.9226C13.9937 12.1913 13.883 12.4423 13.7354 12.6756L15.5513 14.4916L14.4864 15.5564Z" fill="#222836" fill-opacity="0.4" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M5.4987 14.6668C4.3382 14.6668 3.35364 14.2625 2.54499 13.4539C1.73635 12.6452 1.33203 11.6607 1.33203 10.5002C1.33203 9.94461 1.43697 9.41374 1.64685 8.90757C1.85672 8.4014 2.15919 7.95078 2.55425 7.55572L7.55425 2.55572C7.94932 2.16066 8.39993 1.85819 8.90611 1.64831C9.41228 1.43843 9.94314 1.3335 10.4987 1.3335C11.6592 1.3335 12.6438 1.73782 13.4524 2.54646C14.261 3.3551 14.6654 4.33967 14.6654 5.50016C14.6654 6.05572 14.5604 6.58658 14.3505 7.09276C14.1407 7.59893 13.8382 8.04955 13.4431 8.44461L8.44314 13.4446C8.04808 13.8397 7.59746 14.1421 7.09129 14.352C6.58512 14.5619 6.05425 14.6668 5.4987 14.6668ZM10.4246 9.37053L12.4061 7.40757C12.653 7.16066 12.8444 6.87053 12.9802 6.5372C13.116 6.20387 13.1839 5.85819 13.1839 5.50016C13.1839 4.75942 12.9215 4.12671 12.3968 3.60201C11.8722 3.07732 11.2394 2.81498 10.4987 2.81498C10.1407 2.81498 9.79499 2.88288 9.46166 3.01868C9.12833 3.15448 8.8382 3.34584 8.59129 3.59276L6.62833 5.57424L10.4246 9.37053ZM5.4987 13.1853C5.85672 13.1853 6.2024 13.1174 6.53574 12.9816C6.86907 12.8458 7.15919 12.6545 7.40611 12.4076L9.36907 10.4261L5.57277 6.62979L3.59129 8.59276C3.34438 8.83967 3.15302 9.12979 3.01722 9.46313C2.88141 9.79646 2.81351 10.1421 2.81351 10.5002C2.81351 11.2409 3.07586 11.8736 3.60055 12.3983C4.12524 12.923 4.75796 13.1853 5.4987 13.1853Z" fill="#222836" fill-opacity="0.4" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chemotherapy Medications */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <GripVertical className='text-gray-300 ml-[-20px] mr-[20px]' />
              Chemotherapy Medications
            </h2>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications.map((med, index) => (
              <div key={index} className="p-4 bg-gray-50 mb-10 rounded-l-2xl rounded-t-2xl relative">
                <div onClick={() => handleSummaryClick(med, 'Chemotherapy Medications')} className='absolute bottom-[-40px] cursor-pointer p-3 right-0 bg-gray-50 rounded-b-xl'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M6.4 18L5 16.6L14.6 7H6V5H18V17H16V8.4L6.4 18Z" fill="#3472C9" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{med.name}</h3>
                <p className="text-gray-600 mb-4">{med.dose}</p>
                <div className="flex items-center justify-between">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M2.37995 1.71442V5.67925V5.66659V12.2854V1.71442ZM3.66545 8.34525H6.02261C6.13328 8.07636 6.26728 7.82614 6.42461 7.59459C6.58184 7.36303 6.76334 7.14886 6.96911 6.95209H3.66545V8.34525ZM3.66545 11.0119H5.76211C5.71189 10.779 5.68045 10.5461 5.66778 10.3133C5.65512 10.0805 5.66389 9.84898 5.69412 9.61875H3.66545V11.0119ZM2.37995 13.8021C1.96017 13.8021 1.60245 13.6543 1.30678 13.3586C1.01111 13.0629 0.863281 12.7052 0.863281 12.2854V1.71442C0.863281 1.29464 1.01111 0.93692 1.30678 0.641254C1.60245 0.345587 1.96017 0.197754 2.37995 0.197754H7.72128L11.8009 4.27742V6.01192C11.5606 5.9097 11.3134 5.83159 11.0593 5.77759C10.8052 5.72359 10.5468 5.69081 10.2843 5.67925V5.04775H6.95095V1.71442H2.37995V12.2854H6.26111C6.43623 12.5893 6.64223 12.8711 6.87912 13.1308C7.11589 13.3904 7.37956 13.6142 7.67012 13.8021H2.37995ZM10.0854 11.6666C10.5262 11.6666 10.8991 11.5144 11.2041 11.2101C11.509 10.9058 11.6614 10.5333 11.6614 10.0926C11.6614 9.65181 11.5093 9.27898 11.2049 8.97409C10.9006 8.66909 10.5281 8.51659 10.0874 8.51659C9.64667 8.51659 9.27384 8.66875 8.96895 8.97309C8.66395 9.27742 8.51145 9.64992 8.51145 10.0906C8.51145 10.5314 8.66362 10.9042 8.96795 11.2091C9.27228 11.5141 9.64478 11.6666 10.0854 11.6666ZM13.4864 14.5564L11.6704 12.7406C11.4371 12.8881 11.1861 12.9988 10.9174 13.0726C10.6487 13.1464 10.3717 13.1833 10.0864 13.1833C9.22767 13.1833 8.49773 12.8827 7.89662 12.2816C7.29539 11.6804 6.99478 10.9504 6.99478 10.0916C6.99478 9.23281 7.29539 8.50281 7.89662 7.90159C8.49773 7.30048 9.22767 6.99992 10.0864 6.99992C10.9452 6.99992 11.6752 7.30048 12.2764 7.90159C12.8776 8.50281 13.1781 9.23281 13.1781 10.0916C13.1781 10.3768 13.1412 10.6538 13.0674 10.9226C12.9937 11.1913 12.883 11.4423 12.7354 11.6756L14.5513 13.4916L13.4864 14.5564Z" fill="#222836" fill-opacity="0.4" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Holistic Treatment Results */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <GripVertical className='text-gray-300 ml-[-20px] mr-[20px]' />
              Holistic treatment results
            </h2>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center bg-gray-50 rounded-2xl px-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-green-600">All normal</span>
            </div>
            <div className="flex items-center bg-gray-50 rounded-2xl px-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">Positive Progress</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-gray-50 rounded-2xl p-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Tumour Size Reduction</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Current: <span className="font-medium">2.5 cm</span></p>
              <p className="text-sm text-gray-600 mb-4">
                Confirmed a 26.5% tumour reduction, healthy blood count recovery (WBC nadir 3.3 x 10³/μL
                post-Cycle 1, recovering to 4.2 x 10³/μL before Cycle 2).
              </p>
            </div>
            <div className="flex justify-center">
              <img className='rounded-2xl' src="/chemo.png" alt="" />
            </div>
          </div>
        </div>

        {/* Vitals */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <GripVertical className='text-gray-300 ml-[-20px] mr-[20px]' />
              Vitals
            </h2>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center bg-gray-50 rounded-2xl px-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-green-600">All normal</span>
            </div>
            <div className="flex items-center bg-gray-50 rounded-2xl px-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">Positive Progress</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {vitals.map((vital, index) => (
              <div key={index} className="p-4 bg-[#43A55F0D] rounded-t-2xl rounded-l-2xl relative">
                <div onClick={() => handleSummaryClick(vital, 'Vitals Overview')} className='absolute bottom-[-44px] cursor-pointer p-3 right-0 bg-gray-50 rounded-b-xl'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M6.4 18L5 16.6L14.6 7H6V5H18V17H16V8.4L6.4 18Z" fill="#3472C9" />
                  </svg>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{vital.name}</h3>
                  {getTrendIcon(vital.trend)}
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">{vital.value}</p>
                <div className="flex items-center justify-between">
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vital Status Tags */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <GripVertical className="text-gray-300 w-5 h-5 mr-3" />
              Vital Status Tags
            </h2>
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-4">Hematological Status</h3>
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm border-r border-gray-200 border-b border-gray-200">Vital</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm border-r border-gray-200 border-b border-gray-200">Value</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm border-r border-gray-200 border-b border-gray-200">Period</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm border-r border-gray-200 border-b border-gray-200">Status</th>
                </tr>
              </thead>
              <tbody>
                {vitalStatusTags.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 last:border-b-0">
                    <td className="py-3 px-4 text-gray-900 text-sm border-r border-gray-200">{item.vital}</td>
                    <td className="py-3 px-4 text-gray-900 text-sm border-r border-gray-200">{item.value}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm border-r border-gray-200">{item.period}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(item.status)}`}></div>
                        <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Download as PDF Button - Fixed at bottom */}
      <div className="mb-17 p-4 flex justify-end border-t border-gray-200 mt-auto">
        <button
          className="bg-[#1A73E8] flex items-center gap-3 cursor-pointer text-xs hover:bg-blue-600 text-white font-medium py-2 px-8 rounded-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 17 17" fill="none">
            <path d="M8.5 12.5L3.5 7.5L4.9 6.05L7.5 8.65V0.5H9.5V8.65L12.1 6.05L13.5 7.5L8.5 12.5ZM2.5 16.5C1.95 16.5 1.47917 16.3042 1.0875 15.9125C0.695833 15.5208 0.5 15.05 0.5 14.5V11.5H2.5V14.5H14.5V11.5H16.5V14.5C16.5 15.05 16.3042 15.5208 15.9125 15.9125C15.5208 16.3042 15.05 16.5 14.5 16.5H2.5Z" fill="white" />
          </svg>
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default MedicalDashboard;