import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  analyticsEnabled,
  initializeAnalytics,
  trackPageView,
} from "../../services/analyticsService";

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (!analyticsEnabled()) return;
    initializeAnalytics();
  }, []);

  useEffect(() => {
    if (!analyticsEnabled()) return;

    trackPageView({
      page_title: document.title,
      page_location: window.location.href,
      page_path: `${location.pathname}${location.search}${location.hash}`,
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default AnalyticsTracker;
