import React, { useContext, useState, useMemo } from "react";
import { ActivityContext } from "../context/ActivityContext";
import ActivityFilters from "./ActivityFilters";
import ActivityForm from "./ActivityForm";
import ActivityList from "./ActivityList";
import "./ActivityLogger.css";

// Optional prop for custom styling
interface ActivityLoggerProps {
  className?: string;
}

// Main component for logging and displaying activities
const ActivityLogger: React.FC<ActivityLoggerProps> = ({ className = "" }) => {
  const { state, dispatch } = useContext(ActivityContext); // Access global state and dispatch

  // Local state for filtering and sorting
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortCriteria, setSortCriteria] = useState("DateAsc");

  // Filter and sort activities with useMemo for performance
  const filteredActivities = useMemo(() => {
    let activities = [...state.activities];

    // Filter activities by category if a specific one is selected
    if (filterCategory !== "All") {
      activities = activities.filter((act) => act.category === filterCategory);
    }

    // Sort activities based on selected criteria
    switch (sortCriteria) {
      case "DateAsc":
        activities.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "DateDesc":
        activities.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "CarbonAsc":
        activities.sort((a, b) => {
          // Treat saved carbon as negative to reflect positive impact
          const aImpact = a.isEmission ? a.carbonImpact : -a.carbonImpact;
          const bImpact = b.isEmission ? b.carbonImpact : -b.carbonImpact;
          return aImpact - bImpact;
        });
        break;
      case "CarbonDesc":
        activities.sort((a, b) => {
          const aImpact = a.isEmission ? a.carbonImpact : -a.carbonImpact;
          const bImpact = b.isEmission ? b.carbonImpact : -b.carbonImpact;
          return bImpact - aImpact;
        });
        break;
      default:
        break;
    }

    return activities;
  }, [state.activities, filterCategory, sortCriteria]);

  return (
    <div className={`activity-logger ${className}`}>
      
      {/* Header Section: shows Add and Clear buttons or the Activity Form */}
      {!state.showForm ? (
        <div className="logger-header">
          <h2 className="logger-title">ACTIVITY LOGGER</h2>
          <div>
            {/* Show form to add new activity */}
            <button
              className="add-log-btn"
              onClick={() => dispatch({ type: "TOGGLE_FORM" })}
            >
              Add Log
            </button>
            {/* Clear all activity logs */}
            <button
              className="clear-log-btn"
              onClick={() => dispatch({ type: "CLEAR_LOGS" })}
            >
              Clear All Logs
            </button>
          </div>
        </div>
      ) : (
        // Show the activity input form
        <ActivityForm />
      )}

      {/* Filter and Sort Controls */}
      <ActivityFilters
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        sortCriteria={sortCriteria}
        setSortCriteria={setSortCriteria}
      />

      {/* Display the filtered and sorted activity list */}
      <ActivityList activities={filteredActivities} />
    </div>
  );
};

export default ActivityLogger;