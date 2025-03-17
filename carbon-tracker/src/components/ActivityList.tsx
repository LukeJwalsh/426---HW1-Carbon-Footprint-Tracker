import React from "react";

interface ActivityType {
  id: number;
  title: string;
  category: "Driving" | "Flying" | "Recycling" | "Bus";
  quantity: number;
  carbonImpact: number;
  date: string;
  isEmission: boolean;
}

interface ActivityListProps {
  activities: ActivityType[];
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  return (
    <div className="activity-list">
      {activities.length > 0 ? (
        activities.map((activity) => (
          <div
            key={activity.id}
            className={`activity-item ${
              activity.isEmission ? "red-indicator" : "green-indicator"
            }`}
          >
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
        <p className="placeholder">No activities logged yet.</p>
      )}
    </div>
  );
};

export default ActivityList;
