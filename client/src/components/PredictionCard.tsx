import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, TrendingUp, Clock } from 'lucide-react';
import { FirebaseSensorData } from "@shared/schema";
import { getPredictionFromGroq } from "@/lib/groq";
import { useToast } from "@/hooks/use-toast";

interface PredictionResult {
    predicted_temp: number | null;
    predicted_lux: number | null;
    prediction_time?: string;
    message?: string;
}

interface PredictionCardProps {
    recentData: FirebaseSensorData[];
}

export default function PredictionCard({ recentData }: PredictionCardProps) {
    const [predictionHorizon, setPredictionHorizon] = useState<string>("dalam 1 jam");
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const handlePredict = async () => {
        if (!predictionHorizon.trim()) {
            toast({
                title: "Input Kosong",
                description: "Mohon masukkan waktu prediksi (misal: dalam 1 jam, besok pagi).",
                variant: "warning",
            });
            return;
        }

        setIsLoading(true);
        setPrediction(null); // Clear previous prediction

        const result = await getPredictionFromGroq(recentData, predictionHorizon);
        setPrediction(result);
        setIsLoading(false);

        if (result.message && !result.predicted_temp && !result.predicted_lux) {
            toast({
                title: "Info Prediksi",
                description: result.message,
                variant: "info",
            });
        } else if (result.message) {
            toast({
                title: "Prediksi",
                description: result.message,
                variant: "default",
            });
        }
    };

    // Clear prediction when recentData changes, prompting re-prediction if needed
    useEffect(() => {
        setPrediction(null);
    }, [recentData]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="text-primary" size={20} />
                    Prediksi AI
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="predictionHorizon" className="mb-2 block">Waktu Prediksi (misal: dalam 1 jam, besok pagi)</Label>
                        <div className="flex gap-2">
                            <Input
                                id="predictionHorizon"
                                type="text"
                                value={predictionHorizon}
                                onChange={(e) => setPredictionHorizon(e.target.value)}
                                placeholder="dalam 1 jam"
                                className="flex-grow"
                            />
                            <Button onClick={handlePredict} disabled={isLoading || !recentData || recentData.length === 0}>
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Clock size={18} className="mr-2" />
                                )}
                                Prediksi
                            </Button>
                        </div>
                    </div>

                    {prediction && (prediction.predicted_temp !== null || prediction.predicted_lux !== null) && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                            <h4 className="font-semibold text-green-800 mb-2">Hasil Prediksi {prediction.prediction_time ? `untuk ${prediction.prediction_time}` : ''}:</h4>
                            <ul className="list-disc pl-5 text-green-700">
                                {prediction.predicted_temp !== null && <li>Suhu: <span className="font-medium">{prediction.predicted_temp.toFixed(1)}°C</span></li>}
                                {prediction.predicted_lux !== null && <li>Intensitas Cahaya: <span className="font-medium">{prediction.predicted_lux.toLocaleString('id-ID')} lux</span></li>}
                            </ul>
                        </div>
                    )}

                    {prediction?.message && (!prediction.predicted_temp && !prediction.predicted_lux) && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
                            <p className="text-sm">{prediction.message}</p>
                        </div>
                    )}

                    {isLoading && (recentData && recentData.length > 0) && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800 flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <p className="text-sm">Mendapatkan prediksi dari AI...</p>
                        </div>
                    )}

                    {!recentData || recentData.length === 0 && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
                            <p className="text-sm">Tidak ada data terbaru untuk melakukan prediksi.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 