import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const MainLayout = ({ children }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      {children}
      <Footer /> {/* Add Footer here so it appears on all pages */}
    </div>
  );
};

export default MainLayout;