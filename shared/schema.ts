import { pgTable, text, serial, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping it from the original template)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Sensor data schema for our agricultural monitoring
export const sensorData = pgTable("sensor_data", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  light_intensity: numeric("light_intensity").notNull(),
  temperature: numeric("temperature").notNull(),
  raw_data: jsonb("raw_data"),
});

export const insertSensorDataSchema = createInsertSchema(sensorData).pick({
  light_intensity: true,
  temperature: true,
  raw_data: true,
});

export type InsertSensorData = z.infer<typeof insertSensorDataSchema>;
export type SensorData = typeof sensorData.$inferSelect;

// Zod schema for direct Firebase SensorData
export const firebaseSensorDataSchema = z.object({
  timestamp: z.number(),
  light_intensity: z.number(),
  temperature: z.number(),
  status: z.string().optional(),
});

export type FirebaseSensorData = z.infer<typeof firebaseSensorDataSchema>;
