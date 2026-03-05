const { StatusCodes } = require("http-status-codes");
const db = require("../config/db.config");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// Add Permission
const addPermissions = async (req, res) => {
  try {
    const { roleId, moduleId, description } = req.body;

    const isPermissionExists = await db("permissions").where({
      role_id: roleId,
      module_id: moduleId,
    });
    console.log(isPermissionExists);

    if (!isPermissionExists)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "permission already exists",
        success: false,
      });

    const result = await db("permissions").insert({
      role_id: roleId,
      module_id: moduleId,
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
    const { roleId, moduleId } = req.body;

    const result = await db("permissions")
      .where({ role_id: roleId, module_id: moduleId })
      .del();

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
    const result = await db("permissions");
 
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
