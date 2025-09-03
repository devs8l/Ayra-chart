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
        nin: data.npi,
        address: data.address
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


// user login
export const userLogin = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: data.email,
        password: data.password,
        tenant_id: data.tenantId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("user login failed:", error.message);
    return {
      success: false,
      message: error.message || 'Login failed. Please try again.'
    };
  }
};


// user signup
export const userSignup = async (data) => {
  try {
    // First create tenant
    const tenantResponse = await tenantSignup(data);
    if (!tenantResponse.success) {
      throw new Error(tenantResponse.message);
    }
    console.log("tenant", tenantResponse);
    console.log("signup data", data);

    // Then create user with tenant_id
    const response = await fetch(`${BASE_URL}/auth/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tenant_id: tenantResponse.data.tenant_id,
        identifier: data.name.replace(/\s+/g, ''),
        email: data.email,
        password: data.password,
        user_type: "doctor",
        display_name: data.name,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Signup failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("User signup successful:", result);

    return { success: true, data: result };
  } catch (error) {
    console.error("User signup failed:", error.message);
    return {
      success: false,
      message: error.message || 'Signup failed. Please try again.'
    };
  }
};