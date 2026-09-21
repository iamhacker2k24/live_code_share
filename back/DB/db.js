const mongoose = require('mongoose');
const dbConnection = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/ebook_store")
        console.log("db connected sussfully");
    } catch (error) {
        console.log(error)
    }
}

module.exports = dbConnection;
