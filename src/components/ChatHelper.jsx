import { useState, useEffect } from 'react';
import { Calendar, History, ChevronDown, SlidersHorizontal, LogOut } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { ChatContext } from '../context/ChatContext';
import { useContext } from 'react';
import ChatDayModal from './ChatDayModal'; // Import the new component

export default function ChatHelper({ isHelperOpen, setIsHelperOpen, activeTab, setActiveTab }) {
    const { id } = useParams();
    const { userMessages } = useContext(ChatContext);
    const [selectedTab, setSelectedTab] = useState(activeTab || 'history');
    const [yearFilter, setYearFilter] = useState('This Year');
    const [sortOrder, setSortOrder] = useState('Latest First');
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (activeTab) {
            setSelectedTab(activeTab);
        }
    }, [activeTab]);

    useEffect(() => {
        if (id && userMessages[id]) {
            const messages = userMessages[id].filter(msg => !msg.isInitial);
            const history = [];

            // Group messages by day
            const messagesByDay = {};

            messages.forEach((message) => {
                // Use the message timestamp if available, otherwise use current time
                const messageDate = message.timestamp ? new Date(message.timestamp) : new Date();

                // Create a date key in format YYYY-MM-DD for grouping
                const dateKey = messageDate.toISOString().split('T')[0];

                if (!messagesByDay[dateKey]) {
                    messagesByDay[dateKey] = {
                        date: messageDate,
                        formattedDate: messageDate.toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            weekday: 'short'
                        }),
                        messages: []
                    };
                }

                messagesByDay[dateKey].messages.push(message);
            });

            // Convert the grouped messages into history items
            for (const dateKey in messagesByDay) {
                const dayMessages = messagesByDay[dateKey].messages;
                const firstUserMessage = dayMessages.find(msg => msg.type === 'user');
                const title = firstUserMessage
                    ? (firstUserMessage.content.length > 30
                        ? firstUserMessage.content.substring(0, 30) + '...'
                        : firstUserMessage.content)
                    : 'Conversation';

                history.push({
                    title: title,
                    date: messagesByDay[dateKey].formattedDate,
                    fullDate: messagesByDay[dateKey].date,
                    messages: dayMessages,
                    dateKey: dateKey
                });
            }

            // Sort by date (newest first)
            history.sort((a, b) => b.fullDate - a.fullDate);
            setChatHistory(history);
        }
    }, [id, userMessages]);

    const toggleHelper = () => {
        setIsHelperOpen(!isHelperOpen);
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        setActiveTab(tab);
        if (!isHelperOpen) {
            setIsHelperOpen(true);
        }
    };

    const applyYearFilter = (history) => {
        const now = new Date();
        const currentYear = now.getFullYear();

        switch (yearFilter) {
            case 'This Year':
                return history.filter(session =>
                    session.fullDate.getFullYear() === currentYear
                );
            case 'Last Year':
                return history.filter(session =>
                    session.fullDate.getFullYear() === currentYear - 1
                );
            case 'All Time':
            default:
                return history;
        }
    };

    const applySortOrder = (history) => {
        if (sortOrder === 'Latest First') {
            return [...history].sort((a, b) => b.fullDate - a.fullDate);
        } else {
            return [...history].sort((a, b) => a.fullDate - b.fullDate);
        }
    };

    const openDayModal = (day) => {
        setIsHelperOpen(false)
        setSelectedDay(day);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDay(null);
    };

    const filteredHistory = applySortOrder(applyYearFilter(chatHistory));

    return (
        <>
            <div className={`h-full absolute right-0 z-100 top-0 transition-all duration-300 ease-in-out ${isHelperOpen
                ? 'w-md translate-x-0 opacity-100'
                : 'w-0 translate-x-full opacity-100'
                }`}>
                <div className="h-full bg-white border-l border-gray-300 shadow-xl overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
                        <div className={`flex space-x-2 w-full `}>
                            <button
                                className={`px-4 text-sm w-1/2 py-2  flex justify-center items-center gap-2 rounded-[5px] ${selectedTab === 'events'
                                    ? 'bg-[#E2EEFC] text-[#222836] font-medium'
                                    : 'bg-[#F8FBFE] text-[#6F7786]'
                                    }`}
                                onClick={() => handleTabChange('events')}
                            >
                                <img src="/key.svg" alt="" />
                                Key Events
                            </button>
                            <button
                                className={`px-4 text-sm w-1/2 py-2 flex justify-center items-center gap-2 rounded-[5px] ${selectedTab === 'history'
                                    ? 'bg-[#E2EEFC] text-[#222836] font-medium'
                                    : 'bg-[#F8FBFE] text-[#6F7786]'
                                    }`}
                                onClick={() => handleTabChange('history')}
                            >
                                <img src="/history.svg" alt="" />
                                Chat History
                            </button>
                        </div>
                        <button
                            className="text-gray-500 hover:bg-gray-100 rounded-full p-1 ml-2"
                            onClick={toggleHelper}
                        >
                            <LogOut size={20} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                        <div className="relative">
                            <button
                                className="flex items-center text-sm text-gray-700 py-1 px-2 border border-gray-300 rounded"
                                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                            >
                                <Calendar size={16} className="mr-2" />
                                <span>{yearFilter}</span>
                                <ChevronDown size={16} className="ml-2" />
                            </button>

                            {isYearDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                                    {['This Year', 'Last Year', 'All Time'].map((option) => (
                                        <div
                                            key={option}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                            onClick={() => {
                                                setYearFilter(option);
                                                setIsYearDropdownOpen(false);
                                            }}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                className="flex items-center text-sm text-gray-700 py-1 px-2 border border-gray-300 rounded"
                                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                            >
                                <SlidersHorizontal size={16} className="mr-2" />
                                <span>{sortOrder}</span>
                                <ChevronDown size={16} className="ml-2" />
                            </button>

                            {isSortDropdownOpen && (
                                <div className="absolute z-10 mt-1 right-0 bg-white border border-gray-300 rounded shadow-lg">
                                    {['Latest First', 'Oldest First'].map((option) => (
                                        <div
                                            key={option}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm whitespace-nowrap"
                                            onClick={() => {
                                                setSortOrder(option);
                                                setIsSortDropdownOpen(false);
                                            }}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={`${isHelperOpen ? '': 'fadeOut'}  flex-1 overflow-y-auto px-2 py-2`}>
                        {selectedTab === 'history' ? (
                            filteredHistory.length > 0 ? (
                                filteredHistory.map((session, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-3 border mb-2 rounded-md border-gray-200 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => openDayModal(session)}
                                    >
                                        <div className="font-medium text-gray-900">{session.title}</div>
                                        <div className="text-sm text-gray-500">{session.date}</div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={`flex flex-col items-center justify-center h-full text-gray-500 ${isHelperOpen ? '': 'animate-fadeOut'} `}>
                                    <History size={24} className="mb-2" />
                                    <p>No chat history found</p>
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <Calendar size={24} className="mb-2" />
                                <p>Key events will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Use the new modal component */}
            <ChatDayModal
                isOpen={isModalOpen}
                selectedDay={selectedDay}
                onClose={closeModal}
            />
        </>
    );
}