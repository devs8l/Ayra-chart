import React, { useContext } from "react";
import { MedContext } from "../../context/MedContext";
import { Link } from "react-router-dom";

const MonthlyView = () => {
    const {
        filteredUsers,
        searchQuery,
        searchFilteredUsers,
        setSelectedUser,
        setIsUserSelected,
        selectedDate
    } = useContext(MedContext);
    
    const displayedUsers = searchQuery ? searchFilteredUsers : filteredUsers;

    // Function to group patients by date for monthly view
    const groupPatientsByDate = () => {
        const groupedPatients = {};

        displayedUsers.forEach(user => {
            if (user.appointmentDate) {
                try {
                    const date = new Date(user.appointmentDate);
                    // Check if date is valid and in the selected month
                    if (!isNaN(date.getTime()) && 
                        date.getMonth() === selectedDate.getMonth() && 
                        date.getFullYear() === selectedDate.getFullYear()) {
                        const dateKey = date.getDate().toString();
                        if (!groupedPatients[dateKey]) {
                            groupedPatients[dateKey] = [];
                        }
                        groupedPatients[dateKey].push(user);
                    }
                } catch (error) {
                    console.error("Invalid date for user:", user);
                }
            }
        });

        return groupedPatients;
    };

    const handleUserClick = (user) => {
        setSelectedUser(user); // Store the selected user in context
        setIsUserSelected(true);
        console.log("Selected user:", user);
    };

    const groupedPatients = groupPatientsByDate();
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
    const monthName = selectedDate.toLocaleString('default', { month: 'long' });
    const year = selectedDate.getFullYear();

    // Create an array of weeks (for grid layout)
    const weeks = [];
    let week = [];

    // Get the first day of the month
    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        week.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        week.push(day.toString());

        if (week.length === 7 || day === daysInMonth) {
            // Fill remaining days of the last week
            while (week.length < 7) {
                week.push(null);
            }

            weeks.push(week);
            week = [];
        }
    }

    return (
        <>
            <div className="top-0 dark:bg-[#464444] font-semibold text-gray-700 rounded-xl px-3 sm:px-5 py-3 sm:py-5">
                <h2 className="text-base sm:text-lg font-semibold mb-2">{monthName} {year}</h2>
                <div className="grid grid-cols-7 gap-1 sm:gap-2 text-xs sm:text-sm">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center">
                            <span className="hidden xs:inline">{day}</span>
                            <span className="xs:hidden">{day.charAt(0)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto overflow-hidden max-h-[35vh] sm:max-h-[65vh]">
                {weeks.map((week, weekIndex) => (
                    <div key={`week-${weekIndex}`} className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-2">
                        {week.map((day, dayIndex) => (
                            <div
                                key={`day-${weekIndex}-${dayIndex}`}
                                className={`border rounded-lg p-1 sm:p-2 ${day ? 'bg-gray-50 dark:bg-[#2a2a2a]' : 'bg-gray-100 dark:bg-[#333333] opacity-50'} min-h-[70px] sm:min-h-[100px] overflow-y-auto`}
                            >
                                {day && (
                                    <>
                                        <h3 className="font-medium text-xs text-center border-b pb-1 mb-1">{day}</h3>
                                        {groupedPatients[day] && groupedPatients[day].length > 0 ? (
                                            <div className="space-y-1 sm:space-y-2">
                                                {groupedPatients[day].map(user => (
                                                    <Link to={`/user/${user._id}`} key={user._id} onClick={() => handleUserClick(user)} className="block">
                                                        <div className="p-1 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] rounded text-xs">
                                                            <p className="font-medium truncate">{user.name}</p>
                                                            <p className="text-gray-500">{user.time}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center text-gray-500 text-xs">No appts</p>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};

export default MonthlyView;