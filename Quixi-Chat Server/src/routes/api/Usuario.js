import express from 'express';
import User from '../../database/models/Usuario.js';

export const router = express.Router();
export const path = '/api/users';

router.get('/', async (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    let users;
    if (Object.keys(req.query).length > 0) {
        users = await User.find(req.query);
    } else {
        users = await User.find();
    }
    users ? res.status(200).json(users) : res.status(404).json({ message: 'No se encontraron users' });
});

// router.post('')