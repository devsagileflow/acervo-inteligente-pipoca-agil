import { Role } from "@prisma/client";

type User = {
  id?: string;
  role: Role[];
};

// Define as ações disponíveis para controle de acesso
type Action = "view" | "list" | "create" | "update" | "delete";

// Defina os recursos disponíveis para controle de acesso
type Resource = "user";

export type PolicyStatement = {
  action: Action;
  resource: Resource;
  // Função opcional para verificações condicionais,
  // como verificar se o usuário é o proprietário do recurso
  condition?: (user: User, targetResource: any) => boolean;
};

export const policies: Readonly<Record<Role, PolicyStatement[]>> = {
  ADMIN: [
    {
      action: "view",
      resource: "user",
    },
    {
      action: "list",
      resource: "user",
    },
  ],
  USER: [
    {
      action: "view",
      resource: "user",
      condition: (user, targetResource) => user.id === targetResource.id,
    },
  ],
};

/**
 * Checa se um usuário tem permissão para realizar uma ação específica em um recurso
 *
 * @param user - O usuário para quem verificar as permissões
 * @param action - A ação que está sendo tentada
 * @param resource - O recurso sobre o qual a ação está sendo tentada
 * @param targetResource - Instância específica do recurso, usada para verificações condicionais
 * @returns Um booleano indicando se o usuário está autorizado a realizar a ação
 *
 * @example
 * // Checa se o usuário pode atualizar um post
 * if (can(currentUser, 'update', 'post', { id: '', userId: currentUser.id } as Post)) {
 *   // O usuário pode atualizar o post
 * }
 */
export function can(
  user: User,
  action: Action,
  resource: Resource,
  targetResource?: any,
): boolean {
  if (!user || !user.role) return false;

  for (const role of user.role) {
    const userPolicies = policies[role];
    if (!userPolicies) continue; // Se o papel não tiver políticas definidas, pule para o próximo

    for (const policy of userPolicies) {
      if (policy.action === action && policy.resource === resource) {
        if (policy.condition && targetResource) {
          if (policy.condition(user, targetResource)) return true;
        } else return true;
      }
    }
  }

  return false;
}
