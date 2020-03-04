const mogoose = require('mongoose')
const Local = require('./local.model')

const bcrypt = require('bcrypt');
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_WORK_FACTOR = 10;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const generateRandomToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

const USERTYPE = ['user','owner','admin'];
const userSchema = new mogoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [EMAIL_PATTERN, 'Email is invalid']
          },
        password:{
          type: String, 
          required: true,
          // match:[PASSWORD_PATTERN,'Password need 8 character lower case, upper case and number']
        },
        type:{ type: String, enum: USERTYPE },
        avatar:{type:String},
        validateToken: {
            type: String,
            default: generateRandomToken
          },
        validated: {
            type: Boolean,
            default: false
        },        
    }, { timestamps: true }
);

userSchema.virtual('local', {
	ref: Local.modelName,
	localField: '_id',
	foreignField: 'owner',
	options: { sort: { position: -1 } }
});

userSchema.pre('save', function (next) {
    const user = this;
  
    if (user.isModified('password')) {
      bcrypt.genSalt(SALT_WORK_FACTOR)
        .then(salt => {
          return bcrypt.hash(user.password, salt)
            .then(hash => {
              user.password = hash;
              next();
            });
        })
        .catch(error => next(error));
    } else {
      next();
    }
  });
  
  userSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
  }
  
  const User = new mogoose.model('User', userSchema);
  
  module.exports ={
      User,
      USERTYPE
  }