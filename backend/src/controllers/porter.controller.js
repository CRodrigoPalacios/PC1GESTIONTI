import Porter from "../models/Porter.js";

export const createPorter = async (req, res) => {
  try {
    const porter = new Porter(req.body);
    const saved = await porter.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Error creando 5 Fuerzas de Porter", error });
  }
};

export const getPorter = async (req, res) => {
  try {
    const items = await Porter.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo 5 Fuerzas de Porter", error });
  }
};
