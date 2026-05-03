import { z } from "zod";

export const Role = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;
export type Role = (typeof Role)[keyof typeof Role];
export const roleParcer = (role: Role): string => {
  const parser: Record<Role, string> = {
    ADMIN: "Administrador",
    USER: "Usuário",
  };

  return parser[role] || "";
};
export const roleSchema = z.enum(Role, "Função do usuário inválida");

export const userSchema = z.object({
  id: z.string().optional(),
  role: z.array(roleSchema).optional(),
  name: z.string("Nome do usuário é obrigatório"),
  email: z.email("Email do usuário é inválido"),
  emailVerified: z.boolean().optional(),
  image: z.string().nullish(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});
export type User = z.infer<typeof userSchema>;
