import React, { useContext } from "react";
import { ActivityContext } from "../context/ActivityContext";

const ActivityForm: React.FC = () => {
  const { state, dispatch } = useContext(ActivityContext); // Access global state and dispatch

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation: ensure all fields are filled
    if (
      !state.formData.title ||
      !state.formData.category ||
      !state.formData.quantity ||
      !state.formData.date
    ) {
      dispatch({
        type: "VALIDATION_ERROR",
        message: "All fields are required!",
      });
      return;
    }

    // Ensure quantity is a valid positive number
    const quantity = parseFloat(state.formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      dispatch({
        type: "VALIDATION_ERROR",
        message: "Quantity must be a positive number!",
      });
      return;
    }

    // Check if category is valid
    const validCategories = ["Driving", "Flying", "Recycling", "Bus"] as const;
    if (!validCategories.includes(state.formData.category as any)) {
      dispatch({
        type: "VALIDATION_ERROR",
        message: "Invalid category selection!",
      });
      return;
    }

    // Calculate carbon impact and determine if it’s an emission or reduction
    let carbonImpact = 0;
    let isEmission = false;

    switch (state.formData.category) {
      case "Driving":
        carbonImpact = quantity * 0.4;
        isEmission = true;
        break;
      case "Flying":
        carbonImpact = quantity * 90;
        isEmission = true;
        break;
      case "Recycling":
        carbonImpact = quantity * 3;
        isEmission = false;
        break;
      case "Bus":
        carbonImpact = quantity * 0.4;
        isEmission = false;
        break;
      default:
        break;
    }

    // Create new activity object
    const newActivity = {
      id: Date.now(), // Unique ID based on timestamp
      title: state.formData.title,
      category: state.formData.category as "Driving" | "Flying" | "Recycling" | "Bus",
      quantity,
      carbonImpact,
      date: state.formData.date,
      isEmission,
    };

    // Dispatch action to add activity and reset the form
    dispatch({ type: "SUBMIT_ACTIVITY", activity: newActivity });
    dispatch({ type: "RESET_FORM" });
  };

  return (
    <div className="full-screen-overlay">
      <div className="form-container">
        {/* Button to close the form */}
        <button
          className="close-btn"
          onClick={() => dispatch({ type: "TOGGLE_FORM" })}
        >
          Close
        </button>

        {/* Activity form */}
        <form onSubmit={handleSubmit} className="activity-form">
          {/* Activity Name Input */}
          <label htmlFor="activity-title">Activity Name:</label>
          <input
            id="activity-title"
            type="text"
            placeholder="Enter activity name"
            required
            value={state.formData.title}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: "title",
                value: e.target.value,
              })
            }
          />

          {/* Category Dropdown */}
          <label htmlFor="activity-category">Category:</label>
          <select
            id="activity-category"
            required
            value={state.formData.category}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: "category",
                value: e.target.value,
              })
            }
            title="Select a category"
          >
            <option value="">Select Category</option>
            <option value="Driving">🚗Driving (miles)</option>
            <option value="Flying">✈️Flying (hours)</option>
            <option value="Bus">🚌Bus (miles)</option>
            <option value="Recycling">♻️Recycling (lbs)</option>
          </select>

          {/* Quantity Input */}
          <label htmlFor="activity-quantity">Quantity:</label>
          <input
            id="activity-quantity"
            type="number"
            placeholder="Enter quantity"
            required
            value={state.formData.quantity}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: "quantity",
                value: e.target.value,
              })
            }
            title="Enter the quantity"
          />

          {/* Date Picker */}
          <label htmlFor="activity-date">Date:</label>
          <input
            id="activity-date"
            type="date"
            required
            value={state.formData.date}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: "date",
                value: e.target.value,
              })
            }
            title="Select a date"
          />

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Log Activity
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActivityForm;