import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SensorCard from "@/components/SensorCard";
import ChartCard from "@/components/ChartCard";
import InfoCard from "@/components/InfoCard";
import RecentData from "@/components/RecentData";
import ImageSection from "@/components/ImageSection";
import { subscribeToRecentSensorData, subscribeToChartData } from "@/lib/firebase";
import { FirebaseSensorData } from "@shared/schema";
import { ChartPeriod, calculateStats, getTimeSinceUpdate } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [recentData, setRecentData] = useState<FirebaseSensorData[]>([]);
  const [chartData, setChartData] = useState<FirebaseSensorData[]>([]);
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('24h');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Subscribe to recent data
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToRecentSensorData((data) => {
      setRecentData(data);
      setIsLoading(false);
      
      if (data.length > 0) {
        setLastUpdated(getTimeSinceUpdate(data[0].timestamp));
        
        // Notify the user if using sample data (when there's a Firestore permission issue)
        if (data[0].status === "Optimal" && data.every(item => item.status === "Optimal")) {
          toast({
            title: "Menggunakan data demo",
            description: "Menampilkan data demo untuk contoh visualisasi. Untuk menggunakan data sensor real-time, sesuaikan izin Firestore.",
          });
        }
      }
    }, 50); // Get 50 recent entries for stats calculation
    
    return () => unsubscribe();
  }, [toast]);
  
  // Subscribe to chart data
  useEffect(() => {
    const hours = chartPeriod === '24h' ? 24 : chartPeriod === '7d' ? 168 : 720;
    
    const unsubscribe = subscribeToChartData((data) => {
      setChartData(data);
    }, hours);
    
    return () => unsubscribe();
  }, [chartPeriod]);
  
  // Update last updated time
  useEffect(() => {
    const interval = setInterval(() => {
      if (recentData.length > 0) {
        setLastUpdated(getTimeSinceUpdate(recentData[0].timestamp));
      }
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [recentData]);
  
  // Handle period change
  const handlePeriodChange = (period: ChartPeriod) => {
    setChartPeriod(period);
  };
  
  // Handle data refresh
  const handleDataRefresh = () => {
    setIsLoading(true);
    toast({
      title: "Menyegarkan data",
      description: "Mengambil data terbaru dari sensor",
    });
    
    // We don't need to manually refresh since we're using Firestore's onSnapshot
    // The listeners will automatically update when new data arrives
    
    // Just to provide feedback to user, we'll simulate a refresh by setting loading
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Data diperbarui",
        description: "Data sensor terbaru telah dimuat",
      });
    }, 1000);
  };
  
  const stats = calculateStats(recentData);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary to-secondary rounded-xl overflow-hidden mb-8 shadow-lg">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4">
              <i className="fas fa-leaf text-white text-9xl"></i>
            </div>
            <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
              <i className="fas fa-sun text-white text-9xl"></i>
            </div>
          </div>
          <div className="relative z-10 px-6 py-10 md:py-12 text-center md:text-left flex flex-col md:flex-row items-center">
            <div className="md:w-3/4">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Monitoring Cahaya dan Suhu Tanaman</h2>
              <p className="text-white text-opacity-90 mt-2 max-w-2xl">
                Sistem pemantauan real-time untuk optimalisasi pertumbuhan tanaman. Pantau kondisi lingkungan dan 
                tingkatkan hasil panen Anda dengan teknologi monitoring terkini.
              </p>
              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-white text-sm flex items-center">
                  <i className="fas fa-check-circle mr-1 text-accent-light"></i>
                  <span>Data Real-time</span>
                </div>
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-white text-sm flex items-center">
                  <i className="fas fa-check-circle mr-1 text-accent-light"></i>
                  <span>Analisis Otomatis</span>
                </div>
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-white text-sm flex items-center">
                  <i className="fas fa-check-circle mr-1 text-accent-light"></i>
                  <span>Rekomendasi Penyesuaian</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/4 mt-6 md:mt-0 flex justify-center">
              <div className="bg-white bg-opacity-10 p-5 rounded-full w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                <i className="fas fa-seedling text-white text-6xl"></i>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-light"></div>
        </div>
        
        {/* Sensor Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SensorCard 
            title="Intensitas Cahaya (Saat Ini)"
            value={stats.currentLux}
            unit="lux"
            icon="sun"
            color="primary"
            trend={stats.luxTrend}
            change={stats.luxChange}
            lastUpdated={lastUpdated}
            isLoading={isLoading}
          />
          
          <SensorCard 
            title="Suhu (Saat Ini)"
            value={stats.currentTemp}
            unit="°C"
            icon="temperature-half"
            color="secondary"
            trend={stats.tempTrend}
            change={stats.tempChange}
            lastUpdated={lastUpdated}
            isLoading={isLoading}
          />
          
          <SensorCard 
            title="Intensitas Cahaya (Rata-rata Harian)"
            value={stats.avgLux}
            unit="lux"
            icon="chart-line"
            color="accent"
            isAverage={true}
            isLoading={isLoading}
          />
          
          <SensorCard 
            title="Suhu (Rata-rata Harian)"
            value={stats.avgTemp}
            unit="°C"
            icon="chart-line"
            color="accent-dark"
            isAverage={true}
            isLoading={isLoading}
          />
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard 
            title="Intensitas Cahaya"
            data={chartData}
            dataKey="light_intensity"
            unit="lux"
            color="primary"
            period={chartPeriod}
            onPeriodChange={handlePeriodChange}
            min={stats.minLux}
            max={stats.maxLux}
            isLoading={isLoading}
          />
          
          <ChartCard 
            title="Suhu Lingkungan"
            data={chartData}
            dataKey="temperature"
            unit="°C"
            color="secondary"
            period={chartPeriod}
            onPeriodChange={handlePeriodChange}
            min={stats.minTemp}
            max={stats.maxTemp}
            isLoading={isLoading}
          />
        </div>
        
        {/* Detailed Data Section */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h3 className="font-semibold text-neutral-darkest mb-4">Ringkasan Kondisi Tanaman</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard 
                title="Status Pencahayaan"
                color="primary"
                isOptimal={stats.currentLux >= 2000 && stats.currentLux <= 4000}
                data={[
                  "Rentang ideal: 2,000 - 4,000 lux",
                  "Waktu paparan optimal: 8-10 jam/hari",
                  `Pengukuran terakhir: ${stats.currentLux} lux (${stats.currentLux >= 2000 && stats.currentLux <= 4000 ? "optimal" : "perlu penyesuaian"})`
                ]}
              />
              
              <InfoCard 
                title="Status Suhu"
                color="secondary"
                isOptimal={stats.currentTemp >= 22 && stats.currentTemp <= 30}
                data={[
                  "Rentang ideal: 22°C - 30°C",
                  "Fluktuasi suhu terjaga dengan baik",
                  `Suhu saat ini: ${stats.currentTemp}°C (${stats.currentTemp >= 22 && stats.currentTemp <= 30 ? "optimal" : "perlu penyesuaian"})`
                ]}
              />
            </div>
          </div>
        </div>
        
        {/* Recent Data Section */}
        <RecentData 
          data={recentData.slice(0, 5)} 
          onRefresh={handleDataRefresh}
          isLoading={isLoading}
        />
        
        {/* Image Section */}
        <ImageSection />
      </main>
      
      <Footer />
    </div>
  );
}
