const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
    name: String,
    email:String,
    passwordHash: String,
    modules: [{
        type: mongoose.Types.ObjectId,
        ref: 'Module'
    }],
    token: String
});

const modelName = 'User';

if(mongoose.connection && mongoose.connection.models[modelName]){
    module.exports = connection.models[modelName];
}else{
    module.exports = mongoose.model(modelName, userSchema);
}