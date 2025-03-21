import React from "react";

// Define the structure of an activity item
interface ActivityType {
  id: number;
  title: string;
  category: "Driving" | "Flying" | "Recycling" | "Bus";
  quantity: number;
  carbonImpact: number;
  date: string;
  isEmission: boolean; // true = emission activity, false = reduction
}

// Props for the ActivityList component
interface ActivityListProps {
  activities: ActivityType[];
}

// Component to display a list of activity entries
const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  return (
    <div className="activity-list">
      {/* Check if there are any activities to display */}
      {activities.length > 0 ? (
        // Loop through and render each activity
        activities.map((activity) => (
          <div
            key={activity.id}
            // Conditional styling based on whether it's an emission or reduction
            className={`activity-item ${
              activity.isEmission ? "red-indicator" : "green-indicator"
            }`}
          >
            {/* Activity details */}
            <h4>
              <strong>{activity.title}</strong>
            </h4>
            <p>Date: {activity.date}</p>
            <p>Quantity: {activity.quantity}</p>
            <p>
              {activity.isEmission
                ? `Emitted: ${activity.carbonImpact.toFixed(2)} kg CO₂`
                : `Saved: ${activity.carbonImpact.toFixed(2)} kg CO₂`}
            </p>
          </div>
        ))
      ) : (
        // Message if no activities are logged
        <p className="placeholder">No activities logged yet.</p>
      )}
    </div>
  );
};

export default ActivityList;