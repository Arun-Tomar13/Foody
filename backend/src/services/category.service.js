const { tableConstant } = require("../utils/constant");
const db = require("../config/db.config");
const sendResponse = require("../utils/response");
const { StatusCodes } = require("http-status-codes");

const createCategory = async (res,{name,description,restaurant_id,isAvailable}) => {
    
  try {
    const result = await db(tableConstant.category).insert({name,description,isAvailable,restaurant_id});
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

const updateCategory = async (res,{id,name,description,isAvailable}) => {
  try {
    const result = await db(tableConstant.category).where({id}).update({name,description,isAvailable});
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

const getCategory = async (res,data) => {
  try {
    const result = await  db(tableConstant.category)
          .where(data)
          .select("id", "name", "description", "isAvailable");
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

const removeCategoryById = async (res,{id}) => {
  try {
    const result = await  db(tableConstant.category).where({ id }).del();
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

module.exports = {createCategory,getCategory,updateCategory,removeCategoryById}
