const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const userService = require("../services/user.service");
const addressService = require("../services/address.service");
const sendResponse = require("../utils/response");
const { isCartExists, createCart } = require("../services/cart.services");
const roleService = require("../services/role.services");

// generate the access and refresh token
const generateTokens = (userId, role_id, cart_id) => {
  try {
    const accessToken = jwt.sign(
      { userId, role_id, cart_id },
      process.env.ACCESS_TOKEN_SECRET,
    );
    const refreshToken = jwt.sign(
      { userId, role_id, cart_id },
      process.env.REFRESH_TOKEN_SECRET,
    );

    return { accessToken, refreshToken };
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

// Register
const registerUser = async (req, res) => {
  try {
    const {
      name,
      role,
      email,
      age,
      phone,
      address,
      password,
      country,
      gender,
    } = req.body;

    const user = await userService.getUserByEmailOrMobileNo(res, email,phone);

    if (user.length > 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "user already exists with email/phone number",
        success: false,
      });

    const hashedpassword = await bcrypt.hash(password, 10);

    const newuser = await userService.createUser(res, {
      name,
      age,
      role_id: role,
      email,
      phone,
      address,
      password: hashedpassword,
      country,
      gender,
    });

    if (newuser.length == 0) {
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "error while creating user",
        success: false,
      });
    }

    const roleIs = await roleService.getRolesById(res, role);

    if (roleIs[0].name == "customer") {
      const cart = await createCart(res, newuser[0]);

      const addaddress = await addressService.createAddress(
        res,
        address,
        newuser[0],
      );

      if (addaddress.length == 0) {
        return sendResponse({
          res,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "error while creating user",
          success: false,
        });
      }
    }

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "user registered successfully",
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

// Login
const loginUser = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const user = await userService.getUserByEmail(res, Email);

    if (user.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: "user does not exists",
        success: false,
      });

    const isPasswordCorrect = await bcrypt.compare(Password, user[0].password);
    // console.log(isPasswordCorrect);

    if (!isPasswordCorrect)
      return sendResponse({
        res,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: "incorrect password",
        success: false,
      });

    const roleIs = await roleService.getRolesById(res, user[0].role_id);
    let cart = null;

    if (roleIs[0].name == "customer") {
      cart = await isCartExists(res, user[0].id);

      if (cart.length == 0) {
        cart = await createCart(res, user[0]);
      }
    }

    const { accessToken, refreshToken } = generateTokens(
      user[0].id,
      user[0].role_id,
      cart ? cart[0].id : null,
    );

    const newUser = await userService.updateUserByEmail(res, Email, {
      refresh_token: refreshToken,
    });

    if (!newUser)
      sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "internal server error",
        success: false,
      });

    const updatedUser = await userService.getUserById(res, user[0].id);
      
    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "user logged in sucessfully",
      data: { updatedUser, accessToken },
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

// Logout
const logoutUser = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "userid is not present",
        success: false,
      });

    const user = await userService.getUserById(res, userId);

    if (user.length == 0) {
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "user does not exists",
        success: false,
      });
    }

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "user profile logout successfully",
      data: true,
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

module.exports = { registerUser, loginUser, logoutUser };
