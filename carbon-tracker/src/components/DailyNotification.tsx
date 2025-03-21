import React, { useContext, useEffect, useState, useRef } from "react";
import { ActivityContext } from "../context/ActivityContext";
import "./DailyNotification.css";

const DailyNotification: React.FC = () => {
  const { state } = useContext(ActivityContext); // Get activity state from context
  const [message, setMessage] = useState<string | null>(null); // Message to display in the notification

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // Ref to clear timeout when needed

  // Track if the "Don't forget to log today" message has been shown this session
  const logTodayShownRef = useRef<boolean>(false);

  // Store the previous log count to detect new logs
  const prevLogCountRef = useRef<number>(state.activities.length);

  useEffect(() => {
    const totalLogs = state.activities.length;

    // Case 1: No logs exist and the reminder hasn't been shown yet
    if (totalLogs === 0 && !logTodayShownRef.current) {
      logTodayShownRef.current = true; // Mark as shown so it only appears once per session

      // Clear any existing timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Show notification right away
      timeoutRef.current = setTimeout(() => {
        setMessage("Don't forget to log today!");

        // Hide the message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      }, 0); // Immediate trigger
    }

    // Case 2: Show "View Summary" every 3 logs, but only when a new log is added
    else if (totalLogs > prevLogCountRef.current && totalLogs % 3 === 0) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setMessage("View the updated summary!");

        // Hide the message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      }, 6000); // Delay before showing the summary message
    }

    // Update reference for log count
    prevLogCountRef.current = totalLogs;

    // Cleanup on unmount or re-run
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [state.activities]);

  // Don't render anything if no message is active
  if (!message) return null;

  // Render the notification
  return <div className="daily-notification">{message}</div>;
};

export default DailyNotification;