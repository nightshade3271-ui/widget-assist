const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const widgets = await prisma.widget.findMany();
    widgets.forEach(w => {
        console.log(`Widget: ${w.name}`);
        console.log(`System Prompt: ${w.systemPrompt}`);
        console.log('---');
    });
}

main().finally(() => prisma.$disconnect());
