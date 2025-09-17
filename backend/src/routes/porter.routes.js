import express from "express";
import Porter from "../models/Porter.js";

const router = express.Router();

// Listar TODOS los análisis guardados (historial)
router.get("/", async (req, res) => {
  try {
    const docs = await Porter.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener Porter" });
  }
});

// Obtener uno por id
router.get("/:id", async (req, res) => {
  try {
    const doc = await Porter.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "No encontrado" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener Porter" });
  }
});

// Guardar nuevo análisis
router.post("/", async (req, res) => {
  try {
    const porter = new Porter(req.body);
    await porter.save();
    res.json(porter);
  } catch (err) {
    res.status(500).json({ error: "Error al guardar Porter" });
  }
});

// Actualizar uno por id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Porter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "No encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar Porter" });
  }
});

// Borrar uno por id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Porter.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al borrar Porter" });
  }
});

export default router;
