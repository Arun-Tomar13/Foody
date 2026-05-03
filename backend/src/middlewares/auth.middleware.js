const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/response");
const { StatusCodes } = require("http-status-codes");

const auth = () => {
  return async (req, res, next) => {
    try {
      const Bearer = req.get("Authorization");
      
      
      if (!Bearer)
        return sendResponse({
          res,
          statusCode: StatusCodes.UNAUTHORIZED,
          message: 'invalid token',
          success: false,
        });

      const isAccessTokenValid = jwt.verify(
        Bearer,
        process.env.ACCESS_TOKEN_SECRET,
      );

      if (!isAccessTokenValid)
        return sendResponse({
          res,
          statusCode: StatusCodes.UNAUTHORIZED,
          message: 'Unauthorized user',
          success: false,
        });

      req.user = isAccessTokenValid.userId;
      req.cart = isAccessTokenValid.cart_id;
      req.role = isAccessTokenValid.role_id;
      next();
    } catch (error) {
      return sendResponse({
        res,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'invalid token',
        success: false,
      });
    }
  };
};

module.exports = { auth };
