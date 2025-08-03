import React, { useContext } from "react";
import { MedContext } from "../../context/MedContext";
import { Link } from "react-router-dom";

const WeeklyView = () => {
    const {
        filteredUsers,
        searchQuery,
        searchFilteredUsers,
        setSelectedUser,
        setIsUserSelected,
        weekBounds
    } = useContext(MedContext);
    
    const displayedUsers = searchQuery ? searchFilteredUsers : filteredUsers;

    // Function to group patients by day of week
    const groupPatientsByWeekday = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const groupedPatients = {};
        const { startOfWeek, endOfWeek } = weekBounds;

        // Initialize all days of the week
        days.forEach(day => {
            groupedPatients[day] = {
                patients: [],
                date: null,
                dateString: ''
            };
        });

        // Populate days with the actual dates for the current week
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);
            const dayName = days[currentDate.getDay()];
            const dateString = currentDate.toISOString().split('T')[0];
            
            groupedPatients[dayName].date = currentDate;
            groupedPatients[dayName].dateString = dateString;
        }

        // Group patients by the day of week
        displayedUsers.forEach(user => {
            if (user.appointmentDate) {
                try {
                    const date = new Date(user.appointmentDate);
                    // Check if date is valid and falls within the current week
                    if (!isNaN(date.getTime())) {
                        const dateString = date.toISOString().split('T')[0];
                        const dayName = days[date.getDay()];
                        
                        // Check if appointment is in current week
                        if (
                            date >= startOfWeek &&
                            date <= endOfWeek
                        ) {
                            groupedPatients[dayName].patients.push(user);
                        }
                    }
                } catch (error) {
                    console.error("Invalid date for user:", user);
                }
            }
        });

        return { groupedPatients, days };
    };

    const handleUserClick = (user) => {
        setSelectedUser(user); // Store the selected user in context
        setIsUserSelected(true);
        console.log("Selected user:", user);
    };

    const { groupedPatients, days } = groupPatientsByWeekday();
    const { startOfWeek, endOfWeek } = weekBounds;

    // Split days into two rows
    const firstRow = days.slice(0, 4); // Sunday to Wednesday
    const secondRow = days.slice(4);   // Thursday to Saturday

    const formattedStartDate = startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const formattedEndDate = endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Function to render a single day
    const renderDay = (day) => {
        const dayData = groupedPatients[day];
        const isToday = dayData.dateString === new Date().toISOString().split('T')[0];
        const dayDate = new Date(dayData.date);
        const dayNum = dayDate.getDate();

        return (
            <div
                key={day}
                className={`border rounded-lg p-1 sm:p-2 ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-[#2a2a2a]'} min-h-[150px] sm:min-h-[200px] overflow-y-auto`}
            >
                <h3 className="font-medium text-xs sm:text-sm text-center border-b pb-1 sm:pb-2 mb-1 sm:mb-2">{day.substring(0, 3)} {dayNum}</h3>
                {dayData.patients.length > 0 ? (
                    <div className="space-y-2 sm:space-y-3">
                        {dayData.patients.map(user => (
                            <Link to={`/user/${user._id}`} key={user._id} onClick={() => handleUserClick(user)} className="block">
                                <div className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] rounded-lg">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <div>
                                            <h4 className="font-medium text-xs sm:text-sm">{user.name}</h4>
                                            <p className="text-xs text-gray-500">{user.time}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 text-xs">No appointments</p>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="!z-0 top-0 bg-[#f7f7f7] dark:bg-[#464444] font-semibold text-gray-700 rounded-xl px-3 sm:px-5 py-3 sm:py-5">
                <h2 className="text-base sm:text-lg font-semibold mb-2">Week of {formattedStartDate} - {formattedEndDate}</h2>
            </div>

            <div className="flex-grow mt-2 overflow-y-auto overflow-hidden h-[40vh] sm:h-[70vh]">
                {/* First row of days */}
                <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-2">
                    {firstRow.map(day => renderDay(day))}
                </div>
                
                {/* Second row of days */}
                <div className="grid grid-cols-3 gap-1 sm:gap-2">
                    {secondRow.map(day => renderDay(day))}
                </div>
            </div>
        </>
    );
};

export default WeeklyView;