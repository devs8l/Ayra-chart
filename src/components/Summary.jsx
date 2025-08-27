import React, { useState, useContext } from 'react';
import { MedContext } from "../context/MedContext";
import Notepad from './Notepad';
import Billingcode from './Billingcode';
import MedicalDashboard from './MedicalDashboard';
import VisitPatient from './VisitPatient'; // Assuming you have this component
import { Code, FileText, ScrollText, ClipboardList, BarChart2 } from 'lucide-react';

const Summary = () => {
    const { isNotesExpanded, setIsNotesExpanded, selectedUser,
        isUserSelected } = useContext(MedContext);
    const [isChartSelected, setIsChartSelected] = useState(false);
    const [activeTab, setActiveTab] = useState('notepad');
    const [viewMode, setViewMode] = useState('charts'); // 'notes' or 'charts'
    const [chartsTab, setChartsTab] = useState('visit'); // 'visit' or 'charts'
    const [isChartGenerated, setIsChartGenerated] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);

    const getTitlePlaceholder = () => {
        if (isUserSelected && selectedUser) {
            return `${selectedUser.name}'s notes`;
        }
        return "General notes";
    };

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            {/* Header with tabs on the right */}
            <div className="border-b border-gray-200 p-4 flex justify-between gap-10 items-center animate-fadeInLeft [animation-delay:100ms]">
                <h1 className="text-lg sm:text-md text-[#222836] mt-2 sm:mt-1">Summary</h1>

                {/* View Mode Tabs (Patient Charts / Notes) - moved to right of heading */}
                <div className="flex items-center w-full gap-3 justify-start sticky top-0 bg-white z-10">
                    <button
                        onClick={() => setViewMode('charts')}
                        className={`px-2 cursor-pointer text-sm min-w-1/5 py-2 flex justify-center items-center gap-2 rounded-[5px] ${viewMode === 'charts'
                            ? 'bg-[#E2EEFC] text-[#222836] font-medium'
                            : 'bg-[#F8FBFE] text-[#6F7786]'
                            }`}
                    >
                        <FileText size={15} className={viewMode === 'charts' ? 'text-[#222836]' : 'text-[#6F7786]'} />
                        Patient Charts
                    </button>
                    <button
                        onClick={() => setViewMode('notes')}
                        className={`px-2 cursor-pointer text-sm min-w-1/5 py-2 flex justify-center items-center gap-2 rounded-[5px] ${viewMode === 'notes'
                            ? 'bg-[#E2EEFC] text-[#222836] font-medium'
                            : 'bg-[#F8FBFE] text-[#6F7786]'
                            }`}
                    >
                        <ScrollText size={15} className={viewMode === 'notes' ? 'text-[#222836]' : 'text-[#6F7786]'} />
                        Notes
                    </button>
                </div>
            </div>

            {viewMode === 'charts' ? (
                <>
                    {/* Charts View Mode Tabs - Simplified to match image */}
                    <div className="flex items-center gap-4 px-10 py-2">
                        <button
                            onClick={() => setChartsTab('visit')}
                            className={`px-2  py-3 text-sm cursor-pointer font-medium ${chartsTab === 'visit'
                                ? ' border-b-3 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700 border-b-3 border-blue-200'
                                }`}
                        >
                            Visit Summary
                        </button>
                        <button
                            onClick={() => setChartsTab('charts')}
                            className={`px-2 py-3 text-sm cursor-pointer font-medium ${chartsTab === 'charts'
                                ? ' border-b-3 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700 border-b-3 border-blue-200'
                                }`}
                        >
                            Pre-Chart
                        </button>
                    </div>

                    {/* Charts Tab Content */}
                    <div className="flex-1 overflow-y-auto">
                        {chartsTab === 'visit' ? <VisitPatient setIsChartSelected={setIsChartSelected} setChartsTab={setChartsTab} /> : <MedicalDashboard isChartSelected={isChartSelected} setViewMode={setViewMode} setIsChartSelected={setIsChartSelected} isChartGenerated={isChartGenerated} setIsChartGenerated={setIsChartGenerated} dashboardData={dashboardData} setDashboardData={setDashboardData} />}
                    </div>
                </>
            ) : (
                <>
                    {/* Note Title */}
                    <div className="border-b border-gray-200 p-4">
                        <h3>{getTitlePlaceholder()}</h3>
                    </div>

                    {/* Content Tabs (Notepad / Billing Code) */}
                    {/* <div className="flex items-center border-b border-gray-300 p-3 gap-3 justify-between sticky top-0 bg-white z-10">
                        <button
                            onClick={() => setActiveTab('notepad')}
                            className={`px-4 cursor-pointer text-sm w-1/2 py-2 flex justify-center items-center gap-2 rounded-[5px] ${activeTab === 'notepad'
                                ? 'bg-[#E2EEFC] text-[#222836] font-medium'
                                : 'bg-[#F8FBFE] text-[#6F7786]'
                                }`}
                        >
                            <FileText size={15} className={activeTab === 'notepad' ? 'text-[#222836]' : 'text-[#6F7786]'} />
                            Notepad
                        </button>
                        <button
                            onClick={() => setActiveTab('billing')}
                            className={`px-4 cursor-pointer text-sm w-1/2 py-2 flex justify-center items-center gap-2 rounded-[5px] ${activeTab === 'billing'
                                ? 'bg-[#E2EEFC] text-[#222836] font-medium'
                                : 'bg-[#F8FBFE] text-[#6F7786]'
                                }`}
                        >
                            <ScrollText size={15} className={activeTab === 'billing' ? 'text-[#222836]' : 'text-[#6F7786]'} />
                            Billing Code
                        </button>
                    </div> */}

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'notepad' ? <Notepad dashboardData={dashboardData}/> : <Billingcode />}
                    </div>
                </>
            )}
        </div>
    );
};

export default Summary;