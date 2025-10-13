import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const userService = {
    async getAllUsers() {
        return prisma.user.findMany({
            include: { _count: true, posts: true, profile: true },
        });
    },

    async getUserEmailById(id) {
        return await prisma.user.findUnique({
            where: { id: Number(id) },
            select: { email: true },
        });
    },

    async createUser(data) {
        return prisma.user.create({
            data,
        });
    },
};
