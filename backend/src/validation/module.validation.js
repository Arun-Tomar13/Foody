const Joi = require("joi");

const addModuleSchema = Joi.object({
  name: Joi.string().required().max(40),
  description: Joi.string().required().max(50),
})
const removeModuleSchema = Joi.object({
  name: Joi.string().required().max(20),
})

module.exports = {addModuleSchema,removeModuleSchema};
