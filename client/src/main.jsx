import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AnalyticsTracker from "./components/common/AnalyticsTracker";
import AppToaster from "./components/common/AppToaster";
import "./styles/index.css"; // Tailwind import
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <AnalyticsTracker />
      <AppToaster />
      <App />
    </AuthProvider>
  </BrowserRouter>
);
