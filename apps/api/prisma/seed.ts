import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { seedAgilidadeGeralTrail, seedPoProductOwnerTrail } from "./seed-trail";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl });
  const prisma = new PrismaClient({ adapter });

  try {
    await seedAgilidadeGeralTrail(prisma);
    await seedPoProductOwnerTrail(prisma);
    console.log(
      "Seed executado com sucesso: Trilhas Agilidade Geral e PO — Product Owner.",
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Falha ao executar seed:", error);
  process.exit(1);
});
