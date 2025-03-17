import React, { useContext, useEffect, useState, useRef } from "react";
import { ActivityContext } from "../context/ActivityContext";
import "./DailyNotification.css";

const DailyNotification: React.FC = () => {
  const { state } = useContext(ActivityContext);
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track if "log today" notification was shown this session
  const logTodayShownRef = useRef<boolean>(false);
  const prevLogCountRef = useRef<number>(state.activities.length);

  useEffect(() => {
    const totalLogs = state.activities.length;

    // If no logs exist and the "log today" message hasn't been shown yet, show it once per session
    if (totalLogs === 0 && !logTodayShownRef.current) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setMessage("Don't forget to log today!");
        setTimeout(() => setMessage(null), 3000); // Hide after 3 seconds
      },);
    } 
    // Show "View Summary" reminder every 3 logs, but only when a new log is added
    else if (totalLogs > prevLogCountRef.current && totalLogs % 3 === 0) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setMessage("View the updated summary!");
        setTimeout(() => setMessage(null), 3000); // Hide after 3 seconds
      }, 6000);
    }

    prevLogCountRef.current = totalLogs; // Update previous log count

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [state.activities]);

  if (!message) return null;
  return <div className="daily-notification">{message}</div>;
};

export default DailyNotification;
