const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Plz provide name"],
        maxlength:50,
        minlength:3
    },
    email:{
        type: String,
        required:[true,"Plz provide email"],
        validate : {
            validator : validator.isEmail,
            message : "plz provide valid email",
        }
    },
    password:{
        type: String,
        required:[true,"Plz provide password"],
        minlength:6,
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user',
    }
})

UserSchema.pre('save',async function(){ 
    if(!this.isModified('password'))return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);

})
UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
  };
module.exports = mongoose.model("User",UserSchema);