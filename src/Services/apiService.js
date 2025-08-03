// apiService.js
export const fetchPatientHistory = async (patientId) => {
    try {
      const response = await fetch(
        `https://medicalchat-backend-mongodb.vercel.app/patients/${patientId}/history`
      );
      if (!response.ok) throw new Error('Failed to fetch history');
      return await response.json();
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
  };
  
  export const analyzePatientHistory = async (historyData) => {
    try {
      const analysisResult = await fetch(
        `https://medicalchat-tau.vercel.app/full_medical_analysis/Give me the patient full medical analysis`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(historyData),
        }
      );
  
      if (!analysisResult.ok) throw new Error('Failed to analyze history');
      return await analysisResult.json();
    } catch (error) {
      console.error('Error analyzing history:', error);
      throw error;
    }
  };
  
  export const fetchHealthMetrics = async (patientId) => {
    try {
      const response = await fetch(
        `https://medicalchat-backend-mongodb.vercel.app/patients/${patientId}/health-metrics`
      );
      if (!response.ok) throw new Error('Failed to fetch health metrics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      throw error;
    }
  };

  export const getSummaryFollowUp = async (visit) => {
    try {
      const response = await fetch(
        `https://medicalchat-tau.vercel.app/medical_question_suggestions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ para: visit }),
        }
      );
      if (!response.ok) throw new Error('Failed to fetch summary follow-up');
      
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching summary follow-up:', error);
      throw error;
    }
  }