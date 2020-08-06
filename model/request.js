const mongoose = require('mongoose');
const Joi = require('joi');
var {User} = require('../model/users');

const requestSchema = new mongoose.Schema({

    from:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    to:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },

})

const Request = mongoose.model('Request', requestSchema);

const validate = ((request)=>{
    const schema = {
        userA : Joi.string().required(),
        userB : Joi.string().required()
     };
     return Joi.validate(request , schema)
})

module.exports.requestSchema = requestSchema;
module.exports.Request = Request;
module.exports.validate = validate;