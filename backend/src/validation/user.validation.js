// const {joiDate} = require("@joi/date");
// const joiBase = require('joi');

// const Joi = joiBase.extend(joiDate);

// const addUserValidation=()=>{
//     body:Joi.objectId().keys({
//         name: Joi.string().required().message({
//             "string.base":"name should be the type of text",
//             "string.empty":"name cannot be empty",
//             "any.required":"name is required"
//         }),
//         email: Joi.string().email({ minDomainSegments: 2, }).required().message({
//             "string.base":"email should be the type of text",
//             "string.email":"enter a valid email",
//             "string.empty":"email cannot be empty",
//             "any.required":"email is required"
//         }),
//         phone: Joi.string().required().message({
//             "string.base":"phone should be the type of text",
//             "string.empty":"phone cannot be empty",
//             "any.required":"phone is required"
//         }),
//         address: Joi.string().required().message({
//             "string.base":"address should be the type of text",
//             "string.empty":"address cannot be empty",
//             "any.required":"address is required"
//         }),
//         country: Joi.string().required().message({
//             "string.base":"country should be the type of text",
//             "string.empty":"country cannot be empty",
//             "any.required":"country is required"
//         }),
//         gender: Joi.string().required().message({
//             "string.base":"gender should be the type of text",
//             "string.empty":"gender cannot be empty",
//             "any.required":"gender is required"
//         }),
//     })
// }

const Joi = require("joi");

const addUserSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
  role: Joi.number().required(),
  email: Joi.string().required().email(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  country: Joi.string().required(),
  password: Joi.string().required(),
  gender: Joi.string().required(),
});

const loginUserSchema = Joi.object({
  Email: Joi.string().required().email(),
  Password: Joi.string().required(),
});

module.exports = {addUserSchema,loginUserSchema};


