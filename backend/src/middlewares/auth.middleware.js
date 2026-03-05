const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const db = require("../config/db.config");
const { StatusCodes } = require("http-status-codes");

const auth = () => {
  return async (req, res, next) => {
    try {
      const  Bearer  = req.get('Authorization')

      if (!Bearer) throw new ApiError(StatusCodes.UNAUTHORIZED,"Bearer token is not present");
      
      const isAccessTokenValid = jwt.verify(
        Bearer,
        process.env.ACCESS_TOKEN_SECRET,
      );
      
      if (!isAccessTokenValid) throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized user");

      req.user = isAccessTokenValid.userId;
      req.cart = isAccessTokenValid.cart_id;
      next();
    } catch (error) {
      throw new ApiError(StatusCodes.UNAUTHORIZED,error?.message || "invalid bearer token" );
    }
  };
};

module.exports = { auth };
