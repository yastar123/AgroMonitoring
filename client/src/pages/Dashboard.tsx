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
import { ChartPeriod, calculateStats, getTimeSinceUpdate, TrendType } from "@/lib/types";
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
        <div id="dashboard" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 scroll-mt-20">
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
        <div id="statistik" className="mb-8 scroll-mt-20">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 relative overflow-hidden mb-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-light to-accent"></div>
            <div className="absolute -left-10 -bottom-10 opacity-5 pointer-events-none">
              <i className="fas fa-chart-line text-9xl text-accent"></i>
            </div>
            
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white shadow-md mr-4">
                  <i className="fas fa-chart-line text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-neutral-darkest">Visualisasi Data Monitoring</h3>
              </div>
              
              {/* Line Charts */}
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
              
              {/* Additional Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {/* Bar Chart for Hourly Averages */}
                <div className="bg-neutral-lightest p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h4 className="text-neutral-darkest font-semibold mb-3 flex items-center">
                    <i className="fas fa-chart-bar text-primary mr-2"></i>
                    Rata-rata per Jam
                  </h4>
                  <div className="h-56 flex items-center justify-center">
                    {isLoading ? (
                      <div className="text-center text-neutral-dark">
                        <i className="fas fa-circle-notch fa-spin text-2xl mb-2"></i>
                        <p>Memuat data...</p>
                      </div>
                    ) : (
                      <div className="text-center text-neutral-dark p-6">
                        <i className="fas fa-chart-bar text-4xl text-neutral-medium mb-3"></i>
                        <p>Statistik rata-rata per jam akan ditampilkan di sini</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Pie Chart for Optimal vs Non-optimal */}
                <div className="bg-neutral-lightest p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h4 className="text-neutral-darkest font-semibold mb-3 flex items-center">
                    <i className="fas fa-chart-pie text-secondary mr-2"></i>
                    Distribusi Status
                  </h4>
                  <div className="h-56 flex items-center justify-center">
                    {isLoading ? (
                      <div className="text-center text-neutral-dark">
                        <i className="fas fa-circle-notch fa-spin text-2xl mb-2"></i>
                        <p>Memuat data...</p>
                      </div>
                    ) : (
                      <div className="text-center text-neutral-dark p-6">
                        <i className="fas fa-chart-pie text-4xl text-neutral-medium mb-3"></i>
                        <p>Distribusi status kondisi tanaman akan ditampilkan di sini</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Comparison Gauge */}
                <div className="bg-neutral-lightest p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h4 className="text-neutral-darkest font-semibold mb-3 flex items-center">
                    <i className="fas fa-tachometer-alt text-accent-dark mr-2"></i>
                    Perbandingan dengan Target
                  </h4>
                  <div className="h-56 flex items-center justify-center">
                    {isLoading ? (
                      <div className="text-center text-neutral-dark">
                        <i className="fas fa-circle-notch fa-spin text-2xl mb-2"></i>
                        <p>Memuat data...</p>
                      </div>
                    ) : (
                      <div className="text-center text-neutral-dark p-6">
                        <i className="fas fa-tachometer-alt text-4xl text-neutral-medium mb-3"></i>
                        <p>Perbandingan kondisi aktual dengan target ideal akan ditampilkan di sini</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed Data Section */}
        <div id="ringkasan" className="grid grid-cols-1 gap-6 mb-8 scroll-mt-20">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary"></div>
            <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
              <i className="fas fa-seedling text-9xl text-primary"></i>
            </div>
            
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-md mr-4">
                  <i className="fas fa-clipboard-check text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-neutral-darkest">Ringkasan Kondisi Tanaman</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoCard 
                  title="Status Pencahayaan"
                  color="primary"
                  isOptimal={stats.currentLux >= 2000 && stats.currentLux <= 4000}
                  data={[
                    "Rentang ideal: 2,000 - 4,000 lux",
                    "Waktu paparan optimal: 8-10 jam/hari",
                    `Pengukuran terakhir: ${stats.currentLux.toLocaleString('id-ID')} lux (${stats.currentLux >= 2000 && stats.currentLux <= 4000 ? "optimal" : "perlu penyesuaian"})`
                  ]}
                />
                
                <InfoCard 
                  title="Status Suhu"
                  color="secondary"
                  isOptimal={stats.currentTemp >= 22 && stats.currentTemp <= 30}
                  data={[
                    "Rentang ideal: 22°C - 30°C",
                    "Fluktuasi suhu terjaga dengan baik",
                    `Suhu saat ini: ${stats.currentTemp.toFixed(1)}°C (${stats.currentTemp >= 22 && stats.currentTemp <= 30 ? "optimal" : "perlu penyesuaian"})`
                  ]}
                />
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="bg-neutral-lightest p-4 rounded-lg border border-gray-100 text-sm">
                    <h4 className="font-semibold text-neutral-darkest mb-2 flex items-center">
                      <i className="fas fa-lightbulb text-accent-dark mr-2"></i>
                      Tips Peningkatan Kondisi
                    </h4>
                    <ul className="space-y-1 text-neutral-dark">
                      <li className="flex items-start">
                        <i className="fas fa-chevron-right text-primary mr-2 mt-1 text-xs"></i>
                        <span>{stats.currentLux < 2000 ? "Tingkatkan paparan cahaya dengan mengurangi naungan" : stats.currentLux > 4000 ? "Kurangi paparan cahaya langsung dengan memberikan naungan" : "Pertahankan kondisi cahaya saat ini"}</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-chevron-right text-primary mr-2 mt-1 text-xs"></i>
                        <span>{stats.currentTemp < 22 ? "Tingkatkan suhu dengan mengurangi ventilasi atau menggunakan pemanas" : stats.currentTemp > 30 ? "Kurangi suhu dengan meningkatkan ventilasi atau pendinginan" : "Pertahankan kondisi suhu saat ini"}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg shadow-sm hover:bg-primary-dark transition-colors flex items-center">
                      <i className="fas fa-file-download mr-2"></i>
                      Unduh Laporan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Data Section */}
        <div id="data-terbaru" className="scroll-mt-20">
          <RecentData 
            data={recentData.slice(0, 5)} 
            onRefresh={handleDataRefresh}
            isLoading={isLoading}
          />
        </div>
        
        {/* Image Section */}
        <div id="tentang" className="scroll-mt-20">
          <ImageSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
