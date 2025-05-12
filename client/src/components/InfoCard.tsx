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
      text: "text-primary"
    },
    secondary: {
      bg: "bg-secondary bg-opacity-5",
      border: "border-secondary border-opacity-20",
      text: "text-secondary"
    }
  };
  
  return (
    <div className={`${colorMap[color].bg} rounded-lg p-4 border ${colorMap[color].border}`}>
      <h4 className={`${colorMap[color].text} font-medium mb-2`}>{title}</h4>
      <div className="flex items-center mb-2">
        {isOptimal ? (
          <i className="fas fa-check-circle text-primary mr-2"></i>
        ) : (
          <i className="fas fa-exclamation-triangle text-accent-dark mr-2"></i>
        )}
        <p className="text-neutral-dark">
          {title.includes("Cahaya") ? "Intensitas cahaya" : "Suhu"} saat ini{" "}
          <span className="font-medium text-neutral-darkest">
            {isOptimal ? "optimal" : "perlu penyesuaian"}
          </span>
          {title.includes("Suhu") ? "." : " untuk pertumbuhan."}
        </p>
      </div>
      <div className="text-sm text-neutral-dark">
        {data.map((item, index) => (
          <p key={index} className={index < data.length - 1 ? "mb-1" : ""}>
            • {item}
          </p>
        ))}
      </div>
    </div>
  );
}
