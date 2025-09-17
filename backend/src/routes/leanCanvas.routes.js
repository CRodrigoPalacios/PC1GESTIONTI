import express from "express";
import {
  createLeanCanvas,
  getLeanCanvas,
  getLeanCanvasById,
  updateLeanCanvas,
  deleteLeanCanvas,
} from "../controllers/leanCanvas.controller.js";

const router = express.Router();

// Crear
router.post("/", createLeanCanvas);

// Listar todos
router.get("/", getLeanCanvas);

// Obtener uno
router.get("/:id", getLeanCanvasById);

// Actualizar
router.put("/:id", updateLeanCanvas);

// Borrar
router.delete("/:id", deleteLeanCanvas);

export default router;
