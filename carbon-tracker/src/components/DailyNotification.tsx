import React, { useContext, useEffect, useRef, useState } from "react";
import { ActivityContext } from "../context/ActivityContext";
import "./DailyNotification.css";

const DailyNotification: React.FC = () => {
  const { state } = useContext(ActivityContext);
  const [message, setMessage] = useState<string | null>(null);
  const [show, setShow] = useState<boolean>(false);

  // Single timeout ref for notifications
  const notificationTimeoutRef = useRef<number | null>(null);
  const prevLogCountRef = useRef<number>(state.activities.length);

  // Helper to show a notification and auto-clear it after a given duration
  const showNotification = (msg: string, duration: number = 3000) => {
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    setMessage(msg);
    setShow(true);
    notificationTimeoutRef.current = window.setTimeout(() => {
      setShow(false);
      setMessage(null);
      notificationTimeoutRef.current = null;
    }, duration);
  };

  // On mount: show "Don't forget to log today!" if no activity logged today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const loggedToday = state.activities.some(a => a.date === today);
    if (!loggedToday && !localStorage.getItem("notified_today")) {
      localStorage.setItem("notified_today", today);
      showNotification("Don't forget to log today!");
    }
  }, []); // runs only once on mount

  // Show summary notification every time new logs bring the total to a multiple of 3
  useEffect(() => {
    const totalLogs = state.activities.length;
    if (totalLogs > prevLogCountRef.current && totalLogs % 3 === 0) {
      showNotification("Don't forget to view the updated summary!");
    }
    prevLogCountRef.current = totalLogs;
  }, [state.activities]);

  if (!show || !message) return null;
  return <div className="daily-notification">{message}</div>;
};

export default DailyNotification;
