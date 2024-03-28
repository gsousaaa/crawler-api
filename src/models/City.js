
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const modelSchema = new mongoose.Schema({
    city: String,
    region: String,
    country: String,
    temp_c: Number,
    temp_f: Number,
    local_time: String,
    last_updated: String
})

const modelName = 'City'

if (mongoose.connection && mongoose.connection.models[modelName]) {
    module.exports = mongoose.connection.models[modelName]
} else {
    module.exports = mongoose.model(modelName, modelSchema)
}
