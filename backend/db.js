const mongoose = require('mongoose');
const DB = 'mongodb+srv://vaibhavmishra230304:VaVe18614@eatthefruit.2zpvb.mongodb.net/vaibhavmishra?retryWrites=true&w=majority&appName=eatthefruit';

const connectDB = async () => {
    try {
        await mongoose.connect(DB);
        console.log("Connected to MongoDB Atlas");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
