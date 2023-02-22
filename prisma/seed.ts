import { PrismaClient } from '@prisma/client';
import { RolesList } from '../src/core/types/enums';

const prisma = new PrismaClient();

async function seedDb() {
    const defaultuser = await prisma.user.findUnique({ where: { email: 'user@localhost.com' } });

    if (!defaultuser) {
        console.log(1);

        await prisma.user.create({
            data: {
                email: 'user@localhost.com',
                password: 'password',
                firstname: 'John',
                lastname: 'Doe',

                roles: {
                    connect: { code: RolesList.user },
                }
            },
        });
    }

    if (!(await prisma.userRole.findMany()).length) {
        await prisma.userRole.createMany({
            data: [
                { code: RolesList.admin },
                { code: RolesList.user },
            ],
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