import React from "react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.dataKey}: {entry.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default React.memo(CustomTooltip);