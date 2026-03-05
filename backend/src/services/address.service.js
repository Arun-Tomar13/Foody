const { tableConstant } = require("../utils/constant");
const db = require("../config/db.config");
const sendResponse = require("../utils/response");
const { StatusCodes } = require("http-status-codes");

const createAddress = async (res,address,user_id)=>{
   
   try {
      const result = await db(tableConstant.address).insert({address,user_id})
      return result
   } catch (error) {
      return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
   }
}

const getAddress = async (res,data)=>{
   
   try {
      const result = await db(tableConstant.address).where(data).select('address')
      
      return result
   } catch (error) {
      return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
   }
}

const deleteAddressById = async (res,id)=>{
   
   try {
      const result = await db(tableConstant.address).where({id}).del()
      return result
   } catch (error) {
      return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
   }
}

module.exports = {createAddress,getAddress,deleteAddressById}