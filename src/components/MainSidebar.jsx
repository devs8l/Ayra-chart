import { useContext, useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { MedContext } from "../context/MedContext";
import {
    FileText,
    User as UserIcon,
    Calendar as CalendarIcon,
    Settings,
    Search,
    X,
    CircleHelp,
    Sun,
    Moon,
    LogOut
} from "lucide-react";

const Sidebar = ({ isExpanded }) => {
    const { setIsExpanded, isUserSelected, setSearchQuery, searchQuery, setIsPatientExpanded } = useContext(MedContext);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const searchInputRef = useRef(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const navItems = [
        {
            path: "/",
            icon: <FileText size={20} />,
            text: "Appointments",
            title: "Appointments"
        },
        {
            path: "/patients",
            icon: <UserIcon size={20} />,
            text: "Patients",
            title: "Patients"
        },

    ];
    console.log("Sidebar Rendered", isSearchOpen);


    const handleSearchClick = () => {
        if (!isExpanded) {
            setIsExpanded(true);
            // Small delay to allow expansion before focusing
            setTimeout(() => {
                setIsSearchOpen(true);
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                }
            }, 200);
        } else {
            setIsSearchOpen(!isSearchOpen);
            if (!isSearchOpen && searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }
    };

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    return (
        <div className="h-full bg-[#FFFFFF33]  dark:bg-gray-800  flex flex-col justify-between transition-all duration-300">
            {/* Main Content */}
            <div>
                {/* Header - Fixed height */}
                <div className="h-19 px-6 flex items-center ">
                    <button
                        onClick={() => { setIsExpanded(!isExpanded), setIsSearchOpen(false); }}
                        className="flex items-center gap-3 w-full h-full"
                        aria-label="Toggle sidebar"
                    >
                        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                            {isExpanded ? (
                                <img src="/ham-c.svg" className="w-5 h-5" alt="Close menu" />
                            ) : (
                                <img src="/ham-e.svg" className="w-5 h-5" alt="Open menu" />
                            )}
                        </div>
                        <div className={`flex flex-col text-left  h-7 overflow-hidden transition-opacity duration-200 ${isExpanded ? "opacity-100 fadeInLeft" : "opacity-0 w-0 fadeOutRight"}`}>
                            <img src="/Ayra.svg" className='h-full w-full object-contain ' alt="" />
                        </div>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-2 flex-1">
                    <ul className="space-y-1 px-4">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    title={item.title}
                                    className={({ isActive }) =>
                                        `flex items-center p-3 rounded-lg transition-colors  ${(isUserSelected && item.text === 'Appointments')
                                            ? 'text-[#222836] dark:text-blue-400'
                                            : isActive
                                                ? 'text-[#222836] dark:bg-gray-700 dark:text-blue-400'
                                                : 'text-[#22283666] dark:text-gray-300 dark:hover:bg-gray-700'
                                        } ${isActive ? ' dark:bg-gray-700' : ''
                                        }`
                                    }
                                >
                                    <div onClick={() => { setIsPatientExpanded(false) }} className="flex items-center gap-3 w-full">
                                        <span className="w-6 flex justify-center flex-shrink-0">
                                            {item.icon}
                                        </span>
                                        <span className={`whitespace-nowrap semi overflow-hidden transition-all duration-200 ${isExpanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}>
                                            {item.text}
                                        </span>
                                    </div>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Bottom Action Icons */}
            <div className=" dark:border-gray-700 p-2 px-4">
                <ul className="space-y-2">
                    {/* Search - Now with input field */}
                    {!isUserSelected && (
                        <li>
                            {isSearchOpen ? (
                                <div className="flex items-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 bg-transparent border-none outline-none text-sm px-1 py-1"
                                    />
                                    <button
                                        onClick={() => setIsSearchOpen(false)}
                                        className="p-1 absolute right-5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleSearchClick}
                                    className={`flex items-center p-3 rounded-lg  w-full gap-3 cursor-pointer`}
                                    aria-label="Open search"
                                >
                                    <span className="w-6 flex justify-center flex-shrink-0 text-gray-600">
                                        <Search size={20} />
                                    </span>
                                    <span className={`whitespace-nowrap semi text-gray-600 overflow-hidden transition-all duration-200 ${isExpanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}>
                                        Search Patients
                                    </span>
                                </button>
                            )}
                        </li>
                    )}

                    {/* Settings - Moved to bottom */}
                    {/* <li>
                        <NavLink
                            to="/settings"
                            className={({ isActive }) =>
                                `flex items-center p-3 rounded-lg transition-colors ${isActive
                                    ? "bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                                    : "text-gray-600 "
                                }`
                            }
                        >
                            <div className="flex items-center gap-3 w-full ">
                                <span className="w-6 flex justify-center flex-shrink-0">
                                    <Settings size={20} />
                                </span>
                                <span className={`whitespace-nowrap semi overflow-hidden transition-all duration-200 ${isExpanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}>
                                    Settings
                                </span>
                            </div>
                        </NavLink>
                    </li> */}

                    {/* Help */}
                    {/* <li>
                        <button
                            className={`flex items-center text-gray-600 p-3 rounded-lg w-full gap-3 cursor-pointer`}
                            title="Help"
                        >
                            <span className="w-6 flex justify-center flex-shrink-0">
                                <CircleHelp size={20} />
                            </span>
                            <span className={`whitespace-nowrap semi overflow-hidden transition-all duration-200 ${isExpanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}>
                                Help
                            </span>
                        </button>
                    </li> */}

                    {/* Profile Dropdown */}
                    <li>
                        <div className="relative">
                            <button
                                className={`flex items-center p-3 rounded-lg w-full gap-3 text-gray-600 `}
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                aria-label="Toggle profile menu"
                            >
                                <span className="w-6 flex justify-center flex-shrink-0">
                                    <div className="w-6 h-6 rounded-full overflow-hidden">
                                        <img
                                            className="w-full h-full object-cover"
                                            src="/doc-dp.png"
                                            alt="User profile"
                                        />
                                    </div>
                                </span>
                                <span className={`whitespace-nowrap semi overflow-hidden transition-all duration-200 ${isExpanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}>
                                    Profile
                                </span>
                            </button>

                            {isProfileDropdownOpen && (
                                <div className={`absolute ${isExpanded ? "left-full ml-2" : "left-0"} bottom-0 mb-2 bg-white dark:bg-gray-900 rounded-xl shadow-md p-2 z-50 animate-slideDown w-48`}>
                                    <div className="flex flex-col space-y-2">
                                        {/* <Link
                                            to="/profile"
                                            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                        >
                                            <UserIcon size={16} />
                                            <span className="text-sm">Profile</span>
                                        </Link>
                                        <div
                                            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
                                            onClick={() => {
                                                setIsProfileDropdownOpen(false);
                                            }}
                                        >
                                            <Sun size={16} />
                                            <span className="text-sm">Light Mode</span>
                                        </div> */}
                                        <div
                                            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer text-red-500"
                                            onClick={() => {
                                                setIsProfileDropdownOpen(false);
                                            }}
                                        >
                                            <LogOut size={16} />
                                            <span className="text-sm">Logout</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;