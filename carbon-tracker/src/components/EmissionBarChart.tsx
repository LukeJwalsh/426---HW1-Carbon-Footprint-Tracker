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
  const { state } = useContext(ActivityContext); // Access activities from context

  // Define categories to be shown on the chart
  const categories = ["Driving", "Flying", "Bus", "Recycling"];

  // Prepare data for the bar chart by computing net carbon impact for each category
  const data = categories.map((category) => {
    // Filter activities that match the current category
    const activities = state.activities.filter(
      (activity) => activity.category === category
    );

    // Calculate the net impact (emissions = +, reductions = -)
    const net = activities.reduce((sum, activity) => {
      return sum + (activity.isEmission ? activity.carbonImpact : -activity.carbonImpact);
    }, 0);

    return { category, net };
  });

  return (
    <div className="my-4 bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        Category Carbon Impact
      </h3>

      {/* Responsive chart container */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        >
          {/* Grid lines for the chart */}
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />

          {/* X-axis showing category names */}
          <XAxis dataKey="category" stroke="#333" />

          {/* Y-axis showing net carbon values */}
          <YAxis stroke="#333" />

          {/* Tooltip on hover */}
          <Tooltip
            contentStyle={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
            cursor={{ fill: "#f0f0f0" }}
          />

          {/* Bar element with conditional coloring for emissions/reductions */}
          <Bar dataKey="net" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              // Red for emissions, green for reductions
              <Cell
                key={`cell-${index}`}
                fill={entry.net >= 0 ? "#d32f2f" : "#388e3c"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmissionBarChart;