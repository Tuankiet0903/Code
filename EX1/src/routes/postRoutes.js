import express from "express";
import { postController } from "../controllers/postController.js";

const router = express.Router();

router.get("/author/:id", postController.getPostByAuthorId);

export default router;
