import React, { useContext, useState, useMemo } from "react";
import { ActivityContext } from "../context/ActivityContext";
import ActivityFilters from "./ActivityFilters";
import ActivityForm from "./ActivityForm";
import ActivityList from "./ActivityList";
import "./ActivityLogger.css";

interface ActivityLoggerProps {
  className?: string;
}

const ActivityLogger: React.FC<ActivityLoggerProps> = ({ className = "" }) => {
  const { state, dispatch } = useContext(ActivityContext);

  // Filter & Sort state
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortCriteria, setSortCriteria] = useState("DateAsc");

  // Compute filtered and sorted activities using useMemo
  const filteredActivities = useMemo(() => {
    let activities = [...state.activities];

    // Filter activities by category if a specific filter is selected
    if (filterCategory !== "All") {
      activities = activities.filter((act) => act.category === filterCategory);
    }

    // Sort activities based on sort criteria:
    // For carbon, treat savings as negative values.
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
      {/* Header Row: Show form toggling buttons */}
      {!state.showForm ? (
        <div className="logger-header">
          <h2 className="logger-title">ACTIVITY LOGGER</h2>
          <div>
            <button
              className="add-log-btn"
              onClick={() => dispatch({ type: "TOGGLE_FORM" })}
            >
              Add Log
            </button>
            <button
              className="clear-log-btn"
              onClick={() => dispatch({ type: "CLEAR_LOGS" })}
            >
              Clear All Logs
            </button>
          </div>
        </div>
      ) : (
        <ActivityForm />
      )}

      {/* Filter & Sort Controls */}
      <ActivityFilters
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        sortCriteria={sortCriteria}
        setSortCriteria={setSortCriteria}
      />

      {/* Render the List of Activities */}
      <ActivityList activities={filteredActivities} />
    </div>
  );
};

export default ActivityLogger;
