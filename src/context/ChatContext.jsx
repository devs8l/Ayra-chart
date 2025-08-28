import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MedContext } from './MedContext';
import pdfToText from "react-pdftotext";

export const ChatContext = createContext();

const ChatContextProvider = (props) => {
  const { selectedUser } = useContext(MedContext);


  async function extractText(fileObj) {
    // Extract the actual File object (in case it's nested under 'file')
    const file = fileObj.file || fileObj;

    // Validate the file
    if (!file || !(file instanceof File)) {
      console.error("Invalid file - expected a File object");
      return "";
    }

    try {
      const text = await pdfToText(file);
      return text;
    } catch (error) {
      console.error("Failed to extract text from PDF:", error);
      return "";
    }
  }
  // Default initial message for general chat
  const defaultGeneralMessage = {
    type: 'bot',
    content: 'Hi, I am your copilot!',
    subtext: 'Chat and resolve all your queries',
    para: 'Or try these prompts to get started',
    isInitial: true,
  };

  // Default initial message for patient chat
  const defaultPatientMessage = {
    type: 'bot',
    content: 'Patient session started',
    isInitial: true,
  };

  // Store messages by user ID, including 'general' for non-patient chat
  const [userMessages, setUserMessages] = useState({
    general: [defaultGeneralMessage]
  });

  // Current input message
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [isloadingHistory, setIsloadingHistory] = useState(false);

  // Session management
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(3600);
  const [selectedText, setSelectedText] = useState('');
  const intervalRef = useRef(null);

  const [animatedMessages, setAnimatedMessages] = useState([]);


  //speech
  const [isSpeechActive, setIsSpeechActive] = useState(false);
  const [summaryMessages, setSummaryMessages] = useState({});

  // Get current messages - either selected user or general
  const messages = selectedUser
    ? (userMessages[selectedUser.resource.id] || [isSessionActive ? defaultGeneralMessage : defaultGeneralMessage])
    : (userMessages.general || [defaultGeneralMessage]);

  const [showInitialState, setShowInitialState] = useState(true)

  // Update current messages - either for selected user or general
  const setMessages = (newMessages) => {
    const messageKey = selectedUser ? selectedUser.resource.id : 'general';

    setUserMessages(prevUserMessages => ({
      ...prevUserMessages,
      [messageKey]: typeof newMessages === 'function'
        ? newMessages(prevUserMessages[messageKey] ||
          (messageKey === 'general' ? [defaultGeneralMessage] : [isSessionActive ? defaultPatientMessage : defaultGeneralMessage]))
        : newMessages
    }));
  };

  // Load chat history for selected user
  useEffect(() => {
    if (selectedUser && !userMessages[selectedUser.resource.id]) {
      // Initialize this user's messages with appropriate default message based on session state
      setUserMessages(prev => ({
        ...prev,
        [selectedUser.resource.id]: [isSessionActive ? defaultPatientMessage : defaultGeneralMessage]
      }));

      // Optionally, you could fetch chat history from an API here
      // fetchChatHistory(selectedUser.resource.id).then(history => {
      //   if (history && history.length > 0) {
      //     setUserMessages(prev => ({
      //       ...prev,
      //       [selectedUser.resource.id]: history
      //     }));
      //   }
      // });
    }
  }, [selectedUser, isSessionActive]);

  // In your ChatContext provider, add this function
  const clearSummaryMessages = (userId) => {
    setSummaryMessages(prev => {
      const newSummarys = { ...prev };
      delete newSummarys[userId];
      return newSummarys;
    });
  };

  const addSummaryMessage = (userId, visitData, questions) => {
    const summaryContent = {
      visitData,
      questions,
      timestamp: new Date().toISOString()
    };
    setSummaryMessages(prev => {
      const existingSummaries = prev[userId] || [];
      return {
        ...prev,
        [userId]: [...existingSummaries, summaryContent]
      };
    });



    // setMessages(prev => [
    //   ...prev,
    //   {
    //     type: 'summary',
    //     content: summaryContent,
    //     isInitial: false,
    //   }
    // ]);
  };




  const getTokenContent = (visitData) => {
    if (!visitData) return null;
    if (visitData.visitType === 'chart') {
      return `${visitData.notes} , Data from pre-chart noted on ${formatDate(visitData.date)}`;
    }
    if (visitData.visitType === 'medicalSummary') {
      return `${visitData.notes} , Summary noted on ${formatDate(visitData.date)}`;
    }
    if (visitData.allergies) {
      return `Patient is allergic to: ${visitData.allergies}`;
    }
    if (visitData.medicine?.name) {
      return `Prescribed ${visitData.medicine.name} (${visitData.medicine.dosage}) for ${visitData.medicine.diagnosis} - ${visitData.medicine.duration}`;
    }
    if (visitData.problems) {
      return `Problems: ${visitData.problems.join(', ')}`;
    }
    if (visitData.healthMetrics) {
      return `Patient noted ${visitData.healthMetrics.value} - ${visitData.healthMetrics.metric} on ${formatDate(visitData.healthMetrics.date)}`;
    }
    if (visitData.vaccines) {
      if (visitData.vaccines.status === 'Completed') {
        return `Patient was vaccinated with ${visitData.vaccines.name} (${visitData.vaccines.type}) on ${formatDate(visitData.vaccines.date)}`;
      } else {
        return `Patient has ${visitData.vaccines.name} (${visitData.vaccines.type}) in progress, started on ${formatDate(visitData.vaccines.date)}`;
      }
    }
    if (visitData.vitalData) {
      return `Patient's ${visitData.vitalData.vitalName}: ${visitData.vitalData.vitalValue}`;
    }
    if (visitData.visitType === 'medicalVisit') {
      const prescriptionsText = visitData.prescriptions?.length
        ? `Prescribed: ${visitData.prescriptions.map(p =>
          `${p.medicine} (${p.dosage} for ${p.duration})`
        ).join(', ')}. `
        : '';

      const treatmentsText = visitData.treatments?.length
        ? `Treatments performed: ${visitData.treatments.map(t =>
          `${t.procedure} with result: ${t.result}`
        ).join('; ')}. `
        : '';

      const notesText = visitData.notes
        ? `Clinical notes: ${visitData.notes}. `
        : '';

      return (
        `Medical visit with Dr. ${visitData.doctor.name} (${visitData.doctor.specialization}) ` +
        `on ${visitData.formattedDate}. ` +
        `Primary diagnosis: ${visitData.diagnosis}. ` +
        `Consultation duration: ${visitData.duration}. ` +
        prescriptionsText +
        treatmentsText +
        notesText
      );
    }

    return null;
  };

  // Keep your existing formatDate function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Function to handle sending messages
  const sendMessage = async (message, files = [], tokens) => {
    setInputMessage('');
    if (!message.trim() && files.length === 0) return;
    console.log('token',tokens);
    
    let extractedText = "";
    if (files.length > 0) {
      try {
        extractedText = await extractText(files[0]); // Process first file
        console.log("Extracted PDF text:", extractedText);
      } catch (error) {
        console.error("PDF processing failed:", error);
      }
    }
    setUploadedFiles([]);

    // Check if the message is empty or only contains whitespace
    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        content: message,
        files: files.length > 0 ? files : undefined,
        tokens: tokens
      },
    ]);

    setIsMessageLoading(true);

    try {
      if (selectedUser) {
        // Patient-specific flow
        // First, fetch the patient history
        const historyData = await fetchPatientHistory(selectedUser.resource.id);
        const tokenContents = tokens[selectedUser.resource.id]?.map(token => getTokenContent(token.visitData))
          .filter(Boolean) // Remove any null/undefined
          .join(' and '); // Join with 'and'


        const prompt = message + ' Priortize this content for response more : ' + tokenContents + ' Give concise(Shorter) and data dependent response and present it like you are a assistant to  a doctor';
        console.log("Prompt for medical analysis:", prompt);

        if (!historyData) {
          throw new Error('Failed to fetch patient history');
        }

        // Make API call to get medical analysis with history data
        const response = await fetch(
          `https://medicalchat-tau.vercel.app/testmedical_analysis/${encodeURIComponent(prompt)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(historyData),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Format the API response
        // const formattedContent = formatMedicalResponse(data.formatted_response);

        // Add bot response to messages
        console.log(data.structured_data);


        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            content: data.structured_data || 'No response from medical analysis',
            isInitial: false,
          },
        ]);
      } else {
        // General health chat flow - using a different endpoint without patient data
        
        const patientsResponse = await fetch('https://p01--ayra-backend--5gwtzqz9pfqz.code.run/api/v1/emr/patients', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        const patientsData = await patientsResponse.json();

        const generalPrompt = message + extractedText + 'Give concise(Shorter) and data dependent response and present it like you are a assistant to a doctor';

        // Post data to the second API
        const response = await fetch(
          `https://medicalchat-tau.vercel.app/testmedical_analysis/${encodeURIComponent(generalPrompt)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ patients: patientsData }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();


        // Format the API response
        // const formattedContent = formatMedicalResponse(data.formatted_response);

        // Add bot response to messages
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            content: data.structured_data || 'No response from general health chat',
            isInitial: false,
          },
        ]);
      }
    } catch (error) {
      console.error('Error processing chat:', error);

      // Add error message to messages
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          content: 'Sorry, there was an error processing your request.',
          isInitial: false,
        },
      ]);
    } finally {
      setIsMessageLoading(false);
    }

    // Clear input and files after sending

  };

  // Function to regenerate specific message
  const regenerateMessage = async (index) => {
    // Get the original user message to regenerate the response
    const originalUserMessage = messages[index - 1]?.content;

    if (!originalUserMessage) {
      console.error('Cannot regenerate message: No original message found');
      return;
    }

    try {
      // Remove the current bot message
      setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));

      // Show loading state
      setIsMessageLoading(true);

      if (selectedUser) {
        // Patient-specific regeneration
        // Fetch patient history
        const historyData = await fetchPatientHistory(selectedUser.resource.id);

        if (!historyData) {
          throw new Error('Failed to fetch patient history');
        }

        // Regenerate response using the original message
        const response = await fetch(
          `https://medicalchat-tau.vercel.app/testmedical_analysis/${encodeURIComponent(originalUserMessage)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(historyData),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // const formattedContent = formatMedicalResponse(data.formatted_response);


        // Add regenerated bot response to messages
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: 'bot',
            content: data.content || 'No response from medical analysis',
            isInitial: false,
          },
        ]);
      } else {
        // General health chat regeneration
        

        const patientsResponse = await fetch('https://p01--ayra-backend--5gwtzqz9pfqz.code.run/api/v1/emr/patients', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        const patientsData = await patientsResponse.json();

        // Post data to the second API
        const response = await fetch(
          `https://medicalchat-tau.vercel.app/doctor_analysis/${encodeURIComponent(originalUserMessage)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ patients: patientsData }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();


        // Format the API response
        // const formattedContent = formatMedicalResponse(data.content);

        // Add regenerated bot response to messages
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: 'bot',
            content: data.content || 'No response from general health chat',
            isInitial: false,
          },
        ]);
      }
    } catch (error) {
      console.error('Error regenerating message:', error);

      // Add error message to messages
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'bot',
          content: 'Sorry, unable to regenerate the response. Please try again.',
          isInitial: false,
        },
      ]);
    } finally {
      setIsMessageLoading(false);
    }
  };

  // Fetch patient history
  const fetchPatientHistory = async (selectedUserId) => {
    try {
  
      const response = await fetch(
        `https://p01--ayra-backend--5gwtzqz9pfqz.code.run/api/v1/emr/patient/${selectedUserId}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch history');
      const historyData = await response.json();
      console.log("historyData", historyData);

      return historyData; // Pass this to the next API
    } catch (error) {
      console.error('Error fetching history:', error);
      return null;
    }
  };

  // Handle clock click (fetch and analyze patient history)
  const handleClockClick = async () => {
    // If no user is selected, show a general health tips response
    if (!selectedUser) {
      setIsloadingHistory(true);
      try {
        const response = await fetch(
          `https://medicalchat-tau.vercel.app/general_health_chat/${encodeURIComponent("Provide general health tips and wellness advice")}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: "general health tips" }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to get general health tips');
        }

        const data = await response.json();

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: 'bot',
            content: data.content || 'Here are some general health tips...',
            isInitial: false,
          },
        ]);
      } catch (error) {
        console.error('Error fetching general health tips:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: 'bot',
            content: 'Unable to retrieve health tips at this time. Please try again later.',
            isInitial: false,
          },
        ]);
      } finally {
        setIsloadingHistory(false);
      }
      return;
    }

    try {
      setIsloadingHistory(true);

      // Fetch patient history
      const historyData = await fetchPatientHistory(selectedUser?.resource?.id);

      if (!historyData) {
        throw new Error('No patient history found');
      }

      // Fetch analysis with a more dynamic query
      const analysisResult = await fetch(
        `https://medicalchat-tau.vercel.app/testmedical_analysis/Provide a comprehensive overview of this patient's medical history`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(historyData),
        }
      );

      if (!analysisResult.ok) {
        throw new Error('Failed to analyze patient history');
      }

      const analysisData = await analysisResult.json();

      // Add bot message with consistent type
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'bot',
          content: analysisData.content || 'No analysis available',
          isInitial: false,
        },
      ]);
    } catch (error) {
      console.error('Error fetching/analyzing patient history:', error);

      // Add error message to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'bot',
          content: 'Unable to retrieve patient history. Please try again.',
          isInitial: false,
        },
      ]);
    } finally {
      setIsloadingHistory(false);
    }
  };

  // Option to clear chat history
  const clearChatHistory = (userId = null) => {
    const clearMessage = isSessionActive && selectedUser
      ? defaultPatientMessage
      : defaultGeneralMessage;

    if (userId) {
      // Clear history for specific user
      setUserMessages(prev => ({
        ...prev,
        [userId]: [clearMessage]
      }));
    } else if (selectedUser) {
      // Clear history for currently selected user
      setUserMessages(prev => ({
        ...prev,
        [selectedUser.resource.id]: [clearMessage]
      }));
    } else {
      // Clear general chat history
      setUserMessages(prev => ({
        ...prev,
        general: [defaultGeneralMessage]
      }));
    }
  };

  // Start session

  const [activeSessionUserId, setActiveSessionUserId] = useState(null);

  const startSession = (userId) => {
    setIsSessionActive(true);
    setActiveSessionUserId(userId); // Track which user's session is active
    setSessionStartTime(Date.now());
    setElapsedTime(3600);

    // Update initial message for patient if a patient is selected
    // if (userId) {
    //   // Add session start message to the existing chat history
    //   setUserMessages(prev => ({
    //     ...prev,
    //     [userId]: [
    //       ...(prev[userId] || []), // Preserve existing messages
    //       defaultPatientMessage, // Add session start message
    //     ]
    //   }));
    // }

    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev <= 0) {
          clearInterval(intervalRef.current);
          endSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // End session
  const endSession = () => {
    setIsSessionActive(false);
    setActiveSessionUserId(null); // Reset the active session user
    setSessionStartTime(null);
    clearInterval(intervalRef.current);
    setElapsedTime(3600);

    // Reset any active patient chat to general welcome message
    // if (activeSessionUserId) {
    //   setUserMessages(prev => ({
    //     ...prev,
    //     [activeSessionUserId]: [
    //       ...(prev[activeSessionUserId] || []), // Preserve existing messages
    //       defaultGeneralMessage, // Add general welcome message
    //     ]
    //   }));
    // }
  };
  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const value = {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    uploadedFiles,
    setUploadedFiles,
    sendMessage,
    regenerateMessage,
    isMessageLoading,
    isloadingHistory,
    handleClockClick,
    clearChatHistory,
    userMessages,
    // Session-related state and functions
    isSessionActive,
    elapsedTime,
    startSession,
    endSession,
    activeSessionUserId,
    isSpeechActive,
    setIsSpeechActive,
    animatedMessages,
    setAnimatedMessages,
    summaryMessages,
    setSummaryMessages,
    addSummaryMessage,
    showInitialState,
    setShowInitialState,
    clearSummaryMessages,
    setSelectedText,
    selectedText,
  };

  return <ChatContext.Provider value={value}>{props.children}</ChatContext.Provider>;
};

export default ChatContextProvider;