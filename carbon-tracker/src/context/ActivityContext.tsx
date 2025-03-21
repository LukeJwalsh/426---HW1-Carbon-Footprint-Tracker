import React, { createContext, useReducer, useEffect } from "react";

// Define the shape of an activity entry
export type ActivityType = {
  id: number;
  title: string;
  category: "Driving" | "Flying" | "Recycling" | "Bus";
  quantity: number;
  carbonImpact: number;
  date: string;
  isEmission: boolean; // true = emission, false = reduction
};

// Define the shape of an achievement
export type AchievementType = {
  id: number;
  title: string;
  progress: number;
  goal: number;
  isUnlocked: boolean;
};

// Global state shape
type ActivityState = {
  activities: ActivityType[];
  achievements: AchievementType[];
  formData: {
    title: string;
    category: string;
    quantity: string;
    date: string;
  };
  error: string | null;
  showForm: boolean;
  unlockedAchievementsQueue: AchievementType[]; // temporary queue for UI feedback
};

// All possible actions for the reducer
type ActionType =
  | { type: "UPDATE_FIELD"; field: keyof ActivityState["formData"]; value: string }
  | { type: "SUBMIT_ACTIVITY"; activity: ActivityType }
  | { type: "RESET_FORM" }
  | { type: "VALIDATION_ERROR"; message: string }
  | { type: "TOGGLE_FORM" }
  | { type: "LOAD_ACTIVITIES"; activities: ActivityType[] }
  | { type: "CLEAR_LOGS" }
  | { type: "REMOVE_UNLOCKED_ACHIEVEMENT" };

// Initial list of achievements
const initialAchievements: AchievementType[] = [
  { id: 1, title: "Log 5 Activities", progress: 0, goal: 5, isUnlocked: false },
  { id: 2, title: "Log 10 Activities", progress: 0, goal: 10, isUnlocked: false },
  { id: 3, title: "Log activities for 5 days", progress: 0, goal: 5, isUnlocked: false },
  { id: 4, title: "Recycle 5 Different Days", progress: 0, goal: 5, isUnlocked: false },
  { id: 5, title: "Save 25 Carbon", progress: 0, goal: 25, isUnlocked: false },
  { id: 6, title: "Save 50 Carbon", progress: 0, goal: 50, isUnlocked: false },
  { id: 7, title: "Take the Bus 5 Times", progress: 0, goal: 5, isUnlocked: false },
  { id: 8, title: "Take the Bus 10 Times", progress: 0, goal: 10, isUnlocked: false },
  { id: 9, title: "Recycle 5lbs", progress: 0, goal: 5, isUnlocked: false },
  { id: 10, title: "Recycle 15lbs", progress: 0, goal: 15, isUnlocked: false },
];

// Initial state
const initialState: ActivityState = {
  activities: [],
  achievements: initialAchievements,
  formData: { title: "", category: "", quantity: "", date: "" },
  error: null,
  showForm: false,
  unlockedAchievementsQueue: [],
};

// Initializes state from localStorage if available (excluding ephemeral queue)
function init(initialState: ActivityState): ActivityState {
  let activities: ActivityType[] = [];
  let achievements: AchievementType[] = initialAchievements;

  const savedActivities = localStorage.getItem("activities");
  const savedAchievements = localStorage.getItem("achievements");

  if (savedActivities) {
    try {
      activities = JSON.parse(savedActivities);
    } catch (error) {
      console.error("Error parsing activities from local storage:", error);
    }
  }

  if (savedAchievements) {
    try {
      achievements = JSON.parse(savedAchievements);
    } catch (error) {
      console.error("Error parsing achievements from local storage:", error);
    }
  }

  return { ...initialState, activities, achievements, unlockedAchievementsQueue: [] };
}

// Reducer function to handle state updates
const activityReducer = (state: ActivityState, action: ActionType): ActivityState => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
        error: null,
      };

    case "SUBMIT_ACTIVITY": {
      const updatedActivities = [...state.activities, action.activity];

      // Update achievement progress based on new activity
      const updatedAchievements = state.achievements.map((achievement) => {
        switch (achievement.title) {
          case "Log 5 Activities":
          case "Log 10 Activities":
            return {
              ...achievement,
              progress: achievement.progress + 1,
              isUnlocked: achievement.progress + 1 >= achievement.goal,
            };

          case "Log activities for 5 days": {
            const uniqueDates = new Set([
              ...state.activities.map((act) => act.date),
              action.activity.date,
            ]);
            return {
              ...achievement,
              progress: uniqueDates.size,
              isUnlocked: uniqueDates.size >= achievement.goal,
            };
          }

          case "Save 25 Carbon":
          case "Save 50 Carbon":
            if (!action.activity.isEmission) {
              const newProgress = achievement.progress + action.activity.carbonImpact;
              return {
                ...achievement,
                progress: newProgress,
                isUnlocked: newProgress >= achievement.goal,
              };
            }
            return achievement;

          case "Take the Bus 5 Times":
          case "Take the Bus 10 Times":
            if (action.activity.category === "Bus") {
              const newProgress = achievement.progress + 1;
              return {
                ...achievement,
                progress: newProgress,
                isUnlocked: newProgress >= achievement.goal,
              };
            }
            return achievement;

          case "Recycle 5lbs":
          case "Recycle 15lbs":
            if (action.activity.category === "Recycling") {
              const newProgress = achievement.progress + action.activity.quantity;
              return {
                ...achievement,
                progress: newProgress,
                isUnlocked: newProgress >= achievement.goal,
              };
            }
            return achievement;

          case "Recycle 5 Different Days":
            if (action.activity.category === "Recycling") {
              const recyclingUniqueDates = new Set(
                state.activities
                  .filter((act) => act.category === "Recycling")
                  .map((act) => act.date)
              );
              recyclingUniqueDates.add(action.activity.date);
              return {
                ...achievement,
                progress: recyclingUniqueDates.size,
                isUnlocked: recyclingUniqueDates.size >= achievement.goal,
              };
            }
            return achievement;

          default:
            return achievement;
        }
      });

      // Compare new and old achievements to find newly unlocked ones
      const newlyUnlocked = state.achievements.reduce((acc, oldAch, index) => {
        if (!oldAch.isUnlocked && updatedAchievements[index].isUnlocked) {
          acc.push(updatedAchievements[index]);
        }
        return acc;
      }, [] as AchievementType[]);

      // Add newly unlocked achievements to the ephemeral popup queue
      const newQueue = [...state.unlockedAchievementsQueue, ...newlyUnlocked];

      return {
        ...state,
        activities: updatedActivities,
        achievements: updatedAchievements,
        showForm: false,
        unlockedAchievementsQueue: newQueue,
      };
    }

    case "RESET_FORM":
      return {
        ...state,
        formData: { title: "", category: "", quantity: "", date: "" },
        error: null,
      };

    case "VALIDATION_ERROR":
      return { ...state, error: action.message };

    case "TOGGLE_FORM":
      return { ...state, showForm: !state.showForm };

    case "LOAD_ACTIVITIES":
      return { ...state, activities: action.activities };

    case "CLEAR_LOGS":
      return { ...state, activities: [] };

    case "REMOVE_UNLOCKED_ACHIEVEMENT":
      return {
        ...state,
        unlockedAchievementsQueue: state.unlockedAchievementsQueue.slice(1),
      };

    default:
      return state;
  }
};

// Create context to share state and dispatch globally
export const ActivityContext = createContext<{
  state: ActivityState;
  dispatch: React.Dispatch<ActionType>;
}>({ state: initialState, dispatch: () => {} });

// Context Provider to wrap the app and provide state management
export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(activityReducer, initialState, init);

  // Save only non-ephemeral state parts to localStorage when they change
  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(state.activities));
    localStorage.setItem("achievements", JSON.stringify(state.achievements));
    // Don't store unlockedAchievementsQueue — it’s UI-only and resets on refresh
  }, [state.activities, state.achievements]);

  return (
    <ActivityContext.Provider value={{ state, dispatch }}>
      {children}
    </ActivityContext.Provider>
  );
};
