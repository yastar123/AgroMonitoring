import { FirebaseSensorData } from "@shared/schema";
import axios from "axios";

// PERINGATAN: Menyimpan API Key di frontend adalah RISIKO KEAMANAN MAYOR.
// Ini dilakukan sesuai permintaan untuk tujuan demo, tetapi SANGAT HARUS DIPINDAHKAN KE BACKEND.

const api = axios.create({
    baseURL: "https://api.groq.com/openai/v1",
    headers: {
        "Content-Type": "application/json",
        // API Key dicantumkan langsung sesuai permintaan user untuk demo
        // GANTI DENGAN API KEY ANDA YANG SEBENARNYA DI SINI JIKA TIDAK MENGGUNAKAN ENV VARS (TIDAK DISARANKAN UNTUK PRODUKSI)
        Authorization: "Bearer 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",
    },
});

interface PredictionResult {
  predicted_temp: number | null;
  predicted_lux: number | null;
  prediction_time?: string;
  message?: string;
}

export async function getPredictionFromGroq(
  recentData: FirebaseSensorData[],
  predictionHorizon: string
): Promise<PredictionResult> {

  if (recentData.length === 0) {
      return { predicted_temp: null, predicted_lux: null, message: "Tidak ada data sensor terbaru untuk diprediksi." };
  }

  // Format data sensor terbaru untuk prompt
  const formattedData = recentData.map(data => ({
      timestamp: new Date(data.timestamp * 1000).toISOString(), // Konversi timestamp ke format tanggal
      temperature: data.temperature,
      lux: data.light_intensity
  }));

  // Buat prompt untuk AI
  const prompt = `Sebagai AI prediktif, analisis data sensor suhu (°C) dan intensitas cahaya (lux) berikut:

Data Sensor Terbaru:
${JSON.stringify(formattedData, null, 2)}

Berdasarkan tren dari data ini, prediksi nilai suhu dan intensitas cahaya untuk ${predictionHorizon}. Berikan prediksi dalam format JSON murni dengan keys 'predicted_temp' (nilai suhu) dan 'predicted_lux' (nilai lux), serta 'prediction_time' (deskripsi waktu prediksi, misal: 'dalam 1 jam', 'besok pagi') jika memungkinkan. Jangan sertakan teks penjelasan lain di luar objek JSON.

Format Output (JSON murni):
{
  "predicted_temp": nilai_suhu,
  "predicted_lux": nilai_lux,
  "prediction_time": "deskripsi waktu"
}
`;

  try {
    const response = await api.post("/chat/completions", {
        model: "llama3-8b-8192", // Anda bisa ganti model jika perlu
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
        temperature: 0.7, // Sesuaikan untuk mengontrol kreativitas/deterministik
        max_tokens: 150, // Sesuaikan jika prediksi JSON lebih panjang
      });

    // Axios mengembalikan response.data secara langsung
    const data = response.data;
    const content = data.choices?.[0]?.message?.content;

    if (content) {
      try {
        // Coba parse JSON dari content
        const prediction = JSON.parse(content);
        if (typeof prediction.predicted_temp === 'number' || typeof prediction.predicted_lux === 'number') {
             return { 
                 predicted_temp: prediction.predicted_temp,
                 predicted_lux: prediction.predicted_lux,
                 prediction_time: prediction.prediction_time || predictionHorizon,
                 message: "Prediksi berhasil didapatkan."
              };
        } else {
             console.warn("Groq API response format unexpected:", prediction);
             return { predicted_temp: null, predicted_lux: null, message: "Format prediksi dari AI tidak sesuai." };
        }
      } catch (parseError) {
        console.error("Error parsing Groq API response in frontend:", content, parseError);
        return { predicted_temp: null, predicted_lux: null, message: "Gagal memproses prediksi AI di frontend." };
      }
    } else {
        console.warn("Groq API response content empty:", data);
        return { predicted_temp: null, predicted_lux: null, message: "AI tidak memberikan prediksi." };
    }

  } catch (error: any) {
    console.error("Error in getPredictionFromGroq frontend:", error);
     // Periksa jika error adalah AxiosError untuk detail lebih lanjut
    if (axios.isAxiosError(error)) {
        console.error("Axios Error Details:", error.response?.data, error.response?.status);
         return { predicted_temp: null, predicted_lux: null, message: `Terjadi kesalahan saat menghubungi Groq API: ${error.message}. Status: ${error.response?.status || 'N/A'}` };
    } else {
         return { predicted_temp: null, predicted_lux: null, message: `Terjadi kesalahan saat menghubungi Groq API: ${error.message || error}` };
    }
  }
} 