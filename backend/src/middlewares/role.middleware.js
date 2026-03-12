const sendResponse = require("../utils/response");
const { StatusCodes } = require("http-status-codes");
const roleService = require("../services/role.services");

const checkRoles = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const role_id = req.role;
      if (!role_id)
        return sendResponse({
          res,
          statusCode: StatusCodes.UNAUTHORIZED,
          message: "error while fetching role",
          success: false,
        });

      const role = await roleService.getRolesById(res, role_id);
      
      if (role.length==0)
        return sendResponse({
          res,
          statusCode: StatusCodes.UNAUTHORIZED,
          message: "role does not exists",
          success: false,
        });

      if (role[0].name =='admin' || !allowedRoles.includes(role[0].name))
        return sendResponse({
          res,
          statusCode: StatusCodes.UNAUTHORIZED,
          message: "permission denied",
          success: false,
        });

      next();
    } catch (error) {
      return sendResponse({
        res,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: error.message,
        success: false,
      });
    }
  };
};

module.exports = { checkRoles };
