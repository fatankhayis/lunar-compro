import React from "react";

const ChartContainer = ({ title, children, className = "", dataAvailable }) => {
  return (
    <div
      className={`bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-6 ${className}`}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h2>
      {dataAvailable ? (
        <div className="h-[350px]">{children}</div>
      ) : (
        <div className="flex items-center justify-center h-[350px] text-gray-400">
          No data available.
        </div>
      )}
    </div>
  );
};

export default React.memo(ChartContainer);