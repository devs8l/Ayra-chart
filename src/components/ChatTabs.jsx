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

    const { isTransitioning: isMedTransitioning, setIsExpanded } = useContext(MedContext);
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
        updateVisibleTabs();
    }, [activeTabs]);

    // Helper function to get patient ID from FHIR resource
    const getPatientId = (patient) => {
        return patient.resource?.id || patient.id; // Fallback to patient.id if resource doesn't exist
    };

    // Helper function to update visible tabs
    const updateVisibleTabs = () => {
        const currentActiveId = getPatientId({ id: activeTabId }); // Handle both resource and non-resource cases
        
        if (currentActiveId !== 'general' && !visibleTabIds.includes(currentActiveId) && 
            activeTabs.some(tab => getPatientId(tab) === currentActiveId)) {
            
            const currentVisible = visibleTabIds.filter(id =>
                activeTabs.some(tab => getPatientId(tab) === id)
            );
            
            const newVisibleTabs = [currentActiveId];
            
            currentVisible.forEach(id => {
                if (id !== currentActiveId && newVisibleTabs.length < 3) {
                    newVisibleTabs.push(id);
                }
            });
            
            setVisibleTabIds(newVisibleTabs);
            return;
        }
        
        const currentVisible = visibleTabIds.filter(id =>
            activeTabs.some(tab => getPatientId(tab) === id)
        );

        const nonVisibleTabs = activeTabs.filter(tab =>
            !currentVisible.includes(getPatientId(tab))
        );

        let newVisibleTabs = [...currentVisible];
        for (let i = 0; i < nonVisibleTabs.length && newVisibleTabs.length < 3; i++) {
            newVisibleTabs.push(getPatientId(nonVisibleTabs[i]));
        }

        setVisibleTabIds(newVisibleTabs);
    };

    // Special handling for tab selection from dropdown
    const handleTabSelection = (tabId) => {
        switchToTab(tabId);

        const newVisibleTabs = [tabId];
        
        visibleTabIds.forEach(id => {
            if (id !== tabId && newVisibleTabs.length < 3) {
                newVisibleTabs.push(id);
            }
        });

        setVisibleTabIds(newVisibleTabs);
        setIsDropdownOpen(false);
    };

    // Effect to handle when a new tab becomes active
    useEffect(() => {
        const currentActiveId = getPatientId({ id: activeTabId });
        if (currentActiveId === 'general') return;
        
        if (!visibleTabIds.includes(currentActiveId) && 
            activeTabs.some(tab => getPatientId(tab) === currentActiveId)) {
            
            const newVisibleTabs = [currentActiveId];
            
            visibleTabIds.forEach(id => {
                if (newVisibleTabs.length < 3) {
                    newVisibleTabs.push(id);
                }
            });
            
            setVisibleTabIds(newVisibleTabs);
        }
    }, [activeTabId]);

    const handleActiveSessionClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
        setIsExpanded(false);
    };

    const filteredTabs = activeTabs.filter(tab =>
        tab.resource?.name?.[0]?.given?.[0]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Determine which tabs to show in the main row and which to show in dropdown
    const visibleTabs = [];
    const hiddenTabs = [];

    visibleTabIds.forEach(tabId => {
        const tab = activeTabs.find(t => getPatientId(t) === tabId);
        if (tab) {
            visibleTabs.push(tab);
        }
    });

    activeTabs.forEach(tab => {
        if (!visibleTabs.some(t => getPatientId(t) === getPatientId(tab))) {
            hiddenTabs.push(tab);
        }
    });

    const getTabClass = (isActive) => {
        return `flex items-center gap-2 mt-1 rounded-sm px-4 py-2 h-full cursor-pointer whitespace-nowrap overflow-hidden w-40 ${
            isActive
                ? 'bg-white dark:bg-gray-700 mb-3 relative'
                : 'bg-[#FFFFFF66] dark:bg-gray-600 mb-3'
        }`;
    };

    const getTextClass = (isActive) => {
        return `truncate text-sm semi ${isActive ? 'text-gray-900 dark:text-white' : 'text-[#22283666] dark:text-gray-400'}`;
    };

    const getPatientName = (patient) => {
        if (!patient.resource?.name?.[0]) return 'Unknown';
        const name = patient.resource.name[0];
        return `${name.given?.[0] || ''} ${name.family || ''}`.trim();
    };

    return (
        <div className="flex items-center justify-between rounded-xl dark:text-white relative">
            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-2">
                    {/* General Tab - Always visible */}
                    <div
                        onClick={switchToGeneralTab}
                        className={getTabClass(activeTabId === 'general')}
                    >
                        {activeTabId === 'general' && (
                            <div className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-l-md"></div>
                        )}
                        <div className="w-5 h-5 rounded-full flex items-center justify-center">
                            <img src="/home.svg" alt="" />
                        </div>
                        <span className={getTextClass(activeTabId === 'general')}>General</span>
                        {hasHistory('general') && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 ml-auto"></span>
                        )}
                    </div>

                    {/* Visible Tabs - Up to 3 */}
                    {visibleTabs.map((tab) => {
                        const tabId = getPatientId(tab);
                        return (
                            <div
                                key={tabId}
                                onClick={() => switchToTab(tabId)}
                                className={getTabClass(activeTabId === tabId)}
                            >
                                {activeTabId === tabId && (
                                    <div className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-l-md"></div>
                                )}
                                <span className={getTextClass(activeTabId === tabId)}>
                                    {getPatientName(tab)}
                                </span>
                                <div className="ml-auto flex items-center overflow-hidden">
                                    {hasHistory(tabId) && (
                                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCloseTab(e, tabId);
                                        }}
                                        className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-500`}
                                        disabled={isTransitioning || isMedTransitioning}
                                    >
                                        <X size={12} className={getTextClass(activeTabId === tabId)} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

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
                                {hiddenTabs.some(tab => hasHistory(getPatientId(tab))) && (
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
                                .filter(tab => hiddenTabs.some(hiddenTab => getPatientId(hiddenTab) === getPatientId(tab)))
                                .map(tab => {
                                    const tabId = getPatientId(tab);
                                    return (
                                        <div
                                            key={tabId}
                                            onClick={() => handleTabSelection(tabId)}
                                            className="flex items-center justify-between px-4 py-3 text-sm cursor-pointer hover:bg-[#ffffff57] dark:hover:bg-gray-600"
                                        >
                                            <div className="flex items-center gap-2">
                                                <User size={14} />
                                                <span className="truncate">{getPatientName(tab)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {hasHistory(tabId) && (
                                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCloseTab(e, tabId);
                                                    }}
                                                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-500"
                                                    disabled={isTransitioning || isMedTransitioning}
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                            {filteredTabs.filter(tab => hiddenTabs.some(hiddenTab => getPatientId(hiddenTab) === getPatientId(tab))).length === 0 && (
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