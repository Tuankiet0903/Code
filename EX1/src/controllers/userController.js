import { userService } from "../services/userService.js";

export const userController = {
    async getAll(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi khi lấy danh sách user" });
        }
    },

    async getUserEmailById(req, res) {
        try {
            const { id } = req.params;
            const user = await userService.getUserEmailById(id);

            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy user" });
            }

            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi khi lấy email user" });
        }
    },

    async create(req, res) {
        try {
            const { name, email } = req.body;
            const newUser = await userService.createUser({ name, email });
            res.status(201).json(newUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi khi tạo user mới" });
        }
    },
};
