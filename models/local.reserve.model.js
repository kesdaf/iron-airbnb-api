const mongoose = require('mongoose')
//const Local = require('./local.model')
//const User = require('./user.model')

const localReserveSchema = new mongoose.Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    local:{ type: mongoose.Schema.Types.ObjectId, ref: 'Local', required: true },
    init_date:{type:Date},
    finish_date:{type:Date},
    accepted:{type:Boolean}
}, { timestamps: true })
  
module.exports = new mongoose.model('localReserve', localReserveSchema);