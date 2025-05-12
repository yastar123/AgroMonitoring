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
    <div className={`sensor-card bg-white rounded-lg shadow-md p-5 border-l-4 ${colorMap[color].border}`}>
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
        <div className={`p-2 ${colorMap[color].bg} rounded-full`}>
          <i className={`fas fa-${icon} text-xl ${colorMap[color].icon}`}></i>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center text-sm">
          {!isAverage ? (
            <>
              <span className="text-neutral">
                {isLoading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  `Pembaruan terakhir: ${lastUpdated}`
                )}
              </span>
              {trend && (
                <span className="flex items-center text-primary font-medium">
                  <i className={`fas ${getTrendIcon()} mr-1`}></i>
                  <span>{change}%</span>
                </span>
              )}
            </>
          ) : (
            <>
              <span className="text-neutral">24 jam terakhir</span>
              {!isLoading && (
                <span className="flex items-center text-primary font-medium">
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
