import { Router } from 'express';
import { validate } from '../../shared/middlewares/validate.middleware';
import { authenticate } from '../../shared/middlewares/auth.middleware';
import { oauthLoginSchema } from './auth.validator';
import { oauthLogin, me } from './auth.controller';

const router = Router();

// POST /api/auth/oauth  — exchange provider access token for app JWT
router.post('/oauth', validate(oauthLoginSchema), oauthLogin);

// GET /api/auth/me  — return the current user from the JWT
router.get('/me', authenticate, me);

export default router;
