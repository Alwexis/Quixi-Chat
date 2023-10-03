import mongoose, { Schema } from "mongoose";
import { Util } from "../../util.js";
import { v4 as uuidv4 } from 'uuid';
import Message from './Mensaje.js'

const ChatSchema = new Schema({
    id: { type: String, unique: true },
    name: String,
    users: Array,
    image: String,
    last_message: { type: String, default: 'Chat creado' },
    readed: { type: Boolean, default: false },
}, { timestamps: true });

ChatSchema.pre('save', function(next) {
    if (!this.isModified('image')) {
        return next();
    }
    if (this.image != '') {
        const image = Util.base64Decoder(this.image, uuidv4());
        this.image = image;
    }

    this.id = uuidv4();

    Message.create({
        author: 'System',
        content: 'Chat creado',
        chat: this.id,
    });

    next();
});

const Chat = mongoose.model('Chat', ChatSchema);

export default Chat;