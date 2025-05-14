import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

interface GaugeCardProps {
    value: number;
    max: number;
    label: string;
    color: string;
    unit?: string;
}

export default function GaugeCard({ value, max, label, color, unit }: GaugeCardProps) {
    const data = [{ name: label, value, fill: color }];
    return (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col items-center">
            <h4 className="font-semibold mb-2">{label}</h4>
            <ResponsiveContainer width={200} height={200}>
                <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="80%"
                    outerRadius="100%"
                    barSize={20}
                    data={data}
                    startAngle={180}
                    endAngle={0}
                >
                    <PolarAngleAxis
                        type="number"
                        domain={[0, max]}
                        angleAxisId={0}
                        tick={false}
                    />
                    <RadialBar
                        background
                        dataKey="value"
                    />
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center mt-2 text-lg font-bold">{value} {unit}</div>
        </div>
    );
} 