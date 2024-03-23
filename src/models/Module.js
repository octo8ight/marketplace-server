const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const moduleSchema = new mongoose.Schema({
    name: String,
    // tokenId: String,
    url: String,
    desc: String,
    imgPath: String,
    price: Number,
    offer: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users'
        },
        price: Number,
        Date: {
            type: Date,
            default: Date.now()
        },
        status: {
            type: String,
            enum: ['waiting', 'accept'],
            default: 'waiting'
        }
    }]
})

const modelName = 'Module'

if(mongoose.connection && mongoose.connection.models[modelName]){
    module.exports = connection.models[modelName]
}else{
    module.exports = mongoose.model(modelName, moduleSchema)
}