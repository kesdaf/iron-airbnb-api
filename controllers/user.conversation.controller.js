const Conversation = require('../models/user.conversation')
const { USERTYPE } = require('../models/user.model')

module.exports.getConversation = (req,res,next) => {  
    if (req.session.user.type == USERTYPE[0]) {
        Conversation.find({location:req.params.local,user:req.session.user._id})
        .then(convs => res.json(convs))
        .catch(next)
    } else if(req.session.user.type == USERTYPE[1]){
        Conversation.find({location:req.params.local,owner:req.session.user._id})
        .then(convs => res.json(convs))
        .catch(next)
    }
}

module.exports.setMessage = (req,res,next) => {  
    const nextMessage = new Conversation(req.body);
    nextMessage.save()
    .then(message => res.json(message))
    .catch(next)
}