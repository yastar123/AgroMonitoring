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
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-neutral-darkest">{title}</h3>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            className={period === '24h' ? colorMap[color].button : colorMap[color].inactive}
            onClick={() => onPeriodChange('24h')}
          >
            24 Jam
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className={period === '7d' ? colorMap[color].button : colorMap[color].inactive}
            onClick={() => onPeriodChange('7d')}
          >
            7 Hari
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className={period === '30d' ? colorMap[color].button : colorMap[color].inactive}
            onClick={() => onPeriodChange('30d')}
          >
            30 Hari
          </Button>
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
      
      <div className="flex justify-between items-center mt-4 text-xs text-neutral-dark">
        <div className="flex items-center">
          <div className={`h-3 w-3 ${color === 'primary' ? 'bg-primary' : 'bg-secondary'} rounded-full mr-1`}></div>
          <span>{dataKey === 'light_intensity' ? 'Intensitas Cahaya (lux)' : 'Suhu (°C)'}</span>
        </div>
        <div>
          <span className="font-medium">Min: </span>
          <span>
            {isLoading ? (
              <Skeleton className="h-3 w-10 inline-block" />
            ) : (
              dataKey === 'light_intensity' ? min.toLocaleString('id-ID') : min.toFixed(1)
            )} {unit}
          </span> | 
          <span className="font-medium"> Max: </span>
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
  );
}
