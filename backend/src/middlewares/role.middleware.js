const sendResponse = require("../utils/response");
const { StatusCodes } = require("http-status-codes");
const {
  tableConstant,
  rolesConstant,
  moduleConstant,
  actionConstant,
} = require("../utils/constant");
const db = require("../config/db.config");

const checkPermission = (module_id, action_id) => {
  return async (req, res, next) => {
    try {
      // const role_id = req.role;
      
      // if (!role_id)
      //   return sendResponse({
      //     res,
      //     statusCode: StatusCodes.UNAUTHORIZED,
      //     message: "error while fetching role",
      //     success: false,
      //   });

      // if (role_id == rolesConstant.admin) {next(); return };

      //   const isHasPermission = await db(tableConstant.permission).where({
      //     role_id,
      //     module_id,
      //     action_id,
      //   });

      // if (isHasPermission.length == 0)
      //   return sendResponse({
      //     res,
      //     statusCode: StatusCodes.UNAUTHORIZED,
      //     message: "permission denied",
      //     success: false,
      //   });

      next();
    } catch (error) {
      return sendResponse({
        res,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: "Something went wrong while checking permission",
        success: false,
      });
    }
  };
};

module.exports =  checkPermission ;
