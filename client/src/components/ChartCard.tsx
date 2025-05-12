import { useState, useEffect } from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { FirebaseSensorData } from "@shared/schema";
import { ChartPeriod, formatTime } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface ChartCardProps {
  title: string;
  data: FirebaseSensorData[];
  dataKey: "light_intensity" | "temperature";
  unit: string;
  color: "primary" | "secondary";
  period: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
  min: number;
  max: number;
  isLoading?: boolean;
}

export default function ChartCard({
  title,
  data,
  dataKey,
  unit,
  color,
  period,
  onPeriodChange,
  min,
  max,
  isLoading = false
}: ChartCardProps) {
  const [formattedData, setFormattedData] = useState<any[]>([]);
  
  // Colors
  const colorMap = {
    primary: {
      button: "bg-primary-light bg-opacity-10 hover:bg-opacity-20 text-primary",
      inactive: "bg-neutral-light hover:bg-neutral-medium text-neutral-dark",
      line: "hsl(var(--primary))",
      bg: "rgba(46, 125, 50, 0.1)"
    },
    secondary: {
      button: "bg-secondary-light bg-opacity-10 hover:bg-opacity-20 text-secondary",
      inactive: "bg-neutral-light hover:bg-neutral-medium text-neutral-dark",
      line: "hsl(var(--secondary))",
      bg: "rgba(121, 85, 72, 0.1)"
    },
  };
  
  // Format data for chart
  useEffect(() => {
    if (data.length === 0) return;
    
    // Sort by timestamp
    const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
    
    // Apply time interval sampling based on period
    let sampledData = sortedData;
    
    if (period === '7d' && sortedData.length > 168) {
      // Sample every hour
      sampledData = sortedData.filter((_, index) => index % 4 === 0);
    } else if (period === '30d' && sortedData.length > 720) {
      // Sample every 4 hours
      sampledData = sortedData.filter((_, index) => index % 16 === 0);
    }
    
    // Format for chart
    const formatted = sampledData.map(item => ({
      name: formatTime(item.timestamp),
      [dataKey]: item[dataKey],
      timestamp: item.timestamp
    }));
    
    setFormattedData(formatted);
  }, [data, period, dataKey]);
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 relative overflow-hidden">
      {/* Background decorative patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className={`absolute -bottom-8 -right-8 text-8xl text-${color} transform rotate-12`}>
          <i className={`fas fa-${dataKey === 'light_intensity' ? 'sun' : 'temperature-half'}`}></i>
        </div>
      </div>
      
      <div className="relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 md:gap-0">
          <div className="flex items-center">
            <div className={`w-3 h-10 bg-${color} rounded-full mr-3`}></div>
            <h3 className="font-semibold text-neutral-darkest text-lg">{title}</h3>
          </div>
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <Button 
              variant="ghost" 
              size="sm"
              className={`${period === '24h' ? colorMap[color].button : colorMap[color].inactive} rounded-md`}
              onClick={() => onPeriodChange('24h')}
            >
              24 Jam
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={`${period === '7d' ? colorMap[color].button : colorMap[color].inactive} rounded-md`}
              onClick={() => onPeriodChange('7d')}
            >
              7 Hari
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={`${period === '30d' ? colorMap[color].button : colorMap[color].inactive} rounded-md`}
              onClick={() => onPeriodChange('30d')}
            >
              30 Hari
            </Button>
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Skeleton className="h-[90%] w-[95%]" />
          </div>
        ) : formattedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="name" 
                fontSize={12}
                tickMargin={10}
                stroke="#9E9E9E"
              />
              <YAxis 
                fontSize={12}
                tickMargin={10}
                stroke="#9E9E9E"
                domain={[
                  dataKey === 'temperature' ? 20 : 'auto',
                  dataKey === 'temperature' ? 40 : 'auto'
                ]}
              />
              <Tooltip 
                formatter={(value) => [`${value} ${unit}`, title]}
                labelFormatter={(label) => `Waktu: ${label}`}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                name={dataKey === 'light_intensity' ? 'Intensitas Cahaya' : 'Suhu'}
                stroke={colorMap[color].line}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                fill={colorMap[color].bg}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-dark">
            Tidak ada data tersedia
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center">
          <div className={`h-4 w-4 ${color === 'primary' ? 'bg-primary' : 'bg-secondary'} rounded-full mr-2 shadow-sm`}></div>
          <span className="text-sm text-neutral-dark">{dataKey === 'light_intensity' ? 'Intensitas Cahaya (lux)' : 'Suhu (°C)'}</span>
        </div>
        
        <div className="flex gap-3 text-xs">
          <div className="bg-gray-100 px-3 py-1.5 rounded-lg flex items-center">
            <span className="font-medium text-neutral-darkest mr-1">Min:</span>
            <span>
              {isLoading ? (
                <Skeleton className="h-3 w-10 inline-block" />
              ) : (
                dataKey === 'light_intensity' ? min.toLocaleString('id-ID') : min.toFixed(1)
              )} {unit}
            </span>
          </div>
          
          <div className="bg-gray-100 px-3 py-1.5 rounded-lg flex items-center">
            <span className="font-medium text-neutral-darkest mr-1">Max:</span>
            <span>
              {isLoading ? (
                <Skeleton className="h-3 w-10 inline-block" />
              ) : (
                dataKey === 'light_intensity' ? max.toLocaleString('id-ID') : max.toFixed(1)
              )} {unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
