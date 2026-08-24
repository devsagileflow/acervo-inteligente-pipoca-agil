import { ContentType, PrismaClient } from "@prisma/client";

const AGILIDADE_GERAL_TRAIL_ID = "trail-agilidade-geral";
const PO_TRAIL_ID = "trail-po-product-owner";

type SeedVideo = {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  durationInSeconds: number;
  position: number;
};

const AGILIDADE_GERAL_VIDEOS: SeedVideo[] = [
  {
    id: "video-agilidade-geral-01",
    title: "Pílula Ágil — O que não fazer em uma Daily Scrum",
    description:
      "Checklist prático do que evitar numa Daily e do que priorizar para manter foco no progresso e na colaboração.",
    youtubeUrl: "https://youtu.be/DSC9Zvk35PI",
    durationInSeconds: 9 * 60,
    position: 1,
  },
  {
    id: "video-agilidade-geral-02",
    title: "Pílula Ágil — O que é Auto-organização numa equipe ágil?",
    description:
      "Explica auto-organização com responsabilidade e práticas para criar confiança, clareza de objetivos e autonomia real.",
    youtubeUrl: "https://youtu.be/vtTA_5J2YBg",
    durationInSeconds: 21 * 60,
    position: 2,
  },
  {
    id: "video-agilidade-geral-03",
    title: "Scrum como Cascata Disfarçado",
    description:
      "Mostra antipadrões de um Scrum que reproduz cascata na prática, com exemplo real de projeto institucional.",
    youtubeUrl: "https://youtu.be/rZ_fo_Ckbr4",
    durationInSeconds: 38 * 60,
    position: 3,
  },
  {
    id: "video-agilidade-geral-04",
    title: "Comando e Controle Ágil",
    description:
      "Discute o microgerenciamento disfarçado de agilidade e caminhos para descentralizar decisões no time.",
    youtubeUrl: "https://youtu.be/2CNKiNCKJxQ",
    durationInSeconds: 13 * 60,
    position: 4,
  },
  {
    id: "video-agilidade-geral-05",
    title: "Histórias de Usuário — A Base do Desenvolvimento Ágil",
    description:
      "Apresenta critérios INVEST e exemplos práticos de história ruim versus boa, com foco em entrega incremental.",
    youtubeUrl: "https://youtu.be/B6rPxG2-9aU",
    durationInSeconds: 16 * 60,
    position: 5,
  },
  {
    id: "video-agilidade-geral-06",
    title: "DoR e DoD em Histórias de Usuário",
    description:
      "Diferencia Definition of Ready e Definition of Done com critérios objetivos para iniciar e concluir histórias.",
    youtubeUrl: "https://youtu.be/ZeXMzwMY3T0",
    durationInSeconds: 20 * 60,
    position: 6,
  },
  {
    id: "video-agilidade-geral-07",
    title: "Critérios de Aceite — Parte essencial das histórias de usuário",
    description:
      "Mostra como escrever critérios de aceite em Given/When/Then e evitar erros comuns de especificação.",
    youtubeUrl: "https://youtu.be/n0uGb2Ha-Pw",
    durationInSeconds: 20 * 60,
    position: 7,
  },
  {
    id: "video-agilidade-geral-08",
    title: "User Story Mapping",
    description:
      "Ensina a técnica visual de mapeamento de histórias com exemplo de ponta a ponta para planejamento por sprint.",
    youtubeUrl: "https://youtu.be/Hmxn8KIukx8",
    durationInSeconds: 12 * 60,
    position: 8,
  },
  {
    id: "video-agilidade-geral-09",
    title: "Burndown e Burnup — Essenciais para Gestão de Projetos Ágeis",
    description:
      "Explica leitura de burndown e burnup, diferenças entre trabalho restante e concluído e quando usar cada gráfico.",
    youtubeUrl: "https://youtu.be/o7Q3Z7-qWac",
    durationInSeconds: 13 * 60,
    position: 9,
  },
  {
    id: "video-agilidade-geral-10",
    title: "Quais são as maiores falácias na Agilidade",
    description:
      "Fecha a trilha com sete mitos recorrentes sobre agilidade e uma reflexão crítica sobre limites e contexto.",
    youtubeUrl: "https://youtu.be/ec16338ObUA",
    durationInSeconds: 12 * 60,
    position: 10,
  },
];

const AGILIDADE_GERAL_TRAIL_DESCRIPTION =
  "Trilha de fundamentos sobre cerimônias, auto-organização, antipadrões ágeis, histórias de usuário e acompanhamento de progresso. Tags: Scrum e Cerimônias, Auto-organização, Antipadrões Ágeis, Histórias de Usuário, Critérios de Aceite, Acompanhamento de Progresso, Crítica e Reflexão. Ficha técnica: 10 vídeos, duração total aproximada de 2h54min, formato em pílulas objetivas de 9 a 38min, com ritmo sugerido de 5 a 6 sessões de estudo.";

const PO_VIDEOS: SeedVideo[] = [
  {
    id: "video-po-product-owner-01",
    title: "Pílula Ágil — Product Manager vs. Product Owner",
    description:
      "Comparação prática entre PM e PO, destacando estratégia, mercado, backlog e atuação com o time em diferentes contextos.",
    youtubeUrl: "https://www.youtube.com/watch?v=wNGyUPr5y0o",
    durationInSeconds: 12 * 60,
    position: 1,
  },
  {
    id: "video-po-product-owner-02",
    title: "Pílula Ágil — Product Owner: Atribuições e Habilidades Essenciais",
    description:
      "Introdução objetiva às responsabilidades do PO, com foco nas habilidades técnicas e comportamentais do dia a dia.",
    youtubeUrl: "https://www.youtube.com/watch?v=CUtZPn516qs",
    durationInSeconds: 14 * 60,
    position: 2,
  },
  {
    id: "video-po-product-owner-03",
    title: "Pílula Ágil — PO preocupado com a organização do time!",
    description:
      "Esclarece limites entre PO e Scrum Master para evitar sobreposição de papéis e decisões fora de escopo.",
    youtubeUrl: "https://www.youtube.com/watch?v=-5d2M65Z34w",
    durationInSeconds: 26 * 60,
    position: 3,
  },
  {
    id: "video-po-product-owner-04",
    title: "Product Owner como você nunca viu — convidada Débora Magnago",
    description:
      "Debate sobre transição de carreira para PO e práticas de fatiamento de histórias em entregas menores e valiosas.",
    youtubeUrl: "https://youtu.be/NH3lQFbfDa8",
    durationInSeconds: 67 * 60,
    position: 4,
  },
  {
    id: "video-po-product-owner-05",
    title: "Pílula Ágil — Posso ser Product Owner de vários times?",
    description:
      "Prós, contras e cuidados para PO em múltiplos times, com recomendações práticas de limite e delegação.",
    youtubeUrl: "https://www.youtube.com/watch?v=RgGTuI2AgBw",
    durationInSeconds: 20 * 60,
    position: 5,
  },
  {
    id: "video-po-product-owner-06",
    title: 'Tide Cardoso — "Entregar o produto é difícil"',
    description:
      "Crítica ao PO tirador de pedido, foco em métricas por contexto de produto e sinais de backlog desbalanceado.",
    youtubeUrl: "https://www.youtube.com/watch?v=k_HLctcPEsE",
    durationInSeconds: 80 * 60,
    position: 6,
  },
  {
    id: "video-po-product-owner-07",
    title: "O papel do Product Manager em Inovação",
    description:
      "Erros na escrita de histórias de usuário e uso de técnicas de priorização como MoSCoW, GUT e RICE.",
    youtubeUrl: "https://www.youtube.com/watch?v=5-KLp_7wVg4",
    durationInSeconds: 58 * 60,
    position: 7,
  },
  {
    id: "video-po-product-owner-08",
    title: "Product Owner + IA = Super-Poderes",
    description:
      "Uso prático de IA para apoiar o trabalho do PO em BDD e personas, com atenção aos riscos de dependência cega.",
    youtubeUrl: "https://www.youtube.com/watch?v=w_1K2lOGxL0",
    durationInSeconds: 59 * 60,
    position: 8,
  },
  {
    id: "video-po-product-owner-09",
    title: "A utilização da IA em Product Discovery",
    description:
      "Como acelerar discovery com IA em feedbacks, hipóteses e personas, mantendo pensamento crítico e validação cruzada.",
    youtubeUrl: "https://www.youtube.com/watch?v=t1WlrDw5xE0",
    durationInSeconds: 57 * 60,
    position: 9,
  },
];

const PO_TRAIL_DESCRIPTION =
  "Trilha prática sobre as decisões, o backlog e os limites reais do papel de Product Owner.\n\nNão é uma trilha teórica de certificação: o foco é comportamento, decisão e armadilhas reais do cargo — PO que só documenta ao invés de decidir, PO \"tirador de pedido\", PO que invade o papel do Scrum Master.\n\nE como usar IA como apoio sem perder a essência do trabalho (entender a dor do cliente).";

export async function seedAgilidadeGeralTrail(prisma: PrismaClient) {
  await prisma.$transaction(async (tx) => {
    await tx.trail.upsert({
      where: { id: AGILIDADE_GERAL_TRAIL_ID },
      update: {
        title: "Trilha Agilidade Geral",
        imageUrl:
          process.env.BASE_URL + "/public/images/trails/Trilha_Agilidade.png",
        description: AGILIDADE_GERAL_TRAIL_DESCRIPTION,
        isPublished: true,
        isActive: true,
        deletedAt: null,
      },
      create: {
        id: AGILIDADE_GERAL_TRAIL_ID,
        title: "Trilha Agilidade Geral",
        imageUrl:
          process.env.BASE_URL + "/public/images/trails/Trilha_Agilidade.png",
        description: AGILIDADE_GERAL_TRAIL_DESCRIPTION,
        isPublished: true,
        isActive: true,
      },
    });

    for (const video of AGILIDADE_GERAL_VIDEOS) {
      await tx.video.upsert({
        where: { id: video.id },
        update: {
          title: video.title,
          description: video.description,
          youtubeUrl: video.youtubeUrl,
          durationInSeconds: video.durationInSeconds,
          isActive: true,
          deletedAt: null,
        },
        create: {
          id: video.id,
          title: video.title,
          description: video.description,
          youtubeUrl: video.youtubeUrl,
          durationInSeconds: video.durationInSeconds,
          isActive: true,
        },
      });

      await tx.trailItem.upsert({
        where: { id: `trail-item-agilidade-geral-${video.position}` },
        update: {
          trailId: AGILIDADE_GERAL_TRAIL_ID,
          contentType: ContentType.VIDEO,
          contentId: video.id,
          position: video.position,
          isRequired: true,
          isActive: true,
          deletedAt: null,
        },
        create: {
          id: `trail-item-agilidade-geral-${video.position}`,
          trailId: AGILIDADE_GERAL_TRAIL_ID,
          contentType: ContentType.VIDEO,
          contentId: video.id,
          position: video.position,
          isRequired: true,
          isActive: true,
        },
      });
    }
  });
}

export async function seedPoProductOwnerTrail(prisma: PrismaClient) {
  await prisma.$transaction(async (tx) => {
    await tx.trail.upsert({
      where: { id: PO_TRAIL_ID },
      update: {
        title: "Trilha PO — Product Owner",
        imageUrl:
          process.env.BASE_URL +
          "/public/images/trails/Trilha_Product_Owner.png",
        description: PO_TRAIL_DESCRIPTION,
        isPublished: true,
        isActive: true,
        deletedAt: null,
      },
      create: {
        id: PO_TRAIL_ID,
        title: "Trilha PO — Product Owner",
        imageUrl:
          process.env.BASE_URL +
          "/public/images/trails/Trilha_Product_Owner.png",
        description: PO_TRAIL_DESCRIPTION,
        isPublished: true,
        isActive: true,
      },
    });

    for (const video of PO_VIDEOS) {
      await tx.video.upsert({
        where: { id: video.id },
        update: {
          title: video.title,
          description: video.description,
          youtubeUrl: video.youtubeUrl,
          durationInSeconds: video.durationInSeconds,
          isActive: true,
          deletedAt: null,
        },
        create: {
          id: video.id,
          title: video.title,
          description: video.description,
          youtubeUrl: video.youtubeUrl,
          durationInSeconds: video.durationInSeconds,
          isActive: true,
        },
      });

      await tx.trailItem.upsert({
        where: { id: `trail-item-po-product-owner-${video.position}` },
        update: {
          trailId: PO_TRAIL_ID,
          contentType: ContentType.VIDEO,
          contentId: video.id,
          position: video.position,
          isRequired: true,
          isActive: true,
          deletedAt: null,
        },
        create: {
          id: `trail-item-po-product-owner-${video.position}`,
          trailId: PO_TRAIL_ID,
          contentType: ContentType.VIDEO,
          contentId: video.id,
          position: video.position,
          isRequired: true,
          isActive: true,
        },
      });
    }
  });
}
