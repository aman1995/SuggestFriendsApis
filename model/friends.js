const mongoose = require('mongoose');
const Joi = require('joi');
var {User} = require('../model/users');

const friendSchema = new mongoose.Schema({

    userA:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    userB:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },

})

const Friend = mongoose.model('Friend', friendSchema);

const validate = ((friend)=>{
    const schema = {
        userA : Joi.string().required(),
        userB : Joi.string().required()
     };
     return Joi.validate(friend , schema)
})

module.exports.friendSchema = friendSchema;
module.exports.Friend = Friend;
module.exports.validate = validate;