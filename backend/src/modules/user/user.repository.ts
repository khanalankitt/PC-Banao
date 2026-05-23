import mongoose from 'mongoose';
import User, { IUser } from '../../models/user.model';

export type UserRow = Pick<
  IUser,
  '_id' | 'name' | 'email' | 'image' | 'role' | 'provider' | 'savedBuilds'
> & { createdAt: Date; updatedAt: Date };

export type UserSummary = Pick<IUser, '_id' | 'name' | 'email' | 'image' | 'role'> & {
  createdAt: Date;
};

export interface UpdateProfilePayload {
  name?: string;
  image?: string;
}

const PROFILE_FIELDS = 'name email image role provider savedBuilds createdAt updatedAt';
const SUMMARY_FIELDS = 'name email image role createdAt';

export async function findUserById(id: mongoose.Types.ObjectId): Promise<UserRow | null> {
  return User.findById(id).select(PROFILE_FIELDS).lean<UserRow>();
}

export async function findAllUsers(
  page: number,
  limit: number,
): Promise<{ users: UserSummary[]; total: number }> {
  const [users, total] = await Promise.all([
    User.find()
      .select(SUMMARY_FIELDS)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<UserSummary[]>(),
    User.countDocuments(),
  ]);
  return { users, total };
}

export async function updateUserById(
  id: mongoose.Types.ObjectId,
  patch: UpdateProfilePayload,
): Promise<UserRow | null> {
  return User.findByIdAndUpdate(id, { $set: patch }, { new: true })
    .select(PROFILE_FIELDS)
    .lean<UserRow>();
}

export async function deleteUserById(id: mongoose.Types.ObjectId): Promise<void> {
  await User.findByIdAndDelete(id);
}

export async function addSavedBuild(
  userId: mongoose.Types.ObjectId,
  buildId: mongoose.Types.ObjectId,
): Promise<void> {
  await User.findByIdAndUpdate(userId, { $addToSet: { savedBuilds: buildId } });
}

export async function removeSavedBuild(
  userId: mongoose.Types.ObjectId,
  buildId: mongoose.Types.ObjectId,
): Promise<void> {
  await User.findByIdAndUpdate(userId, { $pull: { savedBuilds: buildId } });
}
