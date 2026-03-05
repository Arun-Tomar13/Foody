const { tableConstant } = require("../utils/constant");
const db = require("../config/db.config");
const sendResponse = require("../utils/response");
const { StatusCodes } = require("http-status-codes");

const createCart = async (res,user_id)=>{
   console.log({user_id});
   
   try {
      const cart = await db(tableConstant.cart).insert({user_id})
      return cart
   } catch (error) {
      return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
   }
}

const isCartExists = async (res,user_id)=>{
    try {
      const cart = await db(tableConstant.cart).where({user_id})
     return cart
    } catch (error) {
      return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
    }
}

module.exports = {isCartExists,createCart}