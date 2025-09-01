import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MedContext } from '../context/MedContext';
import OrganizationSignup from '../components/Login/Organisation';
import IndividualSignup from '../components/Login/Individual';
import { Circle } from 'lucide-react';
import { tenantSignup } from '../Services/auth';

const LoginSignup = () => {
  const navigate = useNavigate();
  const { login } = useContext(MedContext);

  const [isLogin, setIsLogin] = useState(true);
  const [signupType, setSignupType] = useState(null); // 'individual' or 'organization'
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null); // 'success', 'error', or null

  // Separate states for different forms
  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    password: ''
  });

  const [individualCredentials, setIndividualCredentials] = useState({
    name: '',
    email: '',
    phone: '',
    npi: '',
    specialty: '',
    clinicName: '',
    pinCode: '',
    emrEhr: 'None',
    transcribingTools: 'None',
    discoveryMethod: '',
    password: '',
    confirmPassword: ''
  });

  const [organizationCredentials, setOrganizationCredentials] = useState({
    repName: '',
    designation: '',
    email: '',
    phone: '',
    orgName: '',
    npi: '',
    domain: '',
    specialties: '',
    doctorCount: '',
    address: '',
    pinCode: '',
    emrEhr: 'None',
    transcribingTools: 'None',
    discoveryMethod: ''
  });

  const [error, setError] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Temporary credentials for demo
  const tempCredentials = {
    email: 'doc@gmail.com',
    password: 'meddemo123@'
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIndividualChange = (e) => {
    const { name, value } = e.target;
    setIndividualCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrganizationChange = (e) => {
    const { name, value } = e.target;
    setOrganizationCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (
      loginCredentials.email === tempCredentials.email &&
      loginCredentials.password === tempCredentials.password
    ) {
      login();
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  // Mock API call function
  const submitSignupRequest = async (data, type) => {
    // Simulate API call with delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure (80% success rate for demo)
        const isSuccess = Math.random() > 0.2;
        if (isSuccess) {
          resolve({ success: true, message: 'Request submitted successfully' });
        } else {
          reject({ success: false, message: 'Request failed. Please try again later.' });
        }
      }, 1500);
    });
  };

  const handleIndividualSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Handle form progression for steps 1-4
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    // For the final step (step 4), submit the request
    if (step === 4) {
      setIsSubmitting(true);
      setRequestStatus(null);

      try {
        const result = await submitSignupRequest(individualCredentials, 'individual');

        if (result.success) {
          setRequestStatus('success');
          setStep(5); // Show success message
        } else {
          setRequestStatus('error');
          setError(result.message);
        }
      } catch (err) {
        setRequestStatus('error');
        setError(err.message || 'Request failed. Please try again after sometime.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleOrganizationSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Handle form progression for step 1
    if (step < 2) {
      setStep(step + 1);
      return;
    }

    // For the final step (step 2), submit the request
    if (step === 2) {
      setIsSubmitting(true);
      setRequestStatus(null);

      try {
        const result = await tenantSignup(organizationCredentials);

        if (result.success) {
          setRequestStatus('success');
          console.log('Signup successful:', result.data);
          setStep(3); // Show success message
        } else {
          setRequestStatus('error');
          setError(result.message || 'Request failed. Please try again after sometime.');
        }
      } catch (err) {
        setRequestStatus('error');
        setError(err.message || 'Request failed. Please try again after sometime.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
      setRequestStatus(null);
    } else if (signupType) {
      // If we're in a signup form but want to go back to type selection
      setSignupType(null);
      setStep(1);
      setError('');
      setRequestStatus(null);
    }
  };

  const toggleForm = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setStep(1);
      setSignupType(null);
      setError('');
      setRequestStatus(null);
      setIsTransitioning(false);
    }, 300);
  };

  const selectSignupType = (type) => {
    setSignupType(type);
    setStep(1); // Reset to first step of the form
    setError('');
    setRequestStatus(null);
  };

  const resetForm = () => {
    setIsLogin(true);
    setStep(1);
    setSignupType(null);
    setError('');
    setRequestStatus(null);
    setIndividualCredentials({
      name: '',
      email: '',
      phone: '',
      npi: '',
      specialty: '',
      clinicName: '',
      pinCode: '',
      emrEhr: 'None',
      transcribingTools: 'None',
      discoveryMethod: '',
      password: '',
      confirmPassword: ''
    });
    setOrganizationCredentials({
      repName: '',
      designation: '',
      email: '',
      phone: '',
      orgName: '',
      npi: '',
      domain: '',
      specialties: '',
      doctorCount: '',
      address: '',
      pinCode: '',
      emrEhr: 'None',
      transcribingTools: 'None',
      discoveryMethod: ''
    });
  };

  return (
    <div className="flex min-h-screen bg-black relative flex-col gap-3">
      {/* Background Image - full screen */}
      <div className="absolute inset-0 z-0">
        <img
          src="/login-bg.jpg"
          alt="Login Background"
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Form container - centered with fixed height and scrollable content */}
      <div className="relative z-10 w-full max-w-lg mx-auto my-auto bg-[#FFFFFFF0] rounded-xl p-8 min-h-[85vh] max-h-[85vh] flex flex-col">
        {/* Logo container with transition */}
        <div className={`${isLogin ? 'flex flex-col justify-center items-center' : 'absolute top-8 left-8'}`}>
          <img
            src="/Ayra.svg"
            alt="Ayra Logo"
            className={`transition-all duration-300 ${isLogin ? 'w-40' : 'w-24'}`}
          />
          {/* Version info */}
          <div className={`text-center text-[10px] text-gray-500 ${isLogin ? 'mb-8' : 'mb-6 ml-10'}`}>
            v1.10 | 2025
          </div>
        </div>

        {!isLogin && signupType && step <= (signupType === 'individual' ? 4 : 2) && (
          <div className="flex mb-6">
            {[...Array(signupType === 'individual' ? 4 : 2)].map((_, i) => (
              <div
                key={i + 1}
                className={`h-1 flex-1 mx-1 mt-15 rounded-full ${i + 1 <= step ? 'bg-[#80B5FF]' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}

        {/* Main form content - scrollable container */}
        <div className={`flex-grow overflow-y-auto ${!isLogin && signupType && step === (signupType === 'individual' ? 5 : 3) ? 'flex items-center justify-center' : ''} ${isLogin || !signupType ? 'flex flex-col justify-center' : ''}`}>
          {isLogin ? (
            // Login Form
            <form onSubmit={handleLoginSubmit} className="space-y-8 p-10">
              <div>
                <div className="text-xs text-gray-500 mb-3">Enter Email ID</div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email ID"
                  className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  value={loginCredentials.email}
                  onChange={handleLoginChange}
                />
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-3">Password</div>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  value={loginCredentials.password}
                  onChange={handleLoginChange}
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors mt-8"
              >
                Login
              </button>

              <div className="text-center text-sm pt-6">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Sign-up
                </button>
              </div>
            </form>
          ) : !signupType ? (
            // Pre-signup: Select individual or organization
            <div className="space-y-18">
              <h2 className="text-[#222836]  font-inter text-center text-[20px] font-semibold leading-[24px] tracking-[-0.48px]">
                What are you signing up as?
              </h2>

              <div className="flex gap-6 justify-center">
                <button
                  onClick={() => selectSignupType('individual')}
                  className="p-2 flex flex-col cursor-pointer items-center"
                >
                  <div className="w-40 h-40 flex items-center justify-center">
                    <img
                      src="/ind.svg"
                      alt="Individual"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="font-medium text-sm mt-8 whitespace-nowrap flex items-center gap-3">
                    Individual Practitioner
                  </div>
                </button>

                <button
                  onClick={() => selectSignupType('organization')}
                  className="p-2 flex flex-col cursor-pointer items-center"
                >
                  <div className="w-40 h-40 flex items-center justify-center">
                    <img
                      src="/org.svg"
                      alt="Organization"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="font-medium text-sm mt-8 whitespace-nowrap flex items-center gap-3">
                    Organization
                  </div>
                </button>
              </div>
            </div>
          ) : signupType === 'individual' ? (
            // Individual signup form
            <IndividualSignup
              step={step}
              credentials={individualCredentials}
              handleChange={handleIndividualChange}
              handleSubmit={handleIndividualSubmit}
              isSubmitting={isSubmitting}
              requestStatus={requestStatus}
              error={error}
            />
          ) : (
            // Organization signup form
            <OrganizationSignup
              step={step}
              credentials={organizationCredentials}
              handleChange={handleOrganizationChange}
              handleSubmit={handleOrganizationSubmit}
              isSubmitting={isSubmitting}
              requestStatus={requestStatus}
              error={error}
            />
          )}
        </div>

        {/* Form navigation buttons placed at the bottom */}
        <div className="mt-auto pt-4">
          {isLogin ? null : (
            <div className="flex justify-between">
              {!signupType ? (
                <button
                  type="button"
                  onClick={toggleForm}
                  className="py-2 text-xs text-gray-600 cursor-pointer hover:text-gray-800"
                >
                  Already have an account? Login
                </button>
              ) : (signupType === 'individual' || signupType === 'organization') &&
                step > 1 &&
                step < (signupType === 'individual' ? 5 : 3) ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="px-6 py-2 text-gray-600 cursor-pointer bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Back
                </button>
              ) : signupType && step === 1 ? (
                <button
                  type="button"
                  onClick={() => setSignupType(null)}
                  className="px-6 py-2 text-gray-600 cursor-pointer  bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Back
                </button>
              ) : signupType && step === (signupType === 'individual' ? 5 : 3) ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 w-full cursor-pointer  bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Back to Login
                </button>
              ) : (
                <div></div> // Empty div for spacing
              )}

              {signupType && step < (signupType === 'individual' ? 4 : 2) && (
                <button
                  type="submit"
                  onClick={signupType === 'individual' ? handleIndividualSubmit : handleOrganizationSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              )}

              {signupType && step === (signupType === 'individual' ? 4 : 2) && (
                <button
                  type="submit"
                  onClick={signupType === 'individual' ? handleIndividualSubmit : handleOrganizationSubmit}
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer outside the white box */}
      <div className="text-center text-xs text-gray-300">
        ©2025. Ayra is a product of Inquantic Technologies Pvt. Ltd. All Rights Reserved
      </div>
    </div>
  );
};

export default LoginSignup;