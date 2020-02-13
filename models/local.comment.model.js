const mongoose = require('mongoose')

const localCommentSchema = new mongoose.Schema({
    starts:{type:Number,enum:[0,1,2,3,4,5]},
    user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reserve:{ type: mongoose.Schema.Types.ObjectId, ref: 'localReserve', required: true },
    // location:{ type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    message:{type:String},
    idParent:{ type: mongoose.Schema.Types.ObjectId, ref: 'localComment'},
}, { timestamps: true })

  
module.exports = new mongoose.model('localComment', localCommentSchema);