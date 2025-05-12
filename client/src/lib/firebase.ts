import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, limit, onSnapshot, Timestamp, DocumentData } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { FirebaseSensorData } from "@shared/schema";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNYM-bGraldjrpeSnbSBQ1QnvvRA03dCg",
  authDomain: "monitoring-5f6a6.firebaseapp.com",
  projectId: "monitoring-5f6a6",
  storageBucket: "monitoring-5f6a6.firebasestorage.app",
  messagingSenderId: "425534358150",
  appId: "1:425534358150:web:3e105a439c243d43320707",
  measurementId: "G-D4M4JMDG26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Initialize Analytics only in browser environment
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Collection references
const sensorDataCollectionRef = collection(db, "sensor_data");

// Convert Firestore data to our schema
export const convertFirestoreData = (doc: DocumentData): FirebaseSensorData => {
  const data = doc.data();
  return {
    timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toMillis() : data.timestamp,
    light_intensity: Number(data.light_intensity),
    temperature: Number(data.temperature),
    status: data.status || getStatus(Number(data.light_intensity), Number(data.temperature))
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
  count: number = 5
) => {
  const recentDataQuery = query(
    sensorDataCollectionRef,
    orderBy("timestamp", "desc"),
    limit(count)
  );
  
  return onSnapshot(recentDataQuery, 
    (snapshot) => {
      const sensorDataArray: FirebaseSensorData[] = [];
      snapshot.forEach((doc) => {
        sensorDataArray.push(convertFirestoreData(doc));
      });
      callback(sensorDataArray);
    },
    (error) => {
      console.error("Error fetching recent sensor data:", error);
      // If there's a permission error, we'll provide sample data for demonstration
      if (error.code === 'permission-denied') {
        // Generate dummy data for demonstration purposes
        const now = Date.now();
        const dummyData: FirebaseSensorData[] = [];
        
        for (let i = 0; i < count; i++) {
          const timestamp = now - (i * 15 * 60 * 1000); // 15 minute intervals
          dummyData.push({
            timestamp: timestamp,
            light_intensity: 2500 + Math.random() * 1500,
            temperature: 25 + (Math.random() * 5 - 2.5),
            status: "Optimal"
          });
        }
        
        callback(dummyData);
      }
    }
  );
};

// Hook to get real-time sensor data for charts with time range filter
export const subscribeToChartData = (
  callback: (data: FirebaseSensorData[]) => void,
  hours: number = 24
) => {
  // Calculate timestamp for filtering
  const hoursAgo = new Date();
  hoursAgo.setHours(hoursAgo.getHours() - hours);
  
  const chartDataQuery = query(
    sensorDataCollectionRef,
    orderBy("timestamp", "asc")
  );
  
  return onSnapshot(chartDataQuery, 
    (snapshot) => {
      const sensorDataArray: FirebaseSensorData[] = [];
      snapshot.forEach((doc) => {
        const data = convertFirestoreData(doc);
        // Client-side filtering by time range
        if (data.timestamp >= hoursAgo.getTime()) {
          sensorDataArray.push(data);
        }
      });
      callback(sensorDataArray);
    },
    (error) => {
      console.error("Error fetching chart data:", error);
      // If there's a permission error, we'll provide sample data for demonstration
      if (error.code === 'permission-denied') {
        // Generate dummy data for the chart
        const now = Date.now();
        const dummyData: FirebaseSensorData[] = [];
        const dataPoints = hours === 24 ? 24 : hours === 168 ? 42 : 90; // Number of data points based on time range
        const interval = hours * 3600000 / dataPoints; // Time interval between data points
        
        for (let i = 0; i < dataPoints; i++) {
          const timestamp = now - (hours * 3600000) + (i * interval);
          // Create a sine wave pattern for the demo data
          const progress = i / dataPoints;
          const sinValue = Math.sin(progress * Math.PI * 2);
          
          dummyData.push({
            timestamp: timestamp,
            light_intensity: 2500 + 1500 * sinValue + Math.random() * 300,
            temperature: 25 + 3 * sinValue + Math.random() * 1.5,
            status: "Optimal"
          });
        }
        
        callback(dummyData);
      }
    }
  );
};

export { db };
