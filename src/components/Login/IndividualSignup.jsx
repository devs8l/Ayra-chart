// IndividualSignup.js
import React from 'react';

const IndividualSignup = ({ step, credentials, handleChange, handleSubmit }) => {
  return (
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
  );
};

export default IndividualSignup;