import React, { useContext, useEffect, useState } from "react";
import { ActivityContext, AchievementType } from "../context/ActivityContext";
import "./AchievementTracker.css";

interface AchievementTrackerProps {
  className?: string;
}

const AchievementTracker: React.FC<AchievementTrackerProps> = ({ className = "" }) => {
  const { state, dispatch } = useContext(ActivityContext);
  const [popupAchievement, setPopupAchievement] = useState<AchievementType | null>(null);

  useEffect(() => {
    if (state.unlockedAchievementsQueue?.length > 0) {
      setPopupAchievement(state.unlockedAchievementsQueue[0]);
      const timer = setTimeout(() => {
        dispatch({ type: "REMOVE_UNLOCKED_ACHIEVEMENT" });
        setPopupAchievement(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.unlockedAchievementsQueue, dispatch]);

  return (
    <div className={`achievement-tracker ${className}`}>
      <h2 className="text-xl font-bold mb-4">Achievements</h2>
      <div className="achievement-grid">
        {state.achievements?.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-card p-4 border rounded-lg ${
              achievement.isUnlocked ? "unlocked" : ""
            }`}
          >
            <h3 className="font-semibold">{achievement.title}</h3>
            <p>
              Progress: {achievement.progress}/{achievement.goal}
            </p>
            {achievement.isUnlocked && (
              <p className="text-green-700 font-bold">Unlocked!</p>
            )}
          </div>
        ))}
      </div>
      {popupAchievement && (
        <div className="achievement-popup">
          <p>Achievement Unlocked: {popupAchievement.title}!</p>
        </div>
      )}
    </div>
  );
};

export default AchievementTracker;
