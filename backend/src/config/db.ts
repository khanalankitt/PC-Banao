import mongoose from 'mongoose';
import { env } from './env';

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState >= 1) return;

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] disconnected');
  });

  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  console.info(`[MongoDB] connected to ${mongoose.connection.name}`);
}
