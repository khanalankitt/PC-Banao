import app from './app';
import { connectDB } from './config/db';

// Vercel serverless: connect to DB on cold start, then export the app.
// connectDB is idempotent — mongoose skips if already connected.
connectDB().catch((err) => {
  console.error('[Fatal] DB connection failed:', err);
});

export default app;
