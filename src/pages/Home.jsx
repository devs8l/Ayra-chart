import { useContext, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Chat from "../components/Chat";
import { MedContext } from "../context/MedContext";
import MidHeader from "../components/MidHeader";
import DatePicker from "../components/DatePicker";
import DateSort from "../components/DateSort";
import Summary from "../components/Summary";

const Home = () => {
  const {
    isSearchOpen,
    isUserSelected,
    isNotesExpanded,
    isContentExpanded,
    setIsContentExpanded,
    isPatientExpanded,
    setIsPatientExpanded
  } = useContext(MedContext);
  const containerRef = useRef(null);
  const location = useLocation();

  // Base widths when nothing is expanded
  const baseContentWidth = isUserSelected ? 'w-[14%]' : 'w-[8%]';
  const baseNotesWidth = isUserSelected ? 'w-[81%]' : 'w-[0%]'; // Set to 0% when no user selected
  const baseChatWidth = isPatientExpanded ? 'w-[0%]' : isUserSelected ? 'w-[5%]' : 'w-[92%]'; // Chat takes more space when no user selected

  // Expanded widths
  const expandedContentWidth = isPatientExpanded ? 'w-[100%]' : 'w-[36%]';
  const expandedChatWidth = isContentExpanded ? isUserSelected ? 'w-[32%]' : 'w-[64%]' : isUserSelected ? 'w-[35%]' : 'w-[92%]';

  // Calculate notes width based on expansions
  const getNotesWidth = () => {
    if (!isUserSelected) return 'w-[0%]'; // Hide notes when no user selected
    
    if (isContentExpanded && isNotesExpanded) {
      return 'w-[37%]';
    }
    if (isContentExpanded) {
      return isPatientExpanded ? 'w-[0%]' : 'w-[60%]';
    }
    if (isNotesExpanded) {
      return 'w-[51%]';
    }
    return baseNotesWidth;
  };

  return (
    <div ref={containerRef} className="flex h-[87vh] w-full">
      <div className={`flex flex-col md:flex-row w-full h-full ${isPatientExpanded ? '' : isUserSelected ? 'gap-3': 'gap-2'}`}>
        {/* Content section */}
        <div className={`${isContentExpanded ? expandedContentWidth : baseContentWidth} overflow-x-hidden flex flex-col transition-all duration-300`}>
          <div className={`bg-[#FFFFFF66] dark:bg-[#00000099] h-full w-full rounded-lg ${isContentExpanded ? 'p-1.5' : ''}`}>
            <div className={`flex ${isContentExpanded ? 'fadeInRight-slow' : 'hidden'} gap-3 ${isUserSelected ? 'animate-fadeOut w-0' : 'animate-fadeInFast w-full'} items-center w-full px-3 mb-3 justify-between ${location.pathname.includes('/patients') ? 'hidden' : ''} ${isUserSelected ? 'hidden' : ''} ${isSearchOpen ? 'hidden' : ''} transition-all duration-300 ease-in-out`}>
              <DatePicker />
              <DateSort />
            </div>
            <Outlet/>
          </div>
        </div>

        {/* Notes section - width will be 0 when no user selected */}
        <div className={`${getNotesWidth()} h-full flex-shrink-0 transition-all duration-300 overflow-hidden`}>
          {isUserSelected && <Summary />}
        </div>

        {/* Chat section - will expand when no user selected */}
        <div className={`${isNotesExpanded ? expandedChatWidth : baseChatWidth} flex-shrink-0 transition-all duration-300`}>
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default Home;