import express from "express";
import { createChat, getAllChats, addConversation, getConversation, deleteChat, updateChat, fetchAIResponse } from "../controllers/chatControllers.js";
import {isAuth} from "../middlewares/isAuth.js";

const router = express.Router();


router.post("/new", isAuth, createChat);
router.get("/all", isAuth, getAllChats);
router.post("/ai", isAuth, fetchAIResponse);
router.post("/:id", isAuth, addConversation);

router.get("/:id", isAuth, getConversation);

router.put("/:id", isAuth, updateChat);
router.delete("/:id", isAuth, deleteChat);

export default router;