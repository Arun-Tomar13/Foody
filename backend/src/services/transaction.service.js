const { tableConstant } = require("../utils/constant");
const db = require("../config/db.config");
const sendResponse = require("../utils/response");
const { StatusCodes } = require("http-status-codes");

const createTransaction = async (res,data)=>{
   
   try {
      const result = await db(tableConstant.transaction).insert(data)
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

const getTransaction = async (res,data)=>{
   
   try {
      const result = await db(tableConstant.transaction).where(data).select('id','created_at as date','transaction_type','transaction_id','credit','debit')
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

const getTotal = async (res,user_id)=>{
   
   try {
      const result = await db(tableConstant.wallet).where({user_id}).select('total_credit as credit','total_debit as debit','balance')
      return result[0]
   } catch (error) {
      return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
   }
}

module.exports = {createTransaction,getTransaction,getTotal}