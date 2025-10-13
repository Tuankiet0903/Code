import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const postService = {
    async getPostByAuthorId(id) {
        return await prisma.post.findMany({
            where: { authorId: Number(id) }
        });
    },

};
