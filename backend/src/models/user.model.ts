import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  savedBuilds: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true },
  password:    { type: String, required: true },
  role:        { type: String, enum: ['user', 'admin'], default: 'user' },
  savedBuilds: [{ type: Schema.Types.ObjectId, ref: 'Build' }],
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);