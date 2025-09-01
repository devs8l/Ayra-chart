// src/api/auth.js

const BASE_URL = "https://p01--ayra-backend--5gwtzqz9pfqz.code.run";

// tenant signup
export const tenantSignup = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/tenant/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.orgName,
        domain: data.domain,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Signup failed: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Tenant signup failed:", error.message);
    return { 
      success: false, 
      message: error.message || 'Request failed. Please try again after sometime.' 
    };
  }
};