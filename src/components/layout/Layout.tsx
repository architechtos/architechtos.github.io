
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-grow ${isMobile ? 'px-4' : 'container py-6'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
