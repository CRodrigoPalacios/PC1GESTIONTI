import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import leanCanvasRoutes from "./routes/leanCanvas.routes.js";
import porterRoutes from "./routes/porter.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// conectar BD
connectDB();

// rutas
app.use("/api/leancanvas", leanCanvasRoutes);
app.use("/api/porter", porterRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend corriendo en puerto ${PORT}`));
