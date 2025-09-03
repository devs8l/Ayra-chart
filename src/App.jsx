// App.jsx
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { Toaster } from 'react-hot-toast';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/LoginSignup";
import UserData from "./components/UserData";
import Appoinments from "./components/Appoinments";
import Patients from "./components/Patients";
import Events from "./components/Events";
import DocumentPreview from "./components/DocumentPreview";
import { MedContext } from "./context/MedContext";
import Error from "./pages/Error";
import Sidebar from "./components/MainSidebar";
import { showWelcomeToast } from "./components/CustomToast";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, login, isExpanded } = useContext(MedContext);
  
  // Check if welcome toast has been shown before using localStorage
  const hasShownWelcome = useRef(
    localStorage.getItem('hasShownWelcome') === 'true'
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      // Reset welcome toast when logged out
      localStorage.removeItem('hasShownWelcome');
    }
  }, [isAuthenticated, navigate]);

  // Show welcome toast when authentication becomes true
  useEffect(() => {
    if (isAuthenticated && !hasShownWelcome.current) {
      // Use a small timeout to ensure the toast appears after the page transition
      const timer = setTimeout(() => {
        showWelcomeToast('Doctor');
        hasShownWelcome.current = true;
        // Persist in localStorage
        localStorage.setItem('hasShownWelcome', 'true');
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  return (
    <>
      {location.pathname === "/login" ? (
        <Routes>
          <Route path="/login" element={<Login login={login} />} />
        </Routes>
      ) : (
        <div className="flex min-h-screen  bg-custom-gradient dark:bg-custom-gradient-d">
          {/* Sidebar */}
          <div
            className={`fixed h-full transition-all duration-300 ease-in-out z-50 ${isExpanded ? "w-64" : "w-20"
              }`}
          >
            <Sidebar isExpanded={isExpanded} />
          </div>

          {/* Main Content */}
          <div
            className={`flex flex-col flex-1 transition-all duration-300 ease-in-out overflow-x-hidden ${isExpanded ? "ml-64" : "ml-20"
              }`}
          >
            {isAuthenticated && <Navbar handleLogout={logout} />}
            <div className="px-4 flex-1 overflow-x-hidden">
              <Routes>
                <Route path="/" element={<Home />}>
                  <Route index element={<Appoinments />} />
                  <Route path="patients" element={<Patients />} />
                  <Route path="events" element={<Events />} />
                  <Route path="user/:id" element={<UserData />} />
                </Route>
                <Route path="/error" element={<Error />} />
              </Routes>
            </div>

            {/* Document Preview Component */}
            <DocumentPreview />
          </div>
          <Toaster
            position="top-center"
            containerStyle={{ zIndex: 9999 }}
            toastOptions={{
              duration: 4000
            }}
          />
        </div>
      )}
    </>
  );
};

export default App;