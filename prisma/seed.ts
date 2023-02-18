import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDb() {
    await prisma.user.create({
        data: {
            email: 'user@localhost.com',
            password: 'password',
            firstname: 'John',
            lastname: 'Doe',
        },
    });
}

seedDb()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });