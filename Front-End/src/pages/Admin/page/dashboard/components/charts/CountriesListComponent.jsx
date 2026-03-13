import React from "react";

const CountriesListComponent = ({ data }) => {
  const countryData = Array.isArray(data) ? data.slice(0, 15) : [];
  
  return (
    <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100 text-sm border rounded-lg p-2">
      {countryData.map((c, i) => (
        <li
          key={`${c.name}-${i}`}
          className="flex justify-between items-center py-2 px-3 text-gray-700 hover:bg-blue-50 transition"
        >
          <span className="truncate">{c.name || "Unknown"}</span>
          <span className="font-bold text-blue-600 whitespace-nowrap ml-2">
            {c.views.toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default React.memo(CountriesListComponent);