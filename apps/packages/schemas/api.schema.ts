import { z } from "zod";

export const orderDirection = z.enum(["asc", "desc"]);
