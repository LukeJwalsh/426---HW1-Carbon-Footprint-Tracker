import React from "react";
import ActivityLogger from "../components/ActivityLogger";
import AchievementTracker from "../components/AchievementTracker";

const LogsAndAchievementsView: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <ActivityLogger className="w-full md:w-1/2" />
      <AchievementTracker className="w-full md:w-1/2" />
    </div>
  );
};

export default LogsAndAchievementsView;
