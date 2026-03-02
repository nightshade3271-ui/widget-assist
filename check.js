const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const w = await prisma.widget.findFirst();
    console.log(w);
}

main().finally(() => prisma.$disconnect());
