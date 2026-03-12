const Joi = require("joi");

const addActionSchema = Joi.object({
  name: Joi.string().required().max(40),
  description: Joi.string().required().max(50),
})
const removeActionSchema = Joi.object({
  name: Joi.string().required().max(20),
})

module.exports = {addActionSchema,removeActionSchema};
