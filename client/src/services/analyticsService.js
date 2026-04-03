const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const GA_SCRIPT_ID = "google-analytics-script";

const isBrowser = typeof window !== "undefined";

let initialized = false;

const ensureDataLayer = () => {
  if (!isBrowser) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };
};

const injectGoogleAnalyticsScript = () => {
  if (!isBrowser || !MEASUREMENT_ID) return;

  if (document.getElementById(GA_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
};

export const initializeAnalytics = () => {
  if (!isBrowser || !MEASUREMENT_ID || initialized) return false;

  ensureDataLayer();
  injectGoogleAnalyticsScript();

  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, {
    send_page_view: false,
  });

  initialized = true;
  return true;
};

export const analyticsEnabled = () => Boolean(MEASUREMENT_ID);

export const trackPageView = ({
  page_title,
  page_location,
  page_path,
} = {}) => {
  if (!analyticsEnabled()) return;

  initializeAnalytics();

  window.gtag("event", "page_view", {
    page_title: page_title || document.title,
    page_location: page_location || window.location.href,
    page_path: page_path || window.location.pathname,
  });
};

export const trackEvent = (eventName, params = {}) => {
  if (!analyticsEnabled()) return;

  initializeAnalytics();
  window.gtag("event", eventName, params);
};

export const getAnalyticsMeasurementId = () => MEASUREMENT_ID;
