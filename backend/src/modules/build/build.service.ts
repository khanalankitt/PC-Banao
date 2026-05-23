import mongoose from 'mongoose';
import { AppError } from '../../shared/types';
import { runCompatibilityCheck } from '../compatibility/compatibility.service';
import { findPartsByIds } from '../compatibility/compatibility.repository';
import {
  BuildRow,
  CreateBuildPayload,
  createBuild,
  deleteBuildById,
  findBuildById,
  findBuildsByUser,
  findPublicBuilds,
  updateBuildById,
} from './build.repository';
import { CreateBuildInput, UpdateBuildInput } from './build.validator';

// ─── helpers ──────────────────────────────────────────────────────────────────

function toObjectId(id: string | undefined): mongoose.Types.ObjectId | undefined {
  return id ? new mongoose.Types.ObjectId(id) : undefined;
}

function toObjectIds(ids: string[] | undefined): mongoose.Types.ObjectId[] {
  return ids?.map((id) => new mongoose.Types.ObjectId(id)) ?? [];
}

async function computeTotalPrice(components: ReturnType<typeof mapComponents>): Promise<number> {
  const allIds = [
    components.cpu,
    components.gpu,
    components.motherboard,
    components.psu,
    components.case,
    components.cooler,
    ...(components.ram    ?? []),
    ...(components.storage ?? []),
  ].filter((id): id is mongoose.Types.ObjectId => id !== undefined);

  if (allIds.length === 0) return 0;

  const parts = await findPartsByIds(allIds);
  // Parts model has price — re-fetch with price field
  const partPrices = await import('../../models/parts.model').then(({ default: Part }) =>
    Part.find({ _id: { $in: allIds } }).select('price').lean<{ price: number }[]>(),
  );
  return partPrices.reduce((sum, p) => sum + p.price, 0);
}

function mapComponents(raw: CreateBuildInput['components']): ReturnType<typeof buildComponentsFromRaw> {
  return buildComponentsFromRaw(raw);
}

function buildComponentsFromRaw(raw: CreateBuildInput['components']) {
  return {
    cpu:         toObjectId(raw.cpu),
    gpu:         toObjectId(raw.gpu),
    motherboard: toObjectId(raw.motherboard),
    ram:         toObjectIds(raw.ram),
    storage:     toObjectIds(raw.storage),
    psu:         toObjectId(raw.psu),
    case:        toObjectId(raw.case),
    cooler:      toObjectId(raw.cooler),
  };
}

function assertOwnership(build: BuildRow, userId: string): void {
  const ownerId =
    typeof build.user === 'object' && build.user !== null
      ? String((build.user as { _id: unknown })._id)
      : String(build.user);
  if (ownerId !== userId) {
    throw new AppError('Forbidden', 403);
  }
}

// ─── public API ───────────────────────────────────────────────────────────────

export async function createUserBuild(
  userId: string,
  input: CreateBuildInput,
): Promise<BuildRow> {
  const components = buildComponentsFromRaw(input.components);
  const [compatibility, totalPrice] = await Promise.all([
    runCompatibilityCheck(components),
    computeTotalPrice(components),
  ]);

  const payload: CreateBuildPayload = {
    user:                new mongoose.Types.ObjectId(userId),
    name:                input.name,
    components,
    totalPrice,
    totalWattage:        compatibility.totalWattage,
    isCompatible:        compatibility.isCompatible,
    compatibilityIssues: compatibility.issues,
    isPublic:            input.isPublic ?? false,
  };

  return createBuild(payload);
}

export async function getUserBuilds(userId: string): Promise<BuildRow[]> {
  return findBuildsByUser(new mongoose.Types.ObjectId(userId));
}

export async function getPublicBuilds(
  page: number,
  limit: number,
): Promise<{ builds: BuildRow[]; total: number; page: number; limit: number }> {
  const { builds, total } = await findPublicBuilds(page, limit);
  return { builds, total, page, limit };
}

export async function getBuildById(buildId: string, requestingUserId?: string): Promise<BuildRow> {
  const build = await findBuildById(new mongoose.Types.ObjectId(buildId));
  if (!build) throw new AppError('Build not found', 404);

  // Private builds are only visible to their owner.
  // build.user is a populated object after findBuildById, so extract _id explicitly.
  const buildOwnerId =
    typeof build.user === 'object' && build.user !== null
      ? String((build.user as { _id: unknown })._id)
      : String(build.user);

  if (!build.isPublic && buildOwnerId !== requestingUserId) {
    throw new AppError('Build not found', 404);
  }

  return build;
}

export async function updateUserBuild(
  buildId: string,
  userId: string,
  input: UpdateBuildInput,
): Promise<BuildRow> {
  const build = await findBuildById(new mongoose.Types.ObjectId(buildId));
  if (!build) throw new AppError('Build not found', 404);
  assertOwnership(build, userId);

  const patch: Parameters<typeof updateBuildById>[1] = {};

  if (input.name !== undefined) patch.name = input.name;
  if (input.isPublic !== undefined) patch.isPublic = input.isPublic;

  if (input.components) {
    const components = buildComponentsFromRaw(input.components);
    const [compatibility, totalPrice] = await Promise.all([
      runCompatibilityCheck(components),
      computeTotalPrice(components),
    ]);
    patch.components           = components;
    patch.totalPrice           = totalPrice;
    patch.totalWattage         = compatibility.totalWattage;
    patch.isCompatible         = compatibility.isCompatible;
    patch.compatibilityIssues  = compatibility.issues;
  }

  const updated = await updateBuildById(new mongoose.Types.ObjectId(buildId), patch);
  return updated!;
}

export async function deleteUserBuild(buildId: string, userId: string): Promise<void> {
  const build = await findBuildById(new mongoose.Types.ObjectId(buildId));
  if (!build) throw new AppError('Build not found', 404);
  assertOwnership(build, userId);
  await deleteBuildById(new mongoose.Types.ObjectId(buildId));
}
