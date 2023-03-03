import { PrismaClient } from '@prisma/client';
import { MainHelpers } from '../src/core/tools/main-helper';
import { RolesList } from '../src/core/types/enums';

const prisma = new PrismaClient();

async function seedDb() {
    await prisma.$connect();

    if (!(await prisma.userRole.findMany()).length) {
        await prisma.userRole.createMany({
            data: [
                { code: RolesList.admin },
                { code: RolesList.user },
            ],
        });
    }

    const defaultuser = await prisma.user.findFirst({ where: { email: 'user@localhost.com' } });

    if (!defaultuser) {
        const hasedPassword = await MainHelpers.hashPassword('password');
        await prisma.user.create({
            data: {
                email: 'user@localhost.com',
                password: hasedPassword,
                firstname: 'John',
                lastname: 'Doe',

                roles: {
                    connect: { code: RolesList.user },
                }
            },
        });
    }



}

seedDb()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });