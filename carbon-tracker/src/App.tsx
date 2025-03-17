import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LogsAndAchievementsView from "./components/LogsAndAchievementsView";
import SummaryView from "./components/SummaryView";
import { ActivityProvider } from "./context/ActivityContext";
import "./index.css";

const App: React.FC = () => {
  return (
    <ActivityProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header title="Carbon Tracker" />
          <main className="flex-1 bg-[#e8f5e9] p-4">
            <Routes>
              <Route path="/" element={<LogsAndAchievementsView />} />
              <Route path="/summary" element={<SummaryView />} />
            </Routes>
          </main>
          <Footer message="Your eco-friendly footer" className="mt-auto" />
        </div>
      </BrowserRouter>
    </ActivityProvider>
  );
};

export default App;