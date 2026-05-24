import mongoose from 'mongoose';
import Part from '../../models/parts.model';
import Build from '../../models/builds.model';
import { IPartSpecs, PartCategory } from '../../models/parts.model';
import { IBuildComponents } from '../../models/builds.model';

export type PartRow = {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: PartCategory;
  wattage: number;
  specs: IPartSpecs;
};

export type BuildRow = {
  _id: mongoose.Types.ObjectId;
  components: IBuildComponents;
};

export async function findPartById(id: mongoose.Types.ObjectId): Promise<PartRow | null> {
  return Part.findById(id).select('name category wattage specs').lean<PartRow>();
}

export async function findPartsByIds(ids: mongoose.Types.ObjectId[]): Promise<PartRow[]> {
  if (ids.length === 0) return [];
  return Part.find({ _id: { $in: ids } }).select('name category wattage specs').lean<PartRow[]>();
}

export async function findBuildById(id: mongoose.Types.ObjectId): Promise<BuildRow | null> {
  return Build.findById(id).select('components').lean<BuildRow>();
}

export async function updateBuildCompatibility(
  id: mongoose.Types.ObjectId,
  patch: {
    isCompatible: boolean;
    compatibilityIssues: string[];
    totalWattage: number;
  },
): Promise<void> {
  await Build.findByIdAndUpdate(id, patch);
}
