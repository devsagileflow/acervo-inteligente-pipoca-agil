import z from "zod";

export const userParamsSchema = z.object({
  userId: z.string(),
});
export type UserParams = z.infer<typeof userParamsSchema>;

export const userBodySchema = z.object({
  name: z.string().optional(),
});
export type UserBody = z.infer<typeof userBodySchema>;

export const profileQueryOptionsSchema = z.object({
  include: z
    .object({
      user: z.boolean().optional(),
    })
    .optional(),
});
export type ProfileQueryOptions = z.infer<typeof profileQueryOptionsSchema>;
