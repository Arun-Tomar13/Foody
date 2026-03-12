const { StatusCodes } = require('http-status-codes')
const userService =  require('../services/user.service')
const  sendResponse  = require('../utils/response')
const { tableConstant, rolesConstant } = require('../utils/constant')
const db = require('../config/db.config')

const getRoles = async (req,res)=>{
try {
      let user = await db(tableConstant.role).select('id','name')
      if (user.length==0)  return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'table does not exists',
        success:false
      }); 
  
      user = user.filter((data)=> data.id!=rolesConstant.admin)
      return sendResponse({res,statusCode:StatusCodes.OK,message:"role fetched succesfully",data:user})
} catch (error) {
  return sendResponse({res,statusCode:StatusCodes.BAD_REQUEST,message:error.message,success:false})
}
}

module.exports = getRoles