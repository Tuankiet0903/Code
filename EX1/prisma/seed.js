import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const count = await prisma.user.count();
    if (count === 0) {
        await prisma.user.create({
            data: {
                name: 'Alice',
                email: 'alice@prisma.io',
                posts: {
                    create: { title: 'Hello World' },
                },
                profile: {
                    create: { bio: 'I like turtles' },
                },
            },
        });
        console.log("✅ Seed data created!");
    } else {
        console.log("ℹ️ Seed data already exists, skipping...");
    }
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
