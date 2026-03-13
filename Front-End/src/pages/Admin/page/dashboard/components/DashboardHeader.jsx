import React from "react";

const DashboardHeader = ({ range, onRangeChange }) => {
  return (
    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
      <select
        className="border border-gray-300 rounded-lg p-2 text-base text-gray-700 font-medium bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
        value={range}
        onChange={onRangeChange}
      >
        <option value="day">Last 24 Hours</option>
        <option value="week">Last 7 Days</option>
        <option value="month">Last 30 Days</option>
      </select>
    </div>
  );
};

export default React.memo(DashboardHeader);