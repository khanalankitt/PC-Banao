import { Router } from 'express';
import { authenticate } from '../../shared/middlewares/auth.middleware';
import { validate } from '../../shared/middlewares/validate.middleware';
import { checkByComponentsSchema, checkByBuildIdSchema } from './compatibility.validator';
import { checkByComponents, checkBuildCompatibility } from './compatibility.controller';

const router = Router();

// POST /api/compatibility/check  — ad-hoc check, no auth required
router.post(
  '/check',
  validate(checkByComponentsSchema),
  checkByComponents,
);

// GET /api/compatibility/build/:buildId  — check + persist, auth required
router.get(
  '/build/:buildId',
  authenticate,
  validate(checkByBuildIdSchema, 'params'),
  checkBuildCompatibility,
);

export default router;
