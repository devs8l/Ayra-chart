import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MedContext } from "../context/MedContext";
import { ChatContext } from "../context/ChatContext";
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader,
  Info,
  ChevronRight,
  FileText,
  Ear
} from "lucide-react";
import PatientCardCollapse from "./PatientCardCollapse";
import Transcript from "./Transcript";

import { fetchPatientHistory, analyzePatientHistory, fetchHealthMetrics } from "../Services/apiService";
import Summaries from "./TabContent/Summaries";
import Allergies from "./TabContent/Allergies";
import Problems from "./TabContent/Problems";
import Medicines from "./TabContent/Medicines";
import Vaccines from "./TabContent/Vaccines";
import Vitals from "./TabContent/Vitals";
import Reports from "./TabContent/Reports";
import Visits from "./TabContent/Visits";
import UserShimmer from "./UserShimmer";

const UserData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, filteredUsers, setIsUserSelected, setIsContentExpanded, isContentExpanded, isPatientRoute } = useContext(MedContext);
  const { userMessages, isSessionActive, elapsedTime, startSession, endSession, activeSessionUserId } = useContext(ChatContext);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("summaries");
  const [patientHistory, setPatientHistory] = useState(null);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [activeView, setActiveView] = useState("synopsis");
  const [healthMetricsData, setHealthMetricsData] = useState(null);
  const [isLoadingHealthMetrics, setIsLoadingHealthMetrics] = useState(false);

  useEffect(() => {
    setIsUserSelected(true);
    return () => {
      setIsUserSelected(false);
    };
  }, [setIsUserSelected]);

  useEffect(() => {
    let user = filteredUsers.find((u) => u._id === id);
    if (!user) {
      user = users.find((u) => u._id === id);
    }
    if (user) {
      setUserData(user);
      const cachedHistory = localStorage.getItem(`patientHistory_${user._id}`);
      if (cachedHistory) {
        try {
          setPatientHistory(JSON.parse(cachedHistory));
        } catch (error) {
          console.error('Error parsing cached history:', error);
          setPatientHistory(null);
        }
      } else {
        setPatientHistory(null);
      }
    }
  }, [id, filteredUsers, users]);

  const getPatientHistory = async () => {
    if (!userData) return;

    setIsLoadingReports(true);
    try {
      const historyData = await fetchPatientHistory(userData._id);
      const analysisData = await analyzePatientHistory(historyData);

      const historyObj = {
        rawData: historyData,
        analysis: analysisData,
        timestamp: new Date().toISOString(),
      };

      setPatientHistory(historyObj);
      localStorage.setItem(`patientHistory_${userData._id}`, JSON.stringify(historyObj));
    } catch (error) {
      console.error('Error processing history:', error);
    } finally {
      setIsLoadingReports(false);
    }
  };

  const getHealthMetrics = async () => {
    if (!userData) return;

    setIsLoadingHealthMetrics(true);
    try {
      const metricsData = await fetchHealthMetrics(userData._id);
      setHealthMetricsData(metricsData);
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      setHealthMetricsData(null);
    } finally {
      setIsLoadingHealthMetrics(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'vitals' && userData) {
      getHealthMetrics();
    }
  }, [activeTab, userData?._id]);

  useEffect(() => {
    if (activeTab === 'summaries' && userData && !patientHistory) {
      getPatientHistory();
    }
  }, [activeTab, userData, patientHistory]);

  useEffect(() => {
    if (userData && userMessages[userData._id]) {
      const messages = userMessages[userData._id].filter(msg => !msg.isInitial);
      const chatEvents = [];

      let sessionDate = new Date();
      let currentSessionMessages = [];
      let lastSessionDate = null;

      for (let i = 0; i < messages.length; i++) {
        if (messages[i].type === 'user') {
          const storedDate = localStorage.getItem(`sessionStarted_${userData._id}_${i}`);
          if (storedDate) {
            sessionDate = new Date(storedDate);
          } else {
            sessionDate = new Date();
            sessionDate.setDate(sessionDate.getDate() - (messages.length - i) / 2);
            localStorage.setItem(`sessionStarted_${userData._id}_${i}`, sessionDate.toISOString());
          }

          if (!lastSessionDate || sessionDate.toDateString() !== lastSessionDate.toDateString()) {
            lastSessionDate = sessionDate;
            currentSessionMessages = [messages[i].content];

            chatEvents.push({
              type: "Chat Session",
              description: messages[i].content.length > 50
                ? messages[i].content.substring(0, 50) + "..."
                : messages[i].content,
              content: [messages[i].content],
              date: sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }),
              timestamp: sessionDate.toISOString(),
              status: "completed"
            });
          } else {
            currentSessionMessages.push(messages[i].content);

            if (chatEvents.length > 0) {
              const lastEvent = chatEvents[chatEvents.length - 1];
              lastEvent.content.push(messages[i].content);
              lastEvent.description = messages[i].content.length > 50
                ? messages[i].content.substring(0, 50) + "..."
                : messages[i].content;
            }
          }
        }
      }

      chatEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setSessionHistory(chatEvents);
    }
  }, [userData, userMessages]);

  const clearCachedData = () => {
    if (userData) {
      localStorage.removeItem(`patientHistory_${userData._id}`);
      setPatientHistory(null);
      getPatientHistory();
    }
  };

  if (!userData) {
    return <UserShimmer/>;
  }

  const sidebarTabs = [
    { id: 'summaries', icon: '/Summaries.svg', label: 'Summaries' },
    { id: 'allergies', icon: '/Allergies.svg', label: 'Allergies' },
    { id: 'problems', icon: '/Problems.svg', label: 'Problems' },
    { id: 'medicines', icon: '/Medicines.svg', label: 'Medicines' },
    { id: 'vaccines', icon: '/Vaccines.svg', label: 'Vaccines' },
    { id: 'vitals', icon: '/Vitals.svg', label: 'Vitals' },
    { id: 'reports', icon: '/Reports.svg', label: 'Reports' },
    { id: 'visits', icon: '/Visits.svg', label: 'Visits' }
  ];

  const renderTabContent = () => {
    const props = {
      userData,
      patientHistory,
      isLoadingReports,
      clearCachedData,
      sessionHistory,
      healthMetricsData,
      isLoadingHealthMetrics
    };

    switch (activeTab) {
      case 'summaries':
        return <Summaries {...props} />;
      case 'allergies':
        return <Allergies {...props} />;
      case 'problems':
        return <Problems {...props} />;
      case 'medicines':
        return <Medicines {...props} />;
      case 'vaccines':
        return <Vaccines {...props} />;
      case 'vitals':
        return <Vitals {...props} />;
      case 'reports':
        return <Reports {...props} />;
      case 'visits':
        return <Visits {...props} />;
      default:
        return null;
    }
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'synopsis':
        return (
          <div className="flex h-full w-full overflow-hidden relative">
            <div className="flex border-r border-gray-300 flex-col bottom-0 left-0 h-full z-10 absolute bg-white py-4 mr-2 pr-3 group gap-4 transition-all duration-300 w-14 group-hover:w-48 hover:w-48 overflow-y-auto overflow-x-hidden">
              {sidebarTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center cursor-pointer px-3 border border-[#fff0] py-2 gap-2 rounded-sm transition-all duration-200 group/button ${activeTab === tab.id
                      ? 'bg-[#E2EEFC] text-[#222836]'
                      : 'dark:text-white bg-[#ffffff77] hover:border-gray-300 text-[#7A7E86]'
                    }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className={`flex-shrink-0 ${activeTab === tab.id
                      ? 'opacity-100'
                      : 'opacity-30'
                    } `}>
                    <img
                      src={tab.icon}
                      alt={tab.label}
                      className="w-5 h-5 "
                    />
                  </div>
                  <span className="text-sm whitespace-nowrap opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 flex flex-col overflow-hidden items-end">
              <div className="overflow-y-auto h-full scrollbar-hide w-[90%] p-4">
                {renderTabContent()}
              </div>
            </div>
          </div>
        );
      case 'transcript':
        return <Transcript />;
      default:
        return null;
    }
  };

  if (!isContentExpanded) {
    return (
      <PatientCardCollapse userData={userData} />
    );
  }

  return (
    <div className="flex flex-col gap-1 animate-fadeIn h-full">
      <div className="flex items-center justify-between px-6 gap-10">
        <div className="flex gap-1 text-lg py-4 items-center text-[#222836]">
          <h2 className="cursor-pointer" onClick={() => navigate(isPatientRoute ? "/patients" : "/")}>{isPatientRoute ? "Patients" : "Appointments"}</h2>
          <ChevronRight size={15} />
          <h2>{userData.name.split(' ')[0] + ''}</h2>
        </div>
        <div className="flex items-center py-3 gap-4">
          <div className="flex items-center gap-1">
            <Clock size={15} className="text-gray-500" />
            <p className="text-sm text-gray-500">Today</p>
          </div>
          <p className="text-sm text-gray-500">{userData?.time}</p>
        </div>
        <button
          className="text-gray-500 p-1 hover:bg-gray-100 rounded"
          onClick={() => setIsContentExpanded(!isContentExpanded)}
        >
          <img src="/notes.svg" className="w-5 h-5" alt="" />
        </button>
      </div>

      <div>
        <div className="flex items-start justify-between relative before:absolute before:left-0 before:top-0
before:h-full before:w-1 before:bg-green-500 before:rounded-l-lg before:z-10 bg-[#ffffff8e] border-gray-300 border p-6 rounded-md mx-1">
          <div className="flex items-start space-x-4 ">
            <img
              src={userData?.profileImage || "/api/placeholder/80/80"}
              className="w-13 h-13 rounded-full object-cover"
              alt={userData?.name}
            />
            <div className="flex gap-10">
              <div className="flex flex-col gap-2">
                <h2 className="text-sm  text-gray-800">Name: <span className="font-medium text-gray-500">{userData?.name}</span></h2>
                <div className="flex gap-1">
                  <h2 className="text-sm  text-gray-800">Patient ID: </h2>
                  <p className="text-sm text-gray-500">#{userData?._id?.slice(-6)}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-sm  text-gray-800">Sex: <span className="font-medium text-gray-500">{userData?.gender}</span></h2>
                <div className="flex gap-1">
                  <h2 className="text-sm  text-gray-800">Age: </h2>
                  <p className="text-sm text-gray-500">35</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-sm  text-gray-800">Weight: <span className="font-medium text-gray-500">64kg</span></h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-sm bg-[#ffffff] dark:bg-[#00000099] mx-1 h-[calc(75vh-100px)] overflow-auto">
        {/* View Selection Buttons */}
        {/* <div className="flex items-center border-b border-gray-300 p-3 gap-3 justify-between sticky top-0 bg-white z-10">
          <button
            onClick={() => setActiveView('synopsis')}
            className={`px-4 text-sm w-1/2 py-2 flex justify-center items-center gap-2 rounded-[5px] ${activeView === 'synopsis'
                ? 'bg-[#E2EEFC] text-[#222836] font-medium'
                : 'bg-[#F8FBFE] text-[#6F7786]'
              }`}
          >
            <FileText size={15} className={activeView === 'synopsis' ? 'text-[#222836]' : 'text-[#6F7786]'} />
            Synopsis
          </button>
          <button
            onClick={() => setActiveView('transcript')}
            className={`px-4 text-sm w-1/2 py-2 flex justify-center items-center gap-2 rounded-[5px] ${activeView === 'transcript'
                ? 'bg-[#E2EEFC] text-[#222836] font-medium'
                : 'bg-[#F8FBFE] text-[#6F7786]'
              }`}
          >
            <Ear size={15} className={activeView === 'transcript' ? 'text-[#222836]' : 'text-[#6F7786]'} />
            Transcript
          </button>
        </div> */}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-auto px-3">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default UserData;