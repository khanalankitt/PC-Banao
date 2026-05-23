import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Must be a valid ObjectId');

export const checkByComponentsSchema = z.object({
  cpu:         objectId.optional(),
  gpu:         objectId.optional(),
  motherboard: objectId.optional(),
  ram:         z.array(objectId).max(4).optional(),
  storage:     z.array(objectId).max(8).optional(),
  psu:         objectId.optional(),
  case:        objectId.optional(),
  cooler:      objectId.optional(),
}).refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  { message: 'Provide at least one component' },
);

export const checkByBuildIdSchema = z.object({
  buildId: objectId,
});

export type CheckByComponentsInput = z.infer<typeof checkByComponentsSchema>;
