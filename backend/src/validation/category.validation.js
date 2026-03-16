const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  isAvailable: Joi.number().required(),
});
const updateCategorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  id: Joi.number().positive().required(),
  isAvailable: Joi.number().required(),
});
const categoryIdSchema = Joi.object({
  id: Joi.number().positive().required(),
})

module.exports = {createCategorySchema,updateCategorySchema,categoryIdSchema};
