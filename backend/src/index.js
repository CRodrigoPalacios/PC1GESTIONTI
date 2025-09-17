import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import leanCanvasRoutes from "./routes/leanCanvas.routes.js";
import porterRoutes from "./routes/porter.routes.js";

dotenv.config();
const app = express();

// ✅ Configuración de CORS
const allowedOrigins = [
  "http://localhost:5173", // Vite en desarrollo
  "http://localhost:3000", // CRA en desarrollo
  "https://pc-1-gestionti.vercel.app", // Frontend en producción (Vercel)
  "https://pc-1-gestionti.vercel.app/"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir sin origin (Postman, curl) o si está en la lista
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// 🔗 Conectar BD
connectDB();

// 📌 Rutas
app.use("/api/leancanvas", leanCanvasRoutes);
app.use("/api/porter", porterRoutes);

// 🌍 Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend corriendo en puerto ${PORT}`));
