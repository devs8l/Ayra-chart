import React, { useContext, useState, useEffect } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { MedContext } from '../../context/MedContext';
import { fetchVitals } from '../../Services/userData';

const Vitals = () => {
  const [vitalsData, setVitalsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setIsLoadingFollowUp,selectedUser } = useContext(MedContext);
  const { addSummaryMessage } = useContext(ChatContext);

  const patientId = selectedUser?.resource?.id;
  // Function to parse FHIR data and extract key vitals
  const parseVitalsFromFHIR = (bundle) => {
    const vitalsMap = {};
    const latestVitals = {};
    
    if (!bundle || !bundle.entry) return [];

    // Process each observation entry
    bundle.entry.forEach(entry => {
      const resource = entry.resource;
      if (resource.resourceType === 'Observation' && resource.status === 'final') {
        const code = resource.code?.coding?.[0]?.code;
        const display = resource.code?.coding?.[0]?.display;
        const value = resource.valueQuantity?.value;
        const unit = resource.valueQuantity?.unit;
        const date = resource.effectiveDateTime;
        
        if (value && date) {
          // Keep only the latest reading for each vital type
          if (!vitalsMap[code] || new Date(date) > new Date(vitalsMap[code].date)) {
            vitalsMap[code] = {
              code,
              display,
              value,
              unit,
              date
            };
          }
        }
      }
    });

    // Map to common vital names and format values
    Object.values(vitalsMap).forEach(vital => {
      switch (vital.code) {
        case '85354-9': // Blood pressure panel
        case '8480-6': // Systolic
        case '8462-4': // Diastolic
          if (!latestVitals.bloodPressure) {
            const systolic = vitalsMap['8480-6']?.value;
            const diastolic = vitalsMap['8462-4']?.value;
            if (systolic && diastolic) {
              latestVitals.bloodPressure = {
                name: 'Blood Pressure',
                value: `${systolic}/${diastolic} mmHg`,
                rawValue: { systolic, diastolic }
              };
            }
          }
          break;
        
        case '8867-4': // Heart rate
          latestVitals.heartRate = {
            name: 'Heart Rate',
            value: `${vital.value} ${vital.unit}`,
            rawValue: vital.value
          };
          break;
        
        case '59408-5': // Oxygen saturation
        case '2708-6':
          latestVitals.oxygenSaturation = {
            name: 'Blood Oxygen',
            value: `${vital.value}%`,
            rawValue: vital.value
          };
          break;
        
        case '8310-5': // Temperature
          latestVitals.temperature = {
            name: 'Temperature',
            value: `${vital.value} °F`,
            rawValue: vital.value
          };
          break;
        
        case '9279-1': // Respiratory rate
          latestVitals.respiratoryRate = {
            name: 'Respiratory Rate',
            value: `${vital.value} /min`,
            rawValue: vital.value
          };
          break;
        
        case '29463-7': // Weight
          latestVitals.weight = {
            name: 'Weight',
            value: `${vital.value} lbs`,
            rawValue: vital.value
          };
          break;
        
        case '8302-2': // Height
          latestVitals.height = {
            name: 'Height',
            value: `${vital.value} inches`,
            rawValue: vital.value
          };
          break;
        
        case '39156-5': // BMI
          latestVitals.bmi = {
            name: 'BMI',
            value: vital.value.toFixed(1),
            rawValue: vital.value
          };
          break;
        
        default:
          break;
      }
    });

    // Return in a consistent order
    return [
      latestVitals.bloodPressure,
      latestVitals.heartRate,
      latestVitals.oxygenSaturation,
      latestVitals.temperature,
      latestVitals.respiratoryRate,
      latestVitals.weight,
      latestVitals.height,
      latestVitals.bmi
    ].filter(Boolean);
  };

  useEffect(() => {
    const loadVitals = async () => {
      try {
        setLoading(true);
        const data = await fetchVitals(patientId);
        const parsedVitals = parseVitalsFromFHIR(data);
        setVitalsData(parsedVitals);
      } catch (error) {
        console.error('Error fetching vitals:', error);
        // Fall back to default data if fetch fails
        setVitalsData([
          { name: 'Blood Pressure', value: '120/80 mmHg' },
          { name: 'Heart Rate', value: '72 /min' },
          { name: 'Blood Oxygen', value: '98%' },
          { name: 'Temperature', value: '98.6 °F' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadVitals();
  }, []);

  const handleVitalsClick = async (vital) => {
    setIsLoadingFollowUp(true);
    console.log("Loading started");
    console.log(vital);
    
    
    const visitData = {
      visitType: 'vital',
      vitalData: {
        vitalName: vital.name,
        vitalValue: vital.value,
      },
      icon: '/Vitals.svg'
    };

    addSummaryMessage(patientId, visitData, []);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4 bg-white rounded-lg">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 text-sm bg-white border border-gray-200 rounded-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg">
      {vitalsData.length > 0 ? (
        vitalsData.map((vital, index) => (
          <div 
            key={index} 
            onClick={() => handleVitalsClick(vital)} 
            className="p-4 text-sm cursor-pointer bg-white border flex items-center justify-between border-gray-200 rounded-sm hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-600 font-medium">{vital.name}</span>
            <span className="font-semibold text-gray-600">{vital.value}</span>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p>No vital signs data available</p>
        </div>
      )}
    </div>
  );
};

export default Vitals;