const { StatusCodes } = require("http-status-codes");
const userService = require("../services/user.service");
const roleService = require("../services/role.services");
const sendResponse = require("../utils/response");

// Get profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId)
      sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "unauthorized user",
        success: false,
      });

    const user = await userService.getUserById(res, userId);

    if (user.length == 0)
      sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "user does not exists",
      });

    // const role = await roleService.getRolesById(res, user[0].role);

    // if (role.length == 0)
    //   sendResponse({
    //     res,
    //     statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    //     message: "internal server error",
    //     success: false,
    //   });

    // user[0].role = role[0].name;
    
    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "successfully get the user profile",
      data: user,
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

// Update
const updateProfile = async (req, res) => {
  try {
    const userId = req.user;
    const data = req.body;

    console.log('profile',data);
    

    if (req.file) data.user_image = req.file.path;

    if (!userId)
      sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "user id is not present",
        success: false,
      });
    const user = await userService.updateUserById(res, userId, data);

    if (!user)
      sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "internal server error",
        success: false,
      });

    let updatedUser = await userService.getUserById(res, userId);

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "user updated successfully",
      data: updatedUser,
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

// Delete
const deleteProfile = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "userid is not present",
        success: false,
      });

    const user = await userService.removeUserById(res, userId);

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "user profile deleted successfully",
      data: user,
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

module.exports = { getProfile, updateProfile, deleteProfile };
