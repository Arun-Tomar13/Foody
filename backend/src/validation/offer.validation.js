const Joi = require("joi");

const createOfferSchema = Joi.object({
  name: Joi.string().required('name is required'),
  description: Joi.string().required(),
  type: Joi.string().required(),
  discount: Joi.number().required(),
  max_discount_limit: Joi.number().required(),
  min_order_amount: Joi.number().required(),
  start_date: Joi.string().required(),
  end_date: Joi.string().required(),
  start_time: Joi.string().required(),
  end_time: Joi.string().required(),
  limit: Joi.number().required(),
});

module.exports = {createOfferSchema};
