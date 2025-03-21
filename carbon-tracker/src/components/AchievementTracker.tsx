import React, { useContext, useEffect, useState } from "react";
import { ActivityContext, AchievementType } from "../context/ActivityContext";
import "./AchievementTracker.css";

// Optional className prop allows custom styling from parent component
interface AchievementTrackerProps {
  className?: string;
}

// Component to track and display achievements
const AchievementTracker: React.FC<AchievementTrackerProps> = ({ className = "" }) => {
  const { state, dispatch } = useContext(ActivityContext); // Access state and dispatch from context

  // Local state to temporarily show a popup when an achievement is unlocked
  const [popupAchievement, setPopupAchievement] = useState<AchievementType | null>(null);

  useEffect(() => {
    // If there are any achievements in the unlock queue, display the first one as a popup
    if (state.unlockedAchievementsQueue?.length > 0) {
      setPopupAchievement(state.unlockedAchievementsQueue[0]);

      // Set a timer to remove the popup after 3 seconds
      const timer = setTimeout(() => {
        dispatch({ type: "REMOVE_UNLOCKED_ACHIEVEMENT" }); // Remove from queue
        setPopupAchievement(null); // Hide popup
      }, 3000);

      // Clear timeout if component unmounts early
      return () => clearTimeout(timer);
    }
  }, [state.unlockedAchievementsQueue, dispatch]);

  return (
    <div className={`achievement-tracker ${className}`}>
      <h2 className="text-xl font-bold mb-4">Achievements</h2>

      {/* Grid of all achievements */}
      <div className="achievement-grid">
        {state.achievements?.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-card p-4 border rounded-lg ${
              achievement.isUnlocked ? "unlocked" : ""
            }`}
          >
            {/* Achievement title and progress */}
            <h3 className="font-semibold">{achievement.title}</h3>
            <p>
              Progress: {achievement.progress}/{achievement.goal}
            </p>

            {/* Show "Unlocked!" message if the achievement is completed */}
            {achievement.isUnlocked && (
              <p className="text-green-700 font-bold">Unlocked!</p>
            )}
          </div>
        ))}
      </div>

      {/* Popup for newly unlocked achievement */}
      {popupAchievement && (
        <div className="achievement-popup">
          <p>Achievement Unlocked: {popupAchievement.title}!</p>
        </div>
      )}
    </div>
  );
};

export default AchievementTracker;
