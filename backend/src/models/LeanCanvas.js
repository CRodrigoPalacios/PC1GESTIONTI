import mongoose from "mongoose";

const LeanCanvasSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, 
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    keyMetrics: { type: String, required: true },
    uniqueValueProposition: { type: String, required: true },
    channels: { type: String, required: true },
    customerSegments: { type: String, required: true },
    costStructure: { type: String, required: true },
    revenueStreams: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model("LeanCanvas", LeanCanvasSchema);
