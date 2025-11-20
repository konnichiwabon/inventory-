import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

try {
	// Attempt to reuse an existing client in dev or create a new one.
	prisma = globalForPrisma.prisma ?? new PrismaClient();
	if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
} catch (err) {
	// Helpful message if Prisma client artifacts aren't generated yet.
	console.error(
		"Prisma Client failed to initialize. Make sure you've run `npx prisma generate` and restarted the dev server.",
		err
	);
	throw err;
}

export { prisma };