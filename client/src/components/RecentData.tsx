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
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-neutral-darkest">Data Terbaru</h3>
        <Button 
          variant="default" 
          size="sm" 
          className="bg-primary hover:bg-primary-dark text-white"
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <i className="fas fa-sync-alt mr-1"></i>
          )}
          Segarkan
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-neutral-medium">
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Waktu</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Cahaya (lux)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Suhu (°C)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-light">
            {isLoading ? (
              // Loading skeletons
              Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">
                    <Skeleton className="h-5 w-32" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-5 w-16" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-5 w-12" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-5 w-20" />
                  </td>
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((reading, index) => {
                const isLightOptimal = reading.light_intensity >= 2000 && reading.light_intensity <= 4000;
                const isTempOptimal = reading.temperature >= 22 && reading.temperature <= 30;
                const isOptimal = isLightOptimal && isTempOptimal;
                
                const statusColor = isOptimal 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800";
                
                const statusText = isOptimal 
                  ? "Optimal" 
                  : !isLightOptimal && !isTempOptimal
                    ? "Perlu Perhatian"
                    : !isLightOptimal
                      ? "Penyesuaian Cahaya"
                      : "Penyesuaian Suhu";
                
                return (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-neutral-darkest">
                      {formatDateTime(reading.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-darkest">
                      {reading.light_intensity.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-darkest">
                      {reading.temperature.toFixed(1)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
                        {statusText}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-neutral-dark">
                  Tidak ada data sensor yang tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
