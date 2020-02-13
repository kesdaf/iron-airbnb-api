const mogoose = require('mongoose')

const userConversationSchema = new mogoose.Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location:{ type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    message:{type:String},
    comment:{type: mongoose.Schema.Types.ObjectId, ref: 'LocalComment', required: true },
}, { timestamps: true })


  
module.exports = new mogoose.model('UserConversation', userConversationSchema);