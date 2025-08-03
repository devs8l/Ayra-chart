import React, { useContext, useState, useRef, useEffect } from "react";
import { MedContext } from "../context/MedContext";
import { Link } from "react-router-dom";
import { ChartSpline, ChevronDown, Clock, Droplets, Repeat } from "lucide-react";
import DayView from "./Views/DayView";
import WeeklyView from "./Views/WeeklyView";
import MonthlyView from "./Views/MonthlyView";
import ScheduleView from "./Views/ScheduleView";
import YearlyView from "./Views/YearlyView";

const Appointments = () => {
    const {
        filteredUsers,
        searchQuery,
        searchFilteredUsers,
        setIsUserSelected,
        isUserSelected,
        filterBasis,
        selectedDate,
        weekBounds,
        setSelectedUser,
        isLoading,
        isContentExpanded,
        setIsContentExpanded
    } = useContext(MedContext);


    // Render the appropriate view based on the filter basis
    const renderView = () => {
        switch (filterBasis) {
            case 'week':
                return <WeeklyView />;
            case 'month':
                return <MonthlyView/>
            case 'year':
                return <YearlyView/>
            case 'schedule':
                return <ScheduleView/>
            case 'day':
                return <DayView />;
            default:
                return <ScheduleView/>
        }
    };
    if (!isContentExpanded) {
        return (
            <div className="h-full  rounded-lg flex flex-col items-center justify-between py-4 px-0">
                <div className='border-b border-gray-300 w-full flex justify-center items-center pb-3'>
                    <button
                        onClick={() => setIsContentExpanded(true)}
                        className="text-gray-500 p-2 cursor-pointer rounded-full hover:text-gray-900 animate-fadeInLeft"
                    >
                        <img src="/notes.svg" className='w-5 h-5' alt="" />
                    </button>
                </div>
            </div>
        );
    }

return (
    <div className={` ${isUserSelected ? 'animate-fadeOut' : ''} !z-0`}>
        {/* Main content container with conditional blur */}
        {renderView()}
    </div>
);
};

export default Appointments;