import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import CustomTooltip from "../CustomTooltip";

const CHART_COLORS = ["#AA7BC3", "#6564AE"];

const LineChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="activeUsers" 
          stroke={CHART_COLORS[0]} 
          strokeWidth={2}
          dot={false}
          name="Active Users"
        />
        <Line 
          type="monotone" 
          dataKey="pageViews" 
          stroke={CHART_COLORS[1]} 
          strokeWidth={2}
          dot={false}
          name="Page Views"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default React.memo(LineChartComponent);