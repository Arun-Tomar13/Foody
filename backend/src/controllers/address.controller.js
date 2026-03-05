const { StatusCodes } = require("http-status-codes");
const { responseMessage, tableConstant } = require("../utils/constant");
const sendResponse = require("../utils/response");
const addressService = require("../services/address.service");

// Add address
const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userid = req.user;

    const hasAddress = await addressService.getAddress(res, {
      address,
      user_id: userid,
    });

    if (hasAddress.length > 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "address already exists",
        success: false,
      });

    const newAddress = await addressService.createAddress(res, address, userid);

    if (newAddress.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "error while adding address",
        success: false,
      });

    const addedAddress = await addressService.getAddress(res, {
      id: newAddress[0],
    });

    if (addedAddress.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: responseMessage.errorInCreatingMenu,
        success: false,
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "address added successfully",
      data: addedAddress[0],
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

// get Address
const getAddress = async (req, res) => {
  try {
    const userid = req.user;

    const hasAddress = await addressService.getAddress(res, {
      user_id: userid,
    });

    if (hasAddress.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "address does not exists",
        success: false,
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "address added successfully",
      data: hasAddress,
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
// remove Address
const removeAddress = async (req, res) => {
  try {
    const {id} = req.params;

    const hasAddress = await addressService.getAddress(res, {id});

    if (hasAddress.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "address does not exists",
        success: false,
      });

    const isRemoved = await addressService.deleteAddressById(res, id);

    if (!isRemoved) {
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "internal server error",
        success: false,
      });
    }

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "address added successfully",
      data: id,
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

module.exports = { addAddress, getAddress, removeAddress };
