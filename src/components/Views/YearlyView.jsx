import React, { useContext } from "react";
import { MedContext } from "../../context/MedContext";
import { Link } from "react-router-dom";

const YearlyView = () => {
    const {
        filteredUsers,
        searchQuery,
        searchFilteredUsers,
        setSelectedUser,
        setIsUserSelected,
        selectedDate
    } = useContext(MedContext);
    
    const displayedUsers = searchQuery ? searchFilteredUsers : filteredUsers;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const year = selectedDate.getFullYear();

    // Group patients by month
    const groupPatientsByMonth = () => {
        const groupedPatients = {};
        months.forEach((month, index) => {
            groupedPatients[index] = [];
        });

        displayedUsers.forEach(user => {
            if (user.appointmentDate) {
                try {
                    const date = new Date(user.appointmentDate);
                    // Check if date is valid and in the selected year
                    if (!isNaN(date.getTime()) && date.getFullYear() === year) {
                        const monthIndex = date.getMonth();
                        groupedPatients[monthIndex].push(user);
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

    const groupedPatients = groupPatientsByMonth();

    return (
        <>
            <div className=" z-0 top-0 dark:bg-[#464444] font-semibold text-gray-700 rounded-xl px-3 sm:px-5 py-3 sm:py-5">
                <h2 className="text-base sm:text-lg font-semibold mb-2">Yearly Calendar - {year}</h2>
            </div>

            <div className="flex-grow overflow-y-auto overflow-hidden max-h-[40vh] sm:max-h-[65vh]">
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                    {months.map((month, index) => (
                        <div key={month} className="border rounded-lg p-2 sm:p-3 bg-gray-50 dark:bg-[#2a2a2a]">
                            <h3 className="font-medium text-sm border-b pb-1 sm:pb-2 mb-1 sm:mb-2">{month}</h3>
                            {groupedPatients[index].length > 0 ? (
                                <div className="space-y-1 sm:space-y-2">
                                    <p className="text-xs sm:text-sm font-medium">{groupedPatients[index].length} appointments</p>
                                    <div className="space-y-1 max-h-[100px] sm:max-h-[150px] overflow-y-auto">
                                        {groupedPatients[index].slice(0, 5).map(user => (
                                            <Link to={`/user/${user._id}`} key={user._id} onClick={() => handleUserClick(user)} className="block">
                                                <div className="p-1 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] rounded text-xs">
                                                    <p className="font-medium truncate">{user.name}</p>
                                                    <p className="text-gray-500">{new Date(user.appointmentDate).getDate()} {month.substring(0, 3)}</p>
                                                </div>
                                            </Link>
                                        ))}
                                        {groupedPatients[index].length > 5 && (
                                            <p className="text-xs text-center text-gray-500">
                                                + {groupedPatients[index].length - 5} more
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 text-xs sm:text-sm">No appointments</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default YearlyView;