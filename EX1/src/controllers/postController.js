import { postService } from "../services/postService.js";

export const postController = {
    async getPostByAuthorId(req, res) {
        try {
            const { id } = req.params;
            const post = await postService.getPostByAuthorId(id);

            if (!post) {
                return res.status(404).json({ message: "Không tìm thấy post" });
            }

            res.status(200).json(post);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi khi lấy post" });
        }
    },
};
