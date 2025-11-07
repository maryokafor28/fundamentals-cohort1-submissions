import express from 'express';
import { sendMessage, getMessages, markAsRead } from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', sendMessage);
router.get('/', getMessages);
router.put('/:id/read', markAsRead);

export default router;