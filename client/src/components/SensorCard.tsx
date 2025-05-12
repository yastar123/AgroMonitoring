import { Skeleton } from "@/components/ui/skeleton";

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  icon: string;
  color: "primary" | "secondary" | "accent" | "accent-dark";
  trend?: "up" | "down" | "stable";
  change?: number;
  lastUpdated?: string;
  isAverage?: boolean;
  isLoading?: boolean;
}

export default function SensorCard({
  title,
  value,
  unit,
  icon,
  color,
  trend,
  change,
  lastUpdated,
  isAverage = false,
  isLoading = false
}: SensorCardProps) {
  
  // Define colors based on the prop
  const colorMap = {
    primary: {
      border: "border-primary",
      bg: "bg-primary-light bg-opacity-10",
      text: "text-primary",
      icon: icon === "sun" ? "text-accent" : "text-primary"
    },
    secondary: {
      border: "border-secondary",
      bg: "bg-secondary-light bg-opacity-10",
      text: "text-secondary",
      icon: "text-secondary"
    },
    accent: {
      border: "border-accent",
      bg: "bg-accent bg-opacity-10",
      text: "text-accent-dark",
      icon: "text-accent-dark"
    },
    "accent-dark": {
      border: "border-accent-dark",
      bg: "bg-accent-dark bg-opacity-10",
      text: "text-accent-dark",
      icon: "text-accent-dark"
    }
  };
  
  // Format the value
  const formattedValue = unit === "lux" 
    ? value.toLocaleString('id-ID')
    : value.toFixed(1);
    
  // Get trend icon
  const getTrendIcon = () => {
    if (trend === "up") return "fa-arrow-up";
    if (trend === "down") return "fa-arrow-down";
    return "fa-minus";
  };
  
  return (
    <div className={`sensor-card bg-white rounded-xl shadow-lg p-5 border-b-4 ${colorMap[color].border} hover:translate-y-[-5px] transition-all duration-300`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-neutral-dark text-sm font-medium">{title}</h3>
          {isLoading ? (
            <Skeleton className="h-10 w-24 mt-2" />
          ) : (
            <p className="text-3xl font-bold mt-2">
              {formattedValue} <span className="text-sm font-normal text-neutral">{unit}</span>
            </p>
          )}
        </div>
        <div className={`p-3 ${colorMap[color].bg} rounded-full flex items-center justify-center shadow-md`}>
          <i className={`fas fa-${icon} text-xl ${colorMap[color].icon}`}></i>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm">
          {!isAverage ? (
            <>
              <span className="text-neutral flex items-center">
                {isLoading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  <>
                    <i className="fas fa-history text-neutral-dark mr-1 opacity-70"></i>
                    <span>{lastUpdated}</span>
                  </>
                )}
              </span>
              {trend && (
                <span className={`flex items-center font-medium px-2 py-1 rounded-full text-xs
                  ${trend === 'up' ? 'bg-green-100 text-green-700' : 
                    trend === 'down' ? 'bg-red-100 text-red-700' : 
                    'bg-gray-100 text-gray-700'}`
                }>
                  <i className={`fas ${getTrendIcon()} mr-1`}></i>
                  <span>{change}%</span>
                </span>
              )}
            </>
          ) : (
            <>
              <span className="text-neutral flex items-center">
                <i className="fas fa-calendar-day text-neutral-dark mr-1 opacity-70"></i>
                <span>24 jam terakhir</span>
              </span>
              {!isLoading && (
                <span className="flex items-center text-primary font-medium bg-primary bg-opacity-10 px-2 py-1 rounded-full text-xs">
                  <i className="fas fa-check-circle mr-1"></i>
                  <span>Optimal</span>
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
