const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        unique:true,
        required:true
    },
})

const User = mongoose.model('User', userSchema);

const validate = ((user)=>{
    const schema = {
        username : Joi.string().required(),
     };
     return Joi.validate(user , schema)
})

module.exports.userSchema = userSchema;
module.exports.User = User;
module.exports.validate = validate;