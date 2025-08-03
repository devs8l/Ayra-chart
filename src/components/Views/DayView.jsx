import React, { useContext, useState } from "react";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { MedContext } from "../../context/MedContext";

const DayView = () => {
    const { filteredUsers, searchQuery, searchFilteredUsers, setIsContentExpanded,isLoading,setIsUserSelected,setSelectedUser,setIsPatientRoute,isCalendarOpen, setIsCalendarOpen } = useContext(MedContext);
    const [expandedUserId, setExpandedUserId] = useState(null);
    const displayedUsers = searchQuery ? searchFilteredUsers : filteredUsers;

    // Get today's date
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Filter users for today
    const todayPatients = displayedUsers.filter(user => {
        if (!user.appointmentDate) return false;
        const date = new Date(user.appointmentDate);
        return !isNaN(date.getTime()) && date.toISOString().split('T')[0] === todayString;
    });

    // Format date
    const formattedToday = today.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        weekday: 'long'
    });

    const handleCardClick = (userId) => {
        setIsCalendarOpen(false);
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };
    const handleUserClick = (user) => {
        setIsContentExpanded(false)
        setSelectedUser(user); // Store the selected user in context
        setIsUserSelected(true);
        setIsPatientRoute(false)
        console.log("Selected user:", user);
    };

    return (
        <div className="space-y-2 sm:space-y-4 flex-grow overflow-y-auto overflow-hidden">
            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="mb-4 sm:mb-6">
                    <div className=" mb-2">
                        <div className="grid grid-cols-13 gap-2 bg-[#ffffff7a] px-4 py-6 rounded-sm text-xs sm:text-sm border border-gray-300">
                            <div className="col-span-2 font-medium">S.No</div>
                            <div className="col-span-5 font-medium">Patient</div>
                            <div className="col-span-3 font-medium">Date</div>
                            <div className="col-span-3 font-medium">Time</div>
                        </div>
                    </div>

                    <div className="space-y-0 max-h-[50vh] sm:max-h-[65vh] overflow-y-auto">
                        {todayPatients.length > 0 ? (
                            todayPatients.map((user, index) => {
                                const isExpanded = expandedUserId === user._id;

                                return (
                                    <div key={user._id}>
                                        <div
                                            className={`overflow-hidden transition-all duration-100 ease-in rounded-md border-l-4 border-[#fff0] grid grid-cols-12 gap-2 items-center sm:py-3 px-5   cursor-pointer my-2 ${isExpanded
                                                ? 'bg-[#ffffff] shadow-md  border-green-500  '
                                                : 'hover:bg-[#ffffff] hover:shadow-md'
                                                }`}
                                            onClick={() => handleCardClick(user._id)}
                                        >
                                            <div className="col-span-1 text-xs sm:text-xs">
                                                {index + 1}
                                            </div>

                                            <div className="col-span-5">
                                                <div className="flex items-center gap-2 sm:gap-4">
                                                    <div className="w-10 h-10 sm:w-9 sm:h-9 bg-blue-100 rounded-full flex items-center overflow-hidden justify-center">
                                                        <img src={user.profileImage} className="w-full h-full object-cover" alt={user.name} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-sm sm:text-sm text-gray-900">{user.name}</h3>
                                                        <p className="text-xs sm:text-sm text-gray-500">#{user._id.slice(-7)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-span-3 text-xs sm:text-sm text-gray-500">
                                                {new Date(user.appointmentDate).toLocaleDateString('en-US', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </div>

                                            <div className="col-span-3 flex gap-2 items-center text-xs sm:text-sm text-gray-500">
                                                <Clock size={14} className="" />
                                                <span>{user.time}</span>
                                            </div>

                                            <div className={`col-span-12 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-80' : 'max-h-0'
                                                }`}>
                                                <div className="mt-2 pt-3 sm:pt-4 ml-10 sm:ml-26">
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
                                                            className="contents"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleUserClick(user);
                                                            }}
                                                        >
                                                            <button className="p-1 mt-3 mb-3 w-full mr-2 hover:text-white text-[#1A73E8] border transition-all duration-100 ease-in border-[#1a73e87c] hover:bg-[#1A73E8] rounded-sm text-sm cursor-pointer">
                                                                Open Profile
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {!isExpanded && <div className="h-px bg-[#2228365a] mx-6 my-1 last:hidden" />}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-sm text-gray-500">No appointments today.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DayView;