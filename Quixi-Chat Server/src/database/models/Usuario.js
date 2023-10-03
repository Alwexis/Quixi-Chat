import mongoose, { Schema } from "mongoose";
import { Util } from "../../util.js";
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
    username: String,
    password: String,
    alias: String,
    profile_picture: String,
    active: Boolean,
}, { timestamps: true });

UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    this.active = true;
    if (this.profile_picture != '') {
        const profile_picture = Util.base64Decoder(this.profile_picture, this.username);
        this.profile_picture = profile_picture;
    }
    next();
});

const User = mongoose.model('Usuarios', UserSchema);

export default User;