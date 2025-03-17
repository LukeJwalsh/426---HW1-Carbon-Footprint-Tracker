import React, { useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ActivityContext } from "../context/ActivityContext";

const EmissionBarChart: React.FC = () => {
  const { state } = useContext(ActivityContext);
  const categories = ["Driving", "Flying", "Bus", "Recycling"];
  const data = categories.map((category) => {
    const activities = state.activities.filter(
      (activity) => activity.category === category
    );
    const net = activities.reduce((sum, activity) => {
      return sum + (activity.isEmission ? activity.carbonImpact : -activity.carbonImpact);
    }, 0);
    return { category, net };
  });
  return (
    <div className="my-4 bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Category Carbon Impact</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="category" stroke="#333" />
          <YAxis stroke="#333" />
          <Tooltip
            contentStyle={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
            cursor={{ fill: "#f0f0f0" }}
          />
          <Bar dataKey="net" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.net >= 0 ? "#d32f2f" : "#388e3c"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmissionBarChart;
