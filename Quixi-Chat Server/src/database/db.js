import mongoose from "mongoose";
import dotenv from 'dotenv';
import AutoIncrement from "./models/AutoIncremento.js";

dotenv.config();

class Database {
    url = process.env.DB_URL;
    db_name = process.env.DB_NAME;

    constructor() {
        mongoose.connect(this.url, { dbName: this.db_name })
        .then(() => {
            console.log('Database connected');
            this.initAutoIncrement();
        })
        .catch((err) => {
            console.log('Database connection error: ' + err);
        });
    }

    async checkCollectionExists(collectionName) {
        const collections = await mongoose.connection.db.listCollections().toArray();
        return collections.filter(collection => collection.name == collectionName).length > 0;
    }

    async initAutoIncrement() {
        const exists = await this.checkCollectionExists('autoincrementos');
        const msgAuto = await AutoIncrement.find({ _id: 'mensajes' });
        if (!exists || msgAuto.length < 1) {
            await AutoIncrement.create({ _id: 'mensajes', seq: 0 });
            await AutoIncrement.create({ _id: 'usuarios', seq: 0 });
        }
    }
}

export default Database;