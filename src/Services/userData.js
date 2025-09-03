// Function to fetch allergies from API
  export const fetchAllergies = async (patientId) => {
    try {
      
      const response = await fetch(`https://p01--ayra-backend--5gwtzqz9pfqz.code.run/api/v1/emr/patient/${patientId}/allergies`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching allergies:", error);
      
      return null;
    } finally {
      
    }
  };

  export const fetchMedications = async (patientId) => {
  try {
    const response = await fetch(`https://p01--ayra-backend--5gwtzqz9pfqz.code.run/api/v1/emr/patient/${patientId}/medications`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching medications:", error);
    return null;
  }
};

// Function to fetch vaccines from API
export const fetchVaccines = async (patientId) => {
  try {
    const response = await fetch(`https://p01--ayra-backend--5gwtzqz9pfqz.code.run/api/v1/emr/patient/${patientId}/vaccines`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching vaccines:", error);
    return null;
  }
};

export const fetchVitals = async (patientId) => {
  try {
    const response = await fetch(`https://p01--ayra-backend--5gwtzqz9pfqz.code.run/api/v1/emr/patient/${patientId}/vitals`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching vaccines:", error);
    return null;
  }
};

export const fetchVisits = async (patientId) => {
  try {
    const response = await fetch(`https://p01--ayra-backend--5gwtzqz9pfqz.code.run/api/v1/emr/patient/${patientId}/visits`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching visits:", error);
    return null;
  }
};