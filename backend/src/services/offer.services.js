const { tableConstant } = require("../utils/constant");
const db = require("../config/db.config");
const sendResponse = require("../utils/response");
const { StatusCodes } = require("http-status-codes");

const addOffer = async (res, data) => {
  try {
    const result = await db(tableConstant.offer).insert(data);
    return result;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const updateOffer = async (res, id, data) => {
  try {
    const result = await db(tableConstant.offer).where({ id }).update(data);
    return result;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const getOffer = async (res, data=null) => {
  try {
    const result = await db(tableConstant.offer)
      .where(function () {
        if (data) {
          this.where(data);
        }
      })
      .select(
        "id",
        "name",
        "type",
        "description",
        "discount",
        "max_discount_limit",
        "min_order_amount",
        "start_date",
        "end_date",
        "start_time",
        "end_time",
        "limit",
        "created_by",
        "status",
      );
    return result;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

module.exports = { addOffer, getOffer, updateOffer };
