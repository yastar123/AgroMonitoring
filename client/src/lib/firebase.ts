import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off, query, orderByChild, limitToLast } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { FirebaseSensorData } from "@shared/schema";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNYM-bGraldjrpeSnbSBQ1QnvvRA03dCg",
  authDomain: "monitoring-5f6a6.firebaseapp.com",
  databaseURL: "https://monitoring-5f6a6-default-rtdb.firebaseio.com",
  projectId: "monitoring-5f6a6",
  storageBucket: "monitoring-5f6a6.firebasestorage.app",
  messagingSenderId: "425534358150",
  appId: "1:425534358150:web:3e105a439c243d43320707",
  measurementId: "G-D4M4JMDG26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// Initialize Analytics only in browser environment
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Convert Realtime Database data to our schema
export const convertRealtimeData = (data: any): FirebaseSensorData => {
  return {
    timestamp: data.timestamp || Date.now(),
    light_intensity: Number(data.lux) || 0,
    temperature: Number(data.temperature) || 0,
    status: getStatus(Number(data.lux), Number(data.temperature))
  };
};

// Determine status based on sensor readings
export const getStatus = (lightIntensity: number, temperature: number): string => {
  // Basic status logic - can be expanded based on plant types or other factors
  const isLightOptimal = lightIntensity >= 2000 && lightIntensity <= 4000;
  const isTempOptimal = temperature >= 22 && temperature <= 30;
  
  if (isLightOptimal && isTempOptimal) return "Optimal";
  if (!isLightOptimal && isTempOptimal) return "Penyesuaian Cahaya";
  if (isLightOptimal && !isTempOptimal) return "Penyesuaian Suhu";
  return "Perlu Perhatian";
};

// Hook to get real-time sensor data
export const subscribeToRecentSensorData = (
  callback: (data: FirebaseSensorData[]) => void,
  count: number = 50
) => {
  const dataRef = ref(db, 'data');
  const recentDataQuery = query(dataRef, orderByChild('timestamp'), limitToLast(count));
  
  const unsubscribe = onValue(recentDataQuery, (snapshot) => {
    const dataArray: FirebaseSensorData[] = [];
    snapshot.forEach((timestampSnapshot) => {
      // Handle the nested structure with unique IDs
      timestampSnapshot.forEach((idSnapshot) => {
        const data = idSnapshot.val();
        if (data) {
          dataArray.push(convertRealtimeData(data));
        }
      });
    });
    // Sort by timestamp in descending order (newest first)
    dataArray.sort((a, b) => b.timestamp - a.timestamp);
    callback(dataArray);
  }, (error) => {
    console.error("Error fetching sensor data:", error);
  });

  return () => {
    off(dataRef);
    unsubscribe();
  };
};

// Hook to get real-time sensor data for charts with time range filter
export const subscribeToChartData = (
  callback: (data: FirebaseSensorData[]) => void,
  hours: number = 24
) => {
  const dataRef = ref(db, 'data');
  // Calculate timestamp for filtering
  const hoursAgo = Date.now() - (hours * 60 * 60 * 1000);
  const chartDataQuery = query(
    dataRef,
    orderByChild('timestamp'),
    limitToLast(hours === 24 ? 24 : hours === 168 ? 168 : 720) // 24h, 7d, or 30d worth of data points
  );
  
  const unsubscribe = onValue(chartDataQuery, (snapshot) => {
    const dataArray: FirebaseSensorData[] = [];
    snapshot.forEach((timestampSnapshot) => {
      // Handle the nested structure with unique IDs
      timestampSnapshot.forEach((idSnapshot) => {
        const data = idSnapshot.val();
        if (data && data.timestamp >= hoursAgo) {
          dataArray.push(convertRealtimeData(data));
        }
      });
    });
    // Sort by timestamp in ascending order (oldest first) for charts
    dataArray.sort((a, b) => a.timestamp - b.timestamp);
    callback(dataArray);
  }, (error) => {
    console.error("Error fetching chart data:", error);
  });

  return () => {
    off(dataRef);
    unsubscribe();
  };
};

export { db };
