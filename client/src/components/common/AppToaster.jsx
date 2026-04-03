import { Toaster } from "react-hot-toast";

const AppToaster = () => {
  return (
    <Toaster
      position="top-right"
      gutter={14}
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        duration: 4000,
        className: "app-toast",
        style: {
          border: "1px solid #e2e8f0",
          background: "#ffffff",
          color: "#0f172a",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
          borderRadius: "20px",
          padding: "14px 16px",
          maxWidth: "380px",
        },
        success: {
          className: "app-toast app-toast-success",
          iconTheme: {
            primary: "#16a34a",
            secondary: "#f0fdf4",
          },
        },
        error: {
          className: "app-toast app-toast-error",
          iconTheme: {
            primary: "#dc2626",
            secondary: "#fef2f2",
          },
        },
      }}
    />
  );
};

export default AppToaster;
