import { FastifyInstance } from "fastify";
import { Forbidden, NotFound, Unauthorized } from "http-errors";

import { updateUser } from "./user.service";
import {
  Result,
  resultSchema,
  UserBody,
  userBodySchema,
  UserParams,
  userParamsSchema,
  userSchema,
} from "@/packages/schemas";

export default async function userRoute(app: FastifyInstance) {
  app.patch<{ Body: UserBody; Params: UserParams; Reply: Result }>(
    "/users/:userId",
    {
      schema: {
        description: "Atualiza um usuário específico",
        tags: ["User"],
        params: userParamsSchema,
        body: userBodySchema,
        response: {
          200: resultSchema(userSchema),
        },
      },
    },
    async (req, reply) => {
      const sessionUser = req.sessionUser;
      if (!sessionUser) throw new Unauthorized();

      const userId = req.params.userId;
      if (sessionUser.user.id !== userId) throw new Forbidden();

      const data = req.body;
      const user = await updateUser(userId, { data });

      if (!user) throw new NotFound("USER_NOT_FOUND");

      const result: Result = {
        success: true,
        data: user,
        code: 200,
      };

      return reply.send(result);
    },
  );
}
