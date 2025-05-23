import { FirebaseSensorData } from "@shared/schema";
import { formatDateTime } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

interface RecentDataProps {
  data: FirebaseSensorData[];
  onRefresh: () => void;
  isLoading?: boolean;
}

export default function RecentData({ data, onRefresh, isLoading = false }: RecentDataProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
        <i className="fas fa-database text-9xl text-primary-dark"></i>
      </div>
      
      {/* Header with refresh button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 relative">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-primary rounded-full mr-3"></div>
          <h3 className="font-semibold text-neutral-darkest text-lg">Data Terbaru</h3>
        </div>
        <Button 
          variant="default" 
          size="sm" 
          className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark text-white shadow-sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <i className="fas fa-sync-alt mr-2"></i>
          )}
          Segarkan Data
        </Button>
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-darkest uppercase tracking-wider border-b">
                <div className="flex items-center">
                  <i className="fas fa-clock text-primary mr-2 opacity-70"></i>
                  Waktu
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-darkest uppercase tracking-wider border-b">
                <div className="flex items-center">
                  <i className="fas fa-sun text-accent mr-2 opacity-70"></i>
                  Cahaya (lux)
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-darkest uppercase tracking-wider border-b">
                <div className="flex items-center">
                  <i className="fas fa-temperature-half text-secondary mr-2 opacity-70"></i>
                  Suhu (°C)
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-darkest uppercase tracking-wider border-b">
                <div className="flex items-center">
                  <i className="fas fa-check-circle text-primary mr-2 opacity-70"></i>
                  Status
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-light">
            {isLoading ? (
              // Loading skeletons
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-16" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-20" />
                  </td>
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((reading, index) => {
                const isLightOptimal = reading.light_intensity >= 1 && reading.light_intensity <= 4000;
                const isTempOptimal = reading.temperature >= 1 && reading.temperature <= 30;
                const isOptimal = isLightOptimal && isTempOptimal;
                
                // Determine status style
                let statusStyle = "";
                let statusIcon = "";
                
                if (isOptimal) {
                  statusStyle = "bg-green-100 text-green-800 border border-green-200";
                  statusIcon = "fas fa-check-circle mr-1";
                } else if (!isLightOptimal && !isTempOptimal) {
                  statusStyle = "bg-red-100 text-red-800 border border-red-200";
                  statusIcon = "fas fa-exclamation-triangle mr-1";
                } else {
                  statusStyle = "bg-yellow-100 text-yellow-800 border border-yellow-200"; 
                  statusIcon = "fas fa-exclamation-circle mr-1";
                }
                
                const statusText = isOptimal 
                  ? "Optimal" 
                  : !isLightOptimal && !isTempOptimal
                    ? "Perlu Perhatian"
                    : !isLightOptimal
                      ? "Penyesuaian Cahaya"
                      : "Penyesuaian Suhu";
                
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-darkest">
                      {formatDateTime(reading.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-darkest font-medium">
                        {reading.light_intensity.toLocaleString('id-ID')}
                      </div>
                      <div className="text-xs text-neutral-dark">
                        {isLightOptimal ? (
                          <span className="text-green-600">Optimal</span>
                        ) : reading.light_intensity < 2000 ? (
                          <span className="text-yellow-600">Kurang cahaya</span>
                        ) : (
                          <span className="text-yellow-600">Terlalu terang</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-darkest font-medium">
                        {reading.temperature.toFixed(1)}
                      </div>
                      <div className="text-xs text-neutral-dark">
                        {isTempOptimal ? (
                          <span className="text-green-600">Optimal</span>
                        ) : reading.temperature < 22 ? (
                          <span className="text-yellow-600">Terlalu dingin</span>
                        ) : (
                          <span className="text-yellow-600">Terlalu panas</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 text-xs rounded-full flex items-center w-fit ${statusStyle}`}>
                        <i className={statusIcon}></i>
                        {statusText}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <i className="fas fa-database text-gray-300 text-4xl mb-3"></i>
                    <p className="text-neutral-dark mb-1">Tidak ada data sensor yang tersedia</p>
                    <p className="text-xs text-neutral">Tekan tombol segarkan untuk memperbarui data</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination placeholder for future use */}
      {data.length > 0 && (
        <div className="flex justify-between items-center mt-4 pt-2 text-xs text-neutral-dark">
          <div>
            Menampilkan {data.length} data terbaru
          </div>
          <div className="text-primary">
            <Button variant="link" size="sm" className="h-8 px-2 text-primary">
              <i className="fas fa-database mr-1"></i> Lihat Semua Data
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
