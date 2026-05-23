import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';
import { validate } from '../../shared/middlewares/validate.middleware';
import {
  buildIdParamSchema,
  paginationSchema,
  updateProfileSchema,
  userIdSchema,
} from './user.validator';
import {
  getMe,
  getUser,
  listUsers,
  removeUser,
  saveMyBuild,
  unsaveMyBuild,
  updateMe,
  updateUser,
} from './user.controller';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// ─── own profile ──────────────────────────────────────────────────────────────
router.get('/me', getMe);
router.patch('/me', validate(updateProfileSchema), updateMe);

// ─── saved builds ─────────────────────────────────────────────────────────────
router.post('/me/saved-builds/:buildId',   validate(buildIdParamSchema, 'params'), saveMyBuild);
router.delete('/me/saved-builds/:buildId', validate(buildIdParamSchema, 'params'), unsaveMyBuild);

// ─── admin ────────────────────────────────────────────────────────────────────
router.get('/',           authorize('admin'), validate(paginationSchema, 'query'), listUsers);
router.get('/:userId',    authorize('admin'), validate(userIdSchema, 'params'), getUser);
router.patch('/:userId',  authorize('admin'), validate(userIdSchema, 'params'), validate(updateProfileSchema), updateUser);
router.delete('/:userId', authorize('admin'), validate(userIdSchema, 'params'), removeUser);

export default router;
