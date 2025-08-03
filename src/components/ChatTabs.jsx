import React, { memo, useContext, useState, useRef, useEffect } from "react";
import { X, User, ChevronDown, Search } from "lucide-react";
import { MedContext } from "../context/MedContext";
import { useChatTabs } from "../context/ChatTabsContext";
import { useNavigate } from "react-router-dom";

const ChatTabs = memo(() => {
    const {
        activeTabId,
        activeTabs,
        isTransitioning,
        hasHistory,
        switchToGeneralTab,
        switchToTab,
        handleCloseTab
    } = useChatTabs();

    const { isTransitioning: isMedTransitioning,setIsExpanded } = useContext(MedContext);
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const [visibleTabIds, setVisibleTabIds] = useState([]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Update visible tabs when activeTabs changes
    useEffect(() => {
        // Update visible tabs based on current state and activeTabs
        updateVisibleTabs();
    }, [activeTabs]); // Run when activeTabs changes

    // Helper function to update visible tabs
    const updateVisibleTabs = () => {
        // If we have a new active tab that isn't in visibleTabIds yet,
        // make sure it's included (this handles new patients)
        if (activeTabId !== 'general' && !visibleTabIds.includes(activeTabId) && 
            activeTabs.some(tab => tab._id === activeTabId)) {
            const currentVisible = visibleTabIds.filter(id =>
                activeTabs.some(tab => tab._id === id)
            );
            
            // Add the active tab at the beginning
            const newVisibleTabs = [activeTabId];
            
            // Add other visible tabs (up to 2 more, since we already added the active tab)
            currentVisible.forEach(id => {
                if (id !== activeTabId && newVisibleTabs.length < 3) {
                    newVisibleTabs.push(id);
                }
            });
            
            setVisibleTabIds(newVisibleTabs);
            return;
        }
        
        // Standard update flow for existing tabs
        // Get current visible tabs that still exist in activeTabs
        const currentVisible = visibleTabIds.filter(id =>
            activeTabs.some(tab => tab._id === id)
        );

        // Get tabs that aren't visible yet
        const nonVisibleTabs = activeTabs.filter(tab =>
            !currentVisible.includes(tab._id)
        );

        // Fill up to 3 visible tabs
        let newVisibleTabs = [...currentVisible];
        for (let i = 0; i < nonVisibleTabs.length && newVisibleTabs.length < 3; i++) {
            newVisibleTabs.push(nonVisibleTabs[i]._id);
        }

        setVisibleTabIds(newVisibleTabs);
    };

    // Special handling for tab selection from dropdown
    const handleTabSelection = (tabId) => {
        // Call the original switchToTab function
        switchToTab(tabId);

        // Create a new array with selected tab at first position
        const newVisibleTabs = [tabId];
        
        // Add other visible tabs (except the selected one)
        visibleTabIds.forEach(id => {
            if (id !== tabId && newVisibleTabs.length < 3) {
                newVisibleTabs.push(id);
            }
        });

        setVisibleTabIds(newVisibleTabs);

        // Close the dropdown
        setIsDropdownOpen(false);
    };

    // Effect to handle when a new tab becomes active
    useEffect(() => {
        if (activeTabId === 'general') return;
        
        // If the active tab is not in visible tabs
        if (!visibleTabIds.includes(activeTabId) && 
            activeTabs.some(tab => tab._id === activeTabId)) {
            
            // Create new visible tabs with the active tab at the beginning
            const newVisibleTabs = [activeTabId];
            
            // Add up to 2 more tabs from the current visible tabs
            visibleTabIds.forEach(id => {
                if (newVisibleTabs.length < 3) {
                    newVisibleTabs.push(id);
                }
            });
            
            setVisibleTabIds(newVisibleTabs);
        }
    }, [activeTabId]);

    const handleActiveSessionClick = () => {
        // Toggle dropdown state - this allows closing by clicking again
        setIsDropdownOpen(!isDropdownOpen);
        setIsExpanded(false)
    };

    const filteredTabs = activeTabs.filter(tab =>
        tab.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Determine which tabs to show in the main row and which to show in dropdown
    const visibleTabs = [];
    const hiddenTabs = [];

    // First, add tabs that should be visible based on visibleTabIds
    visibleTabIds.forEach(tabId => {
        const tab = activeTabs.find(t => t._id === tabId);
        if (tab) {
            visibleTabs.push(tab);
        }
    });

    // All other tabs go to hidden
    activeTabs.forEach(tab => {
        if (!visibleTabs.some(t => t._id === tab._id)) {
            hiddenTabs.push(tab);
        }
    });

    // Common tab class for consistent styling
    const getTabClass = (isActive) => {
        return `flex items-center  gap-2 mt-1 rounded-sm px-4 py-2 h-full cursor-pointer whitespace-nowrap overflow-hidden w-40 ${
            isActive
                ? 'bg-white dark:bg-gray-700 mb-3 relative'
                : 'bg-[#FFFFFF66] dark:bg-gray-600 mb-3 '
        }`;
    };

    // Common text class
    const getTextClass = (isActive) => {
        return `truncate text-sm semi ${isActive ? 'text-gray-900 dark:text-white' : 'text-[#22283666] dark:text-gray-400'}`;
    };

    return (
        <div className="flex items-center justify-between rounded-xl dark:text-white relative">
            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-2 ">
                    {/* General Tab - Always visible */}
                    <div
                        onClick={switchToGeneralTab}
                        className={getTabClass(activeTabId === 'general')}
                    >
                        {activeTabId === 'general' && (
                            <div className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-l-md"></div>
                        )}
                        <div className="w-5 h-5 rounded-full flex items-center justify-center">
                            <img
                                src="/home.svg"
                                alt=""
                            />
                        </div>
                        <span className={getTextClass(activeTabId === 'general')}>General</span>
                        {hasHistory('general') && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 ml-auto"></span>
                        )}
                    </div>

                    {/* Visible Tabs - Up to 3 */}
                    {visibleTabs.map((tab) => (
                        <div
                            key={tab._id}
                            onClick={() => switchToTab(tab._id)}
                            className={getTabClass(activeTabId === tab._id)}
                        >
                            {activeTabId === tab._id && (
                                <div className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-l-md"></div>
                            )}
                            {/* <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
                                <User size={17} />
                            </div> */}
                            <span className={getTextClass(activeTabId === tab._id)}>
                                {tab.name}
                            </span>
                            <div className="ml-auto flex items-center overflow-hidden">
                                {hasHistory(tab._id) && (
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCloseTab(e, tab._id);

                                        // // Also update visibleTabIds when closing a tab
                                        // setVisibleTabIds(prev => {
                                        //     // Remove the closed tab
                                        //     const newIds = prev.filter(id => id !== tab._id);

                                        //     // If there are hidden tabs, bring one to visible
                                        //     if (hiddenTabs.length > 0) {
                                        //         newIds.push(hiddenTabs[0]._id);
                                        //     }

                                        //     return newIds;
                                        // });
                                    }}
                                    className={`p-1 rounded-full   hover:bg-gray-200 dark:hover:bg-gray-500`}
                                    disabled={isTransitioning || isMedTransitioning}
                                >
                                    <X size={12} className={getTextClass(activeTabId === tab._id)} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* "All Active Sessions" Button/Tab - Only shown if there are hidden tabs */}
                    {hiddenTabs.length > 0 && (
                        <div
                            className={getTabClass(isDropdownOpen)}
                            onClick={handleActiveSessionClick}
                        >
                            {isDropdownOpen && (
                                <div className="absolute left-0 top-0 h-full w-1 rounded-l-md"></div>
                            )}
                            <span className={getTextClass(isDropdownOpen)}>All Active Sessions</span>
                            <div className="ml-auto flex items-center">
                                {hiddenTabs.some(tab => hasHistory(tab._id)) && (
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                                )}
                                {isDropdownOpen ? (
                                    <X size={16} />
                                ) : (
                                    <ChevronDown size={16} />
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div
                        ref={dropdownRef}
                        className="absolute z-[9999] mt-2 w-64 right-0 rounded-md shadow-2xl bg-white dark:bg-gray-700"
                    >
                        <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                            <div className="relative">
                                <Search
                                    size={14}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Search tabs..."
                                    className="w-full pl-8 pr-2 py-2 text-sm bg-[#ffffff57] dark:bg-gray-600 rounded-md focus:outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="py-1 max-h-60 overflow-y-auto">
                            {/* Hidden Tabs */}
                            {filteredTabs
                                .filter(tab => hiddenTabs.some(hiddenTab => hiddenTab._id === tab._id))
                                .map(tab => (
                                    <div
                                        key={tab._id}
                                        onClick={() => handleTabSelection(tab._id)}
                                        className="flex items-center justify-between px-4 py-3 text-sm cursor-pointer hover:bg-[#ffffff57] dark:hover:bg-gray-600"
                                    >
                                        <div className="flex items-center gap-2">
                                            <User size={14} />
                                            <span className="truncate">{tab.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {hasHistory(tab._id) && (
                                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCloseTab(e, tab._id);
                                                }}
                                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-500"
                                                disabled={isTransitioning || isMedTransitioning}
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                            {filteredTabs.filter(tab => hiddenTabs.some(hiddenTab => hiddenTab._id === tab._id)).length === 0 && (
                                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                    No tabs found
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default ChatTabs;