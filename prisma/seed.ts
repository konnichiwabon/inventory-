import {PrismaClient} from "@prisma/client";

    const prisma = new PrismaClient();

    async function main() {   
        const demoUserId = "cb46628e-fc69-4c53-a7c1-f3d3d34cfa56";

        //create sample products 
        await prisma.product.createMany({
            data: Array.from({length: 25}).map((_, i) => ({
            userId: demoUserId,
            name: ` Product ${i + 1}`,
            price: parseFloat((Math.random() * 90 + 10).toFixed(2)),
            quantity: Math.floor(Math.random() * 20),
            lowStockAt: 5,
            createdAt: new Date(Date.now() - 10000 * 60 * 60 * 24 * (i * 5)),
            })),
        });
    }

    main()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
