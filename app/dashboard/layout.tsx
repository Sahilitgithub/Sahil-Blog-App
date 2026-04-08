"use client";
import { useState } from "react";
import Sidebar from "../../components/dashboard/sidebar";
import { MenuIcon } from "lucide-react";
import Header from "@/components/Header";

// Dashboard Layout Function
const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <main>
    <div className="flex flex-col md:grid md:grid-cols-12 h-screen">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white p-1 rounded-md bg-gray-950"
        onClick={toggleSidebar}
      >
        <MenuIcon size={24} />
      </button>

      {/* Sidebar */}
      {isSidebarOpen && (
        <aside className="bg-gray-950 text-white p-1 md:col-span-2 md:block transition-all duration-100">
          <Sidebar />
        </aside>
      )}
      {/* Always show sidebar on desktop */}
      <aside className="hidden md:block bg-gray-950 text-white p-1 md:col-span-2">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="text-white flex-1 md:col-span-10">
        <Header />
        {children}
      </div>
    </div>
      </main>
  );
};

export default Layout;
