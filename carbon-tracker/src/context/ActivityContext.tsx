import React, { createContext, useReducer, useEffect } from "react";

// Define Activity Type
export type ActivityType = {
  id: number;
  title: string;
  category: "Driving" | "Flying" | "Recycling" | "Bus";
  quantity: number;
  carbonImpact: number;
  date: string;
  isEmission: boolean;
};

// Define Achievement Type
export type AchievementType = {
  id: number;
  title: string; // e.g., "Log 5 Activities"
  progress: number;
  goal: number;
  isUnlocked: boolean;
};

// State now includes ephemeral unlockedAchievementsQueue
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
  unlockedAchievementsQueue: AchievementType[]; // ephemeral queue
};

// Action Types
type ActionType =
  | { type: "UPDATE_FIELD"; field: keyof ActivityState["formData"]; value: string }
  | { type: "SUBMIT_ACTIVITY"; activity: ActivityType }
  | { type: "RESET_FORM" }
  | { type: "VALIDATION_ERROR"; message: string }
  | { type: "TOGGLE_FORM" }
  | { type: "LOAD_ACTIVITIES"; activities: ActivityType[] }
  | { type: "CLEAR_LOGS" }
  | { type: "REMOVE_UNLOCKED_ACHIEVEMENT" };

// Initial Achievements
const initialAchievements: AchievementType[] = [
    {
      id: 1,
      title: "Log 5 Activities",
      progress: 0,
      goal: 5,
      isUnlocked: false,
    },
    {
      id: 2,
      title: "Log 10 Activities",
      progress: 0,
      goal: 10,
      isUnlocked: false,
    },
    {
      id: 3,
      title: "Log activities for 5 days",
      progress: 0,
      goal: 5,
      isUnlocked: false,
    },
    {
      id: 4,
      title: "Recycle 5 Different Days",
      progress: 0,
      goal: 5,
      isUnlocked: false,
    },
    {
      id: 5,
      title: "Save 25 Carbon",
      progress: 0,
      goal: 25,
      isUnlocked: false,
    },
    {
      id: 6,
      title: "Save 50 Carbon",
      progress: 0,
      goal: 50,
      isUnlocked: false,
    },
    {
      id: 7,
      title: "Take the Bus 5 Times",
      progress: 0,
      goal: 5,
      isUnlocked: false,
    },
    {
      id: 8,
      title: "Take the Bus 10 Times",
      progress: 0,
      goal: 10,
      isUnlocked: false,
    },
    {
      id: 9,
      title: "Recycle 5lbs",
      progress: 0,
      goal: 5,
      isUnlocked: false,
    },
    {
      id: 10,
      title: "Recycle 15lbs",
      progress: 0,
      goal: 15,
      isUnlocked: false,
    },
  ];
  

// Initial State
const initialState: ActivityState = {
  activities: [],
  achievements: initialAchievements,
  formData: { title: "", category: "", quantity: "", date: "" },
  error: null,
  showForm: false,
  unlockedAchievementsQueue: [], // ephemeral, always starts empty
};

// Lazy initializer (does NOT load the ephemeral queue from local storage)
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

  // unlockedAchievementsQueue always starts as empty
  return { ...initialState, activities, achievements, unlockedAchievementsQueue: [] };
}

// Reducer
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

      // Update achievements
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

      // Determine newly unlocked achievements
      const newlyUnlocked = state.achievements.reduce((acc, oldAch, index) => {
        if (!oldAch.isUnlocked && updatedAchievements[index].isUnlocked) {
          acc.push(updatedAchievements[index]);
        }
        return acc;
      }, [] as AchievementType[]);

      // ephemeral queue: we only store it in memory, not localStorage
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

// Create Context
export const ActivityContext = createContext<{
  state: ActivityState;
  dispatch: React.Dispatch<ActionType>;
}>({ state: initialState, dispatch: () => {} });

// Provider
export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(activityReducer, initialState, init);

  // Save only activities and achievements to localStorage
  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(state.activities));
    localStorage.setItem("achievements", JSON.stringify(state.achievements));
    // DO NOT SAVE unlockedAchievementsQueue (ephemeral)
  }, [state.activities, state.achievements]);

  return (
    <ActivityContext.Provider value={{ state, dispatch }}>
      {children}
    </ActivityContext.Provider>
  );
};