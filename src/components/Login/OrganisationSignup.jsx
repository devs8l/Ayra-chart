// OrganizationSignup.js
import React from 'react';

const OrganizationSignup = ({ step, credentials, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-4">
      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold mb-8">Personal Details</h2>
          <div>
            <div className="text-xs text-gray-500 mb-3">Representative Name</div>
            <input
              type="text"
              name="repName"
              placeholder="Type your name"
              className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              value={credentials.repName || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-3">Designation</div>
            <select
              name="designation"
              className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              value={credentials.designation || ''}
              onChange={handleChange}
            >
              <option value="">Select your designation</option>
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
              <option value="Manager">Manager</option>
              <option value="Owner">Owner</option>
              <option value="Other">Other</option>
            </select>
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
          <h2 className="text-xl font-semibold mb-8">Organizational Details</h2>
          <div>
            <div className="text-xs text-gray-500 mb-3">Clinic/Hospital Name</div>
            <input
              type="text"
              name="orgName"
              placeholder="Type your organization's name"
              className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              value={credentials.orgName || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-3">National Provider Identifier (NPI)</div>
            <input
              type="text"
              name="npi"
              placeholder="XXXXX XXXXX"
              className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              value={credentials.npi || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-3">Specialties in Your Organization</div>
            <select
              name="specialties"
              className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              value={credentials.specialties || ''}
              onChange={handleChange}
            >
              <option value="">Select specialties</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Emergency Medicine">Emergency Medicine</option>
              <option value="Family Medicine">Family Medicine</option>
              <option value="Internal Medicine">Internal Medicine</option>
              <option value="Neurology">Neurology</option>
              <option value="Obstetrics and Gynecology">Obstetrics and Gynecology</option>
              <option value="Ophthalmology">Ophthalmology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="Surgery">Surgery</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-3">Number of Doctors/Physicians in Your Organization</div>
            <select
              name="doctorCount"
              className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              value={credentials.doctorCount || ''}
              onChange={handleChange}
            >
              <option value="">Select number</option>
              <option value="1-5">1-5</option>
              <option value="6-10">6-10</option>
              <option value="11-20">11-20</option>
              <option value="21-50">21-50</option>
              <option value="51-100">51-100</option>
              <option value="100+">100+</option>
            </select>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-3">Address</div>
            <textarea
              name="address"
              placeholder="Enter your organization's address"
              className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              value={credentials.address || ''}
              onChange={handleChange}
              rows="2"
            />
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-3">PIN Code</div>
            <input
              type="text"
              name="pinCode"
              placeholder="Enter your PIN code"
              className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              value={credentials.pinCode || ''}
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
              value={credentials.emrEhr || 'None'}
              onChange={handleChange}
            >
              <option value="None">None</option>
              <option value="Epic">Epic</option>
              <option value="Cerner">Cerner</option>
              <option value="Meditech">Meditech</option>
              <option value="Allscripts">Allscripts</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-3">Any existing Transcribing Tools</div>
            <select
              name="transcribingTools"
              className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              value={credentials.transcribingTools || 'None'}
              onChange={handleChange}
            >
              <option value="None">None</option>
              <option value="Dragon">Dragon</option>
              <option value="M*Modal">M*Modal</option>
              <option value="Nuance">Nuance</option>
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
              value={credentials.discoveryMethod || ''}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              <option value="Colleague">Colleague</option>
              <option value="Conference">Conference</option>
              <option value="Online">Online</option>
              <option value="Referral">Referral</option>
              <option value="Sales Representative">Sales Representative</option>
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

export default OrganizationSignup;