import React, { useState, useEffect, useContext } from 'react';
import { MedContext } from '../../context/MedContext';
import { getSummaryFollowUp } from '../../Services/apiService';
import { ChatContext } from '../../context/ChatContext';

const Summaries = ({ patientHistory, isLoadingReports }) => {
    const [activeVisitId, setActiveVisitId] = useState(null);
    const [sortedVisits, setSortedVisits] = useState([]);
    const [sortOrder, setSortOrder] = useState('latest');
    const [timeRange, setTimeRange] = useState('allTime');
    const [showTimeDropdown, setShowTimeDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const { addSummaryMessage, showInitialState, setShowInitialState } = useContext(ChatContext)
    const { isSummaryClicked, setIsSummaryClicked, currentVisit, setCurrentVisit, setFollowUpQuestions, setIsLoadingFollowUp } = useContext(MedContext)
    const patientId = patientHistory?.rawData?._id


    useEffect(() => {
        if (patientHistory?.rawData?.visit_ids?.length > 0) {
            let visits = [...patientHistory.rawData.visit_ids];

            // Filter by time range
            if (timeRange === 'thisYear') {
                const currentYear = new Date().getFullYear();
                visits = visits.filter(visit => {
                    if (!visit.visit_date) return false;
                    try {
                        const visitYear = new Date(visit.visit_date).getFullYear();
                        return visitYear === currentYear;
                    } catch (e) {
                        return false;
                    }
                });
            }

            // Sort visits
            visits.sort((a, b) => {
                try {
                    const dateA = new Date(a.visit_date);
                    const dateB = new Date(b.visit_date);
                    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
                } catch (e) {
                    return 0;
                }
            });

            setSortedVisits(visits);


        } else {
            setSortedVisits([]);
        }
    }, [patientHistory, sortOrder, timeRange, activeVisitId]);



    const formatDate = (dateString) => {
        if (!dateString) return 'Date not available';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) throw new Error('Invalid date');

            const day = date.getDate();
            const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
            const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);

            // Function to get the day suffix (st, nd, rd, th)
            const getDaySuffix = (d) => {
                if (d >= 11 && d <= 13) return 'th';
                switch (d % 10) {
                    case 1: return 'st';
                    case 2: return 'nd';
                    case 3: return 'rd';
                    default: return 'th';
                }
            };

            return `${day}${getDaySuffix(day)} ${month} (${weekday})`;
        } catch (error) {
            console.error('Invalid date format:', dateString);
            return 'Date not available';
        }
    };

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
        setShowTimeDropdown(false);
    };


    const handleSummaryClick = async (visit) => {
        setIsLoadingFollowUp(true);
        console.log("Loading started");
        const visitData = {
            visitType: 'medicalSummary',
            date: visit.visit_date,
            notes: visit.notes || 'No notes available',
            icon:'/Summaries.svg',
        };
        addSummaryMessage(patientId, visitData, []);
    };

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
        setShowSortDropdown(false);
    };

    if (isLoadingReports) {
        return (
            <div className="flex justify-center items-center p-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full pt-2">
            {/* Filters and Sort Controls */}
            <div className="flex items-center gap-2 mb-6 px-2">
                {/* Time Range Dropdown */}
                <div className="relative">
                    <button
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md  transition-colors"
                        onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span className="text-sm font-medium">
                            {timeRange === 'thisYear' ? 'This Year' : 'All Time'}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    {showTimeDropdown && (
                        <div className="absolute z-10 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200">
                            <div className="py-1">
                                <button
                                    className={`block w-full text-left px-4 py-2 text-sm ${timeRange === 'thisYear' ? ' font-medium' : ''
                                        }`}
                                    onClick={() => handleTimeRangeChange('thisYear')}
                                >
                                    This Year
                                </button>
                                <button
                                    className={`block w-full text-left px-4 py-2 text-sm ${timeRange === 'allTime' ? ' font-medium' : ''
                                        }`}
                                    onClick={() => handleTimeRangeChange('allTime')}
                                >
                                    All Time
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sort Order Dropdown */}
                <div className="relative">
                    <button
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md  transition-colors"
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                        </svg>
                        <span className="text-sm font-medium">
                            {sortOrder === 'latest' ? 'Latest First' : 'Oldest First'}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    {showSortDropdown && (
                        <div className="absolute z-10 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200">
                            <div className="py-1">
                                <button
                                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortOrder === 'latest' ? ' font-medium' : ''
                                        }`}
                                    onClick={() => handleSortOrderChange('latest')}
                                >
                                    Latest First
                                </button>
                                <button
                                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortOrder === 'oldest' ? ' font-medium' : ''
                                        }`}
                                    onClick={() => handleSortOrderChange('oldest')}
                                >
                                    Oldest First
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Visit Tabs */}
            <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto px-2 py-3">
                {sortedVisits.length > 0 ? (
                    sortedVisits.map(visit => (
                        <div
                            key={visit._id}
                            className={`p-5 rounded-sm border transition-all duration-200 cursor-pointer ${activeVisitId === visit._id
                                ? 'bg-white border-gray-300 shadow-lg'
                                : 'bg-white border-gray-200 hover:shadow-lg'
                                }`}
                            onClick={() => handleSummaryClick(visit)}
                        >
                            <p className={`text-sm ${activeVisitId === visit._id ? 'text-gray-800 ' : 'text-gray-400'
                                }`}>
                                {formatDate(visit.visit_date)}
                            </p>

                        </div>
                    ))
                ) : (
                    <div className="text-center p-8 text-gray-500">
                        No visit history available
                    </div>
                )}
            </div>
        </div>
    );
};

export default Summaries;