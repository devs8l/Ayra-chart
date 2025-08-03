import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MedContext } from '../context/MedContext';

const LoginSignup = () => {
  const navigate = useNavigate();
  const { login } = useContext(MedContext);

  const [isLogin, setIsLogin] = useState(true);
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
      // Signup logic - handle step progression
      if (step < 5) {
        setStep(step + 1);
      } else {
        // Final submission
        setIsLogin(true);
        setStep(1);
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
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleForm = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setStep(1);
      setError('');
      setIsTransitioning(false);
    }, 300); // Matches CSS transition duration
  };

  const getCompanyName = () => {
    if (isLogin) return 'Propublic Technology Pvt., Ltd.';
    if (step === 1) return 'Insurance Technologies Pvt. Ltd.';
    if (step === 2) return 'Inquantic Technologies Pvt., Ltd.';
    if (step === 3) return 'Inquartic Technologies Pvt. Ltd.';
    if (step === 4) return 'Inquanto Technologies Pvt. Ltd.';
    return 'Ayra Technologies Pvt. Ltd.';
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

      {/* Form container - centered with 70% viewport height */}
      <div className="relative z-10 w-full max-w-lg mx-auto my-auto bg-[#FFFFFFF0] rounded-xl  p-15 min-h-[80vh] flex flex-col">
        {/* Logo container with transition */}
        <div className={`${isLogin ? 'flex  flex-col justify-center items-center ' : 'absolute top-8 left-8 '} `}>
          <img
            src="/Ayra.svg"
            alt="Ayra Logo"
            className={`transition-all duration-300 ${isLogin ? 'w-40' : 'w-24'}`}
          />
          {/* Version info */}
          <div className={`text-center text-[10px] text-gray-500 ${isLogin ? 'mb-8' : ' mb-6 ml-10'}`}>
            v1.10 | 2025
          </div>
        </div>


        {/* Progress bar for signup */}
        {!isLogin && step <= 4 && (
          <div className="flex mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 mx-1 mt-15 rounded-full ${i <= step ? 'bg-[#80B5FF]' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}

        {/* Main form content - centered for login, scrollable for signup */}
        <div className={`flex-grow ${step === 5 ? 'flex items-center justify-center':''}  ${isLogin ? 'flex flex-col justify-center' : 'overflow-y-auto '}`}>
          {isLogin ? (
            // Login Form - centered vertically
            <form onSubmit={handleSubmit} className="space-y-8">
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
          ) : (
            // Signup Form - scrollable with increased gaps
            <form onSubmit={handleSubmit} className="space-y-8 pb-4">
              {step === 1 && (
                <>
                  <h2 className="text-xl font-semibold mb-8">Personal Details</h2>
                  <div>
                    <div className="text-xs text-gray-500 mb-3">Your Name</div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Type your name"
                      className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      value={credentials.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-3">Email</div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your Email ID"
                      className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      value={credentials.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-3">Phone Number</div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91"
                      className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      value={credentials.phone}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-xl font-semibold mb-8">Professional Details</h2>
                  <div>
                    <div className="text-xs text-gray-500 mb-3">National Provider Identifier (NPI)</div>
                    <input
                      type="text"
                      name="npi"
                      placeholder="XXXXX XXXXX"
                      className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      value={credentials.npi}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-3">Specialty</div>
                    <input
                      type="text"
                      name="specialty"
                      placeholder="Select your specialty"
                      className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      value={credentials.specialty}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-3">Clinic/Hospital Name</div>
                    <input
                      type="text"
                      name="clinicName"
                      placeholder="Type your hospital's name"
                      className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      value={credentials.clinicName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-3">PIN Code</div>
                    <input
                      type="text"
                      name="pinCode"
                      placeholder="Enter your PIN code"
                      className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      value={credentials.pinCode}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-xl font-semibold mb-8">Software/IT Details</h2>
                  <div>
                    <div className="text-xs text-gray-500 mb-3">Any existing EMR/EHR</div>
                    <select
                      name="emrEhr"
                      className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      value={credentials.emrEhr}
                      onChange={handleChange}
                    >
                      <option value="None">None</option>
                      <option value="Epic">Epic</option>
                      <option value="Cerner">Cerner</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mt-8">
                    <div className="text-xs text-gray-500 mb-3">Any existing Transcribing Tools</div>
                    <select
                      name="transcribingTools"
                      className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      value={credentials.transcribingTools}
                      onChange={handleChange}
                    >
                      <option value="None">None</option>
                      <option value="Dragon">Dragon</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="text-xl font-semibold mb-8">About Ayra</h2>
                  <div>
                    <div className="text-xs text-gray-500 mb-3">How did you find Ayra AI?</div>
                    <select
                      name="discoveryMethod"
                      className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      value={credentials.discoveryMethod}
                      onChange={handleChange}
                    >
                      <option value="">Select an option</option>
                      <option value="Colleague">Colleague</option>
                      <option value="Conference">Conference</option>
                      <option value="Online">Online</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </>
              )}

              {step === 5 && (
                <div className=''>
                  <h2 className="text-xl font-semibold mb-8 text-center">Request Sent Successfully!</h2>
                  <div className="text-center">
                    <p className="mb-8">Team Ayra will get back to you shortly on your provided contact details.</p>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Form navigation buttons placed at the bottom */}
        <div className="mt-auto pt-4">
          {isLogin ? null : (
            <div className="flex justify-between">
              {step === 1 ? (
                <button
                  type="button"
                  onClick={toggleForm}
                  className="py-2 text-xs text-gray-600 cursor-pointer hover:text-gray-800"
                >
                  Already have an account? Login
                </button>
              ) : step > 1 && step < 5 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="px-6 py-2 text-gray-600 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Back
                </button>
              ) : (
                <div></div> // Empty div for spacing
              )}

              <button
                type="submit"
                onClick={handleSubmit}
                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${step === 5 ? 'w-full' : ''}`}
              >
                {step < 4 ? 'Next' : step === 4 ? 'Submit Request' : 'Done'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer outside the white box */}
      <div className=" text-center text-xs text-gray-300">
        ©2025. Ayra is a product of Inquantic Technologies Pvt. Ltd. All Rights Reserved
      </div>
    </div>
  );
};

export default LoginSignup;