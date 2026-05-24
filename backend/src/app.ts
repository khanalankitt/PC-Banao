import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';

import { env } from './config/env';
import { connectDB } from './config/db';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import { AppError } from './shared/types';

import { authRouter } from './modules/auth';
import { buildRouter } from './modules/build';
import { compatibilityRouter } from './modules/compatibility';
import { productRouter } from './modules/product';
import { userRouter } from './modules/user';

const app = express();

// ─── security & parsing ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// ─── rate limiting ─────────────────────────────────────────────────────────────
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later',
  }),
);

// ─── routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/builds', buildRouter);
app.use('/api/compatibility', compatibilityRouter);

// 404 catch-all (must come after all routes)
app.use((_req, _res, next) => {
  next(new AppError('Route not found', 404));
});

// ─── global error handler ─────────────────────────────────────────────────────
app.use(errorMiddleware);

// ─── bootstrap (local dev only) ───────────────────────────────────────────────
// On Vercel the entry point is src/index.ts which connects and exports the app.
// VERCEL env var is set automatically in the Vercel runtime.
if (!process.env.VERCEL) {
  const bootstrap = async (): Promise<void> => {
    await connectDB();
    app.listen(env.port, () => {
      console.info(`[Server] running on port ${env.port} (${env.nodeEnv})`);
    });
  };

  bootstrap().catch((err) => {
    console.error('[Fatal] failed to start server:', err);
    process.exit(1);
  });
}

export default app;
