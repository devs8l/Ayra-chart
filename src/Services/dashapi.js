// dashapi.js

export async function getPatientComprehensive(patientId) {
  try {
    const response = await fetch(
      `https://p01--ayra-backend--5gwtzqz9pfqz.code.run/api/v1/precharting/patient/${patientId}/comprehensive`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching patient comprehensive data:", error);
    return null;
  }
}
