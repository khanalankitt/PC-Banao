import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Part from "./models/parts.model";
import Build from "./models/builds.model";

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/pcbanao";

// ─── Parts ────────────────────────────────────────────────────────────────────

const parts = [
  // ── CPUs — AM5 ──────────────────────────────────────────────────────────────
  {
    name: "Ryzen 9 7950X",
    brand: "AMD",
    category: "cpu",
    price: 699,
    stock: 14,
    image: "",
    specs: { cores: 16, socket: "AM5", tdp: 170, baseClock: 4.5 },
  },
  {
    name: "Ryzen 9 7900X",
    brand: "AMD",
    category: "cpu",
    price: 449,
    stock: 10,
    image: "",
    specs: { cores: 12, socket: "AM5", tdp: 170, baseClock: 4.7 },
  },
  {
    name: "Ryzen 7 7700X",
    brand: "AMD",
    category: "cpu",
    price: 299,
    stock: 18,
    image: "",
    specs: { cores: 8, socket: "AM5", tdp: 105, baseClock: 4.5 },
  },
  {
    name: "Ryzen 5 7600X",
    brand: "AMD",
    category: "cpu",
    price: 249,
    stock: 22,
    image: "",
    specs: { cores: 6, socket: "AM5", tdp: 105, baseClock: 4.7 },
  },
  {
    name: "Ryzen 5 7600",
    brand: "AMD",
    category: "cpu",
    price: 199,
    stock: 30,
    image: "",
    specs: { cores: 6, socket: "AM5", tdp: 65, baseClock: 3.8 },
  },
  {
    name: "Ryzen 9 7950X3D",
    brand: "AMD",
    category: "cpu",
    price: 699,
    stock: 8,
    image: "",
    specs: { cores: 16, socket: "AM5", tdp: 120, baseClock: 4.2 },
  },
  {
    name: "Ryzen 7 7800X3D",
    brand: "AMD",
    category: "cpu",
    price: 449,
    stock: 12,
    image: "",
    specs: { cores: 8, socket: "AM5", tdp: 120, baseClock: 4.5 },
  },

  // ── CPUs — AM4 ──────────────────────────────────────────────────────────────
  {
    name: "Ryzen 9 5950X",
    brand: "AMD",
    category: "cpu",
    price: 349,
    stock: 9,
    image: "",
    specs: { cores: 16, socket: "AM4", tdp: 105, baseClock: 3.4 },
  },
  {
    name: "Ryzen 7 5800X3D",
    brand: "AMD",
    category: "cpu",
    price: 299,
    stock: 15,
    image: "",
    specs: { cores: 8, socket: "AM4", tdp: 105, baseClock: 3.4 },
  },
  {
    name: "Ryzen 5 5600X",
    brand: "AMD",
    category: "cpu",
    price: 149,
    stock: 35,
    image: "",
    specs: { cores: 6, socket: "AM4", tdp: 65, baseClock: 3.7 },
  },

  // ── CPUs — LGA1700 ──────────────────────────────────────────────────────────
  {
    name: "Core i9-13900K",
    brand: "Intel",
    category: "cpu",
    price: 589,
    stock: 9,
    image: "",
    specs: { cores: 24, socket: "LGA1700", tdp: 125, baseClock: 3.0 },
  },
  {
    name: "Core i9-13900KS",
    brand: "Intel",
    category: "cpu",
    price: 699,
    stock: 5,
    image: "",
    specs: { cores: 24, socket: "LGA1700", tdp: 150, baseClock: 3.2 },
  },
  {
    name: "Core i7-13700K",
    brand: "Intel",
    category: "cpu",
    price: 409,
    stock: 14,
    image: "",
    specs: { cores: 16, socket: "LGA1700", tdp: 125, baseClock: 3.4 },
  },
  {
    name: "Core i5-13600K",
    brand: "Intel",
    category: "cpu",
    price: 299,
    stock: 20,
    image: "",
    specs: { cores: 14, socket: "LGA1700", tdp: 125, baseClock: 3.5 },
  },
  {
    name: "Core i5-13400F",
    brand: "Intel",
    category: "cpu",
    price: 179,
    stock: 28,
    image: "",
    specs: { cores: 10, socket: "LGA1700", tdp: 65, baseClock: 2.5 },
  },
  {
    name: "Core i3-13100F",
    brand: "Intel",
    category: "cpu",
    price: 99,
    stock: 40,
    image: "",
    specs: { cores: 4, socket: "LGA1700", tdp: 58, baseClock: 3.4 },
  },

  // ── CPUs — LGA1200 (older, for incompatibility testing) ─────────────────────
  {
    name: "Core i9-11900K",
    brand: "Intel",
    category: "cpu",
    price: 189,
    stock: 7,
    image: "",
    specs: { cores: 8, socket: "LGA1200", tdp: 125, baseClock: 3.5 },
  },
  {
    name: "Core i7-11700K",
    brand: "Intel",
    category: "cpu",
    price: 149,
    stock: 10,
    image: "",
    specs: { cores: 8, socket: "LGA1200", tdp: 125, baseClock: 3.6 },
  },

  // ── GPUs — NVIDIA ────────────────────────────────────────────────────────────
  {
    name: "GeForce RTX 4090",
    brand: "NVIDIA",
    category: "gpu",
    price: 1599,
    stock: 4,
    image: "",
    specs: { vram: 24, tdp: 450, length: 336 },
  },
  {
    name: "GeForce RTX 4080 Super",
    brand: "NVIDIA",
    category: "gpu",
    price: 999,
    stock: 6,
    image: "",
    specs: { vram: 16, tdp: 320, length: 310 },
  },
  {
    name: "GeForce RTX 4080",
    brand: "NVIDIA",
    category: "gpu",
    price: 1199,
    stock: 5,
    image: "",
    specs: { vram: 16, tdp: 320, length: 336 },
  },
  {
    name: "GeForce RTX 4070 Ti Super",
    brand: "NVIDIA",
    category: "gpu",
    price: 799,
    stock: 9,
    image: "",
    specs: { vram: 16, tdp: 285, length: 285 },
  },
  {
    name: "GeForce RTX 4070 Ti",
    brand: "NVIDIA",
    category: "gpu",
    price: 799,
    stock: 11,
    image: "",
    specs: { vram: 12, tdp: 285, length: 285 },
  },
  {
    name: "GeForce RTX 4070 Super",
    brand: "NVIDIA",
    category: "gpu",
    price: 599,
    stock: 14,
    image: "",
    specs: { vram: 12, tdp: 220, length: 267 },
  },
  {
    name: "GeForce RTX 4070",
    brand: "NVIDIA",
    category: "gpu",
    price: 599,
    stock: 14,
    image: "",
    specs: { vram: 12, tdp: 200, length: 244 },
  },
  {
    name: "GeForce RTX 4060 Ti",
    brand: "NVIDIA",
    category: "gpu",
    price: 399,
    stock: 18,
    image: "",
    specs: { vram: 8, tdp: 165, length: 240 },
  },
  {
    name: "GeForce RTX 4060",
    brand: "NVIDIA",
    category: "gpu",
    price: 299,
    stock: 24,
    image: "",
    specs: { vram: 8, tdp: 115, length: 240 },
  },
  {
    name: "GeForce RTX 3090 Ti",
    brand: "NVIDIA",
    category: "gpu",
    price: 799,
    stock: 5,
    image: "",
    specs: { vram: 24, tdp: 450, length: 336 },
  },
  {
    name: "GeForce RTX 3060",
    brand: "NVIDIA",
    category: "gpu",
    price: 259,
    stock: 20,
    image: "",
    specs: { vram: 12, tdp: 170, length: 242 },
  },

  // ── GPUs — AMD ───────────────────────────────────────────────────────────────
  {
    name: "Radeon RX 7900 XTX",
    brand: "AMD",
    category: "gpu",
    price: 999,
    stock: 7,
    image: "",
    specs: { vram: 24, tdp: 355, length: 287 },
  },
  {
    name: "Radeon RX 7900 XT",
    brand: "AMD",
    category: "gpu",
    price: 799,
    stock: 9,
    image: "",
    specs: { vram: 20, tdp: 315, length: 276 },
  },
  {
    name: "Radeon RX 7800 XT",
    brand: "AMD",
    category: "gpu",
    price: 499,
    stock: 12,
    image: "",
    specs: { vram: 16, tdp: 263, length: 267 },
  },
  {
    name: "Radeon RX 7700 XT",
    brand: "AMD",
    category: "gpu",
    price: 449,
    stock: 15,
    image: "",
    specs: { vram: 12, tdp: 245, length: 267 },
  },
  {
    name: "Radeon RX 7600",
    brand: "AMD",
    category: "gpu",
    price: 269,
    stock: 22,
    image: "",
    specs: { vram: 8, tdp: 165, length: 220 },
  },
  {
    name: "Radeon RX 6700 XT",
    brand: "AMD",
    category: "gpu",
    price: 299,
    stock: 18,
    image: "",
    specs: { vram: 12, tdp: 230, length: 267 },
  },

  // ── Motherboards — AM5 DDR5 ──────────────────────────────────────────────────
  {
    name: "ROG Crosshair X670E Hero",
    brand: "ASUS",
    category: "motherboard",
    price: 629,
    stock: 6,
    image: "",
    specs: {
      socket: "AM5",
      formFactor: "ATX",
      memoryType: "DDR5",
      memorySlots: 4,
      maxMemory: 128,
    },
  },
  {
    name: "ROG Strix X670E-F",
    brand: "ASUS",
    category: "motherboard",
    price: 399,
    stock: 9,
    image: "",
    specs: {
      socket: "AM5",
      formFactor: "ATX",
      memoryType: "DDR5",
      memorySlots: 4,
      maxMemory: 128,
    },
  },
  {
    name: "MPG X670E Carbon WiFi",
    brand: "MSI",
    category: "motherboard",
    price: 499,
    stock: 8,
    image: "",
    specs: {
      socket: "AM5",
      formFactor: "ATX",
      memoryType: "DDR5",
      memorySlots: 4,
      maxMemory: 128,
    },
  },
  {
    name: "B650 Steel Legend WiFi",
    brand: "ASRock",
    category: "motherboard",
    price: 239,
    stock: 14,
    image: "",
    specs: {
      socket: "AM5",
      formFactor: "ATX",
      memoryType: "DDR5",
      memorySlots: 4,
      maxMemory: 128,
    },
  },
  {
    name: "MAG B650M Mortar WiFi",
    brand: "MSI",
    category: "motherboard",
    price: 199,
    stock: 16,
    image: "",
    specs: {
      socket: "AM5",
      formFactor: "mATX",
      memoryType: "DDR5",
      memorySlots: 4,
      maxMemory: 128,
    },
  },
  {
    name: "ROG Strix B650E-I",
    brand: "ASUS",
    category: "motherboard",
    price: 269,
    stock: 10,
    image: "",
    specs: {
      socket: "AM5",
      formFactor: "ITX",
      memoryType: "DDR5",
      memorySlots: 2,
      maxMemory: 64,
    },
  },

  // ── Motherboards — AM4 DDR4 ──────────────────────────────────────────────────
  {
    name: "ROG Crosshair VIII Hero",
    brand: "ASUS",
    category: "motherboard",
    price: 299,
    stock: 8,
    image: "",
    specs: {
      socket: "AM4",
      formFactor: "ATX",
      memoryType: "DDR4",
      memorySlots: 4,
      maxMemory: 128,
    },
  },
  {
    name: "MAG B550 Tomahawk",
    brand: "MSI",
    category: "motherboard",
    price: 159,
    stock: 18,
    image: "",
    specs: {
      socket: "AM4",
      formFactor: "ATX",
      memoryType: "DDR4",
      memorySlots: 4,
      maxMemory: 128,
    },
  },
  {
    name: "B450M DS3H",
    brand: "Gigabyte",
    category: "motherboard",
    price: 89,
    stock: 25,
    image: "",
    specs: {
      socket: "AM4",
      formFactor: "mATX",
      memoryType: "DDR4",
      memorySlots: 4,
      maxMemory: 128,
    },
  },

  // ── Motherboards — LGA1700 DDR5 ──────────────────────────────────────────────
  {
    name: "MPG Z790 Carbon WiFi",
    brand: "MSI",
    category: "motherboard",
    price: 469,
    stock: 8,
    image: "",
    specs: {
      socket: "LGA1700",
      formFactor: "ATX",
      memoryType: "DDR5",
      memorySlots: 4,
      maxMemory: 192,
    },
  },
  {
    name: "ROG Maximus Z790 Hero",
    brand: "ASUS",
    category: "motherboard",
    price: 699,
    stock: 4,
    image: "",
    specs: {
      socket: "LGA1700",
      formFactor: "ATX",
      memoryType: "DDR5",
      memorySlots: 4,
      maxMemory: 192,
    },
  },
  {
    name: "Z790 Aorus Elite AX",
    brand: "Gigabyte",
    category: "motherboard",
    price: 299,
    stock: 12,
    image: "",
    specs: {
      socket: "LGA1700",
      formFactor: "ATX",
      memoryType: "DDR5",
      memorySlots: 4,
      maxMemory: 192,
    },
  },
  {
    name: "PRO Z790-A WiFi",
    brand: "MSI",
    category: "motherboard",
    price: 249,
    stock: 14,
    image: "",
    specs: {
      socket: "LGA1700",
      formFactor: "ATX",
      memoryType: "DDR5",
      memorySlots: 4,
      maxMemory: 192,
    },
  },

  // ── Motherboards — LGA1700 DDR4 ──────────────────────────────────────────────
  {
    name: "TUF Gaming Z690-Plus WiFi",
    brand: "ASUS",
    category: "motherboard",
    price: 219,
    stock: 11,
    image: "",
    specs: {
      socket: "LGA1700",
      formFactor: "ATX",
      memoryType: "DDR4",
      memorySlots: 4,
      maxMemory: 128,
    },
  },
  {
    name: "MAG B660M Mortar DDR4",
    brand: "MSI",
    category: "motherboard",
    price: 149,
    stock: 20,
    image: "",
    specs: {
      socket: "LGA1700",
      formFactor: "mATX",
      memoryType: "DDR4",
      memorySlots: 4,
      maxMemory: 128,
    },
  },

  // ── Motherboards — LGA1200 (legacy, for incompatibility testing) ─────────────
  {
    name: "ROG Strix Z590-E",
    brand: "ASUS",
    category: "motherboard",
    price: 179,
    stock: 7,
    image: "",
    specs: {
      socket: "LGA1200",
      formFactor: "ATX",
      memoryType: "DDR4",
      memorySlots: 4,
      maxMemory: 128,
    },
  },
  {
    name: "MAG B560M Mortar",
    brand: "MSI",
    category: "motherboard",
    price: 119,
    stock: 12,
    image: "",
    specs: {
      socket: "LGA1200",
      formFactor: "mATX",
      memoryType: "DDR4",
      memorySlots: 4,
      maxMemory: 128,
    },
  },

  // ── RAM — DDR5 ───────────────────────────────────────────────────────────────
  {
    name: "Trident Z5 RGB 32 GB DDR5-6000",
    brand: "G.Skill",
    category: "ram",
    price: 129,
    stock: 20,
    image: "",
    specs: { type: "DDR5", speed: 6000, capacity: 16 },
  },
  {
    name: "Trident Z5 RGB 64 GB DDR5-6000",
    brand: "G.Skill",
    category: "ram",
    price: 219,
    stock: 14,
    image: "",
    specs: { type: "DDR5", speed: 6000, capacity: 32 },
  },
  {
    name: "Vengeance DDR5-5600 32 GB",
    brand: "Corsair",
    category: "ram",
    price: 109,
    stock: 28,
    image: "",
    specs: { type: "DDR5", speed: 5600, capacity: 16 },
  },
  {
    name: "Vengeance DDR5-6200 32 GB",
    brand: "Corsair",
    category: "ram",
    price: 129,
    stock: 24,
    image: "",
    specs: { type: "DDR5", speed: 6200, capacity: 16 },
  },
  {
    name: "Fury Beast DDR5-5600 16 GB",
    brand: "Kingston",
    category: "ram",
    price: 69,
    stock: 40,
    image: "",
    specs: { type: "DDR5", speed: 5600, capacity: 8 },
  },
  {
    name: "Dominator Platinum DDR5-6000 64GB",
    brand: "Corsair",
    category: "ram",
    price: 289,
    stock: 8,
    image: "",
    specs: { type: "DDR5", speed: 6000, capacity: 32 },
  },

  // ── RAM — DDR4 ───────────────────────────────────────────────────────────────
  {
    name: "Ripjaws V 32 GB DDR4-3600",
    brand: "G.Skill",
    category: "ram",
    price: 79,
    stock: 30,
    image: "",
    specs: { type: "DDR4", speed: 3600, capacity: 16 },
  },
  {
    name: "Ripjaws V 16 GB DDR4-3200",
    brand: "G.Skill",
    category: "ram",
    price: 45,
    stock: 45,
    image: "",
    specs: { type: "DDR4", speed: 3200, capacity: 8 },
  },
  {
    name: "Vengeance LPX 32 GB DDR4-3200",
    brand: "Corsair",
    category: "ram",
    price: 69,
    stock: 35,
    image: "",
    specs: { type: "DDR4", speed: 3200, capacity: 16 },
  },
  {
    name: "Vengeance LPX 16 GB DDR4-2666",
    brand: "Corsair",
    category: "ram",
    price: 39,
    stock: 50,
    image: "",
    specs: { type: "DDR4", speed: 2666, capacity: 8 },
  },
  {
    name: "Fury Beast DDR4-3600 16 GB",
    brand: "Kingston",
    category: "ram",
    price: 49,
    stock: 40,
    image: "",
    specs: { type: "DDR4", speed: 3600, capacity: 8 },
  },
  {
    name: "Crucial Ballistix 32 GB DDR4",
    brand: "Crucial",
    category: "ram",
    price: 74,
    stock: 28,
    image: "",
    specs: { type: "DDR4", speed: 3600, capacity: 16 },
  },

  // ── Storage ──────────────────────────────────────────────────────────────────
  {
    name: "990 Pro 2 TB NVMe",
    brand: "Samsung",
    category: "storage",
    price: 179,
    stock: 25,
    image: "",
    specs: { storageType: "NVMe", interface: "PCIe 4.0" },
  },
  {
    name: "990 Pro 1 TB NVMe",
    brand: "Samsung",
    category: "storage",
    price: 99,
    stock: 35,
    image: "",
    specs: { storageType: "NVMe", interface: "PCIe 4.0" },
  },
  {
    name: "980 Pro 2 TB NVMe",
    brand: "Samsung",
    category: "storage",
    price: 149,
    stock: 20,
    image: "",
    specs: { storageType: "NVMe", interface: "PCIe 4.0" },
  },
  {
    name: "FireCuda 530 4 TB",
    brand: "Seagate",
    category: "storage",
    price: 329,
    stock: 12,
    image: "",
    specs: { storageType: "NVMe", interface: "PCIe 4.0" },
  },
  {
    name: "FireCuda 530 2 TB",
    brand: "Seagate",
    category: "storage",
    price: 189,
    stock: 18,
    image: "",
    specs: { storageType: "NVMe", interface: "PCIe 4.0" },
  },
  {
    name: "WD Black SN850X 2 TB",
    brand: "WD",
    category: "storage",
    price: 149,
    stock: 22,
    image: "",
    specs: { storageType: "NVMe", interface: "PCIe 4.0" },
  },
  {
    name: "WD Black SN850X 1 TB",
    brand: "WD",
    category: "storage",
    price: 89,
    stock: 33,
    image: "",
    specs: { storageType: "NVMe", interface: "PCIe 4.0" },
  },
  {
    name: "WD Blue SN580 1 TB",
    brand: "WD",
    category: "storage",
    price: 59,
    stock: 50,
    image: "",
    specs: { storageType: "NVMe", interface: "PCIe 4.0" },
  },
  {
    name: "Barracuda 4 TB HDD",
    brand: "Seagate",
    category: "storage",
    price: 79,
    stock: 30,
    image: "",
    specs: { storageType: "HDD", interface: "SATA" },
  },
  {
    name: "WD Blue 2 TB HDD",
    brand: "WD",
    category: "storage",
    price: 49,
    stock: 40,
    image: "",
    specs: { storageType: "HDD", interface: "SATA" },
  },
  {
    name: "MX500 1 TB SATA SSD",
    brand: "Crucial",
    category: "storage",
    price: 69,
    stock: 35,
    image: "",
    specs: { storageType: "SSD", interface: "SATA" },
  },

  // ── PSUs ─────────────────────────────────────────────────────────────────────
  {
    name: "HX1200 Platinum 1200W",
    brand: "Corsair",
    category: "psu",
    price: 229,
    stock: 9,
    image: "",
    specs: { wattage: 1200, efficiency: "80+ Platinum", modular: "full" },
  },
  {
    name: "HX1000 Platinum 1000W",
    brand: "Corsair",
    category: "psu",
    price: 189,
    stock: 12,
    image: "",
    specs: { wattage: 1000, efficiency: "80+ Platinum", modular: "full" },
  },
  {
    name: "RM1000x 1000W",
    brand: "Corsair",
    category: "psu",
    price: 169,
    stock: 14,
    image: "",
    specs: { wattage: 1000, efficiency: "80+ Gold", modular: "full" },
  },
  {
    name: "FOCUS GX-850 850W",
    brand: "Seasonic",
    category: "psu",
    price: 149,
    stock: 15,
    image: "",
    specs: { wattage: 850, efficiency: "80+ Gold", modular: "full" },
  },
  {
    name: "FOCUS GX-750 750W",
    brand: "Seasonic",
    category: "psu",
    price: 129,
    stock: 18,
    image: "",
    specs: { wattage: 750, efficiency: "80+ Gold", modular: "full" },
  },
  {
    name: "RM750x 750W",
    brand: "Corsair",
    category: "psu",
    price: 129,
    stock: 20,
    image: "",
    specs: { wattage: 750, efficiency: "80+ Gold", modular: "full" },
  },
  {
    name: "RM650 650W",
    brand: "Corsair",
    category: "psu",
    price: 99,
    stock: 25,
    image: "",
    specs: { wattage: 650, efficiency: "80+ Gold", modular: "full" },
  },
  {
    name: "SuperNOVA 650 G6",
    brand: "EVGA",
    category: "psu",
    price: 89,
    stock: 22,
    image: "",
    specs: { wattage: 650, efficiency: "80+ Gold", modular: "full" },
  },
  {
    name: "CX550 Bronze 550W",
    brand: "Corsair",
    category: "psu",
    price: 69,
    stock: 30,
    image: "",
    specs: { wattage: 550, efficiency: "80+ Bronze", modular: "semi" },
  },
  {
    name: "CSM 450W Bronze",
    brand: "Corsair",
    category: "psu",
    price: 49,
    stock: 35,
    image: "",
    specs: { wattage: 450, efficiency: "80+ Bronze", modular: "non" },
  },

  // ── Cases ────────────────────────────────────────────────────────────────────
  {
    name: "Lian Li O11D EVO RGB",
    brand: "Lian Li",
    category: "case",
    price: 179,
    stock: 5,
    image: "",
    specs: {
      formFactor: "Mid Tower",
      supportedFormFactors: ["ATX", "mATX", "ITX"],
      maxGpuLength: 420,
      maxCoolerHeight: 167,
    },
  },
  {
    name: "Lian Li O11D Mini",
    brand: "Lian Li",
    category: "case",
    price: 99,
    stock: 8,
    image: "",
    specs: {
      formFactor: "Mid Tower",
      supportedFormFactors: ["mATX", "ITX"],
      maxGpuLength: 360,
      maxCoolerHeight: 155,
    },
  },
  {
    name: "H9 Flow Mid Tower",
    brand: "NZXT",
    category: "case",
    price: 129,
    stock: 8,
    image: "",
    specs: {
      formFactor: "Mid Tower",
      supportedFormFactors: ["ATX", "mATX", "ITX"],
      maxGpuLength: 400,
      maxCoolerHeight: 185,
    },
  },
  {
    name: "H7 Flow",
    brand: "NZXT",
    category: "case",
    price: 109,
    stock: 10,
    image: "",
    specs: {
      formFactor: "Mid Tower",
      supportedFormFactors: ["ATX", "mATX"],
      maxGpuLength: 400,
      maxCoolerHeight: 185,
    },
  },
  {
    name: "H510 Compact",
    brand: "NZXT",
    category: "case",
    price: 69,
    stock: 15,
    image: "",
    specs: {
      formFactor: "Mid Tower",
      supportedFormFactors: ["ATX", "mATX"],
      maxGpuLength: 325,
      maxCoolerHeight: 165,
    },
  },
  {
    name: "Define 7",
    brand: "Fractal",
    category: "case",
    price: 169,
    stock: 7,
    image: "",
    specs: {
      formFactor: "Full Tower",
      supportedFormFactors: ["ATX", "mATX", "ITX"],
      maxGpuLength: 491,
      maxCoolerHeight: 185,
    },
  },
  {
    name: "Define 7 Compact",
    brand: "Fractal",
    category: "case",
    price: 109,
    stock: 11,
    image: "",
    specs: {
      formFactor: "Mid Tower",
      supportedFormFactors: ["ATX", "mATX", "ITX"],
      maxGpuLength: 360,
      maxCoolerHeight: 170,
    },
  },
  {
    name: "Meshify 2",
    brand: "Fractal",
    category: "case",
    price: 149,
    stock: 9,
    image: "",
    specs: {
      formFactor: "Mid Tower",
      supportedFormFactors: ["ATX", "mATX", "ITX"],
      maxGpuLength: 461,
      maxCoolerHeight: 185,
    },
  },
  {
    name: "Torrent Compact",
    brand: "Fractal",
    category: "case",
    price: 129,
    stock: 8,
    image: "",
    specs: {
      formFactor: "Mid Tower",
      supportedFormFactors: ["ATX", "mATX"],
      maxGpuLength: 340,
      maxCoolerHeight: 175,
    },
  },
  // ITX-only case (causes form-factor issues with ATX boards)
  {
    name: "Dan A4-SFX",
    brand: "Dan Cases",
    category: "case",
    price: 189,
    stock: 4,
    image: "",
    specs: {
      formFactor: "ITX",
      supportedFormFactors: ["ITX"],
      maxGpuLength: 295,
      maxCoolerHeight: 52,
    },
  },

  // ── Coolers ──────────────────────────────────────────────────────────────────
  {
    name: "Kraken Elite 360 AIO",
    brand: "NZXT",
    category: "cooler",
    price: 269,
    stock: 3,
    image: "",
    specs: {
      height: 27,
      supportedSockets: ["AM5", "AM4", "LGA1700"],
      coolerTdp: 400,
    },
  },
  {
    name: "Kraken Z53 240 AIO",
    brand: "NZXT",
    category: "cooler",
    price: 149,
    stock: 8,
    image: "",
    specs: {
      height: 27,
      supportedSockets: ["AM5", "AM4", "LGA1700"],
      coolerTdp: 280,
    },
  },
  {
    name: "Hydro H150i Elite",
    brand: "Corsair",
    category: "cooler",
    price: 199,
    stock: 6,
    image: "",
    specs: {
      height: 27,
      supportedSockets: ["AM5", "AM4", "LGA1700"],
      coolerTdp: 350,
    },
  },
  {
    name: "Hydro H100i Elite",
    brand: "Corsair",
    category: "cooler",
    price: 139,
    stock: 10,
    image: "",
    specs: {
      height: 27,
      supportedSockets: ["AM5", "AM4", "LGA1700"],
      coolerTdp: 250,
    },
  },
  {
    name: "NH-D15 Air Cooler",
    brand: "Noctua",
    category: "cooler",
    price: 109,
    stock: 17,
    image: "",
    specs: {
      height: 165,
      supportedSockets: ["AM5", "AM4", "LGA1700"],
      coolerTdp: 250,
    },
  },
  {
    name: "NH-U12S Redux",
    brand: "Noctua",
    category: "cooler",
    price: 59,
    stock: 24,
    image: "",
    specs: {
      height: 158,
      supportedSockets: ["AM5", "AM4", "LGA1700"],
      coolerTdp: 190,
    },
  },
  {
    name: "Arctic Freezer 36",
    brand: "Arctic",
    category: "cooler",
    price: 49,
    stock: 28,
    image: "",
    specs: {
      height: 157,
      supportedSockets: ["AM5", "AM4", "LGA1700"],
      coolerTdp: 200,
    },
  },
  {
    name: "Arctic Freezer 34 eSports",
    brand: "Arctic",
    category: "cooler",
    price: 34,
    stock: 35,
    image: "",
    specs: {
      height: 157,
      supportedSockets: ["AM4", "LGA1700"],
      coolerTdp: 200,
    },
  },
  {
    name: "Be Quiet! Dark Rock Pro 4",
    brand: "be quiet!",
    category: "cooler",
    price: 89,
    stock: 14,
    image: "",
    specs: {
      height: 162,
      supportedSockets: ["AM5", "AM4", "LGA1700"],
      coolerTdp: 250,
    },
  },
  {
    name: "Hyper 212 Black Edition",
    brand: "Cooler Master",
    category: "cooler",
    price: 34,
    stock: 40,
    image: "",
    specs: {
      height: 158,
      supportedSockets: ["AM4", "LGA1700"],
      coolerTdp: 150,
    },
  },
  // AM5-only cooler (causes socket issues with LGA1700/AM4 CPUs)
  {
    name: "Thermalright Phantom Spirit 120 SE",
    brand: "Thermalright",
    category: "cooler",
    price: 29,
    stock: 30,
    image: "",
    specs: { height: 157, supportedSockets: ["AM5"], coolerTdp: 220 },
  },
  // Tiny cooler — insufficient TDP for high-end CPUs
  {
    name: "AMD Wraith Stealth",
    brand: "AMD",
    category: "cooler",
    price: 0,
    stock: 99,
    image: "",
    specs: { height: 54, supportedSockets: ["AM4"], coolerTdp: 65 },
  },
];

// ─── Build definitions ────────────────────────────────────────────────────────
// Each entry is a recipe; we look parts up by name after insertion.

interface BuildRecipe {
  name: string;
  isPublic: boolean;
  cpu: string;
  gpu?: string;
  motherboard: string;
  ram: string[];
  storage: string[];
  psu?: string;
  case?: string;
  cooler?: string;
}

const buildRecipes: BuildRecipe[] = [
  // ── 1. Compatible — flagship AM5 workstation ─────────────────────────────────
  {
    name: "Ryzen Titan Workstation",
    isPublic: true,
    cpu: "Ryzen 9 7950X",
    gpu: "GeForce RTX 4090",
    motherboard: "ROG Crosshair X670E Hero",
    ram: ["Trident Z5 RGB 64 GB DDR5-6000", "Trident Z5 RGB 64 GB DDR5-6000"],
    storage: ["990 Pro 2 TB NVMe", "FireCuda 530 4 TB"],
    psu: "HX1200 Platinum 1200W",
    case: "Define 7",
    cooler: "Kraken Elite 360 AIO",
  },
  // ── 2. Compatible — mid-range Intel gaming build ─────────────────────────────
  {
    name: "Intel Mid-Range Gaming Rig",
    isPublic: true,
    cpu: "Core i5-13600K",
    gpu: "GeForce RTX 4070 Super",
    motherboard: "MPG Z790 Carbon WiFi",
    ram: ["Vengeance DDR5-5600 32 GB", "Vengeance DDR5-5600 32 GB"],
    storage: ["WD Black SN850X 1 TB", "WD Blue 2 TB HDD"],
    psu: "FOCUS GX-750 750W",
    case: "H9 Flow Mid Tower",
    cooler: "Arctic Freezer 36",
  },
  // ── 3. Compatible — budget AMD build ─────────────────────────────────────────
  {
    name: "Budget AM4 Starter",
    isPublic: true,
    cpu: "Ryzen 5 5600X",
    gpu: "Radeon RX 6700 XT",
    motherboard: "MAG B550 Tomahawk",
    ram: ["Ripjaws V 16 GB DDR4-3200", "Ripjaws V 16 GB DDR4-3200"],
    storage: ["WD Black SN850X 1 TB"],
    psu: "RM650 650W",
    case: "Define 7 Compact",
    cooler: "Arctic Freezer 34 eSports",
  },
  // ── 4. Compatible — silent workstation ───────────────────────────────────────
  {
    name: "Silent Noctua Fortress",
    isPublic: true,
    cpu: "Ryzen 7 7700X",
    gpu: "Radeon RX 7800 XT",
    motherboard: "B650 Steel Legend WiFi",
    ram: ["Trident Z5 RGB 32 GB DDR5-6000", "Trident Z5 RGB 32 GB DDR5-6000"],
    storage: ["990 Pro 1 TB NVMe", "Barracuda 4 TB HDD"],
    psu: "FOCUS GX-850 850W",
    case: "Meshify 2",
    cooler: "NH-D15 Air Cooler",
  },
  // ── 5. Compatible — content creator Intel ────────────────────────────────────
  {
    name: "Content Creator Pro",
    isPublic: true,
    cpu: "Core i9-13900K",
    gpu: "GeForce RTX 4080",
    motherboard: "ROG Maximus Z790 Hero",
    ram: [
      "Dominator Platinum DDR5-6000 64GB",
      "Dominator Platinum DDR5-6000 64GB",
    ],
    storage: ["FireCuda 530 2 TB", "990 Pro 2 TB NVMe"],
    psu: "HX1000 Platinum 1000W",
    case: "Lian Li O11D EVO RGB",
    cooler: "Hydro H150i Elite",
  },
  // ── 6. Compatible — 4K gaming beast ──────────────────────────────────────────
  {
    name: "4K Gaming Beast",
    isPublic: true,
    cpu: "Ryzen 7 7800X3D",
    gpu: "Radeon RX 7900 XTX",
    motherboard: "MPG X670E Carbon WiFi",
    ram: ["Vengeance DDR5-6200 32 GB", "Vengeance DDR5-6200 32 GB"],
    storage: ["WD Black SN850X 2 TB"],
    psu: "RM1000x 1000W",
    case: "H9 Flow Mid Tower",
    cooler: "Hydro H100i Elite",
  },
  // ── 7. Compatible — mini ITX Intel build ─────────────────────────────────────
  {
    name: "Compact ITX Powerhouse",
    isPublic: true,
    cpu: "Core i7-13700K",
    gpu: "GeForce RTX 4070",
    motherboard: "ROG Strix B650E-I",
    ram: ["Fury Beast DDR5-5600 16 GB", "Fury Beast DDR5-5600 16 GB"],
    storage: ["980 Pro 2 TB NVMe"],
    psu: "SuperNOVA 650 G6",
    cooler: "NH-U12S Redux",
  },
  // ── 8. Compatible — budget Intel office build ─────────────────────────────────
  {
    name: "Office Workhorse",
    isPublic: true,
    cpu: "Core i3-13100F",
    gpu: "GeForce RTX 4060",
    motherboard: "MAG B660M Mortar DDR4",
    ram: ["Vengeance LPX 16 GB DDR4-2666", "Vengeance LPX 16 GB DDR4-2666"],
    storage: ["MX500 1 TB SATA SSD"],
    psu: "CX550 Bronze 550W",
    case: "H510 Compact",
    cooler: "Hyper 212 Black Edition",
  },
  // ── 9. Compatible — AMD 3D V-Cache gaming ───────────────────────────────────
  {
    name: "AMD 3D V-Cache Gaming",
    isPublic: true,
    cpu: "Ryzen 9 7950X3D",
    gpu: "GeForce RTX 4080 Super",
    motherboard: "ROG Strix X670E-F",
    ram: ["Trident Z5 RGB 32 GB DDR5-6000", "Trident Z5 RGB 32 GB DDR5-6000"],
    storage: ["990 Pro 2 TB NVMe"],
    psu: "HX1000 Platinum 1000W",
    case: "Torrent Compact",
    cooler: "Kraken Z53 240 AIO",
  },
  // ── 10. Compatible — AMD budget mATX ────────────────────────────────────────
  {
    name: "AM5 Budget mATX Build",
    isPublic: true,
    cpu: "Ryzen 5 7600",
    gpu: "Radeon RX 7600",
    motherboard: "MAG B650M Mortar WiFi",
    ram: ["Fury Beast DDR5-5600 16 GB", "Fury Beast DDR5-5600 16 GB"],
    storage: ["WD Blue SN580 1 TB"],
    psu: "RM650 650W",
    case: "H7 Flow",
    cooler: "Arctic Freezer 36",
  },

  // ── 11. INCOMPATIBLE — AM5 CPU + AM4 motherboard (socket mismatch) ───────────
  {
    name: "Socket Mismatch Disaster",
    isPublic: true,
    cpu: "Ryzen 9 7950X", // AM5
    gpu: "GeForce RTX 4070 Ti",
    motherboard: "MAG B550 Tomahawk", // AM4 — MISMATCH
    ram: ["Ripjaws V 32 GB DDR4-3600", "Ripjaws V 32 GB DDR4-3600"],
    storage: ["990 Pro 1 TB NVMe"],
    psu: "FOCUS GX-850 850W",
    case: "Define 7 Compact",
    cooler: "NH-D15 Air Cooler",
  },
  // ── 12. INCOMPATIBLE — DDR5 RAM in DDR4 motherboard ─────────────────────────
  {
    name: "DDR5 in DDR4 Board",
    isPublic: true,
    cpu: "Core i5-13400F",
    gpu: "GeForce RTX 4060 Ti",
    motherboard: "MAG B660M Mortar DDR4", // DDR4 board
    ram: ["Vengeance DDR5-5600 32 GB"], // DDR5 RAM — MISMATCH
    storage: ["WD Black SN850X 1 TB"],
    psu: "RM750x 750W",
    case: "H510 Compact",
    cooler: "Arctic Freezer 34 eSports",
  },
  // ── 13. INCOMPATIBLE — PSU way too small for RTX 4090 + 13900K ───────────────
  {
    name: "Underpowered Powerhouse",
    isPublic: true,
    cpu: "Core i9-13900KS", // 150W TDP
    gpu: "GeForce RTX 4090", // 450W TDP  → ~650W draw total
    motherboard: "MPG Z790 Carbon WiFi",
    ram: ["Vengeance DDR5-5600 32 GB", "Vengeance DDR5-5600 32 GB"],
    storage: ["990 Pro 2 TB NVMe"],
    psu: "CSM 450W Bronze", // ONLY 450W — way too small
    case: "Define 7",
    cooler: "Hydro H150i Elite",
  },
  // ── 14. INCOMPATIBLE — ATX board in ITX-only case ────────────────────────────
  {
    name: "Big Board Tiny Box",
    isPublic: true,
    cpu: "Ryzen 7 7700X",
    gpu: "Radeon RX 7700 XT",
    motherboard: "ROG Crosshair X670E Hero", // ATX
    ram: ["Trident Z5 RGB 32 GB DDR5-6000"],
    storage: ["WD Black SN850X 1 TB"],
    psu: "FOCUS GX-750 750W",
    case: "Dan A4-SFX", // ITX only — FORM FACTOR MISMATCH
    cooler: "NH-U12S Redux",
  },
  // ── 15. INCOMPATIBLE — GPU too long for small case ───────────────────────────
  {
    name: "GPU Wont Fit",
    isPublic: true,
    cpu: "Core i5-13600K",
    gpu: "GeForce RTX 4090", // 336 mm length
    motherboard: "PRO Z790-A WiFi",
    ram: ["Ripjaws V 32 GB DDR4-3600"],
    storage: ["WD Black SN850X 1 TB"],
    psu: "HX1200 Platinum 1200W",
    case: "H510 Compact", // max GPU 325 mm — RTX 4090 is 336 mm
    cooler: "Hydro H100i Elite",
  },
  // ── 16. INCOMPATIBLE — Cooler doesn't support socket ────────────────────────
  {
    name: "Wrong Cooler Socket",
    isPublic: true,
    cpu: "Core i7-13700K", // LGA1700
    gpu: "GeForce RTX 4070 Ti Super",
    motherboard: "Z790 Aorus Elite AX",
    ram: ["Vengeance DDR5-5600 32 GB", "Vengeance DDR5-5600 32 GB"],
    storage: ["FireCuda 530 2 TB"],
    psu: "FOCUS GX-850 850W",
    case: "Meshify 2",
    cooler: "Thermalright Phantom Spirit 120 SE", // AM5 only — no LGA1700
  },
  // ── 17. INCOMPATIBLE — Tiny stock cooler can't handle 170W CPU ──────────────
  {
    name: "Stock Cooler Meltdown",
    isPublic: true,
    cpu: "Ryzen 9 7900X", // 170W TDP
    gpu: "Radeon RX 7800 XT",
    motherboard: "B650 Steel Legend WiFi",
    ram: ["Vengeance DDR5-5600 32 GB"],
    storage: ["WD Black SN850X 1 TB"],
    psu: "RM750x 750W",
    case: "Define 7 Compact",
    cooler: "AMD Wraith Stealth", // only 65W rated — COOLER TDP INSUFFICIENT
  },
  // ── 18. INCOMPATIBLE — LGA1200 CPU on LGA1700 board ────────────────────────
  {
    name: "Legacy Socket Confusion",
    isPublic: true,
    cpu: "Core i9-11900K", // LGA1200
    gpu: "GeForce RTX 3090 Ti",
    motherboard: "TUF Gaming Z690-Plus WiFi", // LGA1700 — MISMATCH
    ram: ["Vengeance LPX 32 GB DDR4-3200", "Vengeance LPX 32 GB DDR4-3200"],
    storage: ["Samsung 980 Pro 2 TB NVMe", "Barracuda 4 TB HDD"],
    psu: "HX1200 Platinum 1200W",
    case: "Lian Li O11D EVO RGB",
    cooler: "Hydro H100i Elite",
  },
  // ── 19. INCOMPATIBLE — multiple issues: socket + DDR mismatch ───────────────
  {
    name: "Total Parts Chaos",
    isPublic: true,
    cpu: "Ryzen 5 7600X", // AM5, 105W
    gpu: "GeForce RTX 4070",
    motherboard: "ROG Crosshair VIII Hero", // AM4 DDR4 — socket AND RAM mismatch
    ram: ["Vengeance DDR5-5600 32 GB"], // DDR5 in DDR4 board
    storage: ["WD Black SN850X 1 TB"],
    psu: "CX550 Bronze 550W", // borderline wattage
    case: "H9 Flow Mid Tower",
    cooler: "AMD Wraith Stealth", // AM4 socket only + only 65W
  },
  // ── 20. Compatible — high-end AMD all-rounder ────────────────────────────────
  {
    name: "AMD All-Rounder Elite",
    isPublic: true,
    cpu: "Ryzen 9 7900X",
    gpu: "Radeon RX 7900 XT",
    motherboard: "ROG Strix X670E-F",
    ram: ["Trident Z5 RGB 32 GB DDR5-6000", "Trident Z5 RGB 32 GB DDR5-6000"],
    storage: ["990 Pro 2 TB NVMe", "Barracuda 4 TB HDD"],
    psu: "HX1000 Platinum 1000W",
    case: "Lian Li O11D EVO RGB",
    cooler: "Be Quiet! Dark Rock Pro 4",
  },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // ── Parts ──────────────────────────────────────────────────────────────────
  const existingParts = await Part.countDocuments();
  let insertedParts: (typeof Part.prototype)[];

  if (existingParts > 0) {
    console.log(`DB already has ${existingParts} parts — skipping part seed.`);
    insertedParts = (await Part.find().lean()) as (typeof Part.prototype)[];
  } else {
    insertedParts = (await Part.insertMany(
      parts,
    )) as unknown as (typeof Part.prototype)[];
    console.log(`Seeded ${insertedParts.length} parts.`);
  }

  // Build a name→id lookup
  const partByName = new Map<string, mongoose.Types.ObjectId>();
  for (const p of insertedParts) {
    partByName.set(
      (p as unknown as { name: string })["name"],
      (p as unknown as { _id: mongoose.Types.ObjectId })["_id"],
    );
  }

  // ── Builds ─────────────────────────────────────────────────────────────────
  const existingBuilds = await Build.countDocuments({ isPublic: true });
  if (existingBuilds > 0) {
    console.log(
      `DB already has ${existingBuilds} public builds — skipping build seed.`,
    );
    await mongoose.disconnect();
    return;
  }

  // Use synthetic user ObjectIds so seeded builds never appear in any real user's "My Builds".
  // These IDs don't correspond to any User document — that's intentional.
  const syntheticUsers = [
    {
      id: new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaaaa"),
      name: "Alex Rivera",
    },
    {
      id: new mongoose.Types.ObjectId("bbbbbbbbbbbbbbbbbbbbbbbb"),
      name: "Priya Sharma",
    },
    {
      id: new mongoose.Types.ObjectId("cccccccccccccccccccccccc"),
      name: "Jordan Lee",
    },
    {
      id: new mongoose.Types.ObjectId("dddddddddddddddddddddddd"),
      name: "Marcus Chen",
    },
    {
      id: new mongoose.Types.ObjectId("eeeeeeeeeeeeeeeeeeeeeeee"),
      name: "Kai Nakamura",
    },
  ];

  const buildsToInsert = [];
  const { runCompatibilityCheck } =
    await import("./modules/compatibility/compatibility.service");

  for (let i = 0; i < buildRecipes.length; i++) {
    const recipe = buildRecipes[i];
    const owner = syntheticUsers[i % syntheticUsers.length];

    const resolve = (name: string | undefined) =>
      name ? partByName.get(name) : undefined;
    const resolveMany = (names: string[]) =>
      names
        .map((n) => partByName.get(n))
        .filter((id): id is mongoose.Types.ObjectId => !!id);

    const components = {
      cpu: resolve(recipe.cpu),
      gpu: resolve(recipe.gpu),
      motherboard: resolve(recipe.motherboard),
      ram: resolveMany(recipe.ram),
      storage: resolveMany(recipe.storage),
      psu: resolve(recipe.psu),
      case: resolve(recipe.case),
      cooler: resolve(recipe.cooler),
    };

    const missing = [
      !components.cpu && recipe.cpu,
      !components.gpu && recipe.gpu,
      !components.motherboard && recipe.motherboard,
    ].filter(Boolean);

    if (missing.length) {
      console.warn(
        `  ⚠ Skipping "${recipe.name}" — parts not found: ${missing.join(", ")}`,
      );
      continue;
    }

    const compat = await runCompatibilityCheck(components);

    const allIds = [
      components.cpu,
      components.gpu,
      components.motherboard,
      components.psu,
      components.case,
      components.cooler,
      ...(components.ram ?? []),
      ...(components.storage ?? []),
    ].filter((id): id is mongoose.Types.ObjectId => !!id);

    const partDocs = await Part.find({ _id: { $in: allIds } })
      .select("price")
      .lean<{ price: number }[]>();
    const totalPrice = partDocs.reduce((s, p) => s + p.price, 0);

    buildsToInsert.push({
      user: owner.id,
      name: recipe.name,
      components,
      totalPrice,
      totalWattage: compat.totalWattage,
      isCompatible: compat.isCompatible,
      compatibilityIssues: compat.issues,
      isPublic: recipe.isPublic,
    });

    const status = compat.isCompatible
      ? "✓"
      : `✗ (${compat.issues.length} issue${compat.issues.length > 1 ? "s" : ""})`;
    console.log(
      `  ${status} "${recipe.name}" (${owner.name}) — $${totalPrice}, ${compat.totalWattage}W`,
    );
  }

  await Build.insertMany(buildsToInsert);
  console.log(`\nSeeded ${buildsToInsert.length} public builds.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
