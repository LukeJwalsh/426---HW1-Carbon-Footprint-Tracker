import React, { useContext } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Import the activity context which holds the logged activities
import { ActivityContext } from "../context/ActivityContext";

// Helper function to compute the net carbon impact per date
const computeNetCarbonByDate = (activities: any[]) => {
  // Group activities by date and sum net carbon impact (emission = +, reduction = -)
  const grouped = activities.reduce((acc, activity) => {
    const date = activity.date;

    // Initialize the date key if it doesn't exist
    if (!acc[date]) {
      acc[date] = 0;
    }

    // Add or subtract carbon impact based on activity type
    acc[date] += activity.isEmission
      ? activity.carbonImpact
      : -activity.carbonImpact;

    return acc;
  }, {} as Record<string, number>);

  // Convert grouped object into sorted array of { date, net } objects
  return Object.keys(grouped)
    .map((date) => ({ date, net: grouped[date] }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Component that displays a line chart of net carbon impact over time
const EmissionOverTimeChart: React.FC = () => {
  // Access activities from context
  const { state } = useContext(ActivityContext);

  // Prepare data to be visualized in the chart
  const data = computeNetCarbonByDate(state.activities);

  return (
    <div className="my-4 bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        Net Carbon Impact Over Time
      </h3>
      {/* ResponsiveContainer ensures the chart resizes with its container */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        >
          {/* Add grid lines to the chart */}
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />

          {/* X-axis showing dates */}
          <XAxis dataKey="date" stroke="#333" />

          {/* Y-axis showing net carbon values */}
          <YAxis stroke="#333" />

          {/* Tooltip shows data details on hover */}
          <Tooltip
            contentStyle={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
            cursor={{ stroke: "#8884d8", strokeWidth: 1 }}
          />

          {/* Line showing net carbon over time */}
          <Line
            type="monotone"
            dataKey="net"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmissionOverTimeChart;