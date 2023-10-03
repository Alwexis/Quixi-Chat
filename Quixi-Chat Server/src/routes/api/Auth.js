import express from 'express';
import User from '../../database/models/Usuario.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { verifyToken } from '../../util.js';

export const router = express.Router();
export const path = '/auth';

router.get('/user', verifyToken, async (req, res) => {
    const username = req.username;
    const user = await User.findOne({ username }, { password: 0, _id: 0 });
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json(user);
});

router.get('/user/:userToSearch', verifyToken, async (req, res) => {
    const username = req.username;
    const user = await User.findOne({ username }, { password: 0, _id: 0 });
    if (!user) {
        return res.status(404).json({ message: 'No autorizado' });
    }
    const { userToSearch } = req.params;
    const userById = await User.findOne({ username: userToSearch }, { password: 0, _id: 0 });
    if (!userById) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json(userById);
});

router.post('/register', async (req, res) => {
    const data = req.body;
    const REQUIRED_FIELDS = ['username', 'password', 'alias'];
    const POSSIBLE_FIELDS = [...REQUIRED_FIELDS, 'profile_picture'];
    if (!REQUIRED_FIELDS.every(field => field in data)) {
        return res.status(400).json({ message: 'Faltan campos requeridos.' });
    }
    if (!Object.keys(data).every(field => POSSIBLE_FIELDS.includes(field))) {
        return res.status(400).json({ message: 'Hay campos no permitidos en el Body' });
    }

    const userCreated = await User.findOne({ username: data.username });
    if (userCreated) {
        return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const user = await User.create(data);
    if (!user) {
        return res.status(500).json({ message: 'Error al crear el usuario' });
    }

    const token = jwt.sign({ username: user.username }, process.env.SECRET_WORD, {
        expiresIn: '7d',
    });
    res.status(200).json({ message: 'Usuario creado con éxito', token });
})

router.post('/login', async (req, res) => {
    const data = req.body;
    const REQUIRED_FIELDS = ['username', 'password'];
    if (!REQUIRED_FIELDS.every(field => field in data)) {
        return res.status(400).json({ message: 'Faltan campos requeridos.' });
    }
    const user = await User.findOne({ username: data.username });
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    bcrypt.compare(data.password, user.password, (err, result) => {
        if (err) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        const token = jwt.sign({ username: user.username }, process.env.SECRET_WORD, {
            expiresIn: '7d',
        });
        res.status(200).json({ message: 'Usuario logueado con éxito', token });
    });
});