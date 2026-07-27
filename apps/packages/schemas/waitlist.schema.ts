import { z } from "zod";

export const waitlistRoleSchema = z.enum(["PO", "SM", "DEV", "OTHER"]);
export type WaitlistRole = z.infer<typeof waitlistRoleSchema>;

export const waitlistSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: waitlistRoleSchema.nullish(),
  message: z.string().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Waitlist = z.infer<typeof waitlistSchema>;
