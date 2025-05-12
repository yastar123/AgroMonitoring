import { FirebaseSensorData } from "@shared/schema";

// Chart period options
export type ChartPeriod = '24h' | '7d' | '30d';

// Chart data for rendering
export interface ChartData {
  name: string;
  value: number;
}

// Utility to format dates
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Utility to format time
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Format date and time
export function formatDateTime(timestamp: number): string {
  return `${formatDate(timestamp)} ${formatTime(timestamp)}`;
}

// Calculate time since last update
export function getTimeSinceUpdate(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return `${seconds} detik lalu`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

// Calculate trend based on previous data
export function calculateTrend(current: number, previous: number): string {
  if (!previous) return 'stable';
  
  const percentChange = ((current - previous) / previous) * 100;
  
  if (percentChange > 0) return 'up';
  if (percentChange < 0) return 'down';
  return 'stable';
}

// Calculate percent change
export function calculatePercentChange(current: number, previous: number): number {
  if (!previous) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

// Process data for statistics
export function calculateStats(data: FirebaseSensorData[]) {
  if (!data.length) {
    return {
      currentLux: 0,
      currentTemp: 0,
      avgLux: 0,
      avgTemp: 0,
      minLux: 0,
      maxLux: 0,
      minTemp: 0,
      maxTemp: 0,
      luxTrend: 'stable',
      tempTrend: 'stable',
      luxChange: 0,
      tempChange: 0,
      lastUpdated: 0
    };
  }

  // Sort by timestamp (newest first)
  const sortedData = [...data].sort((a, b) => b.timestamp - a.timestamp);
  
  // Current values (most recent)
  const currentLux = sortedData[0].light_intensity;
  const currentTemp = sortedData[0].temperature;
  const lastUpdated = sortedData[0].timestamp;
  
  // Previous values (second most recent, if available)
  const previousLux = sortedData.length > 1 ? sortedData[1].light_intensity : currentLux;
  const previousTemp = sortedData.length > 1 ? sortedData[1].temperature : currentTemp;
  
  // Calculate trends and changes
  const luxTrend = calculateTrend(currentLux, previousLux);
  const tempTrend = calculateTrend(currentTemp, previousTemp);
  const luxChange = calculatePercentChange(currentLux, previousLux);
  const tempChange = calculatePercentChange(currentTemp, previousTemp);
  
  // Calculate averages, min, max
  let totalLux = 0;
  let totalTemp = 0;
  let minLux = Number.MAX_VALUE;
  let maxLux = Number.MIN_VALUE;
  let minTemp = Number.MAX_VALUE;
  let maxTemp = Number.MIN_VALUE;
  
  sortedData.forEach(reading => {
    totalLux += reading.light_intensity;
    totalTemp += reading.temperature;
    
    minLux = Math.min(minLux, reading.light_intensity);
    maxLux = Math.max(maxLux, reading.light_intensity);
    minTemp = Math.min(minTemp, reading.temperature);
    maxTemp = Math.max(maxTemp, reading.temperature);
  });
  
  const avgLux = Math.round(totalLux / sortedData.length);
  const avgTemp = parseFloat((totalTemp / sortedData.length).toFixed(1));
  
  return {
    currentLux,
    currentTemp,
    avgLux,
    avgTemp,
    minLux,
    maxLux,
    minTemp,
    maxTemp,
    luxTrend,
    tempTrend,
    luxChange,
    tempChange,
    lastUpdated
  };
}
