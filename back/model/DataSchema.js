const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new mongoose.Schema({}, {
    strict: false
})

const Data =mongoose.model("DataSchema",DataSchema)

module.exports=Data;