import { type Express } from "express";
import { createServer, type Server } from "http";
// Import storage as a named import if needed elsewhere in registerRoutes
import { storage } from "./storage"; // Mengembalikan import storage

// import predictRouter from "./routes/predict"; // Menghapus import predictRouter

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Menghapus baris ini karena predictRouter sudah tidak digunakan dari frontend
  // app.use("/api/predict", predictRouter);

  // Jika Anda punya router lain, tambahkan di sini
  // app.use("/api/another-route", anotherRouter);

  // Biarkan server berjalan tanpa router prediksi
  const httpServer = createServer(app);
  return httpServer;
}
