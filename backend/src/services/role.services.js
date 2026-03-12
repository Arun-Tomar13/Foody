const { tableConstant } = require("../utils/constant");
const db = require("../config/db.config");
const sendResponse = require("../utils/response");
const { StatusCodes } = require("http-status-codes");

const getRolesById = async (res,role_id)=>{
try {
    const result = await db(tableConstant.role).where({id:role_id})
    return result;
    
} catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
}
}

module.exports = {getRolesById}