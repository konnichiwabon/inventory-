// Simple connectivity check for Prisma Client
const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    const count = await prisma.product.count();
    console.log(`Product count: ${count}`);
    const sample = await prisma.product.findMany({ take: 5 });
    console.log("Sample rows:", sample);
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Prisma connectivity check failed. Did you run `npx prisma generate`?", err);
    try { await prisma.$disconnect(); } catch (_) {}
    process.exit(1);
  }
}

main();
