import mongoose, { Schema, Document } from 'mongoose';

export type AuthProvider = 'google';

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  provider: AuthProvider;
  providerId: string;
  role: 'user' | 'admin';
  savedBuilds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, unique: true, lowercase: true },
    image:       { type: String },
    provider:    { type: String, enum: ['google'], required: true },
    providerId:  { type: String, required: true },
    role:        { type: String, enum: ['user', 'admin'], default: 'user' },
    savedBuilds: [{ type: Schema.Types.ObjectId, ref: 'Build' }],
  },
  { timestamps: true },
);

UserSchema.index({ provider: 1, providerId: 1 }, { unique: true });

export default mongoose.model<IUser>('User', UserSchema);
