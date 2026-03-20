const Joi = require("joi");

const createRestaurantSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  address: Joi.string().required(),
  openingTime: Joi.string().required(),
  closingTime: Joi.string().required(),
  owner: Joi.number().required(),
});
const updateRestaurantSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  address: Joi.string().required(),
  openingTime: Joi.string().required(),
  closingTime: Joi.string().required(),
});
const restaurantIdSchema = Joi.object({
  id: Joi.number().positive().required(),
})

module.exports = {createRestaurantSchema,updateRestaurantSchema,restaurantIdSchema};
