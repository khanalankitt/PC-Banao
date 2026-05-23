import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Must be a valid ObjectId');

const componentsSchema = z.object({
  cpu:         objectId.optional(),
  gpu:         objectId.optional(),
  motherboard: objectId.optional(),
  ram:         z.array(objectId).max(4).optional(),
  storage:     z.array(objectId).max(8).optional(),
  psu:         objectId.optional(),
  case:        objectId.optional(),
  cooler:      objectId.optional(),
});

export const createBuildSchema = z.object({
  name:       z.string().trim().min(1).max(100),
  components: componentsSchema,
  isPublic:   z.boolean().optional().default(false),
});

export const updateBuildSchema = z.object({
  name:       z.string().trim().min(1).max(100).optional(),
  components: componentsSchema.optional(),
  isPublic:   z.boolean().optional(),
}).refine(
  (d) => d.name !== undefined || d.components !== undefined || d.isPublic !== undefined,
  { message: 'Provide at least one field to update' },
);

export const buildIdSchema = z.object({
  buildId: objectId,
});

export const publicBuildsQuerySchema = z.object({
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CreateBuildInput  = z.infer<typeof createBuildSchema>;
export type UpdateBuildInput  = z.infer<typeof updateBuildSchema>;
