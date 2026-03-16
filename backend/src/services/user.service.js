const { StatusCodes } = require("http-status-codes");
const db = require("../config/db.config");
const sendResponse = require("../utils/response");


const createUser = async (res,data) => {
  try {
    const newuser = await db("users").insert(data);
    return newuser;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const getUserByEmail = async (res,userEmail) => {
 try {
   const userData = await db("users").where({
     email: userEmail,
   });
 
   return userData;
 } catch (error) {
  return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
 }
};
const getUserByEmailOrMobileNo = async (res,userEmail,mobile) => {
 try {
   const userData = await db("users").where(function(){
     this.where('email',userEmail)
     .orWhere('phone',mobile)
   });
 
   return userData;
 } catch (error) {
  return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
 }
};

const updateUserByEmail = async (res,userEmail, updateData) => {
  try {
    const userData = await db("users")
      .where({
        email: userEmail,
      })
      .update(updateData);
  
    return userData;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const getUserById = async (res,userId) => {
  try {
    const userData = await db("users").where({
      id: userId,
    }).select('name','email','age','address','country','phone','gender','user_image','role_id as role')
  
    return userData;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const updateUserById = async (res,userId,updateData) => {
  
  try {
    const userData = await db("users").where({
      id: userId,
    })
    .update(updateData)
  
    return userData;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const removeUserById = async (res,userId) => {
  try {
    const userData = await db("users").where({
      id: userId,
    })
    .del();
    
    return userData;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};


module.exports = { getUserByEmail, updateUserByEmail,createUser, getUserById,updateUserById,removeUserById,getUserByEmailOrMobileNo };
