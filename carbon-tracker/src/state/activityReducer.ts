type FormDataType = {
    title: string;
    category: string;
    quantity: string;
    date: string;
  };
  
  type ActivityType = {
    id: number;
    title: string;
    category: string;
    quantity: number;
    carbonImpact: number;
    date: string;
    saved?: boolean; // Indicates if it's a "saved" activity (e.g., Recycling)
  };
  
  type ActionType =
    | { type: "UPDATE_FIELD"; field: keyof FormDataType; value: string }
    | { type: "SUBMIT_ACTIVITY"; activity: ActivityType }
    | { type: "RESET_FORM" }
    | { type: "VALIDATION_ERROR"; message: string }
    | { type: "TOGGLE_FULL_SCREEN_FORM" }
    | { type: "LOAD_ACTIVITIES"; activities: ActivityType[] };
  
  const initialState: {
    activities: ActivityType[];
    formData: FormDataType;
    error: string | null;
    fullScreenForm: boolean;
  } = {
    activities: [],
    formData: {
      title: "",
      category: "",
      quantity: "",
      date: "",
    },
    error: null,
    fullScreenForm: false,
  };
  
  function activityReducer(state: typeof initialState, action: ActionType): typeof initialState {
    switch (action.type) {
      case "UPDATE_FIELD":
        return {
          ...state,
          formData: {
            ...state.formData,
            [action.field]: action.value,
          },
          error: null, // Reset error when user types
        };
  
      case "SUBMIT_ACTIVITY":
        return {
          ...state,
          activities: [...state.activities, action.activity],
          fullScreenForm: false, // Close form after submission
        };
  
      case "RESET_FORM":
        return {
          ...state,
          formData: { title: "", category: "", quantity: "", date: "" },
          error: null,
        };
  
      case "VALIDATION_ERROR":
        return { ...state, error: action.message };
  
      case "TOGGLE_FULL_SCREEN_FORM":
        return { ...state, fullScreenForm: !state.fullScreenForm };
  
      case "LOAD_ACTIVITIES":
        return { ...state, activities: action.activities };
  
      default:
        return state;
    }
  }
  
export { activityReducer, initialState };
export type { ActionType };

  