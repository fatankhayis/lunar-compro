import React from "react";
import { MotionConfig } from "framer-motion";
import AnalyticsDashboard from "./dashboard/AnalyticsDashboard";

export default function DashboardPage() {
  return (
    <MotionConfig transition={{ duration: 0.35 }}>
      <div className="min-h-screen bg-gray-50 p-3">
        <AnalyticsDashboard />
      </div>
    </MotionConfig>
  );
}
