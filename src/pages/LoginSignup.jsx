import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MedContext } from '../context/MedContext';
import OrganizationSignup from '../components/Login/OrganisationSignup';
import IndividualSignup from '../components/Login/IndividualSignUp';
import { Circle } from 'lucide-react';

const LoginSignup = () => {
  const navigate = useNavigate();
  const { login } = useContext(MedContext);

  const [isLogin, setIsLogin] = useState(true);
  const [signupType, setSignupType] = useState(null); // 'individual' or 'organization'
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({
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
  const [error, setError] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Temporary credentials for demo
  const tempCredentials = {
    email: 'doc@gmail.com',
    password: 'meddemo123@'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login logic
      if (
        credentials.email === tempCredentials.email &&
        credentials.password === tempCredentials.password
      ) {
        login();
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } else {
      // If we're in the pre-signup step (selecting individual/organization)
      if (!signupType) {
        return; // Shouldn't happen as the button is disabled until selection
      }

      // Handle form submission based on signup type
      if (signupType === 'individual') {
        // Individual signup logic - handle step progression
        if (step < 5) {
          setStep(step + 1);
        } else {
          // Final submission for individual
          setIsLogin(true);
          setStep(1);
          setSignupType(null);
          setCredentials({
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
        }
      } else {
        // Organization signup logic - handle step progression
        if (step < 5) {
          setStep(step + 1);
        } else {
          // Final submission for organization
          setIsLogin(true);
          setStep(1);
          setSignupType(null);
          setCredentials({
            repName: '',
            designation: '',
            email: '',
            phone: '',
            orgName: '',
            npi: '',
            specialties: '',
            doctorCount: '',
            address: '',
            pinCode: '',
            emrEhr: 'None',
            transcribingTools: 'None',
            discoveryMethod: ''
          });
        }
      }
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (signupType) {
      // If we're in a signup form but want to go back to type selection
      setSignupType(null);
      setStep(1);
    }
  };

  const toggleForm = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setStep(1);
      setSignupType(null);
      setError('');
      setIsTransitioning(false);
    }, 300);
  };

  const selectSignupType = (type) => {
    setSignupType(type);
    setStep(1); // Reset to first step of the form
  };

  const getCompanyName = () => {
    if (isLogin) return 'Propublic Technology Pvt., Ltd.';
    if (!signupType) return 'Insurance Technologies Pvt. Ltd.';
    if (signupType === 'individual') {
      if (step === 1) return 'Inquantic Technologies Pvt., Ltd.';
      if (step === 2) return 'Inquartic Technologies Pvt. Ltd.';
      if (step === 3) return 'Inquanto Technologies Pvt. Ltd.';
      return 'Ayra Technologies Pvt. Ltd.';
    } else {
      if (step === 1) return 'Inquantic Technologies Pvt., Ltd.';
      if (step === 2) return 'Inquartic Technologies Pvt. Ltd.';
      if (step === 3) return 'Inquanto Technologies Pvt. Ltd.';
      return 'Ayra Technologies Pvt. Ltd.';
    }
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

        {/* Progress bar for both individual and organization signup */}
        {!isLogin && signupType && step <= 4 && (
          <div className="flex mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 mx-1 mt-15 rounded-full ${i <= step ? 'bg-[#80B5FF]' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}

        {/* Main form content - scrollable container */}
        <div className={`flex-grow overflow-y-auto ${!isLogin && signupType && step === 5 ? 'flex items-center justify-center' : ''} ${isLogin || !signupType ? 'flex flex-col justify-center' : ''}`}>
          {isLogin ? (
            // Login Form
            <form onSubmit={handleSubmit} className="space-y-8 p-10">
              <div>
                <div className="text-xs text-gray-500 mb-3">Enter Email ID</div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email ID"
                  className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  value={credentials.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-3">Password</div>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  value={credentials.password}
                  onChange={handleChange}
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
                  className="text-blue-600 hover:underline"
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
                  className="p-2 flex flex-col items-center"
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
                  className="p-2 flex flex-col items-center"
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
              credentials={credentials}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          ) : (
            // Organization signup form
            <OrganizationSignup
              step={step}
              credentials={credentials}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
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
              ) : (signupType === 'individual' || signupType === 'organization') && step > 1 && step < 5 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="px-6 py-2 text-gray-600 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Back
                </button>
              ) : signupType && step === 1 ? (
                <button
                  type="button"
                  onClick={() => setSignupType(null)}
                  className="px-6 py-2 text-gray-600 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Back
                </button>
              ) : (
                <div></div> // Empty div for spacing
              )}

              {signupType && (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${step === 5 ? 'w-full' : ''}`}
                >
                  {step < 4 ? 'Next' : step === 4 ? 'Submit Request' : 'Done'}
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