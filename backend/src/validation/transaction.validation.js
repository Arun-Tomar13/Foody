const Joi = require("joi");

const TransactionAmountSchema = Joi.object({
  amount: Joi.number().positive().min(100).max(100000).required(),
})

module.exports = {TransactionAmountSchema};
