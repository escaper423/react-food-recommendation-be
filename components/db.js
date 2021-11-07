class MongooseDB{
    constructor(){
        this.mongoose = require('mongoose');
        this.db = null;
    }

    Connect(){
        this.mongoose.connect(process.env.USER_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });
        this.db = this.mongoose.connection;
        this.db.on('error', (error) => console.error(error));
        this.db.once('open', () => console.log('Database Connected.'));
    }

    Close(){
        this.db.close();
    }
}

module.exports = new MongooseDB(); 