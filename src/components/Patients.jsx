import { useContext, useState, useEffect } from "react";
import { MedContext } from "../context/MedContext";
import { ChevronLeft, ChevronRight, Search, ArrowDownAZ } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Patients = () => {
    const {
        users,
        setIsContentExpanded,
        setIsPatientExpanded,
        isPatientExpanded,
        isContentExpanded,
        setSelectedUser,
        setIsUserSelected,
        setIsNotesExpanded,
        setIsPatientRoute
    } = useContext(MedContext);

    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("All Patients");
    const patientsPerPage = 7; // Changed from 10 to 7

    // Format users data
    const formattedUsers = users.map((user, index) => ({
        _id: user._id,
        id: String(index + 1).padStart(2, '0'),
        name: user.name,
        patientId: user._id,
        profileImage: user.profileImage,
        dob: "15/04/1990",
        sex: "M",
        lastVisited: "15/04/2025",
        nextVisit: "12/05/2025",
        primaryDiagnosis: "Allergy",
        primaryPhysician: "Dr. Michael Ericson, MD",
        insuranceStatus: "Insured",
        contactNumber: "9876543210",
        priority: index % 3 === 0 ? "High" : index % 2 === 0 ? "Medium" : "Low"
    }));

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setIsUserSelected(true);
        setIsPatientRoute(true);
        setIsPatientExpanded(false);
        navigate(`/user/${user._id}`);
    };  

    // Filter and sort patients
    useEffect(() => {
        let result = formattedUsers;

        if (searchQuery) {
            result = result.filter(patient =>
                patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.patientId.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (sortColumn) {
            result = [...result].sort((a, b) => {
                if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
                if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
                return 0;
            });
        }

        setFilteredPatients(result);
        // Reset to first page when filters change
        setCurrentPage(1);
    }, [searchQuery, activeTab, sortColumn, sortDirection, users]);

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
    const paginatedPatients = filteredPatients.slice(
        (currentPage - 1) * patientsPerPage, 
        currentPage * patientsPerPage
    );

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setSearchQuery("");
        setCurrentPage(1);
    };

    if (!isContentExpanded) {
        return (
            <div className="h-full rounded-lg flex flex-col items-center justify-between py-4">
                <button
                    onClick={() => setIsContentExpanded(true)}
                    className="text-gray-500 p-2 rounded-full hover:text-gray-900 animate-fadeInLeft"
                >
                    <img src="/notes.svg" className="w-5 h-5" alt="" />
                </button>
            </div>
        );
    }

    const imgUrl = isPatientExpanded ? "/collapse.svg" : "/stretch.svg";

    // Helper function to render sort indicator
    const renderSortIndicator = (column) => {
        if (sortColumn === column) {
            return (
                <svg className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? '' : 'transform rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            );
        }
        return null;
    };

    return (
        <div className="p-1 w-full h-full flex flex-col">
            <div className="flex-1 flex flex-col rounded-lg overflow-hidden">
                {/* Tabs */}
                <div className="flex px-3 gap-1 justify-between pt-2">
                    <div className="flex w-full max-w-md gap-2">
                        <button
                            className={`flex-1 rounded-sm text-xs py-1 px-4 ${activeTab === "All Patients" ? "bg-white text-black" : "border border-[#22283633] text-gray-500"}`}
                            onClick={() => handleTabClick("All Patients")}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                All Patients
                            </div>
                        </button>
                        <button
                            className={`flex-1 rounded-sm text-xs py-2 px-4 ${activeTab === "Follow-ups" ? "bg-white text-black" : "border border-[#22283633] text-gray-500"}`}
                            onClick={() => handleTabClick("Follow-ups")}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                Follow-ups
                            </div>
                        </button>
                    </div>
                    <button
                        onClick={() => {setIsPatientExpanded(!isPatientExpanded), setIsNotesExpanded(false)}}
                        className="text-gray-500 p-2 rounded-full hover:text-gray-900 animate-fadeInLeft"
                    >
                        <img src={imgUrl} className="w-5 h-5" alt="" />
                    </button>
                </div>

                {/* Search and Sort */}
                <div className="px-2 py-4 flex gap-2 border-t border-[#22283633] mt-4 justify-start">
                    <div className="relative w-full max-w-xs">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-[#22283633] rounded-md focus:outline-none"
                        />
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                    <button className="flex items-center gap-1 border text-[#222836] border-[#22283633] rounded-md px-4 py-2">
                        <ArrowDownAZ className="h-4 w-4" />
                        <span>A-Z</span>
                    </button>
                </div>

                {/* Table container */}
                <div className={`flex-1 overflow-x-auto rounded-t-lg ${isPatientExpanded ? 'bg-[#FFFFFF66] border-l border-r border-[#22283633]' : ''}`}>
                    <div className="min-w-full inline-block align-middle">
                        <div className={`overflow-hidden`}>
                            <table className="min-w-full table-fixed border-separate border-spacing-0">
                                {/* Table Header */}
                                <thead className={`text-xs ${isPatientExpanded ? '' : 'bg-[#FFFFFF66]'} rounded-xl`}>
                                    <tr className={isPatientExpanded ? '' : ''}>
                                        <th className={`px-6 py-6 text-left ${isPatientExpanded ? 'rounded-lt-lg' : 'border-l rounded-l-lg'} font-medium border-t border-b border-gray-300`}>S.No</th>
                                        <th className="px-6 py-6 text-left font-medium border-t border-b border-gray-300">Patient Name</th>
                                        <th className={`px-6 py-6 text-left font-medium ${isPatientExpanded ? '' : 'border-r rounded-r-lg'} border-t border-b border-gray-300`}>Patient ID</th>
                                        
                                        {isPatientExpanded && activeTab === "Follow-ups" && (
                                            <>
                                                <th 
                                                    className="px-6 py-4 text-left font-medium cursor-pointer border-t border-b border-gray-300"
                                                    onClick={() => handleSort("contactNumber")}
                                                >
                                                    <div className="flex items-center">
                                                        Contact No
                                                        {renderSortIndicator("contactNumber")}
                                                    </div>
                                                </th>
                                                <th 
                                                    className="px-6 py-4 text-left font-medium cursor-pointer border-t border-b border-gray-300"
                                                    onClick={() => handleSort("priority")}
                                                >
                                                    <div className="flex items-center">
                                                        Priority
                                                        {renderSortIndicator("priority")}
                                                    </div>
                                                </th>
                                            </>
                                        )}

                                        {isPatientExpanded && (
                                            <>
                                                <th 
                                                    className="px-6 py-4 text-left font-medium cursor-pointer border-t border-b border-gray-300"
                                                    onClick={() => handleSort("dob")}
                                                >
                                                    <div className="flex items-center">
                                                        DOB
                                                        {renderSortIndicator("dob")}
                                                    </div>
                                                </th>
                                                <th 
                                                    className="px-6 py-4 text-left font-medium cursor-pointer border-t border-b border-gray-300"
                                                    onClick={() => handleSort("sex")}
                                                >
                                                    <div className="flex items-center">
                                                        Sex
                                                        {renderSortIndicator("sex")}
                                                    </div>
                                                </th>
                                                <th 
                                                    className="px-6 py-4 text-left font-medium cursor-pointer border-t border-b border-gray-300"
                                                    onClick={() => handleSort("lastVisited")}
                                                >
                                                    <div className="flex items-center">
                                                        Last Visit
                                                        {renderSortIndicator("lastVisited")}
                                                    </div>
                                                </th>
                                                <th 
                                                    className="px-6 py-4 text-left font-medium cursor-pointer border-t border-b border-gray-300"
                                                    onClick={() => handleSort("nextVisit")}
                                                >
                                                    <div className="flex items-center">
                                                        Next Visit
                                                        {renderSortIndicator("nextVisit")}
                                                    </div>
                                                </th>
                                                <th 
                                                    className="px-6 py-4 text-left font-medium cursor-pointer border-t border-b border-gray-300"
                                                    onClick={() => handleSort("primaryDiagnosis")}
                                                >
                                                    <div className="flex items-center">
                                                        Primary Diagnosis
                                                        {renderSortIndicator("primaryDiagnosis")}
                                                    </div>
                                                </th>
                                                <th 
                                                    className="px-6 py-4 text-left font-medium cursor-pointer border-t border-b border-gray-300"
                                                    onClick={() => handleSort("primaryPhysician")}
                                                >
                                                    <div className="flex items-center">
                                                        Primary Physician
                                                        {renderSortIndicator("primaryPhysician")}
                                                    </div>
                                                </th>
                                                <th 
                                                    className={`px-6 py-4 text-left font-medium cursor-pointer border-t border-b border-gray-300 ${isPatientExpanded ? 'rounded-rt-lg' : ''}`}
                                                    onClick={() => handleSort("insuranceStatus")}
                                                >
                                                    <div className="flex items-center">
                                                        Insurance Status
                                                        {renderSortIndicator("insuranceStatus")}
                                                    </div>
                                                </th>
                                            </>
                                        )}
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody className="divide-y divide-[#22283633]">
                                    {paginatedPatients.length > 0 ? (
                                        paginatedPatients.map((patient) => (
                                            <tr 
                                                key={patient.id} 
                                                onClick={() => handleUserClick(patient)}
                                                className="hover:bg-gray-50 cursor-pointer"
                                            >
                                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-sm">
                                                    {patient.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                                                            <img src={patient.profileImage} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                        <span className="truncate">{patient.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-sm">
                                                    #{patient.patientId?.slice(-6)}
                                                </td>

                                                {isPatientExpanded && activeTab === "Follow-ups" && (
                                                    <>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            {patient.contactNumber}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                                patient.priority === "High"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : patient.priority === "Medium"
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : "bg-green-100 text-green-800"
                                                                }`}
                                                            >
                                                                {patient.priority}
                                                            </span>
                                                        </td>
                                                    </>
                                                )}

                                                {isPatientExpanded && (
                                                    <>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.dob}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.sex}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.lastVisited}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.nextVisit}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.primaryDiagnosis}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.primaryPhysician}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.insuranceStatus}</td>
                                                    </>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={isPatientExpanded ? 11 : 3} className="px-6 py-4 text-center text-sm text-gray-500">
                                                No patients found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div className={`px-6 py-4 flex items-center justify-end gap-2 border border-[#22283633] bg-[#FFFFFF66] ${isPatientExpanded ? 'rounded-b-lg' : 'rounded-lg'}`}>
                    <button
                        className="p-1 rounded border border-gray-200 disabled:opacity-50"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm text-gray-500">
                        {currentPage} / {totalPages > 0 ? totalPages : 1}
                    </span>
                    <button
                        className="p-1 rounded border border-gray-200 disabled:opacity-50"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Patients;