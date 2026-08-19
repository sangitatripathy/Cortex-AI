import express from 'express';
import { createConversation, getConversations, getMessages, saveMessage, updateConversations } from '../controller/chat.controller.js';

const router = express.Router();

router.post("/create-conversation",createConversation);
router.get("/get-conversations",getConversations);
router.put("/update-conversation",updateConversations);
router.post("/save-message",saveMessage);
router.get("/get-message/:conversationId",getMessages);

export default router;

