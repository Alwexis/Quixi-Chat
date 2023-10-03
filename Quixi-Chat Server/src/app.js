import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import 'dotenv/config';
import Database from './database/db.js';
import { Util, __dirname } from './util.js'
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json({ limit: '1mb' }));
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

new Database();

Util.loadModules(__dirname + '/routes/', app);

io.on('connection', (socket) => {
  // console.log('a user connected');
  const token = socket.request.headers.authorization.split(' ')[1]
  socket.join(token)
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(_PORT, () => {
  console.log('server running at http://localhost:3000');
});