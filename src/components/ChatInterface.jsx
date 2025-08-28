import React, { useRef, useEffect, useContext, useState } from 'react';
import { RefreshCcw, Clipboard, ArrowRight, ThumbsUp, ThumbsDown, ArrowUp, Paperclip, Lightbulb, X, Clock, History, Loader2, Droplets, ChartSpline, Repeat, ChevronDown, ChevronUp, Mic } from 'lucide-react';
import { MedContext } from '../context/MedContext';
import { ChatContext } from '../context/ChatContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LoadingSteps from './LoadingSteps';
import FollowUpTabs from './FollowUpTabs';
import SummaryNoteBox from './SummaryNoteBox';
import FollowUpSummary from './FollowUpSummary';
import { useChatTabs } from '../context/ChatTabsContext';
import AnimatedMarkdown from './AnimatedMarkdown';
import UserSummaryToken from './UserSummaryToken';
import FollowUpText from './FollowUpText';

const ChatInterface = ({ isFullScreen, isGeneralChat, isTransitioning }) => {
  const { openDocumentPreview, selectedUser, isNotesExpanded, isSummaryClicked, setIsSummaryClicked, isSummaryBoxActive, isUserSelected, responseConclusion,
    setResponseConclusion, isLoadingFollowUp,
    setIsLoadingFollowUp, followUpQuestions, isContentExpanded,currentPatient,setCurrentPatient } = useContext(MedContext);
  const {
    messages,
    inputMessage,
    setInputMessage,
    uploadedFiles,
    setUploadedFiles,
    sendMessage,
    regenerateMessage,
    isMessageLoading,
    handleClockClick,
    isloadingHistory,
    formatMedicalResponse,
    isSpeechActive,
    setIsSpeechActive,
    animatedMessages,
    setAnimatedMessages,
    summaryMessages,
    addSummaryMessage,
    showInitialState,
    setShowInitialState,
    clearSummaryMessages
  } = useContext(ChatContext);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const summaryEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [localPromptGiven, setLocalPromptGiven] = useState(false);
  const [hasFocusedInput, setHasFocusedInput] = useState(false);
  const [hasAnimatedInput, setHasAnimatedInput] = useState(false);
  const [showBoxClass, setShowBoxClass] = useState(false);
  const [isUserDetailsExpanded, setIsUserDetailsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { hasHistory } = useChatTabs();

  // Different suggestions based on whether a patient is selected
  const patientSuggestionPrompts = [
    "Summarize this patient's last visit",
    "Show me recent lab results and trends",
    "Does this patient have any allergies or chronic conditions?",
    "Suggest possible causes for the patient's current symptoms"
  ];

  const generalSuggestionPrompts = [
    "Summary of my patient list for today",
    "Which patients need urgent attention or follow ups?",
    "What patterns should I be aware of in today's patients?",
    "Any missed appointments or cancellations today?"
  ];
  const [isArrowClicked, setIsArrowClicked] = useState(false);

  const generateMessageId = (message, index) => {
    if (message.messageId) return message.messageId; // Use existing ID if present
    if (isGeneralChat) return `general-${index}`;
    return selectedUser ? `${selectedUser.resource.id}-${index}` : `general-${index}`;
  };

  // Choose which prompts to display based on patient selection
  const suggestionPrompts = selectedUser ? patientSuggestionPrompts : generalSuggestionPrompts;

  // Debounced scroll to prevent jitter
  const debouncedScrollToBottom = () => {
    if (isTransitioning) return; // Skip scrolling during transitions

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Scroll to bottom when loader appears
  useEffect(() => {
    if (isMessageLoading || isLoadingFollowUp) {
      debouncedScrollToBottom();
    }
  }, [isMessageLoading, isTransitioning, isLoadingFollowUp, animatedMessages, messages]);

  // Reset suggestions when chat changes
  useEffect(() => {
    setLocalPromptGiven(false);
    setShowSuggestions(false);
    setHasFocusedInput(false);
    setHasAnimatedInput(false);
    setShowBoxClass(false);
    setIsUserDetailsExpanded(false);
  }, [selectedUser, isGeneralChat]);

  // Save the previous scroll position before transition
  useEffect(() => {
    if (isTransitioning && messageContainerRef.current) {
      messageContainerRef.current.dataset.scrollTop = messageContainerRef.current.scrollTop;
    } else if (!isTransitioning && messageContainerRef.current && messageContainerRef.current.dataset.scrollTop) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.dataset.scrollTop;
    }
  }, [isTransitioning]);

  // Effect to handle the box class removal after 1 second
  useEffect(() => {
    let timer;
    if (showBoxClass) {
      timer = setTimeout(() => {
        setShowBoxClass(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [showBoxClass]);

  const [userTokens, setUserTokens] = useState({});

  const handleSendMessage = () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;
    setUserTokens(summaryMessages)

    // Clear summary messages for the current user if one is selected
    sendMessage(inputMessage, uploadedFiles, summaryMessages);
    if (selectedUser) {
      clearSummaryMessages(selectedUser.resource.id);
    }
    setLocalPromptGiven(true);
    setShowSuggestions(false);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Process each file
    const newFiles = files.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      data: URL.createObjectURL(file),
      file: file // Store the actual file object
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDocumentClick = (file) => {
    // Use the openDocumentPreview function from MedContext
    openDocumentPreview({
      title: file.name,
      url: file.data,
      type: file.type
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSuggestionClick = (prompt) => {
    setInputMessage(prompt);
  };


  const [cachedFollowUps, setCachedFollowUps] = useState({});

  const handleInputFocus = () => {
    setIsInputFocused(true);
    setHasFocusedInput(true);
    if (!hasAnimatedInput) {
      setShowBoxClass(true); // Show the box class when input is focused
    }

    // Show suggestions with animation after a short delay
    if (!showSuggestions && !localPromptGiven && !isUserDetailsExpanded) {
      setShowSuggestions(true);
    }

    // Trigger border animation only once when input is focused for the first time
    if (!hasAnimatedInput) {
      setHasAnimatedInput(true);
    }
  };

  const toggleUserDetails = () => {
    setIsAnimating(true);
    setIsUserDetailsExpanded(!isUserDetailsExpanded);
    setTimeout(() => {
      setIsAnimating(false);
    }, 300); // Match this with your transition duration
  };

  // Check if we should show the initial state (empty chat)
  useEffect(() => {
    setShowInitialState(messages.length <= 1 && !localPromptGiven)
  }, [messages, localPromptGiven])


  const handleAnimationComplete = (messageId) => {
    console.log("Animation complete", messageId);
  };

  const [inputRows, setInputRows] = useState(1);
  const maxRows = 6;

  // Add this with your other state declarations
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;

      // Detect scroll direction
      if (scrollTop < lastScrollTopRef.current) {
        setIsUserScrolledUp(true);


      } else {
        setIsUserScrolledUp(false);
      }

      lastScrollTopRef.current = scrollTop;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const { selectedText, setSelectedText } = useContext(ChatContext);

  console.log("selected",selectedUser);
  

  return (
    <div className="flex flex-col h-full w-full mx-auto shadow-lg transition-opacity duration-200 ease-in-out"
      style={{ opacity: isTransitioning ? 0.7 : 1 }}>

      {/* Messages Container with fixed minimum height */}
      <div
        ref={messageContainerRef}
        className={`flex-1 overflow-y-auto pb-1 sm:pb-1 md:pb-2 pr-1 sm:pr-2 md:pr-3 lg:pr-4 xl:pr-4 pl-1 sm:pl-2 md:pl-3 lg:pl-4 xl:pl-4 min-h-[200px] transition-all duration-200 ease-in-out ${showInitialState ? 'flex justify-center' : ''} `}
      >

        {showInitialState ? (
          <div className={`w-full mt-4  max-w-3xl mx-auto flex  flex-col text-center space-y-3 ${selectedUser ? 'items-end' : 'items-center'} px-4`}>
            {selectedUser ? (
              <div className="flex flex-col items-center w-full ease-in">
                <div className={` flex w-full gap-7 ${isUserDetailsExpanded ? 'mb-4' : ''}`}>
                  <div className="">
                    <img
                      src={'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'}
                      alt="Patient"
                      className="w-12 h-12 rounded-full object-cover mt-2"
                    />
                    
                  </div>
                  <div className={`flex-1 flex flex-col gap-3 border  border-gray-200 rounded-2xl p-4 transition-all duration-300 ease-in-out ${isUserDetailsExpanded ? 'h-auto animate-fadeInDown shadow-xl' : 'overflow-hidden animate-fadeInUp'}`}>
                    <div className="flex flex-col items-start ">
                      <h3 className="text-md text-gray-600 text-left">
                        {isUserDetailsExpanded ? (
                          <>
                            Feeling fatigued quite often. I also have acute body pain. It is hampering my daily routine. I wonder what could be the reason? Lately, I've noticed my appetite has decreased significantly. I've been experiencing headaches in the morning and difficulty sleeping at night. My blood pressure readings have been slightly elevated compared to my normal range.
                            <br /><br />
                            Previous conditions: Mild hypertension (diagnosed 2019), Seasonal allergies
                            <br />
                            Medications: Lisinopril 10mg daily, Loratadine as needed
                            <br />
                            Last visit: 3 months ago for routine checkup
                          </>
                        ) : (
                          "Feeling fatigued quite often. I also have acute body pain. It is hampering my daily routine. I wonder what could be the reason?"
                        )}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2 mt-2 text-left">
                      <h4 className="text-sm sm:text-md font-medium text-gray-800">Visiting for</h4>
                      <div className="flex flex-wrap gap-2">
                        <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 sm:px-3 py-0.5">
                          <Repeat size={12} /><span className="animate-fadeInUp">Routine Checkup</span>
                        </button>
                        <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 sm:px-3 py-0.5">
                          <ChartSpline size={12} /><span className="animate-fadeInUp">Blood Pressure Checkup</span>
                        </button>
                        <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 sm:px-3 py-0.5">
                          <Droplets size={12} /><span className="animate-fadeInUp">Sugar Checkup</span>
                        </button>
                      </div>
                    </div>

                    {/* Additional content that only shows when expanded */}
                    {isUserDetailsExpanded && (
                      <>
                        <div className="flex flex-col gap-2 mt-6 text-left">
                          <h4 className="text-sm sm:text-md font-medium text-gray-800">Medical History</h4>
                          <div className="flex flex-wrap gap-2">
                            <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 sm:px-3 py-0.5">
                              <Repeat size={12} /><span className="animate-fadeInUp">Hypertension</span>
                            </button>
                            <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 sm:px-3 py-0.5">
                              <ChartSpline size={12} /><span className="animate-fadeInUp">Seasonal Allergies</span>
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-6 text-left">
                          <h4 className="text-sm sm:text-md font-medium text-gray-800">Demographics</h4>
                          <div className="flex flex-wrap gap-2">
                            <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 py-0.5 whitespace-nowrap">
                              <img src="/bp.svg" className="w-4 h-4" alt="" /><span className="animate-fadeInUp">120/80 mmHg</span>
                            </button>
                            <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 py-0.5 whitespace-nowrap">
                              <img src="/glucose.svg" className="w-4 h-4" alt="" /><span className="animate-fadeInUp">95 mg/dL</span>
                            </button>
                            <button className="flex gap-1 text-xs sm:text-sm border border-gray-500 text-gray-500 justify-center items-center rounded-xl px-2 py-0.5 whitespace-nowrap">
                              <img src="/o2.svg" className="w-4 h-4" alt="" /><span className="animate-fadeInUp">98%</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    <button
                      onClick={toggleUserDetails}
                      className={`absolute right-4 bottom-4 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 ${isUserDetailsExpanded ? 'transform rotate-180' : ''}`}
                    >
                      {isUserDetailsExpanded ? <ChevronDown size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xl pt-20 pb-10 text-[#222836] p-5 dark:text-white">
                Good Morning Dr. John!
              </div>
            )}


            {/* Unified UI for both general and patient chat */}
            <div className={`w-[90%] transition-all duration-300 ease-in ${isUserDetailsExpanded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
              <div className={`relative flex flex-col  bg-white border-[0.15rem] shadow-md border-gray-50 overflow-hidden rounded-2xl px-6 py-6 transition-all duration-300 ${showBoxClass ? 'box' : ''} ${isInputFocused ? 'shadow-xl' : 'shadow-xl'}`}>
                {selectedUser && (
                  <UserSummaryToken
                    userId={selectedUser.resource.id}
                    summaryMessages={summaryMessages}
                  />
                )}
                <div className={`transition-all duration-200 ease-in-out ${uploadedFiles.length > 0 ? '' : 'hidden'}`}>
                  {uploadedFiles.length > 0 && (
                    <div className="p-1">
                      <div className="flex flex-wrap gap-1 sm:gap-1 md:gap-2 lg:gap-2 xl:gap-2 ">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex relative group cursor-pointer items-center bg-gray-100 dark:bg-gray-800 rounded-sm px-1 sm:px-2 md:px-3 lg:px-3 xl:px-3 py-1">
                            <span onClick={() => handleDocumentClick(file)} className="text-xs truncate max-w-[60px] sm:max-w-[80px] md:max-w-[100px] lg:max-w-[120px] xl:max-w-[150px]">{file.name}</span>
                            <button
                              onClick={() => handleRemoveFile(index)}
                              className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-0.5 bg-gray-300 rounded-full hover:bg-gray-400"
                              disabled={isTransitioning}
                            >
                              <X size={10} sm:size={12} md:size={14} lg:size={14} xl:size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <textarea
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    // Auto-resize the textarea
                    const textareaLineHeight = 24; // Adjust this based on your line-height
                    const previousRows = e.target.rows;
                    e.target.rows = 1; // Reset rows to get correct scrollHeight

                    const currentRows = Math.floor(e.target.scrollHeight / textareaLineHeight);

                    if (currentRows === previousRows) {
                      e.target.rows = currentRows;
                    }

                    if (currentRows >= maxRows) {
                      e.target.rows = maxRows;
                      e.target.scrollTop = e.target.scrollHeight;
                    } else {
                      e.target.rows = currentRows;
                    }

                    setInputRows(currentRows < maxRows ? currentRows : maxRows);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !isTransitioning) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  onFocus={() => handleInputFocus()}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder={selectedUser ? "How can Ayra help with this patient?" : "How can Ayra help?"}
                  className="flex-1 px-2 py-2 rounded-lg text-sm focus:outline-none dark:bg-[#27313C] dark:text-white resize-none overflow-y-auto"
                  disabled={isTransitioning}
                  rows={inputRows}
                  style={{
                    minHeight: '48px', // Minimum height (1 row)
                    maxHeight: '144px', // Maximum height (6 rows * 24px line height)
                    lineHeight: '24px',
                    transition: 'height 0.2s ease-out'
                  }}
                />
                <div className='flex justify-between items-center p-2 '>
                  <div className='flex'>
                    <button
                      onClick={triggerFileUpload}
                      className="p-2 mr-2 border border-gray-300 text-gray-700 dark:text-white rounded-full cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                      disabled={isTransitioning}
                    >
                      <Paperclip size={16} />
                    </button>

                  </div>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setIsSpeechActive(!isSpeechActive)}
                      className={`px-2 cursor-pointer py-2 rounded-full border border-blue-500 transition-colors ${isSpeechActive ? 'text-red-500' : 'text-gray-500 hover:text-blue-500'}`}
                      disabled={isTransitioning}
                    >
                      <img src="/mic.svg" className='w-4 h-4' alt="" />
                    </button>

                    <button
                      onClick={handleSendMessage}
                      className={`p-2 border ${hasFocusedInput ? 'bg-blue-500 text-white' : ' border-blue-500 text-blue-500'} transition-all ease-in duration-400 rounded-full cursor-pointer hover:bg-blue-500 hover:text-white`}
                      disabled={isTransitioning}
                    >
                      <ArrowUp size={16} />
                    </button>

                  </div>
                </div>
              </div>
            </div>

            {/* Animated Suggestions List - Only show after input is focused */}
            {showSuggestions && hasFocusedInput && !isUserDetailsExpanded && (
              <div className={`w-[90%] mt-6 transition-all duration-300 ease-in-out ${isUserDetailsExpanded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
                <ul className="space-y-1">
                  {suggestionPrompts.map((prompt, index) => (
                    <li
                      key={index}
                      className={`opacity-0 transform -translate-y-2 animate-fadeInUp`}
                      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                    >
                      <button
                        className="w-full p-3 text-left text-gray-500 text-sm transition-all duration-200 rounded-lg cursor-pointer "
                        onClick={() => handleSuggestionClick(prompt)}
                      >
                        {prompt}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3 relative md:space-y-4 lg:space-y-5 xl:space-y-6">
            {/* {isSummaryClicked === selectedUser?.resource.id && (
              <div className={`${isSummaryBoxActive ? 'blur-xs' : ''}`}>
                <SummaryNoteBox boxwidth={'1/2'} marginTop={'10'} lineclamp={true} handleSuggestionClick={handleSuggestionClick} />
                <FollowUpSummary handleSuggestionClick={handleSuggestionClick} />
              </div>
            )} */}
            {messages.map((message, index) => {
              const messageId = generateMessageId(message, index);

              return (
                <div key={messageId} className="space-y-1">
                  {/* User messages always render normally */}
                  {message.type === 'user' && (
                    <div className="flex justify-end">
                      <div className="bg-[#c8ddef83] text-gray-700 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[80%] xl:max-w-[80%] rounded-lg p-1 sm:p-2 md:p-3 lg:p-3 xl:p-3">
                        {selectedUser && <UserSummaryToken
                          userId={selectedUser.resource.id}
                          summaryMessages={message.tokens}
                          isUser={true}
                        />}
                        <p className="text-sm sm:text-sm md:text-base lg:text-base xl:text-base">{message.content}</p>
                        {/* Display files for user messages if they exist */}
                        {message.files && message.files.length > 0 && (
                          <div className="mt-1 sm:mt-1 md:mt-2 lg:mt-2 xl:mt-2 space-y-1 sm:space-y-1 md:space-y-2 lg:space-y-2 xl:space-y-2">
                            {message.files.map((file, fileIndex) => (
                              <div
                                key={fileIndex}
                                className="p-1 sm:p-1 md:p-2 lg:p-2 xl:p-2 rounded flex justify-between items-center cursor-pointer hover:bg-opacity-30"
                                onClick={() => handleDocumentClick(file)}
                              >
                                <div className="flex items-center">
                                  <img src="/doc.svg" className='w-3 h-3 mr-1' alt="" />
                                  <span className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[180px] xl:max-w-[200px]">{file.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* For bot messages, check loading state */}
                  {message.type === 'bot' && !message.isInitial && (
                    <div className="flex justify-start items-start">
                      <img src="/star.svg" className='w-11 h-11 py-1 sm:pt-4 ' alt="" />
                      <div className="text-gray-800 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[80%] xl:max-w-[80%] rounded-lg p-1 sm:p-2 md:p-3 lg:p-3 xl:p-3">

                        <div className="text-sm sm:text-sm md:text-base lg:text-base xl:text-base animate-fadeIn">
                          <AnimatedMarkdown
                            structuredData={message.content}
                            typingSpeed={50}
                            onComplete={() => handleAnimationComplete(messageId)}
                            messageId={messageId}
                            setAnimatedMessages={setAnimatedMessages}
                            animatedMessages={animatedMessages}
                            setResponseConclusion={setResponseConclusion}
                            responseConclusion={responseConclusion}
                            isUserScrolledUp={isUserScrolledUp}
                            setSelectedText={setSelectedText}
                          />

                        </div>
                        {
                          animatedMessages.includes(messageId) && (
                            <div>
                              <div className="flex justify-start space-x-1 border-b border-gray-300 pb-12 pt-5 sm:space-x-2 md:space-x-3 lg:space-x-4 xl:space-x-4 text-gray-500 sm:mt-2 md:mt-3 lg:mt-4 xl:mt-4">
                                <button onClick={() => regenerateMessage(index)} className="hover:text-blue-500">
                                  <RefreshCcw size={15} />
                                </button>
                                <button onClick={() => handleCopy(message.content)} className="hover:text-green-500">
                                  <Clipboard size={15} />
                                </button>
                                <button onClick={() => console.log('Forward')} className="hover:text-yellow-500">
                                  <ArrowRight size={15} />
                                </button>
                                <button onClick={() => console.log('Liked')} className="hover:text-blue-500">
                                  <ThumbsUp size={15} />
                                </button>
                                <button onClick={() => console.log('Disliked')} className="hover:text-red-500">
                                  <ThumbsDown size={15} />
                                </button>
                              </div>
                              <FollowUpTabs
                                responseConclusion={responseConclusion}
                                handleSuggestionClick={handleSuggestionClick}
                                messageId={messageId}
                                cachedFollowUps={cachedFollowUps}
                                setCachedFollowUps={setCachedFollowUps} />
                            </div>
                          )
                        }

                      </div>
                    </div>
                  )}

                  {message.type === 'summary' && (
                    <div className={`${isSummaryBoxActive ? 'blur-xs' : ''}`}>
                      <SummaryNoteBox boxwidth={'1/2'} marginTop={'10'} messageId={messageId} lineclamp={true} currentVisit={message.content.visitData} setResponseConclusion={setResponseConclusion} handleSuggestionClick={handleSuggestionClick} />
                      <FollowUpSummary handleSuggestionClick={handleSuggestionClick} messageId={messageId} currentVisit={message.content.visitData} questions={message.content.questions || []} responseConclusion={responseConclusion} cachedFollowUps={cachedFollowUps} setCachedFollowUps={setCachedFollowUps} />
                    </div>
                  )}

                </div>
              );
            })}

            {/* Separate loader div that appears only when loading */}
            {isMessageLoading && (
              <LoadingSteps isPatientSpecific={!!selectedUser} />
            )}


            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* File Upload Input (hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      {/* Display uploaded files before sending - fixed height to prevent layout shifts */}

      {/* Input Area - Only show at bottom when not in initial state */}
      {!showInitialState && (
        <div className={`relative px-0 ${isSummaryBoxActive ? 'blur-xs' : ''}  transition-all duration-200 ease-in-out mb-4 `}>

          <div onClick={() => setIsArrowClicked(true)} className={`${!isContentExpanded && !isNotesExpanded ? 'w-1/2' : 'w-3/4'} mx-auto flex py-4 px-6 border border-gray-300 shadow-xl ${isInputFocused ? '' : ''} flex-col gap-2 bg-white dark:bg-[#27313C] rounded-3xl transition-all duration-200`}>
            {selectedUser && (
              <>
                <UserSummaryToken
                  userId={selectedUser.resource.id}
                  summaryMessages={summaryMessages}
                />

                {/* <FollowUpText selectedText={selectedText} /> */}
              </>
            )}
            <div className={`transition-all duration-200 ease-in-out ${uploadedFiles.length > 0 ? '' : 'hidden'}`}>
              {uploadedFiles.length > 0 && (
                <div className="p-1">
                  <div className="flex flex-wrap gap-1 sm:gap-1 md:gap-2 lg:gap-2 xl:gap-2 ">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex relative group cursor-pointer items-center bg-gray-100 dark:bg-gray-800 rounded-sm px-1 sm:px-2 md:px-3 lg:px-3 xl:px-3 py-1">
                        <span onClick={() => handleDocumentClick(file)} className="text-xs truncate max-w-[60px] sm:max-w-[80px] md:max-w-[100px] lg:max-w-[120px] xl:max-w-[150px]">{file.name}</span>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-0.5 bg-gray-300 rounded-full hover:bg-gray-400"
                          disabled={isTransitioning}
                        >
                          <X size={10} sm:size={12} md:size={14} lg:size={14} xl:size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <textarea
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                // Auto-resize the textarea
                const textareaLineHeight = 24; // Adjust this based on your line-height
                const previousRows = e.target.rows;
                e.target.rows = 1; // Reset rows to get correct scrollHeight

                const currentRows = Math.floor(e.target.scrollHeight / textareaLineHeight);

                if (currentRows === previousRows) {
                  e.target.rows = currentRows;
                }

                if (currentRows >= maxRows) {
                  e.target.rows = maxRows;
                  e.target.scrollTop = e.target.scrollHeight;
                } else {
                  e.target.rows = currentRows;
                }

                setInputRows(currentRows < maxRows ? currentRows : maxRows);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isTransitioning) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder={selectedUser ? "How can Ayra help with this patient?" : "How can Ayra help?"}
              className="flex-1 px-2 py-4 rounded-lg text-sm focus:outline-none dark:bg-[#27313C] dark:text-white resize-none overflow-y-auto"
              disabled={isTransitioning}
              rows={inputRows}
              style={{
                minHeight: '48px', // Minimum height (1 row)
                maxHeight: '144px', // Maximum height (6 rows * 24px line height)
                lineHeight: '24px',
                transition: 'height 0.2s ease-out'
              }}
            />
            <div className='flex justify-between items-center px-1 py-3'>
              <div className='flex  items-center'>
                <button
                  onClick={triggerFileUpload}
                  className="px-2 py-2 mr-2  border cursor-pointer border-gray-100  text-gray-500 hover:text-blue-500 rounded-full transition-colors"
                  disabled={isTransitioning}
                >
                  <Paperclip size={18} />
                </button>

              </div>
              <div className='flex gap-2 items-center'>
                <button
                  onClick={() => setIsSpeechActive(!isSpeechActive)}
                  className={`px-2 py-2 rounded-full border border-blue-500 cursor-pointer transition-colors ${isSpeechActive ? 'text-red-500' : 'text-gray-500 hover:text-blue-500'}`}
                  disabled={isTransitioning}
                >
                  <img src="/mic.svg" className='w-4 h-4' alt="" />
                </button>
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                  disabled={isTransitioning || (!inputMessage.trim() && uploadedFiles.length === 0)}
                >
                  <ArrowUp size={18} />
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;