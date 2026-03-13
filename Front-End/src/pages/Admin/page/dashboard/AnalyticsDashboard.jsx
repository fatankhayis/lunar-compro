import React, { useState, useMemo, useCallback } from "react";

// Components
import DashboardHeader from "./components/DashboardHeader";
import SummaryCard from "./components/SummaryCard";
import ChartContainer from "./components/ChartContainer";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";

// Chart components
import LineChartComponent from "./components/charts/LineChartComponent";
import PagesChartComponent from "./components/charts/PagesChartComponent";
import BrowsersChartComponent from "./components/charts/BrowsersChartComponent";
import ReferrersChartComponent from "./components/charts/ReferrersChartComponent";
import CountriesListComponent from "./components/charts/CountriesListComponent";

// Hooks
import { useAnalyticsData } from "../hooks/useAnalyticsData";
import { useFormattedData } from "../hooks/useFormattedData";

const AnalyticsDashboard = () => {
  const [range, setRange] = useState("month");

  const { data, loading, error } = useAnalyticsData(range);
  const formattedData = useFormattedData(data);
  const { visitors, browsers, pages, referrers, countries } = formattedData;

  const handleRangeChange = useCallback((e) => {
    setRange(e.target.value);
  }, []);

  const hasData = useMemo(() => {
    return visitors.length > 0 || browsers.length > 0 || pages.length > 0;
  }, [visitors, browsers, pages]);

  const rangeLabel = useMemo(() => {
    switch (range) {
      case "day": return "Last 24 Hours";
      case "week": return "Last 7 Days";
      case "month": return "Last 30 Days";
      default: return range;
    }
  }, [range]);

  // ✅ Hitung total
  const totalActiveUsers = useMemo(() => {
    if (!visitors?.length) return 0;
    return visitors.reduce((sum, item) => sum + (item.activeUsers || 0), 0);
  }, [visitors]);

  const totalPageViews = useMemo(() => {
    if (!visitors?.length) return 0;
    return visitors.reduce((sum, item) => sum + (item.pageViews || 0), 0);
  }, [visitors]);

  if (loading) return <LoadingState />;
  if (!data || !hasData || error) return <EmptyState range={range} error={error} />;

  return (
    <div className="space-y-8 bg-gray-50 min-h-screen p-4">
      <DashboardHeader range={range} onRangeChange={handleRangeChange} />

      {/* ✅ Mode DAY tanpa chart utama */}
      {range === "day" ? (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SummaryCard
              data={{ active_users: totalActiveUsers }}
              range={rangeLabel}
              title="Total Active Users"
              color="blue"
            />
            <SummaryCard
              data={{ page_views: totalPageViews }}
              range={rangeLabel}
              title="Total Page Views"
              color="green"
            />
          </div>

          {/* 4 Chart ringkasan */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
            <ChartContainer title="Top 10 Visited Pages" dataAvailable={pages.length > 0}>
              <PagesChartComponent data={pages} />
            </ChartContainer>

            <ChartContainer title="Top Browsers" dataAvailable={browsers.length > 0}>
              <BrowsersChartComponent data={browsers} />
            </ChartContainer>

            <ChartContainer title="Top Referrers (Traffic Sources)" dataAvailable={referrers.length > 0}>
              <ReferrersChartComponent data={referrers} />
            </ChartContainer>

            <ChartContainer title="Visitor Countries" dataAvailable={countries.length > 0}>
              <CountriesListComponent data={countries} />
            </ChartContainer>
          </div>
        </>
      ) : (
        <>
          {/* ✅ Mode week & month — totalin semua active users & page views */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SummaryCard
              data={{ active_users: totalActiveUsers }}
              range={rangeLabel}
              title="Total Active Users"
              color="blue"
            />
            <SummaryCard
              data={{ page_views: totalPageViews }}
              range={rangeLabel}
              title="Total Page Views"
              color="green"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ChartContainer
              title={`Active Users & Page Views (${rangeLabel})`}
              className="lg:col-span-2"
              dataAvailable={visitors.length > 0}
            >
              <LineChartComponent data={visitors} />
            </ChartContainer>

            <ChartContainer title="Top 10 Visited Pages" dataAvailable={pages.length > 0}>
              <PagesChartComponent data={pages} />
            </ChartContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <ChartContainer title="Top Browsers" dataAvailable={browsers.length > 0}>
              <BrowsersChartComponent data={browsers} />
            </ChartContainer>

            <ChartContainer title="Top Referrers (Traffic Sources)" dataAvailable={referrers.length > 0}>
              <ReferrersChartComponent data={referrers} />
            </ChartContainer>

            <ChartContainer title="Visitor Countries" dataAvailable={countries.length > 0}>
              <CountriesListComponent data={countries} />
            </ChartContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(AnalyticsDashboard);
