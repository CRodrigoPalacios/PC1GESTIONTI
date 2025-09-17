import LeanCanvas from "../models/LeanCanvas.js";

export const createLeanCanvas = async (req, res) => {
  try {
    const leanCanvas = new LeanCanvas(req.body);
    const saved = await leanCanvas.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Error creando Lean Canvas", error });
  }
};

export const getLeanCanvas = async (req, res) => {
  try {
    const items = await LeanCanvas.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo Lean Canvas", error });
  }
};

// 👇 nuevo: obtener uno
export const getLeanCanvasById = async (req, res) => {
  try {
    const item = await LeanCanvas.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "No encontrado" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo Lean Canvas", error });
  }
};

// 👇 nuevo: actualizar
export const updateLeanCanvas = async (req, res) => {
  try {
    const updated = await LeanCanvas.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "No encontrado" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error actualizando Lean Canvas", error });
  }
};

// 👇 nuevo: eliminar
export const deleteLeanCanvas = async (req, res) => {
  try {
    const deleted = await LeanCanvas.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "No encontrado" });
    res.json({ message: "Lean Canvas eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando Lean Canvas", error });
  }
};
