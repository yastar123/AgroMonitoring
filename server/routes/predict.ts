import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';
import { FirebaseSensorData } from "@shared/schema";

const router = Router();

// Pastikan GROQ_API_KEY diatur di environment variable server Anda.
// Jika menggunakan file .env, pastikan Anda menggunakan library seperti 'dotenv' di entry file server (misal: index.ts)
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama3-8b-8192"; // Ganti model jika perlu

interface PredictionResult {
  predicted_temp: number | null;
  predicted_lux: number | null;
  prediction_time?: string;
  message?: string;
}

router.post('/', async (req: Request, res: Response) => {
    const { recentData, predictionHorizon } = req.body;

    if (!GROQ_API_KEY) {
        console.error("GROQ_API_KEY environment variable not set on the server.");
        return res.status(500).json({ message: "Server error: Groq API Key tidak dikonfigurasi." });
    }

    if (!recentData || !Array.isArray(recentData) || recentData.length === 0 || !predictionHorizon) {
        return res.status(400).json({ message: "Data atau waktu prediksi tidak lengkap atau format salah." });
    }

    // Format data sensor terbaru untuk prompt
    const formattedData = recentData.map((data: FirebaseSensorData) => ({
        timestamp: new Date(data.timestamp * 1000).toISOString(),
        temperature: data.temperature,
        lux: data.light_intensity // Menggunakan light_intensity sesuai data sensor
    }));

    // Buat prompt untuk AI
    const prompt = `As a predictive AI, analyze the following temperature (°C) and light intensity (lux) sensor data:

Recent Sensor Data:
${JSON.stringify(formattedData, null, 2)}

Based on the trends in this data, predict the temperature and light intensity values for ${predictionHorizon}. Provide the prediction strictly in JSON format with keys 'predicted_temp' (temperature value), 'predicted_lux' (lux value), and 'prediction_time' (a description of the prediction time, e.g., 'in 1 hour', 'tomorrow morning') if possible. Do not include any other explanatory text outside the JSON object.

Output Format (Pure JSON):
{
  "predicted_temp": temp_value,
  "predicted_lux": lux_value,
  "prediction_time": "time description"
}`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`, // Menggunakan API Key dari environment server
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful AI assistant that predicts sensor data based on provided history. Respond only with the requested JSON format.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 150,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Error fetching Groq API from backend: ${response.status} - ${errorBody}`);
            return res.status(response.status).json({ message: `Failed to get prediction from Groq API: ${response.status}` });
        }

        const data: any = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (content) {
            try {
                // Parse JSON dari content
                const prediction = JSON.parse(content);
                if (typeof prediction.predicted_temp === 'number' || typeof prediction.predicted_lux === 'number') {
                    // Kirim hasil prediksi ke frontend
                    res.json({
                        predicted_temp: prediction.predicted_temp,
                        predicted_lux: prediction.predicted_lux,
                        prediction_time: prediction.prediction_time || predictionHorizon,
                        message: "Prediksi berhasil didapatkan."
                    });
                } else {
                    console.warn("Groq API response format unexpected:", prediction);
                    res.status(500).json({ message: "Failed to parse prediction format from AI." });
                }
            } catch (parseError) {
                console.error("Error parsing Groq API response in backend:", content, parseError);
                res.status(500).json({ message: "Failed to process AI prediction result." });
            }
        } else {
            console.warn("Groq API response content empty:", data);
            res.status(500).json({ message: "AI did not provide a prediction." });
        }

    } catch (error) {
        console.error("Error in backend predict endpoint:", error);
        res.status(500).json({ message: "An error occurred on the server while getting prediction." });
    }
});

export default router; 