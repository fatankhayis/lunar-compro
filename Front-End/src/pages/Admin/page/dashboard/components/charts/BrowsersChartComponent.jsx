import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "../CustomTooltip";

const CHART_COLORS = ["#AA7BC3", "#6564AE", "#F4B400", "#0F9D58", "#DB4437", "#4285F4"];

const BrowsersChartComponent = ({ data }) => {
  const browserData = Array.isArray(data) ? data.slice(0, 6) : [];
  
  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie 
          dataKey="views" 
          data={browserData}
          outerRadius={60}
          innerRadius={20}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
          labelLine={false}
        >
          {browserData.map((_, index) => (
            <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default React.memo(BrowsersChartComponent);