import { Router } from 'express';
import { authenticate, optionalAuthenticate } from '../../shared/middlewares/auth.middleware';
import { validate } from '../../shared/middlewares/validate.middleware';
import {
  buildIdSchema,
  createBuildSchema,
  publicBuildsQuerySchema,
  updateBuildSchema,
} from './build.validator';
import { create, getOne, listMine, listPublic, remove, update } from './build.controller';

const router = Router();

// GET  /api/builds/public  — paginated community builds (no auth required)
router.get('/public', validate(publicBuildsQuerySchema, 'query'), listPublic);

// GET  /api/builds/mine — must be declared before /:buildId to avoid param capture
router.get('/mine', authenticate, listMine);

// GET  /api/builds/:buildId — public builds readable without auth; private only to owner
router.get('/:buildId', optionalAuthenticate, validate(buildIdSchema, 'params'), getOne);

// All remaining build routes require authentication
router.use(authenticate);

// POST /api/builds         — create a new build
router.post('/', validate(createBuildSchema), create);

// PATCH /api/builds/:buildId
router.patch('/:buildId', validate(buildIdSchema, 'params'), validate(updateBuildSchema), update);

// DELETE /api/builds/:buildId
router.delete('/:buildId', validate(buildIdSchema, 'params'), remove);

export default router;
