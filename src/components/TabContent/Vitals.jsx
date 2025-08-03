import React, { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { MedContext } from '../../context/MedContext';

const Vitals = ({ userData, patientHistory }) => {
  // Default data structure that matches your image
  const defaultVitals = [
    { name: 'Blood Pressure', value: '120/80 mmHg' },
    { name: 'Blood Sugar', value: '95 mg/dL' },
    { name: 'Blood Oxygen Rate', value: '98%' }
  ];
  const { setIsLoadingFollowUp } = useContext(MedContext)
  const { addSummaryMessage } = useContext(ChatContext)
  const patientId = patientHistory?.rawData?._id

  const handleVitalsClick = async (vital) => {
    setIsLoadingFollowUp(true);
    console.log("Loading started");
    const visitData = {
      vitalData: {
        vitalName: vital.name,
        vitalValue: vital.value,
      },
      icon:'/Vitals.svg'
    }

    addSummaryMessage(patientId, visitData, []);
  };

  // Use provided data or fall back to defaults
  const displayData = defaultVitals;

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg">
      {displayData.map((vital, index) => (
        <div key={index} onClick={() => handleVitalsClick(vital)} className="p-4 text-sm cursor-pointer bg-white border flex items-center justify-between border-gray-200 rounded-sm ">
          <span className="text-gray-600">{vital.name}</span>
          <span className="font-medium">{vital.value}</span>
        </div>
      ))}
    </div>
  );
};



export default Vitals;