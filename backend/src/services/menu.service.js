const { tableConstant } = require("../utils/constant");
const db = require("../config/db.config");
const sendResponse = require("../utils/response");
const { StatusCodes } = require("http-status-codes");

const addMenuItem = async (res, data) => {
  try {
    const result = await db(tableConstant.menu).insert(data);
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

const getMenuByName = async (res, name,restaurant_id,category_id) => {
  try {
    const result = await db(tableConstant.menu).where({name,restaurant_id,category_id});
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

const getAllMenuItem = async (res, data) => {

    const page=data.page || 0
    const limit=data.limit || 10
    
  try {
    const result = await db(tableConstant.menu)
      .where(function () {
            if (data.category_id) {
              this.where("category_id", data.category_id);
            }
            if (data.restaurant_id) {
              this.where("restaurant_id", data.restaurant_id);
            }
            if (data.query) {
              this.where("name", "like", `%${data.query}%`);
            }
          })
      .offset(page * limit)
      .limit(limit)
      .select(
        "id",
        "type",
        "description",
        "isAvailable",
        "name",
        "price",
        "category_id",
        "image"
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
const getMenuItemById = async (res, itemId) => {
  try {
    const result = await db(tableConstant.menu)
      .where({ id: itemId })
      .select(
        "id",
        "type",
        "description",
        "isAvailable",
        "name",
        "price",
        "restaurant_id",
        "category_id",
        "image",
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

const updateMenuItem = async (res, data) => {
  try {
    const result = await db(tableConstant.menu)
      .where({ id: data.id })
      .update(data);
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

const removeMenuItem = async (res, itemid) => {
  try {
    const result = await db(tableConstant.menu).where({ id: itemid }).del();
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

module.exports = {
  addMenuItem,
  updateMenuItem,
  getMenuItemById,
  removeMenuItem,
  getAllMenuItem,
  getMenuByName
};
