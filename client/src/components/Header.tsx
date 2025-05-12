import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      setCurrentTime(now.toLocaleTimeString('id-ID', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
      
      setCurrentDate(now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    };
    
    // Initial update
    updateDateTime();
    
    // Update every second
    const interval = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);
  
  // Navigation links
  const navLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Statistik", path: "/statistik" },
    { name: "Panduan", path: "/panduan" },
    { name: "Tentang", path: "/tentang" }
  ];
  
  return (
    <header className="bg-gradient-to-r from-primary to-primary-dark shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="bg-white p-2 rounded-full mr-2">
                <i className="fas fa-leaf text-primary text-xl"></i>
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">AgroMonitor</h1>
                <p className="text-white text-xs opacity-80 hidden sm:block">Sistem Monitoring Tanaman</p>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-4">
            {navLinks.map((link, index) => (
              <Link key={index} href={link.path}>
                <div className="text-white hover:text-accent-light transition-colors duration-200 text-sm font-medium cursor-pointer">
                  {link.name}
                </div>
              </Link>
            ))}
          </nav>
          
          <div className="border-l border-white border-opacity-20 h-8 mx-2"></div>
          
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm bg-primary-dark bg-opacity-40 px-3 py-1 rounded-full">
              <i className="fas fa-clock mr-1"></i>
              <span>{currentTime}</span>
            </span>
            <span className="text-white text-sm bg-primary-dark bg-opacity-40 px-3 py-1 rounded-full">
              <i className="fas fa-calendar-day mr-1"></i>
              <span className="hidden lg:inline">{currentDate}</span>
              <span className="lg:hidden">{new Date().toLocaleDateString('id-ID')}</span>
            </span>
          </div>
        </div>
        
        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-dark py-3 px-4 shadow-lg animate-accordion-down">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link, index) => (
              <Link key={index} href={link.path}>
                <div 
                  className="text-white hover:text-accent-light transition-colors duration-200 py-2 border-b border-white border-opacity-10 cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </div>
              </Link>
            ))}
          </nav>
          <div className="flex flex-col space-y-2 mt-3 pt-2 border-t border-white border-opacity-10">
            <span className="text-white text-sm">
              <i className="fas fa-clock mr-1"></i>
              <span>{currentTime}</span>
            </span>
            <span className="text-white text-sm">
              <i className="fas fa-calendar-day mr-1"></i>
              <span>{currentDate}</span>
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
