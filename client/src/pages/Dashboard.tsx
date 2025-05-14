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
      if (data.length > 0) {
        setRecentData(prevData => {
          // Keep only the last 50 readings
          const newData = [...prevData, ...data].slice(-50);
          return newData;
        });
        setLastUpdated(getTimeSinceUpdate(data[0].timestamp));
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to chart data
  useEffect(() => {
    const unsubscribe = subscribeToChartData((data) => {
      if (data.length > 0) {
        setChartData(prevData => {
          // Keep only the last 24 readings for the chart
          const newData = [...prevData, ...data].slice(-24);
          return newData;
        });
      }
    });

    return () => unsubscribe();
  }, [chartPeriod]);

  // Update last updated time
  useEffect(() => {
    const interval = setInterval(() => {
      if (recentData.length > 0) {
        setLastUpdated(getTimeSinceUpdate(recentData[recentData.length - 1].timestamp));
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

    // The data will be automatically updated through the real-time subscription
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">

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


        {/* Sensor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SensorCard
            title="Intensitas Cahaya"
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
            title="Suhu"
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
            title="Rata-rata Cahaya"
            value={stats.avgLux}
            unit="lux"
            icon="chart-line"
            color="accent"
            isAverage={true}
            isLoading={isLoading}
          />

          <SensorCard
            title="Rata-rata Suhu"
            value={stats.avgTemp}
            unit="°C"
            icon="chart-line"
            color="accent-dark"
            isAverage={true}
            isLoading={isLoading}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
            title="Suhu"
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

        {/* Tips Pertanian */}
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg mt-4 flex items-center gap-3 mb-8 shadow-sm">
          <i className="fas fa-leaf text-green-600 text-xl"></i>
          <span className="text-green-900 text-sm font-medium">Tips: Pastikan tanaman mendapat cahaya pagi minimal 6 jam sehari dan cek suhu lingkungan secara berkala untuk pertumbuhan optimal.</span>
        </div>

        {/* Info Cards */}
        <div className="grid text-white grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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

        {/* Recent Data */}
        <div id="data-terbaru" className="scroll-mt-20">
          <RecentData
            data={recentData.slice(-5)}
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
