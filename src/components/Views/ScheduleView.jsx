import React, { useContext, useState, useEffect, useRef } from "react";
import { MedContext } from "../../context/MedContext";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

const ScheduleView = () => {
    const {
        filteredUsers,
        searchQuery,
        searchFilteredUsers,
        setSelectedUser,
        setIsUserSelected,
        isLoading
    } = useContext(MedContext);
    
    const [expandedUserId, setExpandedUserId] = useState(null);
    const [isBlurred, setIsBlurred] = useState(false);
    const appointmentsRef = useRef(null);
    const displayedUsers = searchQuery ? searchFilteredUsers : filteredUsers;

    // Close expanded card when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (appointmentsRef.current && !appointmentsRef.current.contains(event.target)) {
                setExpandedUserId(null);
                setIsBlurred(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleUserClick = (user) => {
        setSelectedUser(user); // Store the selected user in context
        setIsUserSelected(true);
        console.log("Selected user:", user);
    };

    // Render a single patient card
    const renderPatientCard = (user) => {
        const isExpanded = expandedUserId === user._id;

        

        const handleCardClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setExpandedUserId(isExpanded ? null : user._id);
            setIsBlurred(!isExpanded);
        };

        return (
            <>
                <div
                    key={user._id}
                    className={`rounded-md grid grid-cols-1 sm:grid-cols-[2fr_1fr] items-center overflow-hidden gap-1 p-3 sm:p-3 transition-all duration-300 ease-in-out cursor-pointer mx-2 sm:mx-4 ${isExpanded ? 'bg-[#ffffff8e] border border-gray-200 shadow-md before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-green-500 before:rounded-r' : 'hover:bg-[#ffffff8e] border border-[#fff0] hover:border-gray-200 hover-shadow-7xl'} mb-3 sm:my-2`}
                    onClick={handleCardClick}
                >
                    <div className="grid grid-cols-[2.5rem_auto] sm:grid-cols-[3rem_auto] items-center gap-2 sm:gap-4">
                        <div className="w-10 h-10 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center overflow-hidden justify-center">
                            <img src={user.profileImage} className="w-full h-full object-cover" alt={user.name} />
                        </div>
                        <div>
                            <h3 className="font-medium text-sm sm:text-base text-gray-900">{user.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-500">#{user._id.slice(-7)}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center mt-2 sm:mt-0">
                        <Clock size={14} className="" />
                        <span className="text-xs sm:text-sm text-gray-500">{user.time}</span>
                    </div>

                    {/* Expanded content wrapper - conditionally rendered */}
                    <div className={`col-span-1 sm:col-span-2 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-80' : 'max-h-0'}`}>
                        <div className="pt-3 sm:pt-4 ml-10 sm:ml-16">
                            <div className="flex flex-col gap-2 sm:gap-3">
                                <div className="flex gap-2">
                                    <button className="flex gap-3 w-1/4 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 sm:px-3 py-0.5">
                                        Sex: {user.gender}
                                    </button>
                                    <button className="flex gap-1 w-1/4 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 sm:px-3 py-0.5">
                                        Age: 28
                                    </button>
                                    <button className="flex gap-1 w-1/3 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 sm:px-3 py-0.5">
                                        Weight: 59kg
                                    </button>
                                </div>

                                <Link
                                    to={`/user/${user._id}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUserClick(user);
                                    }}
                                    className="contents"
                                >
                                    <button className="p-1 mt-3 mb-3 w-full mr-2 hover:text-white text-[#1A73E8] border transition-all duration-100 ease-in border-[#1A73E8] hover:bg-[#1A73E8] rounded-sm text-sm cursor-pointer">Open Profile</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {!isExpanded && <div className="h-px bg-[#2228365a] mx-6 my-1 last:hidden" />}
            </>
        );
    };

    // Get today's date
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Get tomorrow's date
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];

    // Filter users for today and tomorrow
    const todayPatients = displayedUsers.filter(user => {
        if (!user.appointmentDate) return false;
        try {
            const date = new Date(user.appointmentDate);
            return !isNaN(date.getTime()) && date.toISOString().split('T')[0] === todayString;
        } catch (error) {
            console.error("Invalid date for user:", user);
            return false;
        }
    });

    const tomorrowPatients = displayedUsers.filter(user => {
        if (!user.appointmentDate) return false;
        try {
            const date = new Date(user.appointmentDate);
            return !isNaN(date.getTime()) && date.toISOString().split('T')[0] === tomorrowString;
        } catch (error) {
            console.error("Invalid date for user:", user);
            return false;
        }
    });

    // Format dates
    const formattedToday = today.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        weekday: 'long'
    });

    const formattedTomorrow = tomorrow.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        weekday: 'long'
    });

    return (
        <div ref={appointmentsRef} className="space-y-2 sm:space-y-4 flex-grow overflow-y-auto h-full ">
            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="max-h-[50vh] sm:max-h-[75vh] overflow-y-auto">
                    {/* Today's appointments */}
                    <div className="mb-4 sm:mb-6">
                        <h3 className="text-sm sm:text-base font-medium mb-2 pl-3 sm:pl-5">{formattedToday}</h3>
                        <div className="space-y-0">
                            {todayPatients.length > 0 ? (
                                todayPatients.map(user => renderPatientCard(user))
                            ) : (
                                <p className="text-center text-sm text-gray-500">No appointments today.</p>
                            )}
                        </div>
                    </div>

                    {/* Tomorrow's appointments */}
                    <div className="mb-4 sm:mb-6">
                        <h3 className="text-sm sm:text-base font-medium mb-2 pl-3 sm:pl-5">{formattedTomorrow}</h3>
                        <div className="space-y-0">
                            {tomorrowPatients.length > 0 ? (
                                tomorrowPatients.map(user => renderPatientCard(user))
                            ) : (
                                <p className="text-center text-sm text-gray-500">No appointments tomorrow.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleView;