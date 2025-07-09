const { MongoClient } = require("mongodb");

const Db = process.env.MONGO_URI || 'mongodb+srv://rubia:02314@sagri.jpsznvu.mongodb.net/?retryWrites=true&w=majority&appName=sagri';

const client = new MongoClient(Db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let _db;

module.exports = {
    connectToMongoDB: async function (callback) {
        try {
            await client.connect();
            _db = client.db("sagri"); 
            console.log("Conectado ao MongoDB.");

            return callback(null);
        } catch (error) {
            return callback(error);
        }
    },

    getDb: function () {
        return _db;
    }
};
