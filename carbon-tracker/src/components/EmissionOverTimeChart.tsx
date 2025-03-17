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
import { ActivityContext } from "../context/ActivityContext";

const computeNetCarbonByDate = (activities: any[]) => {
  const grouped = activities.reduce((acc, activity) => {
    const date = activity.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += activity.isEmission ? activity.carbonImpact : -activity.carbonImpact;
    return acc;
  }, {} as Record<string, number>);
  return Object.keys(grouped)
    .map((date) => ({ date, net: grouped[date] }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const EmissionOverTimeChart: React.FC = () => {
  const { state } = useContext(ActivityContext);
  const data = computeNetCarbonByDate(state.activities);
  return (
    <div className="my-4 bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Net Carbon Impact Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="date" stroke="#333" />
          <YAxis stroke="#333" />
          <Tooltip
            contentStyle={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
            cursor={{ stroke: "#8884d8", strokeWidth: 1 }}
          />
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

