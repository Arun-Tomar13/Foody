const { StatusCodes } = require("http-status-codes");
const userService = require("../services/user.service");
const sendResponse = require("../utils/response");
const { tableConstant } = require("../utils/constant");
const db = require("../config/db.config");

const addModule = async (req, res) => {
  try {
    const {name,description} = req.body;
    let module = await db(tableConstant.module).insert({name,description});

    if (module.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "error while creating module",
        success: false,
      });
      
    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "module created succesfully"
    });
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const removeModule = async (req, res) => {
  try {
    const {name} = req.body;
    
    let module = await db(tableConstant.module).where({name}).del();

    if (!module)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "error while removing module",
        success: false,
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "module removed succesfully"
    });
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

module.exports = {addModule,removeModule};
