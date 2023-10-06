import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { Util } from "../../util.js";

const MessageSchema = new Schema({
    id: { type: String, unique: true },
    author: String,
    content: String,
    chat: String,
    attachments: { type: Array, default: [] },
}, { timestamps: true });

MessageSchema.pre('save', function(next) {
    this.id = uuidv4();
    if (this.attachments.length > 0) {
        const attachments = [];
        for (let attachment of this.attachments) {
            const fileName = uuidv4();
            const file = Util.base64Decoder(attachment, fileName);
            attachments.push({ name: fileName, file });
        }
        this.attachments = attachments;
    }
    next();
});

const Message = mongoose.model('Mensajes', MessageSchema);

export default Message;