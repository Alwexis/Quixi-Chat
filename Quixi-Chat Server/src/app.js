import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import 'dotenv/config';
import Database from './database/db.js';
import { Util, __dirname } from './util.js'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Chat from './database/models/Chat.js';
import jwt from 'jsonwebtoken';
import User from './database/models/Usuario.js';
import mongoose from "mongoose";

const app = express();
app.use(express.json({ limit: '2048mb' }));
//app.use(cors({
//  origin: 'http://localhost:4200'
//}))
app.use(cors())
app.use(cookieParser())
app.use(express.static('uploads'));
export const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const _PORT = process.env.PORT || 3000;
export const _IO = io;

const _db = new Database();

Util.loadModules(__dirname + '/routes/', app);

mongoose.connection.on('connected', async () => {
  io.on('connection', async (socket) => {
    const token = socket.handshake.headers.authorization.split(' ')[1];
    if (!token) return;
    const payload = jwt.verify(token, process.env.SECRET_WORD);
    const username = payload.username;
    console.log('Mongoose is connected');
    const user = await User.findOne({ username }, { _id: 0, password: 0, createdAt: 0, updatedAt: 0, __v: 0, active: 0 });
    const chats = await Chat.find({}, { _id: 0, __v: 0 }).where('users').in([user]);
    const chatsIds = chats.map(chat => chat.id);
    console.log('Conectandose a...')
    socket.join(chatsIds)

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
});

server.listen(_PORT, () => {
  console.log('server running at http://localhost:3000');
});