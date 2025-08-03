import React, { useContext } from 'react';
import { MedContext } from '../context/MedContext';
import { X } from 'lucide-react'; // Import the X icon
import { ChatContext } from '../context/ChatContext';

const UserSummaryToken = ({ userId, summaryMessages,isUser }) => {
    const {
        setActiveSummaryData,
        setIsSummaryBoxActive,
        isSummaryBoxActive,
    } = useContext(MedContext);

    const {
        setSummaryMessages
    } = useContext(ChatContext);

    if (!userId || !summaryMessages[userId] || summaryMessages[userId].length === 0) {
        return null;
    }

    const handleTokenClick = (summary) => {
        if (!isSummaryBoxActive) {
            setActiveSummaryData({
                visitData: summary?.visitData,
            });
        }
        setIsSummaryBoxActive(!isSummaryBoxActive);
    };
    const formatDate = (dateString) => {
        if (!dateString) return null;
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return null;

            const day = date.getDate();
            const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
            const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);

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
            return null;
        }
    };

    const handleRemoveSummary = (index, e) => {
        e.stopPropagation(); // Prevent triggering the token click
        setSummaryMessages(prev => {
            const updatedSummaries = [...prev[userId]];
            updatedSummaries.splice(index, 1); // Remove the summary at the specified index

            return {
                ...prev,
                [userId]: updatedSummaries
            };
        });
    };

    return (
        <div className="w-full mb-2 px-2">
            <div className="flex flex-wrap gap-2">
                {summaryMessages[userId].map((summary, index) => {
                    return (
                        <button
                            key={index}
                            onClick={() => handleTokenClick(summary)}
                            className="group flex animate-fadeIn-slow items-center gap-1 cursor-pointer text-xs bg-[#1A73E80D] text-gray-800 px-3 py-1 rounded-sm hover:bg-gray-200 border border-[#22283666] relative"
                        >
                            <span className="truncate max-w-[120px]">
                                <img src={summary.visitData.icon} className='h-5' alt="" />
                            </span>
                            <span>
                                {summary.visitData.visitType === 'chart' && (summary.visitData.noteType)}
                                {summary.visitData.visitType === 'medicalSummary' && (formatDate(summary.visitData.date) || 'Visit')}
                                {summary.visitData.allergies && `${summary.visitData.allergies}`}
                                {summary.visitData.medicine?.name && `${summary.visitData.medicine.name}`}
                                {summary.problems && 'Problems'}
                                {summary.visitData.healthMetrics && `${summary.visitData.healthMetrics.metric} Reading`}
                                {summary.visitData.vaccines && `${summary.visitData.vaccines.name}`}
                                {summary.visitData.vitalData && `${summary.visitData.vitalData.vitalName}`}
                                {summary.visitData.visitType === 'medicalVisit' && (
                                    `Doctor Visit` +
                                    (summary.diagnosis ? ` for ${summary.diagnosis}` : '') +
                                    (summary.formattedDate ? ` on ${summary.formattedDate}` : '')
                                )}
                                {!summary.visitType && !summary.allergies && !summary.medicine?.name &&
                                    !summary.problems && !summary.healthMetrics && !summary.vaccines &&
                                    !summary.vitalData && ''}
                            </span>
                            {!isUser && <button
                                onClick={(e) => handleRemoveSummary(index, e)}
                                className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-0.5 bg-gray-300 rounded-full hover:bg-gray-400"
                            >
                                <X size={12} className="text-gray-700" />
                            </button>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default UserSummaryToken;