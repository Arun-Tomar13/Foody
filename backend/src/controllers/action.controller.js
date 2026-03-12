const { StatusCodes } = require("http-status-codes");
const userService = require("../services/user.service");
const sendResponse = require("../utils/response");
const { tableConstant } = require("../utils/constant");
const db = require("../config/db.config");

const addAction = async (req, res) => {
  try {
    const {name,description} = req.body;
    let module = await db(tableConstant.action).insert({name,description});

    if (module.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "error while creating action",
        success: false,
      });
      
    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "action created succesfully"
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

const removeAction = async (req, res) => {
  try {
    const {name} = req.body;
    
    let module = await db(tableConstant.action).where({name}).del();

    if (!module)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "error while removing action",
        success: false,
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "action removed succesfully"
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

module.exports = {addAction,removeAction};
