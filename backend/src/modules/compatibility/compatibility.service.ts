import mongoose from 'mongoose';
import { IBuildComponents } from '../../models/builds.model';
import { PartCategory } from '../../models/parts.model';
import { AppError } from '../../shared/types';
import {
  PartRow,
  findPartById,
  findPartsByIds,
  findBuildById,
  updateBuildCompatibility,
} from './compatibility.repository';

export interface CompatibilityResult {
  isCompatible: boolean;
  issues: string[];
  warnings: string[];
  totalWattage: number;
}

// Conservative fallbacks for parts whose specs lack an explicit wattage/tdp value
const WATTAGE_FALLBACKS: Partial<Record<PartCategory, number>> = {
  cpu: 95,
  gpu: 200,
  motherboard: 50,
  ram: 10,
  storage: 10,
  cooler: 10,
  case: 0,
};

// ─── rule checkers (pure functions — no I/O) ──────────────────────────────────

function ruleCpuMotherboard(
  cpu: PartRow,
  mb: PartRow,
  issues: string[],
): void {
  if (cpu.specs.socket && mb.specs.socket && cpu.specs.socket !== mb.specs.socket) {
    issues.push(
      `CPU socket mismatch: ${cpu.name} uses ${cpu.specs.socket} but ${mb.name} requires ${mb.specs.socket}`,
    );
  }
}

function ruleRamMotherboard(
  ramSticks: PartRow[],
  mb: PartRow,
  issues: string[],
  warnings: string[],
): void {
  const mbSlots = mb.specs.memorySlots ?? 4;

  for (const ram of ramSticks) {
    if (mb.specs.memoryType && ram.specs.type && ram.specs.type !== mb.specs.memoryType) {
      issues.push(
        `RAM type mismatch: ${ram.name} is ${ram.specs.type} but ${mb.name} supports ${mb.specs.memoryType}`,
      );
    }
  }

  if (ramSticks.length > mbSlots) {
    issues.push(
      `Too many RAM sticks: ${mb.name} has ${mbSlots} slots but ${ramSticks.length} selected`,
    );
  }

  if (mb.specs.maxMemory) {
    const totalGb = ramSticks.reduce((sum, r) => sum + (r.specs.capacity ?? 0), 0);
    if (totalGb > mb.specs.maxMemory) {
      issues.push(
        `RAM exceeds motherboard maximum: ${totalGb} GB installed, ${mb.name} supports up to ${mb.specs.maxMemory} GB`,
      );
    }
  }

  if (ramSticks.length % 2 !== 0 && mbSlots >= 4) {
    warnings.push(`Odd RAM stick count on ${mb.name} may disable dual-channel mode`);
  }
}

function rulePsuWattage(
  parts: {
    cpu: PartRow | null;
    gpu: PartRow | null;
    ramSticks: PartRow[];
    storageList: PartRow[];
    cooler: PartRow | null;
  },
  psu: PartRow,
  issues: string[],
  warnings: string[],
): number {
  const psuWattage = psu.wattage > 0 ? psu.wattage : (psu.specs.wattage ?? 0);

  const estimated =
    (parts.cpu    ? (parts.cpu.wattage    || WATTAGE_FALLBACKS.cpu    || 0) : (WATTAGE_FALLBACKS.cpu    ?? 0)) +
    (parts.gpu    ? (parts.gpu.wattage    || WATTAGE_FALLBACKS.gpu    || 0) : (WATTAGE_FALLBACKS.gpu    ?? 0)) +
    (WATTAGE_FALLBACKS.motherboard ?? 0) +
    parts.ramSticks.length   * (WATTAGE_FALLBACKS.ram    ?? 0) +
    parts.storageList.length * (WATTAGE_FALLBACKS.storage ?? 0) +
    (parts.cooler ? (parts.cooler.wattage || WATTAGE_FALLBACKS.cooler || 0) : (WATTAGE_FALLBACKS.cooler ?? 0));

  const recommended = Math.ceil(estimated * 1.2); // 20 % headroom is the industry standard

  if (psuWattage > 0 && psuWattage < estimated) {
    issues.push(
      `PSU insufficient: system draws ~${estimated} W but ${psu.name} is only ${psuWattage} W`,
    );
  } else if (psuWattage > 0 && psuWattage < recommended) {
    warnings.push(
      `PSU headroom is tight: ~${estimated} W draw against ${psuWattage} W (recommended ≥${recommended} W)`,
    );
  }

  return estimated;
}

function ruleCaseFormFactor(
  mb: PartRow,
  pcCase: PartRow,
  issues: string[],
): void {
  const supported = pcCase.specs.supportedFormFactors ?? [];
  if (mb.specs.formFactor && supported.length > 0 && !supported.includes(mb.specs.formFactor)) {
    issues.push(
      `Form factor mismatch: ${mb.name} is ${mb.specs.formFactor} but ${pcCase.name} supports ${supported.join(', ')}`,
    );
  }
}

function ruleCaseGpuLength(
  gpu: PartRow,
  pcCase: PartRow,
  issues: string[],
  warnings: string[],
): void {
  const { length: gpuLen } = gpu.specs;
  const { maxGpuLength } = pcCase.specs;
  if (gpuLen && maxGpuLength) {
    if (gpuLen > maxGpuLength) {
      issues.push(`GPU too long: ${gpu.name} is ${gpuLen} mm, ${pcCase.name} fits up to ${maxGpuLength} mm`);
    } else if (gpuLen > maxGpuLength - 20) {
      warnings.push(`Tight GPU fit: ${gpu.name} (${gpuLen} mm) is within 20 mm of the case limit — verify cable clearance`);
    }
  }
}

function ruleCaseCoolerHeight(
  cooler: PartRow,
  pcCase: PartRow,
  issues: string[],
  warnings: string[],
): void {
  const { height: coolerH } = cooler.specs;
  const { maxCoolerHeight } = pcCase.specs;
  if (coolerH && maxCoolerHeight) {
    if (coolerH > maxCoolerHeight) {
      issues.push(`Cooler too tall: ${cooler.name} is ${coolerH} mm, ${pcCase.name} fits up to ${maxCoolerHeight} mm`);
    } else if (coolerH > maxCoolerHeight - 10) {
      warnings.push(`Tight cooler clearance: ${cooler.name} (${coolerH} mm) leaves less than 10 mm in ${pcCase.name}`);
    }
  }
}

function ruleCoolerCpu(
  cpu: PartRow,
  cooler: PartRow,
  issues: string[],
  warnings: string[],
): void {
  const supported = cooler.specs.supportedSockets ?? [];
  if (cpu.specs.socket && supported.length > 0 && !supported.includes(cpu.specs.socket)) {
    issues.push(
      `Cooler incompatible: ${cooler.name} does not support ${cpu.specs.socket} (supports: ${supported.join(', ')})`,
    );
  }

  const { tdp: cpuTdp } = cpu.specs;
  const { coolerTdp } = cooler.specs;
  if (cpuTdp && coolerTdp) {
    if (cpuTdp > coolerTdp) {
      issues.push(`Cooler TDP insufficient: ${cpu.name} is ${cpuTdp} W, ${cooler.name} is rated for ${coolerTdp} W`);
    } else if (cpuTdp > coolerTdp * 0.85) {
      warnings.push(`Cooler near its limit: ${cpu.name} (${cpuTdp} W) exceeds 85 % of ${cooler.name}'s ${coolerTdp} W rating`);
    }
  }
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function toObjectId(id: string | undefined): mongoose.Types.ObjectId | undefined {
  return id ? new mongoose.Types.ObjectId(id) : undefined;
}

function toObjectIds(ids: string[] | undefined): mongoose.Types.ObjectId[] {
  return ids?.map((id) => new mongoose.Types.ObjectId(id)) ?? [];
}

// ─── public API ───────────────────────────────────────────────────────────────

export async function runCompatibilityCheck(
  components: IBuildComponents,
): Promise<CompatibilityResult> {
  const issues: string[] = [];
  const warnings: string[] = [];

  const [cpu, gpu, mb, psu, pcCase, cooler, ramSticks, storageList] = await Promise.all([
    components.cpu         ? findPartById(components.cpu)         : null,
    components.gpu         ? findPartById(components.gpu)         : null,
    components.motherboard ? findPartById(components.motherboard) : null,
    components.psu         ? findPartById(components.psu)         : null,
    components.case        ? findPartById(components.case)        : null,
    components.cooler      ? findPartById(components.cooler)      : null,
    findPartsByIds(components.ram     ?? []),
    findPartsByIds(components.storage ?? []),
  ]);

  if (cpu && mb)                  ruleCpuMotherboard(cpu, mb, issues);
  if (mb && ramSticks.length > 0) ruleRamMotherboard(ramSticks, mb, issues, warnings);
  if (psu)                        rulePsuWattage({ cpu, gpu, ramSticks, storageList, cooler }, psu, issues, warnings);
  if (mb && pcCase)               ruleCaseFormFactor(mb, pcCase, issues);
  if (gpu && pcCase)              ruleCaseGpuLength(gpu, pcCase, issues, warnings);
  if (cooler && pcCase)           ruleCaseCoolerHeight(cooler, pcCase, issues, warnings);
  if (cpu && cooler)              ruleCoolerCpu(cpu, cooler, issues, warnings);

  const totalWattage =
    (cpu    ? (cpu.wattage    || WATTAGE_FALLBACKS.cpu    || 0) : (WATTAGE_FALLBACKS.cpu    ?? 0)) +
    (gpu    ? (gpu.wattage    || WATTAGE_FALLBACKS.gpu    || 0) : (WATTAGE_FALLBACKS.gpu    ?? 0)) +
    (WATTAGE_FALLBACKS.motherboard ?? 0) +
    ramSticks.length   * (WATTAGE_FALLBACKS.ram    ?? 0) +
    storageList.length * (WATTAGE_FALLBACKS.storage ?? 0) +
    (cooler ? (cooler.wattage || WATTAGE_FALLBACKS.cooler || 0) : (WATTAGE_FALLBACKS.cooler ?? 0));

  return { isCompatible: issues.length === 0, issues, warnings, totalWattage };
}

export interface RawComponentIds {
  cpu?: string;
  gpu?: string;
  motherboard?: string;
  ram?: string[];
  storage?: string[];
  psu?: string;
  case?: string;
  cooler?: string;
}

export async function checkComponentsFromRequest(raw: RawComponentIds): Promise<CompatibilityResult> {
  const components: IBuildComponents = {
    cpu:         toObjectId(raw.cpu as string | undefined),
    gpu:         toObjectId(raw.gpu as string | undefined),
    motherboard: toObjectId(raw.motherboard as string | undefined),
    ram:         toObjectIds(raw.ram as string[] | undefined),
    storage:     toObjectIds(raw.storage as string[] | undefined),
    psu:         toObjectId(raw.psu as string | undefined),
    case:        toObjectId(raw.case as string | undefined),
    cooler:      toObjectId(raw.cooler as string | undefined),
  };
  return runCompatibilityCheck(components);
}

export async function checkAndPersistBuild(buildId: string): Promise<CompatibilityResult> {
  const buildObjectId = new mongoose.Types.ObjectId(buildId);
  const build = await findBuildById(buildObjectId);
  if (!build) throw new AppError('Build not found', 404);

  const result = await runCompatibilityCheck(build.components);

  await updateBuildCompatibility(buildObjectId, {
    isCompatible: result.isCompatible,
    compatibilityIssues: result.issues,
    totalWattage: result.totalWattage,
  });

  return result;
}
