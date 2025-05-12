import { useEffect, useState } from "react";

export default function Header() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  
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
  
  return (
    <header className="bg-primary shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <i className="fas fa-leaf text-white text-2xl mr-3"></i>
          <h1 className="text-white text-xl font-semibold">AgroMonitor</h1>
        </div>
        <div className="hidden md:flex items-center space-x-4">
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
    </header>
  );
}
