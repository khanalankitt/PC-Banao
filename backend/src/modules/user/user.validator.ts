import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Must be a valid ObjectId');

export const updateProfileSchema = z.object({
  name:  z.string().trim().min(1).max(100).optional(),
  image: z.url('Must be a valid URL').optional(),
}).refine(
  (d) => d.name !== undefined || d.image !== undefined,
  { message: 'Provide at least one field to update' },
);

export const userIdSchema = z.object({
  userId: objectId,
});

export const buildIdParamSchema = z.object({
  buildId: objectId,
});

export const paginationSchema = z.object({
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
