import React from "react";

const SkeletonCard = () => (
  <div className="animate-pulse bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-6 h-[350px]">
    <div className="h-6 bg-gray-200 w-1/4 mb-6 rounded-md"></div>
    <div className="h-4/5 bg-gray-100 rounded-lg"></div>
  </div>
);

const LoadingState = () => {
  return (
    <div className="space-y-8 bg-gray-50 min-h-screen p-4">
      <div className="flex justify-between items-center pb-4 border-b">
        <div className="h-8 bg-gray-200 w-64 rounded animate-pulse"></div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
      <SkeletonCard />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
};

export default LoadingState;