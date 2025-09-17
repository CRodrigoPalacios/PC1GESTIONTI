import mongoose from "mongoose";

const PorterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, 
    threatNewEntrants: { type: String, required: true },
    bargainingSuppliers: { type: String, required: true },
    bargainingCustomers: { type: String, required: true },
    threatSubstitutes: { type: String, required: true },
    competitiveRivalry: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export default mongoose.model("Porter", PorterSchema);
