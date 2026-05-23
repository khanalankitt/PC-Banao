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

export async function findBuildById(id: mongoose.Types.ObjectId): Promise<BuildRow | null> {
  return Build.findById(id).select(BUILD_FIELDS).lean<BuildRow>();
}

export async function findBuildsByUser(
  userId: mongoose.Types.ObjectId,
): Promise<BuildRow[]> {
  return Build.find({ user: userId })
    .select(BUILD_FIELDS)
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
