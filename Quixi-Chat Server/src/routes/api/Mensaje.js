import express from 'express';
import Message from '../../database/models/Mensaje.js';
import { verifyToken } from '../../util.js';
import User from '../../database/models/Usuario.js';
import Chat from '../../database/models/Chat.js';

export const router = express.Router();
export const path = '/api/messages';

router.get('/:chatId', verifyToken, async (req, res) => {
    const username = req.username;
    const user = await User.findOne({ username }, { _id: 0, password: 0, createdAt: 0, updatedAt: 0, __v: 0, active: 0 });
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { chatId } = req.params;
    const chat = await Chat.findOne({ id: chatId }, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 });
    if (!chat) {
        return res.status(404).json({ message: 'Chat no encontrado' });
    }
    if (!chat.users.some(user => user.username != username)) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    const messages = await Message.find({ chat: chatId }, { _id: 0, __v: 0, updatedAt: 0 });

    res.status(200).json(messages);
});

// router.post('')