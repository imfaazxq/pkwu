import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';

interface NavbarProps {
  activeMenu?: string;
  onMenuClick?: (menu: string) => void;
  pageTitle?: string;
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ 
  activeMenu = 'dashboard', 
  onMenuClick,
  pageTitle = 'Dashboard',
  children
}) => {
  const { logout } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push('/x7k9m2/Login');
  };

  // Menu click handler
  const handleMenuClick = (menu: string, route?: string) => {
    if (onMenuClick) {
      onMenuClick(menu);
    }
    if (route) {
      router.push(route);
    }
    // Close mobile menu when a menu item is selected
    setIsMobileMenuOpen(false);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-sans relative overflow-hidden">
      {/* Global Font Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Lora:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Montserrat', sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Lora', serif;
        }
      `}</style>

      {/* Mobile Header */}
      <div className="md:hidden bg-[#3A5645] text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-30">
        <h1 className="text-xl font-semibold">Terapi Admin</h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="focus:outline-none"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed 
          md:static 
          top-0 
          left-0 
          bottom-0 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          w-64 
          bg-[#3A5645] 
          text-white 
          transition-transform 
          duration-300 
          ease-in-out 
          z-40 
          ${collapsed ? 'md:w-20' : 'md:w-64'}
        `}
      >
        <div className="p-4 border-b border-[#4d705b] flex items-center justify-between mt-16 md:mt-0">
          {!collapsed && <h1 className="text-xl font-semibold">Terapi Admin</h1>}
          {collapsed && <h1 className="text-xl font-semibold">TA</h1>}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="text-white hover:bg-[#4d705b] p-2 rounded-full transition-all duration-200 hidden md:block"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
        
        <nav className="mt-6">
          <div className={`${collapsed ? 'px-2 text-center' : 'px-4'} mb-3 text-sm opacity-75`}>
            {!collapsed && 'Dashboard'}
            {collapsed && '📊'}
          </div>
          
          <a 
            href="#" 
            className={`flex items-center ${collapsed ? 'justify-center' : 'px-4'} py-3 ${activeMenu === 'dashboard' ? 'bg-[#4d705b]' : 'hover:bg-[#4d705b] hover:bg-opacity-50'} text-white transition-all duration-200`}
            onClick={() => handleMenuClick('dashboard', '/x7k9m2/Homepage')}
          >
            <span className={`${collapsed ? '' : 'mr-3'} text-xl`}>📄</span>
            {!collapsed && <span>Dashboard</span>}
          </a>
          
          <div className={`${collapsed ? 'px-2 text-center' : 'px-4'} mt-6 mb-3 text-sm opacity-75`}>
            {!collapsed && 'Management'}
            {collapsed && '⚙️'}
          </div>
          
          <a 
            href="#" 
            className={`flex items-center ${collapsed ? 'justify-center' : 'px-4'} py-3 ${activeMenu === 'bookings' ? 'bg-[#4d705b]' : 'hover:bg-[#4d705b] hover:bg-opacity-50'} text-white transition-all duration-200`}
            onClick={() => handleMenuClick('bookings', '/x7k9m2/Bookings')}
          >
            <span className={`${collapsed ? '' : 'mr-3'} text-xl`}>📅</span>
            {!collapsed && <span>Bookings</span>}
          </a>
          
          <a 
            href="#" 
            className={`flex items-center ${collapsed ? 'justify-center' : 'px-4'} py-3 ${activeMenu === 'clients' ? 'bg-[#4d705b]' : 'hover:bg-[#4d705b] hover:bg-opacity-50'} text-white transition-all duration-200`}
            onClick={() => handleMenuClick('clients', '/x7k9m2/Clients')}
          >
            <span className={`${collapsed ? '' : 'mr-3'} text-xl`}>👥</span>
            {!collapsed && <span>Clients</span>}
          </a>
          
          <a 
            href="#" 
            className={`flex items-center ${collapsed ? 'justify-center' : 'px-4'} py-3 ${activeMenu === 'progress' ? 'bg-[#4d705b]' : 'hover:bg-[#4d705b] hover:bg-opacity-50'} text-white transition-all duration-200`}
            onClick={() => handleMenuClick('progress', '/x7k9m2/Progress')}
          >
            <span className={`${collapsed ? '' : 'mr-3'} text-xl`}>📈</span>
            {!collapsed && <span>Progress</span>}
          </a>
          
          <a 
            href="#" 
            className={`flex items-center ${collapsed ? 'justify-center' : 'px-4'} py-3 ${activeMenu === 'testiclients' ? 'bg-[#4d705b]' : 'hover:bg-[#4d705b] hover:bg-opacity-50'} text-white transition-all duration-200`}
            onClick={() => handleMenuClick('testiclients', '/x7k9m2/TestiClients')}
          >
            <span className={`${collapsed ? '' : 'mr-3'} text-xl`}>💬</span>
            {!collapsed && <span>TestiClients</span>}
          </a>
          
          <div className={`absolute bottom-0 left-0 ${collapsed ? 'w-20' : 'w-64'} p-4 border-t border-[#4d705b]`}>
            <a 
              href="#" 
              className={`flex items-center ${collapsed ? 'justify-center' : ''} text-white opacity-75 hover:opacity-100 transition-opacity duration-200`}
              onClick={handleLogout}
            >
              <span className={`${collapsed ? '' : 'mr-3'} text-xl`}>🚪</span>
              {!collapsed && <span>Logout</span>}
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div 
        className={`
          flex-1 
          overflow-auto 
          transition-all 
          duration-300 
          ease-in-out 
          ${isMobileMenuOpen ? 'blur-sm' : ''}
        `}
      >
        {/* Header */}
        <header className="bg-white shadow sticky top-0 z-10">
          <div className="px-4 md:px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                {pageTitle}
              </h1>
              <div className="text-right">
                <p className="text-xs md:text-base text-gray-600">{formatDate(currentTime)}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="pt-16 md:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Navbar;