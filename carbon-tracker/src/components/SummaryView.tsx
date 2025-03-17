import React from "react";
import EmissionBarChart from "./EmissionBarChart";
import EmissionOverTimeChart from "./EmissionOverTimeChart";
import "./SummaryView.css"; 

const SummaryView: React.FC = () => {
  return (
    <div className="summary-container">
      <div className="charts-container">
        <EmissionBarChart />
        <EmissionOverTimeChart />
      </div>
    </div>
  );
};

export default SummaryView;
