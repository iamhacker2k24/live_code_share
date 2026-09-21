const mongoose = require('mongoose');
const dbConnection = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/live_file_share")
        console.log("db connected sussfully");
    } catch (error) {
        console.log(error)
    }
}

module.exports = dbConnection;
