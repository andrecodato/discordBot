const mongoose = require('mongoose');
require('dotenv').config();

class Database {
    constructor() {
        this.connection = null;
    }

    connect () {
        console.log('[MongoDB] Conectando a database...');
        
        mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log('[MongoDB] Conectado a database!');
            this.connection = mongoose.connection;
        }).catch(err => {
            console.log('[MongoDB] Erro ao conectar a database: ', err);
        });
    }
}

module.exports = Database;