/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");

/**
 * Seed: creates 9 categories + 20 products for an EXISTING store.
 * Usage:
 *   npm run db:seed:store -- --storeSlug=minha-loja
 * Or:
 *   set STORE_SLUG=minha-loja && npm run db:seed:store
 */

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i += 1) {
    const raw = argv[i];
    if (!raw.startsWith("--")) continue;
    const [key, maybeValue] = raw.slice(2).split("=");
    if (maybeValue !== undefined) {
      out[key] = maybeValue;
      continue;
    }
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      out[key] = next;
      i += 1;
      continue;
    }
    out[key] = "true";
  }
  return out;
}

function money(n) {
  // Keep at 2 decimals for Decimal columns
  return Math.round(n * 100) / 100;
}

async function main() {
  const prisma = new PrismaClient();
  const args = parseArgs(process.argv);

  const storeSlug = (args.storeSlug || process.env.STORE_SLUG || "").trim();
  if (!storeSlug) {
    throw new Error(
      "Missing store slug. Pass --storeSlug <slug> or set STORE_SLUG env var."
    );
  }

  console.log(`[seed] Looking up store by slug: ${storeSlug}`);
  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    select: { id: true, name: true, slug: true },
  });

  if (!store) {
    throw new Error(
      `Store not found for slug "${storeSlug}". Create the store first, then rerun seed.`
    );
  }

  console.log(`[seed] Using store: ${store.name} (${store.id})`);

  const categoriesSeed = [
    { name: "Eletrônicos" },
    { name: "Moda" },
    { name: "Casa & Cozinha" },
    { name: "Beleza & Cuidados" },
    { name: "Esporte & Lazer" },
    { name: "Livros" },
    { name: "Papelaria" },
    { name: "Pet Shop" },
    { name: "Acessórios" },
  ];

  const categoryByName = new Map();

  console.log("[seed] Ensuring categories exist (idempotent).");
  for (const cat of categoriesSeed) {
    const existing = await prisma.category.findFirst({
      where: { storeId: store.id, name: cat.name },
      select: { id: true, name: true },
    });

    if (existing) {
      categoryByName.set(existing.name, existing);
      continue;
    }

    const created = await prisma.category.create({
      data: { storeId: store.id, name: cat.name },
      select: { id: true, name: true },
    });
    categoryByName.set(created.name, created);
  }

  function catId(name) {
    const c = categoryByName.get(name);
    if (!c) throw new Error(`Missing category "${name}" in seed map`);
    return c.id;
  }

  // Realistic ecommerce-ish products (PT-BR), with stable public images.
  // Note: these image URLs are public; adjust if you have your own CDN/storage.
  const productsSeed = [
    {
      category: "Eletrônicos",
      name: "Fone Bluetooth com Cancelamento de Ruído",
      brand: "Auris",
      price: money(399.9),
      stock: 48,
      description:
        "Fone over‑ear com ANC híbrido, modo transparência e até 40h de bateria. Ideal para trabalho, estudos e viagens, com almofadas confortáveis e microfone para chamadas.",
      images: [
        "https://images.unsplash.com/photo-1518441312881-6c2df9cb0b3e?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Eletrônicos",
      name: "Teclado Mecânico Compacto 65% (Hot‑Swap)",
      brand: "KeyForge",
      price: money(549.0),
      stock: 22,
      description:
        "Teclado 65% com switches hot‑swap, iluminação RGB, keycaps PBT e layout ABNT2. Construção sólida para digitação e jogos.",
      images: [
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Eletrônicos",
      name: "Mouse Sem Fio Ergonômico Recarregável",
      brand: "ErgoPoint",
      price: money(189.9),
      stock: 65,
      description:
        "Mouse ergonômico vertical com sensor de alta precisão, clique silencioso e bateria recarregável via USB‑C. Conforto para longas horas de uso.",
      images: [
        "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Casa & Cozinha",
      name: "Cafeteira Prensa Francesa 1L em Vidro Borossilicato",
      brand: "BrewLab",
      price: money(129.9),
      stock: 40,
      description:
        "Prensa francesa de 1L com vidro resistente e filtro de aço inox. Preparo rápido e sabor encorpado para café ou chá.",
      images: [
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Casa & Cozinha",
      name: "Jogo de Facas Inox 6 Peças com Cepo",
      brand: "CorteFino",
      price: money(229.9),
      stock: 18,
      description:
        "Conjunto com facas essenciais para cozinha, lâminas em aço inox e cabo anatômico. Cepo compacto para organização e segurança.",
      images: [
        "https://images.unsplash.com/photo-1593618998160-2b63f2c1a820?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Casa & Cozinha",
      name: "Garrafa Térmica Inox 1L (Parede Dupla)",
      brand: "ThermX",
      price: money(159.9),
      stock: 55,
      description:
        "Garrafa térmica em inox com parede dupla a vácuo. Mantém bebidas quentes ou frias por horas, sem suar por fora.",
      images: [
        "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Moda",
      name: "Camiseta Básica Algodão Penteado",
      brand: "Essentia",
      price: money(69.9),
      stock: 120,
      description:
        "Camiseta básica de algodão penteado, toque macio e caimento confortável. Versátil para looks do dia a dia.",
      images: [
        "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Moda",
      name: "Moletom Canguru Unissex (Felpa)",
      brand: "UrbanWarm",
      price: money(169.9),
      stock: 60,
      description:
        "Moletom com capuz e bolso canguru, felpa interna e cordão ajustável. Perfeito para clima ameno e conforto diário.",
      images: [
        "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Acessórios",
      name: "Relógio Minimalista com Pulseira de Couro",
      brand: "Tempo&Co",
      price: money(299.9),
      stock: 24,
      description:
        "Relógio de design minimalista, caixa leve e pulseira de couro ajustável. Combina com casual e social.",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Acessórios",
      name: "Óculos de Sol Polarizado (UV400)",
      brand: "Solare",
      price: money(149.9),
      stock: 70,
      description:
        "Lentes polarizadas com proteção UV400 e armação leve. Reduz reflexos e melhora o conforto visual em dias ensolarados.",
      images: [
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Beleza & Cuidados",
      name: "Sérum Vitamina C 10% (30ml)",
      brand: "DermaGlow",
      price: money(89.9),
      stock: 90,
      description:
        "Sérum com vitamina C 10% para uniformizar o tom da pele e ajudar na luminosidade. Textura leve e rápida absorção.",
      images: [
        "https://images.unsplash.com/photo-1612810436541-336d0b5d0a63?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Beleza & Cuidados",
      name: "Hidratante Facial Oil‑Free (50g)",
      brand: "BalanceSkin",
      price: money(59.9),
      stock: 110,
      description:
        "Hidratante facial oil‑free para uso diário. Ajuda a manter a pele hidratada sem pesar, com acabamento seco.",
      images: [
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Esporte & Lazer",
      name: "Tapete de Yoga Antiderrapante 6mm",
      brand: "FlowFit",
      price: money(119.9),
      stock: 75,
      description:
        "Tapete de yoga com boa aderência e amortecimento. Ideal para yoga, pilates e alongamentos, fácil de limpar.",
      images: [
        "https://images.unsplash.com/photo-1540206276207-3af25c08fd44?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Esporte & Lazer",
      name: "Garrafa Squeeze 750ml com Trava",
      brand: "HydraGo",
      price: money(39.9),
      stock: 150,
      description:
        "Squeeze 750ml com bico de silicone, trava anti‑vazamento e pegada firme. Perfeita para academia e trilhas.",
      images: [
        "https://images.unsplash.com/photo-1526401485004-2aa7d7b46c33?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Livros",
      name: "Livro: Hábitos Atômicos (Edição em Português)",
      brand: "Alta Books",
      price: money(54.9),
      stock: 35,
      description:
        "Guia prático sobre como criar bons hábitos e eliminar os maus com pequenas mudanças diárias. Leitura acessível e aplicável.",
      images: [
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Livros",
      name: "Livro: Clean Code (Edição em Português)",
      brand: "Alta Books",
      price: money(129.9),
      stock: 20,
      description:
        "Referência em boas práticas de desenvolvimento: código legível, sustentável e fácil de evoluir em projetos reais.",
      images: [
        "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Papelaria",
      name: "Caderno Pontilhado A5 (Hardcover) 192 páginas",
      brand: "NoteCraft",
      price: money(49.9),
      stock: 80,
      description:
        "Caderno pontilhado A5 com capa dura, papel de boa gramatura e abertura confortável. Ideal para bullet journal e planejamento.",
      images: [
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Papelaria",
      name: "Canetas Gel 0.7mm (Kit com 6 cores)",
      brand: "ColorInk",
      price: money(29.9),
      stock: 200,
      description:
        "Kit com 6 canetas gel de escrita macia e secagem rápida. Ótimas para anotações, marcações e estudos.",
      images: [
        "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Pet Shop",
      name: "Cama para Pet Média com Almofada Removível",
      brand: "PetNest",
      price: money(139.9),
      stock: 28,
      description:
        "Cama macia para pets de porte pequeno/médio, com almofada removível e tecido fácil de limpar. Conforto e aconchego para o dia a dia.",
      images: [
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      category: "Pet Shop",
      name: "Brinquedo Mordedor para Cães (Borracha Natural)",
      brand: "DogPlay",
      price: money(24.9),
      stock: 140,
      description:
        "Mordedor resistente em borracha natural, ajuda a entreter e reduzir estresse. Textura pensada para estimular a mastigação.",
      images: [
        "https://images.unsplash.com/photo-1601758173926-196d2f3f21a1?auto=format&fit=crop&w=1200&q=80",
      ],
    },
  ];

  console.log("[seed] Ensuring products exist (idempotent).");
  let createdCount = 0;
  let skippedCount = 0;

  for (const p of productsSeed) {
    const existing = await prisma.product.findFirst({
      where: { storeId: store.id, name: p.name },
      select: { id: true, name: true },
    });

    if (existing) {
      skippedCount += 1;
      continue;
    }

    const product = await prisma.product.create({
      data: {
        storeId: store.id,
        categoryId: catId(p.category),
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        brand: p.brand ?? null,
        isActive: true,
        images: {
          create: (p.images || []).map((url) => ({ url })),
        },
      },
      select: { id: true },
    });

    createdCount += 1;
    console.log(`[seed] Created product: ${p.name} (${product.id})`);
  }

  console.log(
    `[seed] Done. Created: ${createdCount}. Skipped (already existed): ${skippedCount}.`
  );

  await prisma.$disconnect();
}

main().catch((err) => {
  // Ensure Prisma disconnect on failure too
  console.error("[seed] Failed:", err);
  process.exitCode = 1;
});

