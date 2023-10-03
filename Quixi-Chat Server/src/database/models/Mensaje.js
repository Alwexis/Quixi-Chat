import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const MessageSchema = new Schema({
    id: { type: String, unique: true },
    author: String,
    content: String,
    chat: String,
    attachments: { type: Array, default: [] },
}, { timestamps: true });

MessageSchema.pre('save', function(next) {
    this.id = uuidv4();
    next();
});

const Message = mongoose.model('Mensajes', MessageSchema);

export default Message;