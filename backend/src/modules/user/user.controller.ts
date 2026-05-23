import { Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { AuthRequest } from '../../shared/types';
import { UpdateProfileInput } from './user.validator';
import {
  deleteUser,
  getUserById,
  getMyProfile,
  listAllUsers,
  saveBuild,
  unsaveBuild,
  updateMyProfile,
  updateUserByAdmin,
} from './user.service';

// ─── own profile ──────────────────────────────────────────────────────────────

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await getMyProfile(req.user!.userId);
  sendSuccess(res, user, 'Profile fetched');
});

export const updateMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await updateMyProfile(req.user!.userId, req.body as UpdateProfileInput);
  sendSuccess(res, user, 'Profile updated');
});

// ─── saved builds ─────────────────────────────────────────────────────────────

export const saveMyBuild = asyncHandler(async (req: AuthRequest, res: Response) => {
  await saveBuild(req.user!.userId, req.params['buildId'] as string);
  sendSuccess(res, null, 'Build saved');
});

export const unsaveMyBuild = asyncHandler(async (req: AuthRequest, res: Response) => {
  await unsaveBuild(req.user!.userId, req.params['buildId'] as string);
  sendSuccess(res, null, 'Build removed from saved');
});

// ─── admin ────────────────────────────────────────────────────────────────────

export const listUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = req.query as unknown as { page: number; limit: number };
  const result = await listAllUsers(Number(query.page), Number(query.limit));
  sendSuccess(res, result, 'Users fetched');
});

export const getUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await getUserById(req.params['userId'] as string);
  sendSuccess(res, user, 'User fetched');
});

export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await updateUserByAdmin(
    req.params['userId'] as string,
    req.body as UpdateProfileInput,
  );
  sendSuccess(res, user, 'User updated');
});

export const removeUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deleteUser(req.params['userId'] as string);
  sendSuccess(res, null, 'User deleted');
});
