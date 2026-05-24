import { z } from 'zod';

export const oauthLoginSchema = z.object({
  provider:    z.enum(['google']),
  accessToken: z.string().min(1, 'accessToken is required'),
});

export type OAuthLoginInput = z.infer<typeof oauthLoginSchema>;
