import mongoose, { Schema } from "mongoose";

const AutoIncrementSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const AutoIncrement = mongoose.model('AutoIncremento', AutoIncrementSchema);

export default AutoIncrement;