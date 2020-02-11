const mogoose = require('mongoose')
const LocalOptionsSchema = new mogoose.Schema({
    name:{type:String,required:true},
    icon:{type:String,required:false}
})

const LocalOptions = new mogoose.model('LocalOption', LocalOptionsSchema)
module.exports = LocalOptions