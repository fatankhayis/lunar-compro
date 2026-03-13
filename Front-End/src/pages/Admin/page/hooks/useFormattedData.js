import { useMemo } from "react";

export const useFormattedData = (data) => {
  return useMemo(() => {
    if (!data) {
      return {
        visitors: [],
        browsers: [],
        pages: [],
        referrers: [],
        countries: []
      };
    }

    const visitors = Array.isArray(data.visitors_views) ? data.visitors_views.map((v) => ({
      date: new Date(v.date).toLocaleDateString("en-US", { 
        day: "2-digit", 
        month: "short" 
      }),
      activeUsers: v.activeUsers || 0,
      pageViews: v.screenPageViews || 0,
    })) : [];

    const browsers = Array.isArray(data.browsers) ? data.browsers.map((b) => ({
      name: b.browser || 'Unknown',
      views: b.screenPageViews || 0,
    })) : [];

    const pages = Array.isArray(data.pages) ? data.pages.map((p) => ({
      name: p.path || 'Unknown',
      views: p.screenPageViews || 0,
    })) : [];

    const referrers = Array.isArray(data.referrers) ? data.referrers.map((r) => ({
      name: r.pageReferrer || "Direct / None",
      views: r.screenPageViews || 0,
    })) : [];

    const countries = Array.isArray(data.countries) ? data.countries.map((c) => ({
      name: c.country || "Unknown",
      views: c.screenPageViews || 0,
    })) : [];

    return { visitors, browsers, pages, referrers, countries };
  }, [data]);
};