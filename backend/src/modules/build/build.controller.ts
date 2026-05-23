import { Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { AuthRequest } from '../../shared/types';
import { CreateBuildInput, UpdateBuildInput } from './build.validator';
import {
  createUserBuild,
  deleteUserBuild,
  getBuildById,
  getPublicBuilds,
  getUserBuilds,
  updateUserBuild,
} from './build.service';

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const build = await createUserBuild(req.user!.userId, req.body as CreateBuildInput);
  sendSuccess(res, build, 'Build created', 201);
});

export const listMine = asyncHandler(async (req: AuthRequest, res: Response) => {
  const builds = await getUserBuilds(req.user!.userId);
  sendSuccess(res, builds, 'Builds fetched');
});

export const listPublic = asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = req.query as unknown as { page: number; limit: number };
  const result = await getPublicBuilds(Number(query.page), Number(query.limit));
  sendSuccess(res, result, 'Public builds fetched');
});

export const getOne = asyncHandler(async (req: AuthRequest, res: Response) => {
  const build = await getBuildById(req.params['buildId'] as string, req.user?.userId);
  sendSuccess(res, build, 'Build fetched');
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const build = await updateUserBuild(
    req.params['buildId'] as string,
    req.user!.userId,
    req.body as UpdateBuildInput,
  );
  sendSuccess(res, build, 'Build updated');
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deleteUserBuild(req.params['buildId'] as string, req.user!.userId);
  sendSuccess(res, null, 'Build deleted');
});
