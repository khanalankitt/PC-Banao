import User, { IUser, AuthProvider } from '../../models/user.model';

export type UserRow = Pick<IUser, '_id' | 'name' | 'email' | 'image' | 'role' | 'provider' | 'providerId'>;

export interface UpsertUserPayload {
  provider: AuthProvider;
  providerId: string;
  name: string;
  email: string;
  image?: string;
}

export async function findUserById(id: string): Promise<UserRow | null> {
  return User.findById(id).select('name email image role provider providerId').lean<UserRow>();
}

export async function upsertOAuthUser(payload: UpsertUserPayload): Promise<UserRow> {
  const user = await User.findOneAndUpdate(
    { provider: payload.provider, providerId: payload.providerId },
    {
      $set: {
        name:  payload.name,
        email: payload.email,
        image: payload.image,
      },
      $setOnInsert: {
        role: 'user',
      },
    },
    { upsert: true, new: true, select: 'name email image role provider providerId' },
  ).lean<UserRow>();

  return user!;
}
