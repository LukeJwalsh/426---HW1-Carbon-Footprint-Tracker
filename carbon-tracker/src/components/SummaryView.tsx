import React from "react";
import EmissionBarChart from "./EmissionBarChart";
import EmissionOverTimeChart from "./EmissionOverTimeChart";
import "./SummaryView.css"; // Custom styles for layout/styling

// Component that displays a summary of emissions using charts
const SummaryView: React.FC = () => {
  return (
    <div className="summary-container">
      {/* Wrapper for holding both charts side-by-side or stacked (based on CSS) */}
      <div className="charts-container">
        {/* Bar chart showing impact by category */}
        <EmissionBarChart />

        {/* Line chart showing carbon impact over time */}
        <EmissionOverTimeChart />
      </div>
    </div>
  );
};

export default SummaryView;
