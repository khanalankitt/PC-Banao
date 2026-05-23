import { Router } from 'express';
import { authenticate } from '../../shared/middlewares/auth.middleware';
import { validate } from '../../shared/middlewares/validate.middleware';
import {
  buildIdSchema,
  createBuildSchema,
  publicBuildsQuerySchema,
  updateBuildSchema,
} from './build.validator';
import { create, getOne, listMine, listPublic, remove, update } from './build.controller';

const router = Router();

// All build routes require authentication
router.use(authenticate);

// GET  /api/builds/public  — paginated community builds (auth still required for future personalization)
router.get('/public', validate(publicBuildsQuerySchema, 'query'), listPublic);

// GET  /api/builds/mine    — all builds belonging to the current user
router.get('/mine', listMine);

// POST /api/builds         — create a new build
router.post('/', validate(createBuildSchema), create);

// GET  /api/builds/:buildId
router.get('/:buildId', validate(buildIdSchema, 'params'), getOne);

// PATCH /api/builds/:buildId
router.patch('/:buildId', validate(buildIdSchema, 'params'), validate(updateBuildSchema), update);

// DELETE /api/builds/:buildId
router.delete('/:buildId', validate(buildIdSchema, 'params'), remove);

export default router;
