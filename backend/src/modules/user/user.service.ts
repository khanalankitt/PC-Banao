import mongoose from 'mongoose';
import { AppError } from '../../shared/types';
import { findBuildById } from '../build/build.repository';
import {
  UserRow,
  UserSummary,
  addSavedBuild,
  deleteUserById,
  findAllUsers,
  findUserById,
  removeSavedBuild,
  updateUserById,
} from './user.repository';
import { UpdateProfileInput } from './user.validator';

// ─── own profile ──────────────────────────────────────────────────────────────

export async function getMyProfile(userId: string): Promise<UserRow> {
  const user = await findUserById(new mongoose.Types.ObjectId(userId));
  if (!user) throw new AppError('User not found', 404);
  return user;
}

export async function updateMyProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<UserRow> {
  const updated = await updateUserById(new mongoose.Types.ObjectId(userId), input);
  if (!updated) throw new AppError('User not found', 404);
  return updated;
}

// ─── saved builds ─────────────────────────────────────────────────────────────

export async function saveBuild(userId: string, buildId: string): Promise<void> {
  const build = await findBuildById(new mongoose.Types.ObjectId(buildId));
  if (!build) throw new AppError('Build not found', 404);
  if (!build.isPublic && build.user.toString() !== userId) {
    throw new AppError('Build not found', 404);
  }
  await addSavedBuild(
    new mongoose.Types.ObjectId(userId),
    new mongoose.Types.ObjectId(buildId),
  );
}

export async function unsaveBuild(userId: string, buildId: string): Promise<void> {
  await removeSavedBuild(
    new mongoose.Types.ObjectId(userId),
    new mongoose.Types.ObjectId(buildId),
  );
}

// ─── admin ────────────────────────────────────────────────────────────────────

export async function listAllUsers(
  page: number,
  limit: number,
): Promise<{ users: UserSummary[]; total: number; page: number; limit: number }> {
  const { users, total } = await findAllUsers(page, limit);
  return { users, total, page, limit };
}

export async function getUserById(targetId: string): Promise<UserRow> {
  const user = await findUserById(new mongoose.Types.ObjectId(targetId));
  if (!user) throw new AppError('User not found', 404);
  return user;
}

export async function updateUserByAdmin(
  targetId: string,
  input: UpdateProfileInput,
): Promise<UserRow> {
  const updated = await updateUserById(new mongoose.Types.ObjectId(targetId), input);
  if (!updated) throw new AppError('User not found', 404);
  return updated;
}

export async function deleteUser(targetId: string): Promise<void> {
  const user = await findUserById(new mongoose.Types.ObjectId(targetId));
  if (!user) throw new AppError('User not found', 404);
  await deleteUserById(new mongoose.Types.ObjectId(targetId));
}
