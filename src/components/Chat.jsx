import React, { memo, useContext, useEffect, useState } from "react";
import ChatInterface from "./ChatInterface";
import { Maximize, Minimize, AlertCircle, ChevronDown, Repeat, ChartSpline, Droplets, ChevronUp, Calendar } from "lucide-react";
import { MedContext } from "../context/MedContext";
import { ChatContext } from "../context/ChatContext";
import SimpleSpeechRecognition from "./Speech";
import { useChatTabs } from "../context/ChatTabsContext";
import ChatHelper from "./ChatHelper";
import SummaryNoteBox from "./SummaryNoteBox";

const Chat = memo(({ toggleFullScreen, isFullScreen }) => {
    const { selectedUser, isNotesExpanded, isSummaryBoxActive, setIsNotesExpanded, activeSummaryData, isUserSelected } = useContext(MedContext);
    const { isSpeechActive, messages } = useContext(ChatContext);
    const { activeTabId, activeTabs, addTab, showConfirmDialog, confirmCloseTab, cancelCloseTab, tabToClose } = useChatTabs();

    const [isUserDetailsExpanded, setIsUserDetailsExpanded] = useState(false);
    const [isHelperOpen, setIsHelperOpen] = useState(false);
    const [helperActiveTab, setHelperActiveTab] = useState('history');

    const toggleUserDetails = () => {
        setIsUserDetailsExpanded(!isUserDetailsExpanded);
    };

    // Add new tab when a user is selected
    useEffect(() => {
        if (selectedUser) {
            addTab(selectedUser);
        }
    }, [selectedUser, addTab]);
    // Render collapsed version
    if (!isNotesExpanded) {
        return (
            <div className="h-full bg-white rounded-lg flex flex-col items-center justify-between py-4">
                <div className='border-b border-gray-300 w-full flex justify-center items-center pb-3'>
                    <button
                        onClick={() => setIsNotesExpanded(true)}
                        className="text-gray-500 p-2 rounded-full hover:text-gray-900 animate-fadeInLeft"
                    >
                        <img src="/notes.svg" className='w-5 h-5' alt="" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className={` sm:pt-3 h-full bg-[#ffffff] dark:bg-[#00000099] rounded-lg flex flex-col overflow-hidden relative`}>
                {isSpeechActive && (
                    <div className="flex items-center animate-fadeInUp justify-center absolute w-full h-full z-100 top-0 left-0 bg-[#ffffff00] ">
                        <SimpleSpeechRecognition />
                    </div>
                )}
                {isSummaryBoxActive && (
                    <div className="flex items-center   justify-center absolute w-full h-full z-100 top-0 left-0 bg-[#CBE1FC66]">
                        <SummaryNoteBox boxwidth={"[90%]"} messageId={activeSummaryData?.messageId}
                            currentVisit={activeSummaryData?.visitData} marginTop={'0'} lineclamp={false} />
                    </div>
                )}

                <div className={`flex ${isSpeechActive ? 'blur-lg' : ''} ${isSummaryBoxActive ? 'blur-xs' : ''} items-center justify-between border-b border-gray-200 pb-2`}>
                    <h1 className="text-lg sm:text-md text-[#222836] dark:text-white  mt-2 sm:mt-2  sm:px-4  sm:mb-2">
                        Ayra Intelligence
                    </h1>



                    <div className={`flex relative ${isUserDetailsExpanded ? 'z-0' : 'z-10'}   items-center space-x-2 pr-2`}>
                        <button
                            className={`p-2 rounded-full cursor-pointer ${helperActiveTab === 'events' ? ' text-blue-600' : 'text-gray-500 '}`}
                            onClick={() => {
                                setHelperActiveTab('events');
                                setIsHelperOpen(true);
                            }}
                        >
                            <img src="/key.svg" alt="" />
                        </button>
                        <button
                            className={`p-2 rounded-full cursor-pointer ${helperActiveTab === 'history' ? ' text-blue-600' : 'text-gray-500 '}`}
                            onClick={() => {
                                setHelperActiveTab('history');
                                setIsHelperOpen(true);
                            }}
                        >
                            <img src="/history.svg" alt="" />
                        </button>
                        {
                            isUserSelected && (
                                <button
                                    className="text-gray-500 p-1 hover:bg-gray-100 rounded"
                                    onClick={() => setIsNotesExpanded(false)}
                                >
                                    <img src="/notes.svg" className='w-5 h-5' alt="" />
                                </button>
                            )
                        }

                    </div>
                </div>

                {showConfirmDialog && (
                    <div className="fixed inset-0 bg-[#0000008c] flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-md w-full shadow-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertCircle className="text-red-500" size={20} />
                                <h2 className="text-lg font-semibold dark:text-white">End Chat</h2>
                            </div>
                            <p className="mb-6 dark:text-gray-300">
                                Are you sure you want to end the chat for{' '}
                                {activeTabs.find(tab => tab._id === tabToClose)?.name}?
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={cancelCloseTab}
                                    className="px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmCloseTab}
                                    className="px-3 sm:px-4 py-1 sm:py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    End Chat
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className={`flex-grow  overflow-y-auto ${isSpeechActive || isSummaryBoxActive ? 'blur-md' : ''} transition-opacity duration-300 ease-in-out`}>

                    <ChatInterface
                        isFullScreen={isFullScreen}
                        isGeneralChat={activeTabId === 'general'}
                    />
                </div>
                <ChatHelper
                    isHelperOpen={isHelperOpen}
                    setIsHelperOpen={setIsHelperOpen}
                    activeTab={helperActiveTab}
                    setActiveTab={setHelperActiveTab}
                />
            </div>
        </div>
    );
});

export default Chat;