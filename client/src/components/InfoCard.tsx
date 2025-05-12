import { CheckCircle, AlertTriangle } from "lucide-react";

interface InfoCardProps {
  title: string;
  color: "primary" | "secondary";
  isOptimal: boolean;
  data: string[];
}

export default function InfoCard({ title, color, isOptimal, data }: InfoCardProps) {
  const colorMap = {
    primary: {
      bg: "bg-primary bg-opacity-5",
      border: "border-primary border-opacity-20",
      text: "text-primary",
      icon: "text-primary",
      statusBg: "bg-primary bg-opacity-10",
      gradient: "from-primary-light to-primary"
    },
    secondary: {
      bg: "bg-secondary bg-opacity-5",
      border: "border-secondary border-opacity-20",
      text: "text-secondary",
      icon: "text-secondary",
      statusBg: "bg-secondary bg-opacity-10",
      gradient: "from-secondary-light to-secondary"
    }
  };
  
  return (
    <div className={`${colorMap[color].bg} rounded-xl p-6 border ${colorMap[color].border} shadow-md overflow-hidden relative`}>
      {/* Background decorative element */}
      <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
        <i className={`fas fa-${title.includes("Cahaya") ? "sun" : "temperature-half"} text-9xl ${colorMap[color].text}`}></i>
      </div>
      
      {/* Gradient bar */}
      <div className={`absolute left-0 top-0 w-full h-1 bg-gradient-to-r ${colorMap[color].gradient}`}></div>
      
      <div className="relative">
        <div className="flex items-center mb-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorMap[color].statusBg} mr-3`}>
            <i className={`fas fa-${title.includes("Cahaya") ? "sun" : "temperature-half"} ${colorMap[color].icon}`}></i>
          </div>
          <h4 className={`${colorMap[color].text} font-semibold text-lg`}>{title}</h4>
        </div>
        
        <div className={`flex items-center p-3 rounded-lg mb-4 ${
          isOptimal 
            ? "bg-green-50 border border-green-100" 
            : "bg-amber-50 border border-amber-100"
        }`}>
          {isOptimal ? (
            <i className="fas fa-check-circle text-green-500 mr-3 text-lg"></i>
          ) : (
            <i className="fas fa-exclamation-triangle text-amber-500 mr-3 text-lg"></i>
          )}
          <p className="text-neutral-dark">
            {title.includes("Cahaya") ? "Intensitas cahaya" : "Suhu"} saat ini{" "}
            <span className={`font-medium ${isOptimal ? "text-green-700" : "text-amber-700"}`}>
              {isOptimal ? "optimal" : "perlu penyesuaian"}
            </span>
            {title.includes("Suhu") ? "." : " untuk pertumbuhan."}
          </p>
        </div>
        
        <div className="text-sm text-neutral-dark space-y-2.5">
          {data.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="mt-0.5 mr-2 text-xs">
                <i className={`fas fa-circle ${colorMap[color].text}`}></i>
              </div>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
