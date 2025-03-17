import React, { useContext, useEffect, useState, useRef } from "react";
import { ActivityContext } from "../context/ActivityContext";
import "./DailyNotification.css";

const DailyNotification: React.FC = () => {
  const { state } = useContext(ActivityContext);
  const [message, setMessage] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const lastSummaryCountRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const totalLogs = state.activities.length;

    if (totalLogs === 0) {
      // Show the "Don't forget to log today!" immediately
      setMessage("Don't forget to log today!");
      setShow(true);
    } else if (totalLogs % 3 === 0 && totalLogs > lastSummaryCountRef.current) {
      // Schedule the "View Summary" notification after 5 seconds
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setMessage("Don't forget to view the updated summary!");
        setShow(true);
        lastSummaryCountRef.current = totalLogs;

        // Auto-hide after 3 seconds
        setTimeout(() => setShow(false), 3000);
      }, 5000);
    } else {
      setShow(false);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [state.activities]);

  if (!show) return null;
  return <div className="daily-notification">{message}</div>;
};

export default DailyNotification;