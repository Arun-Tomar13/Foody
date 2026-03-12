const { StatusCodes } = require("http-status-codes");
const db = require("../config/db.config");
const {
  rolesConstant,
  moduleConstant,
  actionConstant,
  tableConstant,
} = require("../utils/constant");
const sendResponse = require("../utils/response");

// Add Permission
const addPermissions = async (req, res) => {
  try {
    const { role, module, action, description } = req.body;

    console.log( rolesConstant[role],
       moduleConstant[module],
       actionConstant[action]);
    

    const isPermissionExists = await db(tableConstant.permission).where({
      role_id: rolesConstant[role],
      module_id: moduleConstant[module],
      action_id: actionConstant[action],
    });

    if (isPermissionExists.length)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "permission already exists",
        success: false,
      });

    const result = await db(tableConstant.permission).insert({
      role_id: rolesConstant[role],
      module_id: moduleConstant[module],
      action_id: actionConstant[action],
      description,
    });

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "permission added successfully",
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

// Remove Permission
const removePermission = async (req, res) => {
  try {
    const { permission_id } = req.body;

    const result = await db(tableConstant.permission).where({ id: permission_id }).del();

    if (!result)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "permission does not exists",
        success: false,
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "permission removed successfully",
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

// Read Permission
const readPermission = async (req, res) => {
  try {
    const result = await db(tableConstant.permission);

    if (result.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "their does not exists any permission",
        success: false,
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "permission read sucessfully",
      data: result,
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

module.exports = { addPermissions, removePermission, readPermission };
