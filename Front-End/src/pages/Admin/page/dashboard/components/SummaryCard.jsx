import React, { useMemo } from "react";

const SummaryCard = ({ data, range, title = "Total Active Users", color = "blue" }) => {
  const key = Object.keys(data || {})[0];
  const value = useMemo(() => data?.[key]?.toLocaleString() || "0", [data, key]);

  const colorClasses = {
    blue: "border-blue-600 text-blue-600",
    green: "border-green-600 text-green-600",
  };

  return (
    <div
      className={`bg-white shadow-lg rounded-xl p-6 border-l-4 ${colorClasses[color]} transition duration-300 hover:shadow-xl`}
    >
      <p className={`text-sm font-medium ${colorClasses[color]} uppercase`}>
        {title}
      </p>
      <p className="text-4xl font-extrabold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-2">During {range}</p>
    </div>
  );
};

export default React.memo(SummaryCard);
