import mongoose, { Schema, Document } from "mongoose";

export type PartCategory =
  | "cpu"
  | "gpu"
  | "motherboard"
  | "ram"
  | "storage"
  | "psu"
  | "case"
  | "cooler";

const categories: PartCategory[] = [
  "cpu",
  "gpu",
  "motherboard",
  "ram",
  "storage",
  "psu",
  "case",
  "cooler",
];

export interface IPartSpecs {
  // CPU
  socket?: string; // e.g. "AM5", "LGA1700"
  tdp?: number; // Watts
  cores?: number;
  baseClock?: number; // GHz

  // GPU
  vram?: number; // GB
  powerConnector?: string; // e.g. "16-pin", "8-pin"
  length?: number; // mm (for case fit)

  // Motherboard
  formFactor?: string; // "ATX" | "mATX" | "ITX"
  memoryType?: string; // "DDR4" | "DDR5"
  memorySlots?: number;
  maxMemory?: number; // GB

  // RAM
  type?: string; // "DDR4" | "DDR5"
  speed?: number; // MHz
  capacity?: number; // GB per stick

  // Storage
  storageType?: string; // "SSD" | "HDD" | "NVMe"
  interface?: string; // "SATA" | "PCIe 4.0"

  // PSU
  wattage?: number;
  efficiency?: string; // "80+ Gold" etc.
  modular?: "full" | "semi" | "non";

  // Case
  supportedFormFactors?: string[]; // ["ATX", "mATX"]
  maxGpuLength?: number; // mm
  maxCoolerHeight?: number; // mm

  // Cooler
  height?: number; // mm
  supportedSockets?: string[];
  coolerTdp?: number; // Max TDP supported
}

export interface IPart extends Document {
  name: string;
  brand: string;
  category: PartCategory;
  price: number;
  stock: number;
  image: string;
  specs: IPartSpecs;
  rating: number;
  reviewCount: number;
}

const PartSchema = new Schema<IPart>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, enum: [...categories], required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    image: { type: String },
    specs: { type: Schema.Types.Mixed, required: true }, // flexible per category
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

PartSchema.index({ category: 1, price: 1 });
PartSchema.index({ brand: 1 });

export default mongoose.model<IPart>("Part", PartSchema);
