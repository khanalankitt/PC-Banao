import mongoose from 'mongoose';
import { env } from './env';

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState >= 1) return;

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] disconnected');
  });

  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 5000,
    // Keep the connection alive across Vercel warm invocations
    maxPoolSize: 10,
    minPoolSize: 1,
    socketTimeoutMS: 30_000,
    // Reduce DNS lookups on repeat cold starts
    family: 4,
  });

  console.info(`[MongoDB] connected to ${mongoose.connection.name}`);
}
