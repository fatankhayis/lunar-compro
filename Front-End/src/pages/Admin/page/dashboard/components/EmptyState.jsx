import React from "react";

const EmptyState = ({ range, error }) => {
  return (
    <div className="text-center p-12 bg-white m-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        {error ? "Error Loading Data" : "No Data Available"}
      </h2>
      <p className="text-gray-500">
        {error 
          ? `Error: ${error}`
          : `No analytics data found for <b>${range}</b> period. Try changing the time range.`
        }
      </p>
    </div>
  );
};

export default EmptyState;