import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LogsAndAchievementsView from "./components/LogsAndAchievementsView";
import SummaryView from "./components/SummaryView";
import { ActivityProvider } from "./context/ActivityContext";
import DailyNotification from "./components/DailyNotification";
import "./index.css";

const App: React.FC = () => {
  return (
    // Wrap the entire app in the ActivityProvider to share state globally
    <ActivityProvider>
      {/* React Router setup for navigation between views */}
      <BrowserRouter>
        {/* Flex layout: column layout that stretches to full height */}
        <div className="flex flex-col min-h-screen">
          
          {/* App header with title */}
          <Header title="Carbon Tracker" />
          <DailyNotification />
          {/* Main content area with route-specific views */}
          <main className="flex-1 bg-[#e8f5e9] p-4">
            <Routes>
              {/* Route for the default activity logging + achievements view */}
              <Route path="/" element={<LogsAndAchievementsView />} />
              
              {/* Route for the summary/graph view */}
              <Route path="/summary" element={<SummaryView />} />
            </Routes>
          </main>

          {/* App footer, sticks to the bottom when content is short */}
          <Footer message="Your eco-friendly footer" className="mt-auto" />
        </div>
      </BrowserRouter>
    </ActivityProvider>
  );
};

export default App;
