import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { CheckByComponentsInput } from './compatibility.validator';
import { checkComponentsFromRequest, checkAndPersistBuild } from './compatibility.service';

export const checkByComponents = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CheckByComponentsInput;
  const result = await checkComponentsFromRequest(body);
  sendSuccess(res, result, 'Compatibility check complete');
});

export const checkBuildCompatibility = asyncHandler(async (req: Request, res: Response) => {
  const buildId = req.params['buildId'] as string;
  const result = await checkAndPersistBuild(buildId);
  sendSuccess(res, result, 'Build compatibility updated');
});
