/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();
  const stores = await prisma.store.findMany({
    select: { id: true, slug: true, name: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  console.log(JSON.stringify(stores, null, 2));
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

