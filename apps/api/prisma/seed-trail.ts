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
      "Checklist prático do que evitar numa Daily (atraso, despreparo, falar demais, negatividade) e do que priorizar (objetividade, foco no progresso, colaboração). Reforça que a Daily não serve para resolver problemas nem é status report.",
    youtubeUrl: "https://youtu.be/DSC9Zvk35PI",
    durationInSeconds: 9 * 60,
    position: 1,
  },
  {
    id: "video-agilidade-geral-02",
    title: "Pílula Ágil — O que é Auto-organização numa equipe ágil?",
    description:
      "Define o que é auto-organização de fato — liberdade com responsabilidade, não caos — e como implementar na prática: construir confiança, definir objetivos claros, delegar responsabilidades e remover obstáculos.",
    youtubeUrl: "https://youtu.be/vtTA_5J2YBg",
    durationInSeconds: 21 * 60,
    position: 2,
  },
  {
    id: "video-agilidade-geral-03",
    title: "Scrum como Cascata Disfarçado",
    description:
      'Antipadrões que fazem um time "ágil" reproduzir, na prática, um modelo em cascata: sprints rígidos, documentação excessiva, fases sequenciais e resistência a mudanças — com exemplo real de um projeto institucional que deu errado.',
    youtubeUrl: "https://youtu.be/rZ_fo_Ckbr4",
    durationInSeconds: 38 * 60,
    position: 3,
  },
  {
    id: "video-agilidade-geral-04",
    title: "Comando e Controle Ágil",
    description:
      'Crítica ao "comando e controle disfarçado de ágil": cerimônias que viram reunião de cobrança, falta de autonomia e microgerenciamento por trás de um verniz de metodologia ágil — e como reverter isso descentralizando decisões.',
    youtubeUrl: "https://youtu.be/2CNKiNCKJxQ",
    durationInSeconds: 13 * 60,
    position: 4,
  },
  {
    id: "video-agilidade-geral-05",
    title: "Histórias de Usuário — A Base do Desenvolvimento Ágil",
    description:
      "Como escrever boas histórias de usuário usando os critérios INVEST, com exemplos comparativos claros de história ruim x boa — vaga vs. específica, história gigante vs. fatiada em partes entregáveis.",
    youtubeUrl: "https://youtu.be/B6rPxG2-9aU",
    durationInSeconds: 16 * 60,
    position: 5,
  },
  {
    id: "video-agilidade-geral-06",
    title: "DoR e DoD em Histórias de Usuário",
    description:
      "Diferença entre Definition of Ready (o que uma história precisa ter para começar a ser desenvolvida) e Definition of Done (o que garante que foi entregue com qualidade), com critérios práticos para cada um.",
    youtubeUrl: "https://youtu.be/ZeXMzwMY3T0",
    durationInSeconds: 20 * 60,
    position: 6,
  },
  {
    id: "video-agilidade-geral-07",
    title: "Critérios de Aceite — Parte essencial das histórias de usuário",
    description:
      "O que são critérios de aceite, como escrevê-los no formato Given/When/Then, e os erros mais comuns — ser genérico, focar em solução técnica em vez do comportamento esperado pelo usuário.",
    youtubeUrl: "https://youtu.be/n0uGb2Ha-Pw",
    durationInSeconds: 20 * 60,
    position: 7,
  },
  {
    id: "video-agilidade-geral-08",
    title: "User Story Mapping",
    description:
      "Técnica visual de organizar histórias de usuário ao longo da jornada do usuário, com um exemplo prático completo (sistema de e-mail) mostrando como isso vira insumo direto para o roadmap por sprint.",
    youtubeUrl: "https://youtu.be/Hmxn8KIukx8",
    durationInSeconds: 12 * 60,
    position: 8,
  },
  {
    id: "video-agilidade-geral-09",
    title: "Burndown e Burnup — Essenciais para Gestão de Projetos Ágeis",
    description:
      "Os dois gráficos mais usados para acompanhar progresso em projetos ágeis: como ler cada um, a diferença entre trabalho restante e trabalho concluído, e quando usar um ou outro.",
    youtubeUrl: "https://youtu.be/o7Q3Z7-qWac",
    durationInSeconds: 13 * 60,
    position: 9,
  },
  {
    id: "video-agilidade-geral-10",
    title: "Quais são as maiores falácias na Agilidade",
    description:
      "Sete mitos comuns sobre agilidade, incluindo achar que ágil é sinônimo de 'fazer rápido', que serve para qualquer tipo de projeto, e que elimina hierarquia e documentação. Fecha a trilha com uma reflexão crítica sobre o que agilidade não é.",
    youtubeUrl: "https://youtu.be/ec16338ObUA",
    durationInSeconds: 12 * 60,
    position: 10,
  },
];

const AGILIDADE_GERAL_TRAIL_DESCRIPTION =
  'Trilha de fundamentos: como conduzir bem as cerimônias do dia a dia, reconhecer quando o "ágil" de uma equipe é só verniz sobre um processo tradicional.\n\nEscrever e refinar boas histórias de usuário, e acompanhar o progresso do time com os gráficos certos.\n\nFecha com uma reflexão crítica sobre os mitos mais repetidos sobre agilidade.';
const AGILIDADE_GERAL_TRAIL_TAGS = [
  "Scrum e Cerimônias",
  "Auto-organização",
  "Antipadrões Ágeis",
  "Acompanhamento de Progresso",
  "Critica e Reflexão",
  "Histórias de Usuário",
  "Critérios de Aceite",
];
const AGILIDADE_GERAL_TRAIL_SPECS = [
  "10 vídeos",
  "2h54min de duração",
  "Pílulas objetivas de 9 a 38 minutos",
  "Ritmo sugerido: ~5-6 sessões de estudo (blocos de 30-40min), ou ~2 semanas em ritmo de 1 vídeo a cada 2 dias",
];
const AGILIDADE_GERAL_TRAIL_IMAGE_URL =
  process.env.BASE_URL + "/public/images/trails/Trilha_Agilidade.png";

const PO_VIDEOS: SeedVideo[] = [
  {
    id: "video-po-product-owner-01",
    title: "Pílula Ágil — Product Manager vs. Product Owner",
    description:
      "Comparação direta entre os dois papéis — PM foca em estratégia e mercado, PO foca em backlog e time. Traz exemplos práticos (app de música, ERP, e-commerce) mostrando como cada um atuaria.",
    youtubeUrl: "https://youtu.be/wNGyUPr5y0o",
    durationInSeconds: 12 * 60,
    position: 1,
  },
  {
    id: "video-po-product-owner-02",
    title: "Pílula Ágil — Product Owner: Atribuições e Habilidades Essenciais",
    description:
      "Introdução conceitual ao papel do PO — o que ele faz no dia a dia e quais habilidades técnicas e comportamentais são esperadas dele.",
    youtubeUrl: "https://youtu.be/CUtZPn516qs",
    durationInSeconds: 14 * 60,
    position: 2,
  },
  {
    id: "video-po-product-owner-03",
    title: "Pílula Ágil — PO preocupado com a organização do time!",
    description:
      "Onde termina a responsabilidade do PO e começa a do Scrum Master — útil pra quem confunde os dois papéis ou está assumindo o cargo pela primeira vez.",
    youtubeUrl: "https://youtu.be/-5d2M65Z34w",
    durationInSeconds: 26 * 60,
    position: 3,
  },
  {
    id: "video-po-product-owner-04",
    title: "Product Owner como você nunca viu — convidada Débora Magnago",
    description:
      "Conversa sobre transição de carreira para PO sem vir de TI, com exemplos reais (dentista, enfermeira que viraram PO) e boas práticas de fatiamento de histórias de usuário — como dividir uma funcionalidade grande em pedaços entregáveis.",
    youtubeUrl: "https://youtu.be/NH3lQFbfDa8",
    durationInSeconds: 67 * 60,
    position: 4,
  },
  {
    id: "video-po-product-owner-05",
    title: "Pílula Ágil — Posso ser Product Owner de vários times?",
    description:
      "Prós, contras e cuidados práticos de um PO cobrir mais de um time ao mesmo tempo — inclui recomendação de não passar de 2-3 times e dicas de delegação.",
    youtubeUrl: "https://youtu.be/RgGTuI2AgBw",
    durationInSeconds: 20 * 60,
    position: 5,
  },
  {
    id: "video-po-product-owner-06",
    title: 'Tide Cardoso — "Entregar o produto é difícil"',
    description:
      'Crítica ao "PO tirador de pedido" e defesa de que todo problema deve ser medido — fala sobre métricas específicas por tipo de produto e por que um backlog com mais de 20 itens é sinal de alerta.',
    youtubeUrl: "https://youtu.be/k_HLctcPEsE",
    durationInSeconds: 80 * 60,
    position: 6,
  },
  {
    id: "video-po-product-owner-07",
    title: "O papel do Product Manager em Inovação",
    description:
      "Erros comuns na escrita de histórias de usuário e técnicas de priorização (MoSCoW, GUT, RICE) — bom para quem já escreve backlog mas quer refinar a prática.",
    youtubeUrl: "https://youtu.be/5-KLp_7wVg4",
    durationInSeconds: 58 * 60,
    position: 7,
  },
  {
    id: "video-po-product-owner-08",
    title: "Product Owner + IA = Super-Poderes",
    description:
      "Demonstração prática de como usar IA no dia a dia do PO — geração de histórias via BDD, criação de personas por prompt — com alerta sobre os riscos de confiar cegamente na IA.",
    youtubeUrl: "https://youtu.be/w_1K2lOGxL0",
    durationInSeconds: 59 * 60,
    position: 8,
  },
  {
    id: "video-po-product-owner-09",
    title: "A utilização da IA em Product Discovery",
    description:
      "Como a IA pode acelerar etapas do discovery (análise de feedback, personas, hipóteses), com reflexão crítica sobre riscos de viés e a importância de cruzar múltiplas fontes.",
    youtubeUrl: "https://youtu.be/t1WlrDw5xE0",
    durationInSeconds: 57 * 60,
    position: 9,
  },
];

const PO_TRAIL_DESCRIPTION =
  'Trilha prática sobre as decisões, o backlog e os limites reais do papel de Product Owner.\n\nNão é uma trilha teórica de certificação: o foco é comportamento, decisão e armadilhas reais do cargo — PO que só documenta em vez de decidir, PO "tirador de pedido", PO que invade o papel do Scrum Master.\n\nE como usar IA como apoio sem perder a essência do trabalho (entender a dor do cliente).';
const PO_TRAIL_TAGS = [
  "Product Owner",
  "Histórias de Usuário",
  "Backlog e Priorização",
  "Discovery",
  "IA Aplicada a Produto",
  "Papéis Ágeis",
  "Métricas de Produto",
  "Transição de Carreira",
];
const PO_TRAIL_SPECS = [
  "9 vídeos",
  "6h34 de duração",
  "4 pílulas curtas de 12-26 min + 5 conteúdos longos (57min-1h20)",
  "Ritmo sugerido: ~10-13 sessões de estudo (blocos de 30-40min), ou ~2 semanas em ritmo de 1 vídeo por dia útil",
];
const PO_TRAIL_IMAGE_URL =
  process.env.BASE_URL + "/public/images/trails/Trilha_Product_Owner.png";

export async function seedAgilidadeGeralTrail(prisma: PrismaClient) {
  await prisma.$transaction(async (tx) => {
    await tx.trail.upsert({
      where: { id: AGILIDADE_GERAL_TRAIL_ID },
      update: {
        title: "TRILHA AGILIDADE GERAL",
        tags: AGILIDADE_GERAL_TRAIL_TAGS,
        specs: AGILIDADE_GERAL_TRAIL_SPECS,
        imageUrl: AGILIDADE_GERAL_TRAIL_IMAGE_URL,
        description: AGILIDADE_GERAL_TRAIL_DESCRIPTION,
        isPublished: true,
        isActive: true,
        deletedAt: null,
      },
      create: {
        id: AGILIDADE_GERAL_TRAIL_ID,
        title: "TRILHA AGILIDADE GERAL",
        tags: AGILIDADE_GERAL_TRAIL_TAGS,
        specs: AGILIDADE_GERAL_TRAIL_SPECS,
        imageUrl: AGILIDADE_GERAL_TRAIL_IMAGE_URL,
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
        title: "TRILHA PRODUCT OWNER",
        tags: PO_TRAIL_TAGS,
        specs: PO_TRAIL_SPECS,
        imageUrl: PO_TRAIL_IMAGE_URL,
        description: PO_TRAIL_DESCRIPTION,
        isPublished: true,
        isActive: true,
        deletedAt: null,
      },
      create: {
        id: PO_TRAIL_ID,
        title: "TRILHA PRODUCT OWNER",
        tags: PO_TRAIL_TAGS,
        specs: PO_TRAIL_SPECS,
        imageUrl: PO_TRAIL_IMAGE_URL,
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
