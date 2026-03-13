import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import CustomTooltip from "../CustomTooltip";

const CHART_COLORS = ["#AA7BC3"];

const PagesChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer>
      <BarChart data={data.slice(0, 10)}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={80}
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="views" fill={CHART_COLORS[0]} name="Page Views" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default React.memo(PagesChartComponent);