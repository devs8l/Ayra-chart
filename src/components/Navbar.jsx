import { Menu, Moon, Sun, X, LogOut, User, Settings, Bell } from 'lucide-react';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MedContext } from '../context/MedContext';
import NotificationPopup from './NotificationPopup';
import ChatTabs from './ChatTabs';

const Navbar = () => {
    const { isUserSelected, logout, isExpanded, setIsExpanded } = useContext(MedContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const mobileMenuRef = useRef(null);
    const profileDropdownRef = useRef(null);

    // Dark mode state
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    // Apply theme on mount & when theme state changes
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Toggle dark mode
    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    // Close mobile menu when screen size changes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileMenuOpen]);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
                !event.target.closest('[data-menu-toggle]')) {
                setIsMobileMenuOpen(false);
            }

            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target) &&
                !event.target.closest('[data-profile-toggle]')) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle escape key press to close menus
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isMobileMenuOpen, isProfileDropdownOpen]);

    // Format date for different screen sizes
    const formatDate = () => {
        const now = new Date();
        const isSmallScreen = window.innerWidth < 640;
        const dateOptions = {
            day: 'numeric',
            month: isSmallScreen ? 'short' : 'long',
            weekday: isSmallScreen ? undefined : 'long'
        };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };

        return {
            date: now.toLocaleDateString('en-US', dateOptions),
            time: now.toLocaleTimeString([], timeOptions)
        };
    };

    const { date, time } = formatDate();

    return (
        <>
            <div className="flex flex-col w-full">
                {/* Main Navbar */}
                <div className="dark:text-white  mb-3 px-2 sm:px-3 py-3 bg-[#FFFFFF33]">
                    <div className="flex items-center justify-between">
                        {/* Left Section - Logo and Toggle */}
                        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
                            <div className={`${isExpanded ? 'fadeOutLeft hidden' : 'fadeInRight'} h-7 z-10`}>
                                <img src="/Ayra.svg" className='h-full w-full object-contain ' alt="" />
                            </div>
                            <div className={`${isExpanded ? 'fadeInLeft' : 'ml-10 '} `}>
                                <ChatTabs />
                            </div>
                        </div>

                        {/* Right Section - Date and Notification */}
                        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
                            {/* Date/Time display - responsive versions */}
                            <div className="hidden sm:block text-xs sm:text-sm md:text-md whitespace-nowrap truncate">
                                {date} | {time}
                            </div>

                            {/* Mobile date display */}
                            <div className="sm:hidden text-xs whitespace-nowrap truncate max-w-20">
                                {date} | {time}
                            </div>

                            {/* Notification icon */}
                            <NotificationPopup />

                            {/* Profile dropdown */}
                            

                            {/* Mobile menu toggle button */}
                            <button
                                className="md:hidden w-8 h-8 flex items-center justify-center"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle mobile menu"
                                data-menu-toggle
                            >
                                {isMobileMenuOpen ?
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" /> :
                                    <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                                }
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu - slide down panel */}
                {isMobileMenuOpen && (
                    <div
                        ref={mobileMenuRef}
                        className="md:hidden bg-white dark:bg-gray-900 m-2 mt-0 rounded-xl shadow-md p-4 animate-slideDown z-40"
                    >
                        <div className="flex flex-col space-y-4">
                            {/* Profile section */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        src="/doc-dp.png"
                                        alt="User profile"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-medium">John Doe</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
                                </div>
                            </div>

                            <Link
                                to="/profile"
                                className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm">Profile</span>
                            </Link>

                            <Link
                                to="/settings"
                                className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm">Settings</span>
                            </Link>

                            <div
                                className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
                                onClick={() => {
                                    toggleTheme();
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                {theme === "dark" ?
                                    <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> :
                                    <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
                                }
                                <span className="text-sm">
                                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                                </span>
                            </div>

                            <div
                                className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer text-red-500"
                                onClick={() => {
                                    logout();
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm">Logout</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add slide-down animation */}
            <style jsx="true">{`
                @keyframes slideDown {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out forwards;
                }
                @media (max-width: 400px) {
                    .xs\\:block {
                        display: block;
                    }
                }
            `}</style>
        </>
    );
};

export default Navbar;