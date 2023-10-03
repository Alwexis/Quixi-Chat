import express from 'express';
import { verifyToken } from '../../util.js';
import User from '../../database/models/Usuario.js';
import Chat from '../../database/models/Chat.js';

export const router = express.Router();
export const path = '/api/chats';

router.get('/', verifyToken, async (req, res) => {
    const username = req.username;
    const user = await User.findOne({ username }, { _id: 0, password: 0, createdAt: 0, updatedAt: 0, __v: 0, active: 0 });
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    const chats = await Chat.find({}, { _id: 0, __v: 0 }).where('users').in([user]);
    res.status(200).json(chats);
});

router.post('/', verifyToken, async (req, res) => {
    const username = req.username;
    const user = await User.findOne({ username }, { _id: 0, password: 0, createdAt: 0, updatedAt: 0, __v: 0, active: 0 });
    if (!user) {
        return res.status(404).json({ message: 'No autorizado' });
    }
    const { users, name, image } = req.body;
    const usersNames = users.map(user => user.username);
    const usersExists = await User.find({}, { _id: 0, password: 0, createdAt: 0, updatedAt: 0, __v: 0, active: 0 }).where('username').in(usersNames);
    if (usersExists.length != users.length) {
        return res.status(404).json({ message: 'Miembros del chat inválidos.' });
    }
    users.push(user);
    const chat = await Chat.create({ users, name, image });
    if (!chat) {
        return res.status(500).json({ message: 'Error al crear chat' });
    }
    res.status(200).json({ message: 'Chat creado', chat });
});

// router.post('')