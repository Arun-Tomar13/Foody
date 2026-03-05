const Joi = require("joi");

const createMenuSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  price: Joi.string().required(),
  category_id: Joi.number().positive().required(),
});
const updateMenuSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  image: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.string().required(),
  id: Joi.number().positive().required(),
  category_id: Joi.number().positive().required(),
  isAvailable: Joi.number().required(),
});
const menuIdSchema = Joi.object({
  id: Joi.number().positive().required(),
})

module.exports = {menuIdSchema,updateMenuSchema,createMenuSchema};
