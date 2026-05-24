import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Part from "./models/parts.model";

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/pcbanao";

const parts = [
  // ─── CPUs — AM5 ──────────────────────────────────────────────────────────────
  { name: "Ryzen 9 7950X",       brand: "AMD",   category: "cpu", price: 699, stock: 14, image: "", wattage: 170, specs: { Cores: 16, Socket: "AM5", TDP: "170W", "Boost Clock": "5.7 GHz" } },
  { name: "Ryzen 9 7950X3D",     brand: "AMD",   category: "cpu", price: 699, stock: 8,  image: "", wattage: 120, specs: { Cores: 16, Socket: "AM5", TDP: "120W", "Boost Clock": "5.7 GHz" } },
  { name: "Ryzen 9 7900X",       brand: "AMD",   category: "cpu", price: 449, stock: 10, image: "", wattage: 170, specs: { Cores: 12, Socket: "AM5", TDP: "170W", "Boost Clock": "5.6 GHz" } },
  { name: "Ryzen 9 7900X3D",     brand: "AMD",   category: "cpu", price: 449, stock: 7,  image: "", wattage: 120, specs: { Cores: 12, Socket: "AM5", TDP: "120W", "Boost Clock": "5.6 GHz" } },
  { name: "Ryzen 9 7900",        brand: "AMD",   category: "cpu", price: 349, stock: 12, image: "", wattage: 65,  specs: { Cores: 12, Socket: "AM5", TDP: "65W",  "Boost Clock": "5.4 GHz" } },
  { name: "Ryzen 7 7800X3D",     brand: "AMD",   category: "cpu", price: 449, stock: 12, image: "", wattage: 120, specs: { Cores: 8,  Socket: "AM5", TDP: "120W", "Boost Clock": "5.0 GHz" } },
  { name: "Ryzen 7 7700X",       brand: "AMD",   category: "cpu", price: 299, stock: 18, image: "", wattage: 105, specs: { Cores: 8,  Socket: "AM5", TDP: "105W", "Boost Clock": "5.4 GHz" } },
  { name: "Ryzen 7 7700",        brand: "AMD",   category: "cpu", price: 249, stock: 20, image: "", wattage: 65,  specs: { Cores: 8,  Socket: "AM5", TDP: "65W",  "Boost Clock": "5.3 GHz" } },
  { name: "Ryzen 5 7600X",       brand: "AMD",   category: "cpu", price: 249, stock: 22, image: "", wattage: 105, specs: { Cores: 6,  Socket: "AM5", TDP: "105W", "Boost Clock": "5.3 GHz" } },
  { name: "Ryzen 5 7600",        brand: "AMD",   category: "cpu", price: 199, stock: 30, image: "", wattage: 65,  specs: { Cores: 6,  Socket: "AM5", TDP: "65W",  "Boost Clock": "5.1 GHz" } },
  { name: "Ryzen 5 7500F",       brand: "AMD",   category: "cpu", price: 149, stock: 35, image: "", wattage: 65,  specs: { Cores: 6,  Socket: "AM5", TDP: "65W",  "Boost Clock": "5.0 GHz" } },

  // ─── CPUs — AM4 ──────────────────────────────────────────────────────────────
  { name: "Ryzen 9 5950X",       brand: "AMD",   category: "cpu", price: 349, stock: 9,  image: "", wattage: 105, specs: { Cores: 16, Socket: "AM4", TDP: "105W", "Boost Clock": "4.9 GHz" } },
  { name: "Ryzen 9 5900X",       brand: "AMD",   category: "cpu", price: 249, stock: 14, image: "", wattage: 105, specs: { Cores: 12, Socket: "AM4", TDP: "105W", "Boost Clock": "4.8 GHz" } },
  { name: "Ryzen 7 5800X3D",     brand: "AMD",   category: "cpu", price: 299, stock: 15, image: "", wattage: 105, specs: { Cores: 8,  Socket: "AM4", TDP: "105W", "Boost Clock": "4.5 GHz" } },
  { name: "Ryzen 7 5800X",       brand: "AMD",   category: "cpu", price: 199, stock: 18, image: "", wattage: 105, specs: { Cores: 8,  Socket: "AM4", TDP: "105W", "Boost Clock": "4.7 GHz" } },
  { name: "Ryzen 5 5600X",       brand: "AMD",   category: "cpu", price: 149, stock: 35, image: "", wattage: 65,  specs: { Cores: 6,  Socket: "AM4", TDP: "65W",  "Boost Clock": "4.6 GHz" } },
  { name: "Ryzen 5 5600",        brand: "AMD",   category: "cpu", price: 119, stock: 45, image: "", wattage: 65,  specs: { Cores: 6,  Socket: "AM4", TDP: "65W",  "Boost Clock": "4.4 GHz" } },
  { name: "Ryzen 5 5500",        brand: "AMD",   category: "cpu", price: 89,  stock: 50, image: "", wattage: 65,  specs: { Cores: 6,  Socket: "AM4", TDP: "65W",  "Boost Clock": "4.2 GHz" } },

  // ─── CPUs — LGA1700 ──────────────────────────────────────────────────────────
  { name: "Core i9-13900KS",     brand: "Intel", category: "cpu", price: 699, stock: 5,  image: "", wattage: 150, specs: { Cores: 24, Socket: "LGA1700", TDP: "150W", "Boost Clock": "6.0 GHz" } },
  { name: "Core i9-13900K",      brand: "Intel", category: "cpu", price: 589, stock: 9,  image: "", wattage: 125, specs: { Cores: 24, Socket: "LGA1700", TDP: "125W", "Boost Clock": "5.8 GHz" } },
  { name: "Core i9-13900",       brand: "Intel", category: "cpu", price: 489, stock: 8,  image: "", wattage: 65,  specs: { Cores: 24, Socket: "LGA1700", TDP: "65W",  "Boost Clock": "5.6 GHz" } },
  { name: "Core i7-13700K",      brand: "Intel", category: "cpu", price: 409, stock: 14, image: "", wattage: 125, specs: { Cores: 16, Socket: "LGA1700", TDP: "125W", "Boost Clock": "5.4 GHz" } },
  { name: "Core i7-13700",       brand: "Intel", category: "cpu", price: 339, stock: 16, image: "", wattage: 65,  specs: { Cores: 16, Socket: "LGA1700", TDP: "65W",  "Boost Clock": "5.2 GHz" } },
  { name: "Core i5-13600K",      brand: "Intel", category: "cpu", price: 299, stock: 20, image: "", wattage: 125, specs: { Cores: 14, Socket: "LGA1700", TDP: "125W", "Boost Clock": "5.1 GHz" } },
  { name: "Core i5-13600",       brand: "Intel", category: "cpu", price: 239, stock: 22, image: "", wattage: 65,  specs: { Cores: 14, Socket: "LGA1700", TDP: "65W",  "Boost Clock": "5.0 GHz" } },
  { name: "Core i5-13400F",      brand: "Intel", category: "cpu", price: 179, stock: 28, image: "", wattage: 65,  specs: { Cores: 10, Socket: "LGA1700", TDP: "65W",  "Boost Clock": "4.6 GHz" } },
  { name: "Core i5-13400",       brand: "Intel", category: "cpu", price: 199, stock: 25, image: "", wattage: 65,  specs: { Cores: 10, Socket: "LGA1700", TDP: "65W",  "Boost Clock": "4.6 GHz" } },
  { name: "Core i3-13100F",      brand: "Intel", category: "cpu", price: 99,  stock: 40, image: "", wattage: 58,  specs: { Cores: 4,  Socket: "LGA1700", TDP: "58W",  "Boost Clock": "4.5 GHz" } },
  { name: "Core i3-13100",       brand: "Intel", category: "cpu", price: 119, stock: 35, image: "", wattage: 60,  specs: { Cores: 4,  Socket: "LGA1700", TDP: "60W",  "Boost Clock": "4.5 GHz" } },

  // ─── CPUs — LGA1200 (legacy) ──────────────────────────────────────────────────
  { name: "Core i9-11900K",      brand: "Intel", category: "cpu", price: 189, stock: 7,  image: "", wattage: 125, specs: { Cores: 8,  Socket: "LGA1200", TDP: "125W", "Boost Clock": "5.2 GHz" } },
  { name: "Core i7-11700K",      brand: "Intel", category: "cpu", price: 149, stock: 10, image: "", wattage: 125, specs: { Cores: 8,  Socket: "LGA1200", TDP: "125W", "Boost Clock": "5.0 GHz" } },
  { name: "Core i5-11600K",      brand: "Intel", category: "cpu", price: 119, stock: 12, image: "", wattage: 125, specs: { Cores: 6,  Socket: "LGA1200", TDP: "125W", "Boost Clock": "4.9 GHz" } },

  // ─── GPUs — NVIDIA RTX 40 series ─────────────────────────────────────────────
  { name: "GeForce RTX 4090",           brand: "NVIDIA", category: "gpu", price: 1599, stock: 4,  image: "", wattage: 450, specs: { VRAM: "24 GB", "Boost Clock": "2.52 GHz", TDP: "450W" } },
  { name: "GeForce RTX 4080 Super",     brand: "NVIDIA", category: "gpu", price: 999,  stock: 6,  image: "", wattage: 320, specs: { VRAM: "16 GB", "Boost Clock": "2.55 GHz", TDP: "320W" } },
  { name: "GeForce RTX 4080",           brand: "NVIDIA", category: "gpu", price: 1199, stock: 5,  image: "", wattage: 320, specs: { VRAM: "16 GB", "Boost Clock": "2.51 GHz", TDP: "320W" } },
  { name: "GeForce RTX 4070 Ti Super",  brand: "NVIDIA", category: "gpu", price: 799,  stock: 9,  image: "", wattage: 285, specs: { VRAM: "16 GB", "Boost Clock": "2.61 GHz", TDP: "285W" } },
  { name: "GeForce RTX 4070 Ti",        brand: "NVIDIA", category: "gpu", price: 799,  stock: 11, image: "", wattage: 285, specs: { VRAM: "12 GB", "Boost Clock": "2.61 GHz", TDP: "285W" } },
  { name: "GeForce RTX 4070 Super",     brand: "NVIDIA", category: "gpu", price: 599,  stock: 14, image: "", wattage: 220, specs: { VRAM: "12 GB", "Boost Clock": "2.48 GHz", TDP: "220W" } },
  { name: "GeForce RTX 4070",           brand: "NVIDIA", category: "gpu", price: 599,  stock: 14, image: "", wattage: 200, specs: { VRAM: "12 GB", "Boost Clock": "2.48 GHz", TDP: "200W" } },
  { name: "GeForce RTX 4060 Ti 16 GB",  brand: "NVIDIA", category: "gpu", price: 499,  stock: 10, image: "", wattage: 165, specs: { VRAM: "16 GB", "Boost Clock": "2.54 GHz", TDP: "165W" } },
  { name: "GeForce RTX 4060 Ti",        brand: "NVIDIA", category: "gpu", price: 399,  stock: 18, image: "", wattage: 165, specs: { VRAM: "8 GB",  "Boost Clock": "2.54 GHz", TDP: "165W" } },
  { name: "GeForce RTX 4060",           brand: "NVIDIA", category: "gpu", price: 299,  stock: 24, image: "", wattage: 115, specs: { VRAM: "8 GB",  "Boost Clock": "2.46 GHz", TDP: "115W" } },
  { name: "GeForce RTX 4050 (Laptop)",  brand: "NVIDIA", category: "gpu", price: 249,  stock: 15, image: "", wattage: 115, specs: { VRAM: "6 GB",  "Boost Clock": "2.37 GHz", TDP: "115W" } },

  // ─── GPUs — NVIDIA RTX 30 series ─────────────────────────────────────────────
  { name: "GeForce RTX 3090 Ti",  brand: "NVIDIA", category: "gpu", price: 799, stock: 5,  image: "", wattage: 450, specs: { VRAM: "24 GB", "Boost Clock": "1.86 GHz", TDP: "450W" } },
  { name: "GeForce RTX 3090",     brand: "NVIDIA", category: "gpu", price: 699, stock: 6,  image: "", wattage: 350, specs: { VRAM: "24 GB", "Boost Clock": "1.70 GHz", TDP: "350W" } },
  { name: "GeForce RTX 3080 Ti",  brand: "NVIDIA", category: "gpu", price: 599, stock: 7,  image: "", wattage: 350, specs: { VRAM: "12 GB", "Boost Clock": "1.67 GHz", TDP: "350W" } },
  { name: "GeForce RTX 3080",     brand: "NVIDIA", category: "gpu", price: 499, stock: 9,  image: "", wattage: 320, specs: { VRAM: "10 GB", "Boost Clock": "1.71 GHz", TDP: "320W" } },
  { name: "GeForce RTX 3070 Ti",  brand: "NVIDIA", category: "gpu", price: 399, stock: 12, image: "", wattage: 290, specs: { VRAM: "8 GB",  "Boost Clock": "1.77 GHz", TDP: "290W" } },
  { name: "GeForce RTX 3070",     brand: "NVIDIA", category: "gpu", price: 349, stock: 15, image: "", wattage: 220, specs: { VRAM: "8 GB",  "Boost Clock": "1.73 GHz", TDP: "220W" } },
  { name: "GeForce RTX 3060 Ti",  brand: "NVIDIA", category: "gpu", price: 299, stock: 18, image: "", wattage: 200, specs: { VRAM: "8 GB",  "Boost Clock": "1.67 GHz", TDP: "200W" } },
  { name: "GeForce RTX 3060",     brand: "NVIDIA", category: "gpu", price: 259, stock: 20, image: "", wattage: 170, specs: { VRAM: "12 GB", "Boost Clock": "1.78 GHz", TDP: "170W" } },
  { name: "GeForce RTX 3050",     brand: "NVIDIA", category: "gpu", price: 179, stock: 28, image: "", wattage: 130, specs: { VRAM: "8 GB",  "Boost Clock": "1.78 GHz", TDP: "130W" } },

  // ─── GPUs — AMD RX 7000 series ────────────────────────────────────────────────
  { name: "Radeon RX 7900 XTX",   brand: "AMD", category: "gpu", price: 999, stock: 7,  image: "", wattage: 355, specs: { VRAM: "24 GB", "Boost Clock": "2.50 GHz", TDP: "355W" } },
  { name: "Radeon RX 7900 XT",    brand: "AMD", category: "gpu", price: 799, stock: 9,  image: "", wattage: 315, specs: { VRAM: "20 GB", "Boost Clock": "2.40 GHz", TDP: "315W" } },
  { name: "Radeon RX 7900 GRE",   brand: "AMD", category: "gpu", price: 549, stock: 11, image: "", wattage: 260, specs: { VRAM: "16 GB", "Boost Clock": "2.25 GHz", TDP: "260W" } },
  { name: "Radeon RX 7800 XT",    brand: "AMD", category: "gpu", price: 499, stock: 12, image: "", wattage: 263, specs: { VRAM: "16 GB", "Boost Clock": "2.43 GHz", TDP: "263W" } },
  { name: "Radeon RX 7700 XT",    brand: "AMD", category: "gpu", price: 449, stock: 15, image: "", wattage: 245, specs: { VRAM: "12 GB", "Boost Clock": "2.54 GHz", TDP: "245W" } },
  { name: "Radeon RX 7600 XT",    brand: "AMD", category: "gpu", price: 329, stock: 18, image: "", wattage: 190, specs: { VRAM: "16 GB", "Boost Clock": "2.76 GHz", TDP: "190W" } },
  { name: "Radeon RX 7600",       brand: "AMD", category: "gpu", price: 269, stock: 22, image: "", wattage: 165, specs: { VRAM: "8 GB",  "Boost Clock": "2.63 GHz", TDP: "165W" } },

  // ─── GPUs — AMD RX 6000 series ────────────────────────────────────────────────
  { name: "Radeon RX 6950 XT",    brand: "AMD", category: "gpu", price: 599, stock: 7,  image: "", wattage: 335, specs: { VRAM: "16 GB", "Boost Clock": "2.31 GHz", TDP: "335W" } },
  { name: "Radeon RX 6800 XT",    brand: "AMD", category: "gpu", price: 449, stock: 10, image: "", wattage: 300, specs: { VRAM: "16 GB", "Boost Clock": "2.25 GHz", TDP: "300W" } },
  { name: "Radeon RX 6750 XT",    brand: "AMD", category: "gpu", price: 349, stock: 14, image: "", wattage: 250, specs: { VRAM: "12 GB", "Boost Clock": "2.60 GHz", TDP: "250W" } },
  { name: "Radeon RX 6700 XT",    brand: "AMD", category: "gpu", price: 299, stock: 18, image: "", wattage: 230, specs: { VRAM: "12 GB", "Boost Clock": "2.58 GHz", TDP: "230W" } },
  { name: "Radeon RX 6650 XT",    brand: "AMD", category: "gpu", price: 249, stock: 22, image: "", wattage: 176, specs: { VRAM: "8 GB",  "Boost Clock": "2.64 GHz", TDP: "176W" } },
  { name: "Radeon RX 6600 XT",    brand: "AMD", category: "gpu", price: 219, stock: 25, image: "", wattage: 160, specs: { VRAM: "8 GB",  "Boost Clock": "2.59 GHz", TDP: "160W" } },
  { name: "Radeon RX 6600",       brand: "AMD", category: "gpu", price: 189, stock: 28, image: "", wattage: 132, specs: { VRAM: "8 GB",  "Boost Clock": "2.49 GHz", TDP: "132W" } },

  // ─── Motherboards — AM5 DDR5 ─────────────────────────────────────────────────
  { name: "ROG Crosshair X670E Hero",   brand: "ASUS",    category: "motherboard", price: 629, stock: 6,  image: "", wattage: 0, specs: { Socket: "AM5", Chipset: "X670E", Form: "ATX",  "Memory Type": "DDR5", "Memory Slots": 4 } },
  { name: "ROG Strix X670E-F",          brand: "ASUS",    category: "motherboard", price: 399, stock: 9,  image: "", wattage: 0, specs: { Socket: "AM5", Chipset: "X670E", Form: "ATX",  "Memory Type": "DDR5", "Memory Slots": 4 } },
  { name: "TUF Gaming X670E-Plus",      brand: "ASUS",    category: "motherboard", price: 299, stock: 12, image: "", wattage: 0, specs: { Socket: "AM5", Chipset: "X670E", Form: "ATX",  "Memory Type": "DDR5", "Memory Slots": 4 } },
  { name: "MPG X670E Carbon WiFi",      brand: "MSI",     category: "motherboard", price: 499, stock: 8,  image: "", wattage: 0, specs: { Socket: "AM5", Chipset: "X670E", Form: "ATX",  "Memory Type": "DDR5", "Memory Slots": 4 } },
  { name: "MEG X670E Ace",              brand: "MSI",     category: "motherboard", price: 599, stock: 5,  image: "", wattage: 0, specs: { Socket: "AM5", Chipset: "X670E", Form: "ATX",  "Memory Type": "DDR5", "Memory Slots": 4 } },
  { name: "B650 Steel Legend WiFi",     brand: "ASRock",  category: "motherboard", price: 239, stock: 14, image: "", wattage: 0, specs: { Socket: "AM5", Chipset: "B650",  Form: "ATX",  "Memory Type": "DDR5", "Memory Slots": 4 } },
  { name: "B650E PG Riptide",           brand: "ASRock",  category: "motherboard", price: 199, stock: 16, image: "", wattage: 0, specs: { Socket: "AM5", Chipset: "B650E", Form: "ATX",  "Memory Type": "DDR5", "Memory Slots": 4 } },
  { name: "MAG B650M Mortar WiFi",      brand: "MSI",     category: "motherboard", price: 199, stock: 16, image: "", wattage: 0, specs: { Socket: "AM5", Chipset: "B650",  Form: "mATX", "Memory Type": "DDR5", "Memory Slots": 4 } },
  { name: "ROG Strix B650E-I",          brand: "ASUS",    category: "motherboard", price: 269, stock: 10, image: "", wattage: 0, specs: { Socket: "AM5", Chipset: "B650E", Form: "ITX",  "Memory Type": "DDR5", "Memory Slots": 2 } },
  { name: "B650I Aorus Ultra",          brand: "Gigabyte",category: "motherboard", price: 299, stock: 8,  image: "", wattage: 0, specs: { Socket: "AM5", Chipset: "B650I", Form: "ITX",  "Memory Type": "DDR5", "Memory Slots": 2 } },

  // ─── Motherboards — AM4 DDR4 ─────────────────────────────────────────────────
  { name: "ROG Crosshair VIII Hero",    brand: "ASUS",    category: "motherboard", price: 299, stock: 8,  image: "", wattage: 0, specs: { Socket: "AM4", Chipset: "X570",  Form: "ATX",  "Memory Type": "DDR4", "Memory Slots": 4 } },
  { name: "TUF Gaming X570-Plus",       brand: "ASUS",    category: "motherboard", price: 199, stock: 14, image: "", wattage: 0, specs: { Socket: "AM4", Chipset: "X570",  Form: "ATX",  "Memory Type": "DDR4", "Memory Slots": 4 } },
  { name: "MAG B550 Tomahawk",          brand: "MSI",     category: "motherboard", price: 159, stock: 18, image: "", wattage: 0, specs: { Socket: "AM4", Chipset: "B550",  Form: "ATX",  "Memory Type": "DDR4", "Memory Slots": 4 } },
  { name: "B550 Gaming X V2",           brand: "Gigabyte",category: "motherboard", price: 139, stock: 20, image: "", wattage: 0, specs: { Socket: "AM4", Chipset: "B550",  Form: "ATX",  "Memory Type": "DDR4", "Memory Slots": 4 } },
  { name: "B450M DS3H",                 brand: "Gigabyte",category: "motherboard", price: 89,  stock: 25, image: "", wattage: 0, specs: { Socket: "AM4", Chipset: "B450",  Form: "mATX", "Memory Type": "DDR4", "Memory Slots": 4 } },
  { name: "B550M DS3H",                 brand: "Gigabyte",category: "motherboard", price: 109, stock: 22, image: "", wattage: 0, specs: { Socket: "AM4", Chipset: "B550",  Form: "mATX", "Memory Type": "DDR4", "Memory Slots": 4 } },

  // ─── Motherboards — LGA1700 DDR5 ─────────────────────────────────────────────
  { name: "ROG Maximus Z790 Hero",      brand: "ASUS",    category: "motherboard", price: 699, stock: 4,  image: "", wattage: 0, specs: { Socket: "LGA1700", Chipset: "Z790", Form: "ATX",  "Memory Type": "DDR5", "Memory Slots": 4 } },
  { name: "ROG Strix Z790-E",           brand: "ASUS",    category: "motherboard", price: 499, stock: 7,  image: "", wattage: 0, specs: { Socket: "LGA1700", Chipset: "Z790", Form: "ATX",  "Memory Type": "DDR5", "Memory Slots": 4 } },
  { name: "MPG Z790 Carbon WiFi",       brand: "MSI",     category: "motherboard", price: 469, stock: 8,  image: "", wattage: 0, specs: { Socket: "LGA1700", Chipset: "Z790", Form: "ATX",  "Memory Type": "DDR5", "Memory Slots": 4 } },
  { name: "PRO Z790-A WiFi",            brand: "MSI",     category: "motherboard", price: 249, stock: 14, image: "", wattage: 0, specs: { Socket: "LGA1700", Chipset: "Z790", Form: "ATX",  "Memory Type": "DDR5", "Memory Slots": 4 } },
  { name: "Z790 Aorus Elite AX",        brand: "Gigabyte",category: "motherboard", price: 299, stock: 12, image: "", wattage: 0, specs: { Socket: "LGA1700", Chipset: "Z790", Form: "ATX",  "Memory Type": "DDR5", "Memory Slots": 4 } },
  { name: "Z790I Aorus Ultra",          brand: "Gigabyte",category: "motherboard", price: 349, stock: 8,  image: "", wattage: 0, specs: { Socket: "LGA1700", Chipset: "Z790", Form: "ITX",  "Memory Type": "DDR5", "Memory Slots": 2 } },
  { name: "TUF Gaming B760M-Plus WiFi", brand: "ASUS",    category: "motherboard", price: 179, stock: 18, image: "", wattage: 0, specs: { Socket: "LGA1700", Chipset: "B760", Form: "mATX", "Memory Type": "DDR5", "Memory Slots": 4 } },
  { name: "MAG B760M Mortar WiFi",      brand: "MSI",     category: "motherboard", price: 189, stock: 16, image: "", wattage: 0, specs: { Socket: "LGA1700", Chipset: "B760", Form: "mATX", "Memory Type": "DDR5", "Memory Slots": 4 } },

  // ─── Motherboards — LGA1700 DDR4 ─────────────────────────────────────────────
  { name: "TUF Gaming Z690-Plus WiFi",  brand: "ASUS",    category: "motherboard", price: 219, stock: 11, image: "", wattage: 0, specs: { Socket: "LGA1700", Chipset: "Z690", Form: "ATX",  "Memory Type": "DDR4", "Memory Slots": 4 } },
  { name: "MAG B660M Mortar DDR4",      brand: "MSI",     category: "motherboard", price: 149, stock: 20, image: "", wattage: 0, specs: { Socket: "LGA1700", Chipset: "B660", Form: "mATX", "Memory Type": "DDR4", "Memory Slots": 4 } },

  // ─── Motherboards — LGA1200 (legacy) ─────────────────────────────────────────
  { name: "ROG Strix Z590-E",           brand: "ASUS",    category: "motherboard", price: 179, stock: 7,  image: "", wattage: 0, specs: { Socket: "LGA1200", Chipset: "Z590", Form: "ATX",  "Memory Type": "DDR4", "Memory Slots": 4 } },
  { name: "MAG B560M Mortar",           brand: "MSI",     category: "motherboard", price: 119, stock: 12, image: "", wattage: 0, specs: { Socket: "LGA1200", Chipset: "B560", Form: "mATX", "Memory Type": "DDR4", "Memory Slots": 4 } },

  // ─── RAM — DDR5 ──────────────────────────────────────────────────────────────
  { name: "Trident Z5 RGB 32 GB DDR5-6000",    brand: "G.Skill",  category: "ram", price: 129, stock: 20, image: "", wattage: 0, specs: { Type: "DDR5", Speed: "6000 MHz", Capacity: "32 GB" } },
  { name: "Trident Z5 RGB 64 GB DDR5-6000",    brand: "G.Skill",  category: "ram", price: 219, stock: 14, image: "", wattage: 0, specs: { Type: "DDR5", Speed: "6000 MHz", Capacity: "64 GB" } },
  { name: "Trident Z5 Neo 32 GB DDR5-6000",    brand: "G.Skill",  category: "ram", price: 139, stock: 16, image: "", wattage: 0, specs: { Type: "DDR5", Speed: "6000 MHz", Capacity: "32 GB" } },
  { name: "Vengeance DDR5-5600 32 GB",         brand: "Corsair",  category: "ram", price: 109, stock: 28, image: "", wattage: 0, specs: { Type: "DDR5", Speed: "5600 MHz", Capacity: "32 GB" } },
  { name: "Vengeance DDR5-6000 32 GB",         brand: "Corsair",  category: "ram", price: 119, stock: 24, image: "", wattage: 0, specs: { Type: "DDR5", Speed: "6000 MHz", Capacity: "32 GB" } },
  { name: "Dominator Platinum DDR5-6000 64 GB",brand: "Corsair",  category: "ram", price: 289, stock: 8,  image: "", wattage: 0, specs: { Type: "DDR5", Speed: "6000 MHz", Capacity: "64 GB" } },
  { name: "Fury Beast DDR5-5600 16 GB",        brand: "Kingston", category: "ram", price: 69,  stock: 40, image: "", wattage: 0, specs: { Type: "DDR5", Speed: "5600 MHz", Capacity: "16 GB" } },
  { name: "Fury Beast DDR5-6000 32 GB",        brand: "Kingston", category: "ram", price: 109, stock: 30, image: "", wattage: 0, specs: { Type: "DDR5", Speed: "6000 MHz", Capacity: "32 GB" } },
  { name: "Lancer RGB DDR5-6000 32 GB",        brand: "TeamGroup",category: "ram", price: 99,  stock: 22, image: "", wattage: 0, specs: { Type: "DDR5", Speed: "6000 MHz", Capacity: "32 GB" } },

  // ─── RAM — DDR4 ──────────────────────────────────────────────────────────────
  { name: "Ripjaws V 16 GB DDR4-3200",         brand: "G.Skill",  category: "ram", price: 45,  stock: 45, image: "", wattage: 0, specs: { Type: "DDR4", Speed: "3200 MHz", Capacity: "16 GB" } },
  { name: "Ripjaws V 32 GB DDR4-3600",         brand: "G.Skill",  category: "ram", price: 79,  stock: 30, image: "", wattage: 0, specs: { Type: "DDR4", Speed: "3600 MHz", Capacity: "32 GB" } },
  { name: "Ripjaws V 64 GB DDR4-3600",         brand: "G.Skill",  category: "ram", price: 149, stock: 18, image: "", wattage: 0, specs: { Type: "DDR4", Speed: "3600 MHz", Capacity: "64 GB" } },
  { name: "Vengeance LPX 16 GB DDR4-2666",     brand: "Corsair",  category: "ram", price: 39,  stock: 50, image: "", wattage: 0, specs: { Type: "DDR4", Speed: "2666 MHz", Capacity: "16 GB" } },
  { name: "Vengeance LPX 32 GB DDR4-3200",     brand: "Corsair",  category: "ram", price: 69,  stock: 35, image: "", wattage: 0, specs: { Type: "DDR4", Speed: "3200 MHz", Capacity: "32 GB" } },
  { name: "Vengeance RGB Pro 32 GB DDR4-3600",  brand: "Corsair",  category: "ram", price: 89,  stock: 28, image: "", wattage: 0, specs: { Type: "DDR4", Speed: "3600 MHz", Capacity: "32 GB" } },
  { name: "Fury Beast DDR4-3600 16 GB",         brand: "Kingston", category: "ram", price: 49,  stock: 40, image: "", wattage: 0, specs: { Type: "DDR4", Speed: "3600 MHz", Capacity: "16 GB" } },
  { name: "Fury Beast DDR4-3200 32 GB",         brand: "Kingston", category: "ram", price: 69,  stock: 32, image: "", wattage: 0, specs: { Type: "DDR4", Speed: "3200 MHz", Capacity: "32 GB" } },
  { name: "Crucial Ballistix 32 GB DDR4-3600",  brand: "Crucial",  category: "ram", price: 74,  stock: 28, image: "", wattage: 0, specs: { Type: "DDR4", Speed: "3600 MHz", Capacity: "32 GB" } },
  { name: "Crucial Ballistix 16 GB DDR4-3200",  brand: "Crucial",  category: "ram", price: 44,  stock: 40, image: "", wattage: 0, specs: { Type: "DDR4", Speed: "3200 MHz", Capacity: "16 GB" } },

  // ─── Storage — NVMe PCIe 5.0 ─────────────────────────────────────────────────
  { name: "990 Evo Plus 2 TB NVMe",       brand: "Samsung",   category: "storage", price: 189, stock: 20, image: "", wattage: 8, specs: { Capacity: "2 TB",  Read: "7250 MB/s", Interface: "PCIe 5.0" } },
  { name: "FireCuda 540 2 TB NVMe",       brand: "Seagate",   category: "storage", price: 229, stock: 14, image: "", wattage: 9, specs: { Capacity: "2 TB",  Read: "10000 MB/s",Interface: "PCIe 5.0" } },

  // ─── Storage — NVMe PCIe 4.0 ─────────────────────────────────────────────────
  { name: "990 Pro 2 TB NVMe",            brand: "Samsung",   category: "storage", price: 179, stock: 25, image: "", wattage: 7, specs: { Capacity: "2 TB",  Read: "7450 MB/s", Interface: "PCIe 4.0" } },
  { name: "990 Pro 1 TB NVMe",            brand: "Samsung",   category: "storage", price: 99,  stock: 35, image: "", wattage: 6, specs: { Capacity: "1 TB",  Read: "7450 MB/s", Interface: "PCIe 4.0" } },
  { name: "980 Pro 2 TB NVMe",            brand: "Samsung",   category: "storage", price: 149, stock: 20, image: "", wattage: 7, specs: { Capacity: "2 TB",  Read: "7000 MB/s", Interface: "PCIe 4.0" } },
  { name: "980 Pro 1 TB NVMe",            brand: "Samsung",   category: "storage", price: 89,  stock: 30, image: "", wattage: 6, specs: { Capacity: "1 TB",  Read: "7000 MB/s", Interface: "PCIe 4.0" } },
  { name: "FireCuda 530 4 TB NVMe",       brand: "Seagate",   category: "storage", price: 329, stock: 12, image: "", wattage: 8, specs: { Capacity: "4 TB",  Read: "7300 MB/s", Interface: "PCIe 4.0" } },
  { name: "FireCuda 530 2 TB NVMe",       brand: "Seagate",   category: "storage", price: 189, stock: 18, image: "", wattage: 7, specs: { Capacity: "2 TB",  Read: "7300 MB/s", Interface: "PCIe 4.0" } },
  { name: "FireCuda 530 1 TB NVMe",       brand: "Seagate",   category: "storage", price: 109, stock: 25, image: "", wattage: 6, specs: { Capacity: "1 TB",  Read: "7300 MB/s", Interface: "PCIe 4.0" } },
  { name: "WD Black SN850X 4 TB NVMe",   brand: "WD",         category: "storage", price: 299, stock: 10, image: "", wattage: 8, specs: { Capacity: "4 TB",  Read: "7300 MB/s", Interface: "PCIe 4.0" } },
  { name: "WD Black SN850X 2 TB NVMe",   brand: "WD",         category: "storage", price: 149, stock: 22, image: "", wattage: 7, specs: { Capacity: "2 TB",  Read: "7300 MB/s", Interface: "PCIe 4.0" } },
  { name: "WD Black SN850X 1 TB NVMe",   brand: "WD",         category: "storage", price: 89,  stock: 33, image: "", wattage: 6, specs: { Capacity: "1 TB",  Read: "7300 MB/s", Interface: "PCIe 4.0" } },
  { name: "WD Blue SN580 1 TB NVMe",     brand: "WD",         category: "storage", price: 59,  stock: 50, image: "", wattage: 5, specs: { Capacity: "1 TB",  Read: "4150 MB/s", Interface: "PCIe 4.0" } },
  { name: "WD Blue SN580 500 GB NVMe",   brand: "WD",         category: "storage", price: 39,  stock: 60, image: "", wattage: 4, specs: { Capacity: "500 GB",Read: "4000 MB/s", Interface: "PCIe 4.0" } },
  { name: "Crucial P5 Plus 2 TB NVMe",   brand: "Crucial",    category: "storage", price: 129, stock: 20, image: "", wattage: 7, specs: { Capacity: "2 TB",  Read: "6600 MB/s", Interface: "PCIe 4.0" } },
  { name: "Crucial P5 Plus 1 TB NVMe",   brand: "Crucial",    category: "storage", price: 79,  stock: 30, image: "", wattage: 6, specs: { Capacity: "1 TB",  Read: "6600 MB/s", Interface: "PCIe 4.0" } },
  { name: "Lexar NM790 2 TB NVMe",       brand: "Lexar",      category: "storage", price: 109, stock: 25, image: "", wattage: 7, specs: { Capacity: "2 TB",  Read: "7400 MB/s", Interface: "PCIe 4.0" } },

  // ─── Storage — SATA SSD ───────────────────────────────────────────────────────
  { name: "870 EVO 2 TB SATA SSD",       brand: "Samsung",   category: "storage", price: 149, stock: 20, image: "", wattage: 4, specs: { Capacity: "2 TB",  Read: "560 MB/s",  Interface: "SATA" } },
  { name: "870 EVO 1 TB SATA SSD",       brand: "Samsung",   category: "storage", price: 89,  stock: 30, image: "", wattage: 3, specs: { Capacity: "1 TB",  Read: "560 MB/s",  Interface: "SATA" } },
  { name: "MX500 2 TB SATA SSD",         brand: "Crucial",   category: "storage", price: 109, stock: 25, image: "", wattage: 4, specs: { Capacity: "2 TB",  Read: "560 MB/s",  Interface: "SATA" } },
  { name: "MX500 1 TB SATA SSD",         brand: "Crucial",   category: "storage", price: 69,  stock: 35, image: "", wattage: 3, specs: { Capacity: "1 TB",  Read: "560 MB/s",  Interface: "SATA" } },
  { name: "WD Blue 2 TB SATA SSD",       brand: "WD",        category: "storage", price: 119, stock: 22, image: "", wattage: 4, specs: { Capacity: "2 TB",  Read: "560 MB/s",  Interface: "SATA" } },

  // ─── Storage — HDD ───────────────────────────────────────────────────────────
  { name: "Barracuda 8 TB HDD",          brand: "Seagate",   category: "storage", price: 129, stock: 18, image: "", wattage: 9,  specs: { Capacity: "8 TB",  Read: "220 MB/s",  Interface: "SATA" } },
  { name: "Barracuda 4 TB HDD",          brand: "Seagate",   category: "storage", price: 79,  stock: 30, image: "", wattage: 8,  specs: { Capacity: "4 TB",  Read: "220 MB/s",  Interface: "SATA" } },
  { name: "Barracuda 2 TB HDD",          brand: "Seagate",   category: "storage", price: 49,  stock: 40, image: "", wattage: 7,  specs: { Capacity: "2 TB",  Read: "220 MB/s",  Interface: "SATA" } },
  { name: "WD Blue 4 TB HDD",            brand: "WD",        category: "storage", price: 89,  stock: 25, image: "", wattage: 8,  specs: { Capacity: "4 TB",  Read: "180 MB/s",  Interface: "SATA" } },
  { name: "WD Blue 2 TB HDD",            brand: "WD",        category: "storage", price: 49,  stock: 40, image: "", wattage: 7,  specs: { Capacity: "2 TB",  Read: "180 MB/s",  Interface: "SATA" } },
  { name: "IronWolf 4 TB NAS HDD",       brand: "Seagate",   category: "storage", price: 99,  stock: 15, image: "", wattage: 10, specs: { Capacity: "4 TB",  Read: "210 MB/s",  Interface: "SATA" } },

  // ─── PSUs ─────────────────────────────────────────────────────────────────────
  { name: "HX1500i Titanium 1500W",      brand: "Corsair",  category: "psu", price: 349, stock: 5,  image: "", wattage: 1500, specs: { Wattage: "1500W", Efficiency: "80+ Titanium", Modular: "Full" } },
  { name: "HX1200 Platinum 1200W",       brand: "Corsair",  category: "psu", price: 229, stock: 9,  image: "", wattage: 1200, specs: { Wattage: "1200W", Efficiency: "80+ Platinum", Modular: "Full" } },
  { name: "HX1000 Platinum 1000W",       brand: "Corsair",  category: "psu", price: 189, stock: 12, image: "", wattage: 1000, specs: { Wattage: "1000W", Efficiency: "80+ Platinum", Modular: "Full" } },
  { name: "RM1000x 1000W",               brand: "Corsair",  category: "psu", price: 169, stock: 14, image: "", wattage: 1000, specs: { Wattage: "1000W", Efficiency: "80+ Gold",     Modular: "Full" } },
  { name: "RM850x 850W",                 brand: "Corsair",  category: "psu", price: 149, stock: 16, image: "", wattage: 850,  specs: { Wattage: "850W",  Efficiency: "80+ Gold",     Modular: "Full" } },
  { name: "RM750x 750W",                 brand: "Corsair",  category: "psu", price: 129, stock: 20, image: "", wattage: 750,  specs: { Wattage: "750W",  Efficiency: "80+ Gold",     Modular: "Full" } },
  { name: "RM650 650W",                  brand: "Corsair",  category: "psu", price: 99,  stock: 25, image: "", wattage: 650,  specs: { Wattage: "650W",  Efficiency: "80+ Gold",     Modular: "Full" } },
  { name: "CX650 Bronze 650W",           brand: "Corsair",  category: "psu", price: 79,  stock: 28, image: "", wattage: 650,  specs: { Wattage: "650W",  Efficiency: "80+ Bronze",   Modular: "Non"  } },
  { name: "CX550 Bronze 550W",           brand: "Corsair",  category: "psu", price: 69,  stock: 30, image: "", wattage: 550,  specs: { Wattage: "550W",  Efficiency: "80+ Bronze",   Modular: "Semi" } },
  { name: "FOCUS GX-1000 1000W",         brand: "Seasonic", category: "psu", price: 199, stock: 10, image: "", wattage: 1000, specs: { Wattage: "1000W", Efficiency: "80+ Gold",     Modular: "Full" } },
  { name: "FOCUS GX-850 850W",           brand: "Seasonic", category: "psu", price: 149, stock: 15, image: "", wattage: 850,  specs: { Wattage: "850W",  Efficiency: "80+ Gold",     Modular: "Full" } },
  { name: "FOCUS GX-750 750W",           brand: "Seasonic", category: "psu", price: 129, stock: 18, image: "", wattage: 750,  specs: { Wattage: "750W",  Efficiency: "80+ Gold",     Modular: "Full" } },
  { name: "FOCUS GX-650 650W",           brand: "Seasonic", category: "psu", price: 109, stock: 22, image: "", wattage: 650,  specs: { Wattage: "650W",  Efficiency: "80+ Gold",     Modular: "Full" } },
  { name: "PRIME TX-1000 1000W",         brand: "Seasonic", category: "psu", price: 279, stock: 6,  image: "", wattage: 1000, specs: { Wattage: "1000W", Efficiency: "80+ Titanium", Modular: "Full" } },
  { name: "Supernova 1000 G7 1000W",     brand: "EVGA",     category: "psu", price: 179, stock: 11, image: "", wattage: 1000, specs: { Wattage: "1000W", Efficiency: "80+ Gold",     Modular: "Full" } },
  { name: "SuperNOVA 850 G7 850W",       brand: "EVGA",     category: "psu", price: 149, stock: 14, image: "", wattage: 850,  specs: { Wattage: "850W",  Efficiency: "80+ Gold",     Modular: "Full" } },
  { name: "SuperNOVA 650 G6 650W",       brand: "EVGA",     category: "psu", price: 89,  stock: 22, image: "", wattage: 650,  specs: { Wattage: "650W",  Efficiency: "80+ Gold",     Modular: "Full" } },
  { name: "Straight Power 12 1000W",     brand: "be quiet!",category: "psu", price: 199, stock: 9,  image: "", wattage: 1000, specs: { Wattage: "1000W", Efficiency: "80+ Platinum", Modular: "Full" } },
  { name: "Pure Power 12 M 750W",        brand: "be quiet!",category: "psu", price: 109, stock: 18, image: "", wattage: 750,  specs: { Wattage: "750W",  Efficiency: "80+ Gold",     Modular: "Full" } },
  { name: "Pure Power 12 M 650W",        brand: "be quiet!",category: "psu", price: 89,  stock: 22, image: "", wattage: 650,  specs: { Wattage: "650W",  Efficiency: "80+ Gold",     Modular: "Full" } },
  { name: "Cybenetics Platinum 650W",    brand: "Fractal",  category: "psu", price: 99,  stock: 20, image: "", wattage: 650,  specs: { Wattage: "650W",  Efficiency: "80+ Platinum", Modular: "Full" } },

  // ─── Cases ───────────────────────────────────────────────────────────────────
  { name: "Lian Li O11D EVO RGB",        brand: "Lian Li",   category: "case", price: 179, stock: 5,  image: "", wattage: 0, specs: { Form: "Mid Tower", "MB Support": "ATX/mATX/ITX", "Max GPU": "420 mm" } },
  { name: "Lian Li O11D Mini",           brand: "Lian Li",   category: "case", price: 99,  stock: 8,  image: "", wattage: 0, specs: { Form: "Mid Tower", "MB Support": "mATX/ITX",     "Max GPU": "360 mm" } },
  { name: "Lian Li O11D XL",             brand: "Lian Li",   category: "case", price: 229, stock: 4,  image: "", wattage: 0, specs: { Form: "Full Tower","MB Support": "E-ATX/ATX",    "Max GPU": "446 mm" } },
  { name: "PC-O11 Dynamic EVO",          brand: "Lian Li",   category: "case", price: 149, stock: 7,  image: "", wattage: 0, specs: { Form: "Mid Tower", "MB Support": "ATX/mATX/ITX", "Max GPU": "420 mm" } },
  { name: "H9 Flow Mid Tower",           brand: "NZXT",      category: "case", price: 129, stock: 8,  image: "", wattage: 0, specs: { Form: "Mid Tower", "MB Support": "ATX/mATX/ITX", "Max GPU": "400 mm" } },
  { name: "H7 Flow",                     brand: "NZXT",      category: "case", price: 109, stock: 10, image: "", wattage: 0, specs: { Form: "Mid Tower", "MB Support": "ATX/mATX",     "Max GPU": "400 mm" } },
  { name: "H7 Elite",                    brand: "NZXT",      category: "case", price: 149, stock: 8,  image: "", wattage: 0, specs: { Form: "Mid Tower", "MB Support": "ATX/mATX",     "Max GPU": "400 mm" } },
  { name: "H510 Compact",                brand: "NZXT",      category: "case", price: 69,  stock: 15, image: "", wattage: 0, specs: { Form: "Mid Tower", "MB Support": "ATX/mATX",     "Max GPU": "325 mm" } },
  { name: "H5 Flow",                     brand: "NZXT",      category: "case", price: 89,  stock: 12, image: "", wattage: 0, specs: { Form: "Mid Tower", "MB Support": "ATX/mATX/ITX", "Max GPU": "365 mm" } },
  { name: "Define 7",                    brand: "Fractal",   category: "case", price: 169, stock: 7,  image: "", wattage: 0, specs: { Form: "Full Tower","MB Support": "E-ATX/ATX",    "Max GPU": "491 mm" } },
  { name: "Define 7 Compact",            brand: "Fractal",   category: "case", price: 109, stock: 11, image: "", wattage: 0, specs: { Form: "Mid Tower", "MB Support": "ATX/mATX/ITX", "Max GPU": "360 mm" } },
  { name: "Meshify 2",                   brand: "Fractal",   category: "case", price: 149, stock: 9,  image: "", wattage: 0, specs: { Form: "Mid Tower", "MB Support": "ATX/mATX/ITX", "Max GPU": "461 mm" } },
  { name: "Meshify 2 Compact",           brand: "Fractal",   category: "case", price: 109, stock: 12, image: "", wattage: 0, specs: { Form: "Mid Tower", "MB Support": "ATX/mATX/ITX", "Max GPU": "360 mm" } },
  { name: "Torrent Compact",             brand: "Fractal",   category: "case", price: 129, stock: 8,  image: "", wattage: 0, specs: { Form: "Mid Tower", "MB Support": "ATX/mATX",     "Max GPU": "340 mm" } },
  { name: "4000D Airflow",               brand: "Corsair",   category: "case", price: 104, stock: 12, image: "", wattage: 0, specs: { Form: "Mid Tower", "MB Support": "ATX/mATX/ITX", "Max GPU": "360 mm" } },
  { name: "5000D Airflow",               brand: "Corsair",   category: "case", price: 174, stock: 8,  image: "", wattage: 0, specs: { Form: "Mid Tower", "MB Support": "ATX/mATX/ITX", "Max GPU": "420 mm" } },
  { name: "iCUE 5000X RGB",              brand: "Corsair",   category: "case", price: 199, stock: 6,  image: "", wattage: 0, specs: { Form: "Mid Tower", "MB Support": "ATX/mATX/ITX", "Max GPU": "420 mm" } },
  { name: "MAG Forge 321R Airflow",      brand: "MSI",       category: "case", price: 79,  stock: 14, image: "", wattage: 0, specs: { Form: "Mid Tower", "MB Support": "ATX/mATX/ITX", "Max GPU": "370 mm" } },
  { name: "Enthoo Pro 2",                brand: "Phanteks",  category: "case", price: 159, stock: 7,  image: "", wattage: 0, specs: { Form: "Full Tower","MB Support": "E-ATX/ATX",    "Max GPU": "503 mm" } },
  { name: "Eclipse P500A",               brand: "Phanteks",  category: "case", price: 129, stock: 9,  image: "", wattage: 0, specs: { Form: "Mid Tower", "MB Support": "ATX/mATX/ITX", "Max GPU": "420 mm" } },
  { name: "Dan A4-SFX",                  brand: "Dan Cases", category: "case", price: 189, stock: 4,  image: "", wattage: 0, specs: { Form: "ITX",       "MB Support": "ITX",          "Max GPU": "295 mm" } },
  { name: "Velka 5",                     brand: "Sliger",    category: "case", price: 129, stock: 5,  image: "", wattage: 0, specs: { Form: "ITX",       "MB Support": "ITX",          "Max GPU": "200 mm" } },

  // ─── Coolers — AIO liquid ─────────────────────────────────────────────────────
  { name: "Kraken Elite 360 AIO",         brand: "NZXT",        category: "cooler", price: 269, stock: 3,  image: "", wattage: 25, specs: { Type: "AIO Liquid", Radiator: "360 mm", Sockets: "AM5/AM4/LGA1700" } },
  { name: "Kraken Elite 280 AIO",         brand: "NZXT",        category: "cooler", price: 229, stock: 5,  image: "", wattage: 22, specs: { Type: "AIO Liquid", Radiator: "280 mm", Sockets: "AM5/AM4/LGA1700" } },
  { name: "Kraken Z53 240 AIO",           brand: "NZXT",        category: "cooler", price: 149, stock: 8,  image: "", wattage: 20, specs: { Type: "AIO Liquid", Radiator: "240 mm", Sockets: "AM5/AM4/LGA1700" } },
  { name: "Hydro H150i Elite Capellix",   brand: "Corsair",     category: "cooler", price: 199, stock: 6,  image: "", wattage: 25, specs: { Type: "AIO Liquid", Radiator: "360 mm", Sockets: "AM5/AM4/LGA1700" } },
  { name: "Hydro H100i Elite",            brand: "Corsair",     category: "cooler", price: 139, stock: 10, image: "", wattage: 20, specs: { Type: "AIO Liquid", Radiator: "240 mm", Sockets: "AM5/AM4/LGA1700" } },
  { name: "Hydro H115i RGB",              brand: "Corsair",     category: "cooler", price: 159, stock: 8,  image: "", wattage: 22, specs: { Type: "AIO Liquid", Radiator: "280 mm", Sockets: "AM5/AM4/LGA1700" } },
  { name: "Arctic Liquid Freezer III 360",brand: "Arctic",      category: "cooler", price: 109, stock: 12, image: "", wattage: 20, specs: { Type: "AIO Liquid", Radiator: "360 mm", Sockets: "AM5/AM4/LGA1700" } },
  { name: "Arctic Liquid Freezer III 240",brand: "Arctic",      category: "cooler", price: 84,  stock: 18, image: "", wattage: 18, specs: { Type: "AIO Liquid", Radiator: "240 mm", Sockets: "AM5/AM4/LGA1700" } },
  { name: "MAG CoreLiquid E360",          brand: "MSI",         category: "cooler", price: 149, stock: 9,  image: "", wattage: 22, specs: { Type: "AIO Liquid", Radiator: "360 mm", Sockets: "AM5/AM4/LGA1700" } },
  { name: "ROG Ryuo III 360",             brand: "ASUS",        category: "cooler", price: 229, stock: 5,  image: "", wattage: 25, specs: { Type: "AIO Liquid", Radiator: "360 mm", Sockets: "AM5/AM4/LGA1700" } },

  // ─── Coolers — Air ───────────────────────────────────────────────────────────
  { name: "NH-D15 Air Cooler",            brand: "Noctua",      category: "cooler", price: 109, stock: 17, image: "", wattage: 6, specs: { Type: "Air",        Radiator: "N/A",    Sockets: "AM5/AM4/LGA1700" } },
  { name: "NH-U14S",                      brand: "Noctua",      category: "cooler", price: 89,  stock: 20, image: "", wattage: 6, specs: { Type: "Air",        Radiator: "N/A",    Sockets: "AM5/AM4/LGA1700" } },
  { name: "NH-U12S Redux",                brand: "Noctua",      category: "cooler", price: 59,  stock: 24, image: "", wattage: 5, specs: { Type: "Air",        Radiator: "N/A",    Sockets: "AM5/AM4/LGA1700" } },
  { name: "Dark Rock Pro 5",              brand: "be quiet!",   category: "cooler", price: 99,  stock: 14, image: "", wattage: 6, specs: { Type: "Air",        Radiator: "N/A",    Sockets: "AM5/AM4/LGA1700" } },
  { name: "Dark Rock 4",                  brand: "be quiet!",   category: "cooler", price: 69,  stock: 18, image: "", wattage: 5, specs: { Type: "Air",        Radiator: "N/A",    Sockets: "AM5/AM4/LGA1700" } },
  { name: "Pure Rock 2",                  brand: "be quiet!",   category: "cooler", price: 39,  stock: 30, image: "", wattage: 4, specs: { Type: "Air",        Radiator: "N/A",    Sockets: "AM5/AM4/LGA1700" } },
  { name: "Arctic Freezer 36",            brand: "Arctic",      category: "cooler", price: 49,  stock: 28, image: "", wattage: 5, specs: { Type: "Air",        Radiator: "N/A",    Sockets: "AM5/AM4/LGA1700" } },
  { name: "Arctic Freezer 34 eSports",    brand: "Arctic",      category: "cooler", price: 34,  stock: 35, image: "", wattage: 4, specs: { Type: "Air",        Radiator: "N/A",    Sockets: "AM4/LGA1700"     } },
  { name: "Hyper 212 Black Edition",      brand: "Cooler Master",category: "cooler", price: 34, stock: 40, image: "", wattage: 4, specs: { Type: "Air",        Radiator: "N/A",    Sockets: "AM4/LGA1700"     } },
  { name: "MasterAir MA824 Stealth",      brand: "Cooler Master",category: "cooler", price: 84, stock: 14, image: "", wattage: 6, specs: { Type: "Air",        Radiator: "N/A",    Sockets: "AM5/AM4/LGA1700" } },
  { name: "Thermalright Phantom Spirit 120 SE", brand: "Thermalright", category: "cooler", price: 29, stock: 30, image: "", wattage: 4, specs: { Type: "Air", Radiator: "N/A",    Sockets: "AM5"             } },
  { name: "Thermalright Peerless Assassin 120", brand: "Thermalright", category: "cooler", price: 39, stock: 25, image: "", wattage: 5, specs: { Type: "Air", Radiator: "N/A",    Sockets: "AM5/AM4/LGA1700" } },
  { name: "AMD Wraith Stealth",           brand: "AMD",         category: "cooler", price: 0,   stock: 99, image: "", wattage: 3, specs: { Type: "Air",        Radiator: "N/A",    Sockets: "AM4"             } },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const existing = await Part.countDocuments();
  if (existing > 0) {
    console.log(`DB already has ${existing} parts.`);
    console.log("Drop the parts collection first if you want to re-seed.");
    await mongoose.disconnect();
    return;
  }

  const inserted = await Part.insertMany(parts);
  console.log(`Seeded ${inserted.length} parts across all categories.`);

  const summary: Record<string, number> = {};
  for (const p of parts) {
    summary[p.category] = (summary[p.category] ?? 0) + 1;
  }
  for (const [cat, count] of Object.entries(summary)) {
    console.log(`  ${cat}: ${count}`);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
