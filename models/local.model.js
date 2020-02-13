const mongoose = require('mongoose')

const LocalSchema = new mongoose.Schema(
    {
        title:{type:String,required:true},
        options:[{
            option:{ type: mongoose.Schema.Types.ObjectId, ref: 'LocalOption', required: true },
            bool:{type:Boolean, required:true}
        }],
        owner:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        image:[{type:String}],
        price:{type:Number,required:true},
        description:{type:String,required:true},
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
              },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    }, { timestamps: true }
)
LocalSchema.index({location:'2dsphere'});

const Local = new mongoose.model('Local', LocalSchema)
module.exports = Local