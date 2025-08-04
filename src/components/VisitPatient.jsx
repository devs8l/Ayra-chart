import React from 'react';
import { Calendar, Clock, User, FileText, Activity, Pill, ClipboardList, AlertCircle } from 'lucide-react';

const VisitPatient = ({ setIsChartSelected,setChartsTab }) => {
    const handleGeneratePreChart = () => {
        // Add your pre-chart generation logic here
        console.log("Generating Pre-Chart...");
        setIsChartSelected(true);
        setChartsTab('charts');
    };

    return (
        <div className='flex flex-col h-full'>
            <div className="w-full p-6 bg-white  overflow-y-auto flex flex-col">
                {/* Header */}
                <div className="p-4 mb-6 rounded-2xl">
                    <h1 className="text-lg font-bold text-gray-800 mb-2">Patient Visit Summary</h1>
                    <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="mr-4">08/04/25</span>
                        <Clock className="w-4 h-4 mr-2" />
                        <span>10:00 - 11:00 AM</span>
                    </div>
                </div>

                {/* Patient Demographics */}
                <div className="rounded-2xl shadow-sm mb-6" style={{ backgroundColor: '#F5F8FC33' }}>
                    <div className="px-6 py-3">
                        <h2 className="text-md font-semibold text-gray-800 flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Patient Demographics
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                                <p className="text-gray-900 font-medium">Zack Daniel</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                                <p className="text-gray-900">35</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Sex</label>
                                <p className="text-gray-900">Male</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">DOB</label>
                                <p className="text-gray-900">15/03/1990</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Patient ID</label>
                                <p className="text-gray-900 font-mono">PT-2025-7842</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Insurance</label>
                                <p className="text-gray-900">BlueCross Premium</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chief Complaint */}
                <div className="rounded-2xl shadow-sm mb-6" style={{ backgroundColor: '#F5F8FC33' }}>
                    <div className="px-6 py-3">
                        <h2 className="text-md font-semibold text-gray-800 flex items-center">
                            <FileText className="w-5 h-5 mr-2" />
                            Chief Complaint / Reason for Visit
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">What is the main reason you are seeking care today?</label>
                            <p className="text-gray-900 p-3 rounded-2xl" style={{ backgroundColor: '#F5F8FC33' }}>
                                Increasing episodes of fatigue and tingling in extremities, suspected to be related to Chronoviral Neuropathy flare-up.
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">How long have you had this issue?</label>
                            <p className="text-gray-900">
                                Symptoms have worsened over the past 2 weeks, with initial onset 6 months ago.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Vital Signs */}
                <div className="rounded-2xl shadow-sm mb-6" style={{ backgroundColor: '#F5F8FC33' }}>
                    <div className="px-6 py-3">
                        <h2 className="text-md font-semibold text-gray-800 flex items-center">
                            <Activity className="w-5 h-5 mr-2" />
                            Vital Signs
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-2xl" style={{ backgroundColor: '#F5F8FC33' }}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                                <p className="text-md font-bold text-gray-900">128/82</p>
                                <span className="text-xs text-gray-600">mmHg</span>
                            </div>
                            <div className="p-4 rounded-2xl" style={{ backgroundColor: '#F5F8FC33' }}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate</label>
                                <p className="text-md font-bold text-gray-900">76</p>
                                <span className="text-xs text-gray-600">bpm</span>
                            </div>
                            <div className="p-4 rounded-2xl" style={{ backgroundColor: '#F5F8FC33' }}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                                <p className="text-md font-bold text-gray-900">98.6°F</p>
                                <span className="text-xs text-gray-600">(37.0°C)</span>
                            </div>
                            <div className="p-4 rounded-2xl" style={{ backgroundColor: '#F5F8FC33' }}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">O2 Saturation</label>
                                <p className="text-md font-bold text-gray-900">98%</p>
                                <span className="text-xs text-gray-600">Room air</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assessment & Plan */}
                <div className="rounded-2xl shadow-sm mb-6" style={{ backgroundColor: '#F5F8FC33' }}>
                    <div className="px-6 py-3">
                        <h2 className="text-md font-semibold text-gray-800 flex items-center">
                            <ClipboardList className="w-5 h-5 mr-2" />
                            Assessment & Plan
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="p-4 rounded-2xl" style={{ backgroundColor: '#F5F8FC33' }}>
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-gray-500 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Primary Diagnosis</h3>
                                    <p className="text-gray-700">Chronoviral Neuropathy - Acute exacerbation</p>
                                    <p className="text-sm text-gray-600 mt-1">ICD-10: G62.89</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-800">Treatment Plan:</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Continue current medication regimen with dosage adjustment
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Physical therapy referral for mobility exercises
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Lab work: Complete metabolic panel, B12, folate levels
                                </li>
                                <li className="flex items-start">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Follow-up appointment in 2 weeks
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Medications */}
                <div className="rounded-2xl shadow-sm mb-6" style={{ backgroundColor: '#F5F8FC33' }}>
                    <div className="px-6 py-3">
                        <h2 className="text-md font-semibold text-gray-800 flex items-center">
                            <Pill className="w-5 h-5 mr-2" />
                            Current Medications
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 rounded-2xl" style={{ backgroundColor: '#F5F8FC33' }}>
                                <div>
                                    <p className="font-medium text-gray-900">Gabapentin</p>
                                    <p className="text-sm text-gray-600">300mg three times daily</p>
                                </div>
                                <span className="px-2 py-1 text-gray-800 text-xs rounded-2xl" style={{ backgroundColor: '#F5F8FC33' }}>Active</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-2xl" style={{ backgroundColor: '#F5F8FC33' }}>
                                <div>
                                    <p className="font-medium text-gray-900">Vitamin B12</p>
                                    <p className="text-sm text-gray-600">1000mcg daily</p>
                                </div>
                                <span className="px-2 py-1 text-gray-800 text-xs rounded-2xl" style={{ backgroundColor: '#F5F8FC33' }}>Active</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-2xl" style={{ backgroundColor: '#F5F8FC33' }}>
                                <div>
                                    <p className="font-medium text-gray-900">Duloxetine</p>
                                    <p className="text-sm text-gray-600">60mg daily - Increased from 30mg</p>
                                </div>
                                <span className="px-2 py-1 text-gray-800 text-xs rounded-2xl" style={{ backgroundColor: '#F5F8FC33' }}>Modified</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Provider Information */}
                <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: '#F5F8FC33' }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Attending Physician</p>
                            <p className="font-medium text-gray-900">Dr. Sarah Mitchell, MD</p>
                            <p className="text-sm text-gray-600">Neurology Department</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Next Appointment</p>
                            <p className="font-medium text-gray-900">05/08/25 at 2:00 PM</p>
                            <p className="text-sm text-gray-600">Follow-up visit</p>
                        </div>
                    </div>
                </div>


            </div>
            {/* Generate Pre-Chart Button - Fixed at bottom */}
            <div className="p-4 flex justify-end border-t border-gray-200 mt-auto">
                <button
                    onClick={handleGeneratePreChart}
                    className="bg-[#1A73E8] flex items-center gap-3 cursor-pointer text-xs hover:bg-[#1a56cb] text-white font-medium py-2 px-8 rounded-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 17 17" fill="none">
                        <path d="M8.5 12.5L3.5 7.5L4.9 6.05L7.5 8.65V0.5H9.5V8.65L12.1 6.05L13.5 7.5L8.5 12.5ZM2.5 16.5C1.95 16.5 1.47917 16.3042 1.0875 15.9125C0.695833 15.5208 0.5 15.05 0.5 14.5V11.5H2.5V14.5H14.5V11.5H16.5V14.5C16.5 15.05 16.3042 15.5208 15.9125 15.9125C15.5208 16.3042 15.05 16.5 14.5 16.5H2.5Z" fill="white" />
                    </svg>
                    Generate Pre-Chart
                </button>
            </div>
        </div>
    );
};

export default VisitPatient;