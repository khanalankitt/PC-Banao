import mongoose from 'mongoose';
import Build, { IBuild, IBuildComponents } from '../../models/builds.model';

export type BuildRow = Pick<
  IBuild,
  | '_id'
  | 'user'
  | 'name'
  | 'components'
  | 'totalPrice'
  | 'totalWattage'
  | 'isCompatible'
  | 'compatibilityIssues'
  | 'isPublic'
  | 'aiSuggested'
> & {
  createdAt: Date;
  updatedAt: Date;
};

export interface CreateBuildPayload {
  user: mongoose.Types.ObjectId;
  name: string;
  components: IBuildComponents;
  totalPrice: number;
  totalWattage: number;
  isCompatible: boolean;
  compatibilityIssues: string[];
  isPublic: boolean;
}

export interface UpdateBuildPayload {
  name?: string;
  components?: IBuildComponents;
  totalPrice?: number;
  totalWattage?: number;
  isCompatible?: boolean;
  compatibilityIssues?: string[];
  isPublic?: boolean;
}

const BUILD_FIELDS =
  'user name components totalPrice totalWattage isCompatible compatibilityIssues isPublic aiSuggested createdAt updatedAt';

const PART_FIELDS = 'name brand category price stock image specs';
const COMPONENT_POPULATE = [
  { path: 'user',                   select: 'name image' },
  { path: 'components.cpu',         select: PART_FIELDS },
  { path: 'components.gpu',         select: PART_FIELDS },
  { path: 'components.motherboard', select: PART_FIELDS },
  { path: 'components.psu',         select: PART_FIELDS },
  { path: 'components.case',        select: PART_FIELDS },
  { path: 'components.cooler',      select: PART_FIELDS },
  { path: 'components.ram',         select: PART_FIELDS },
  { path: 'components.storage',     select: PART_FIELDS },
];

export async function findBuildById(id: mongoose.Types.ObjectId): Promise<BuildRow | null> {
  return Build.findById(id).select(BUILD_FIELDS).populate(COMPONENT_POPULATE).lean<BuildRow>();
}

export async function findBuildsByUser(
  userId: mongoose.Types.ObjectId,
): Promise<BuildRow[]> {
  return Build.find({ user: userId })
    .select(BUILD_FIELDS)
    .populate(COMPONENT_POPULATE)
    .sort({ createdAt: -1 })
    .lean<BuildRow[]>();
}

export async function findPublicBuilds(
  page: number,
  limit: number,
): Promise<{ builds: BuildRow[]; total: number }> {
  const filter = { isPublic: true };
  const [builds, total] = await Promise.all([
    Build.find(filter)
      .select(BUILD_FIELDS)
      .populate(COMPONENT_POPULATE)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<BuildRow[]>(),
    Build.countDocuments(filter),
  ]);
  return { builds, total };
}

export async function createBuild(payload: CreateBuildPayload): Promise<BuildRow> {
  const build = await Build.create(payload);
  return build.toObject() as unknown as BuildRow;
}

export async function updateBuildById(
  id: mongoose.Types.ObjectId,
  patch: UpdateBuildPayload,
): Promise<BuildRow | null> {
  return Build.findByIdAndUpdate(id, { $set: patch }, { new: true })
    .select(BUILD_FIELDS)
    .lean<BuildRow>();
}

export async function deleteBuildById(id: mongoose.Types.ObjectId): Promise<void> {
  await Build.findByIdAndDelete(id);
}
