const { StatusCodes } = require("http-status-codes");
const cartItemService = require("../services/cartItem.service");
const sendResponse = require("../utils/response");
const offerService = require("../services/offer.services");
const { rolesConstant } = require("../utils/constant");
const { limit } = require("../config/db.config");

// create offer
const createOffer = async (req, res) => {
  try {
    const userId = req.user;
    const role = req.role;
    const {
      name,
      type,
      description,
      discount,
      max_discount_limit,
      min_order_amount,
      start_date,
      end_date,
      start_time,
      end_time,
      limit,
    } = req.body;

    const isOrderExists = await offerService.getOffer(res, {
      name,
      type,
      discount,
    });

    if (isOrderExists.length > 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "offer already exists!",
        success: false,
      });

    let coupon_code = `${name.replace(" ", "")}${Math.floor(Math.random() * 999999)}`;

    const offer = await offerService.addOffer(res, {
      name,
      type,
      description,
      discount,
      max_discount_limit,
      min_order_amount,
      start_date,
      end_date,
      start_time,
      end_time,
      coupon_code,
      created_by: role == rolesConstant.admin ? 0 : userId,
      limit,
    });

    if (offer.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "error while creating offer!",
        success: false,
      });

    const createdOffer = await offerService.getOffer(res, { id: offer[0] });

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "offer created successfully",
      data: createdOffer,
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

// update offer
const updateOffer = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      discount,
      max_discount_limit,
      min_order_amount,
      start_date,
      end_date,
      start_time,
      end_time,
      limit,
      status,
    } = req.body;
    const { id } = req.params;

    console.log(id);

    const isOrderExists = await offerService.getOffer(res, { id });

    if (isOrderExists.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "offer does not exists!",
        success: false,
      });

    const offer = await offerService.updateOffer(res, id, {
      name,
      type,
      description,
      discount,
      max_discount_limit,
      min_order_amount,
      start_date,
      end_date,
      start_time,
      end_time,
      limit,
      status,
    });

    if (offer.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "error while creating offer!",
        success: false,
      });

    const updatedOffer = await offerService.getOffer(res, { id });

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "offer updated successfully",
      data: updatedOffer,
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

// get offer
const getOffers = async (req, res) => {
  try {
    const role = req.role;
    const userId = req.user;

    let offer;
    if (role == rolesConstant.admin) {
      offer = await offerService.getOffer(res);
    } else if (role == rolesConstant.restaurant_owner) {
      offer = await offerService.getOffer(res, { created_by: userId });
    } else offer = await offerService.getOffer(res, { status: 1 });

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "offer fetched successfully",
      data: offer,
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

const applyOffer = async (req, res) => {
  try {
    const userId = req.user;
    const { coupon_code, total } = req.body;
    const { restaurant_id } = req.query;

    const offer = await offerService.getOffer(res, { coupon_code });

    if (offer.length == 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "invalid coupon code!",
        success: false,
      });

      if (offer[0].min_order_amount > total)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "add more item to get offer",
        success: false,
      });

    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];
    // const time =currentDate.toISOString().split('T')[1].split('.')[0].slice(0,-3)

    if (date < offer[0].start_date || date > offer[0].end_date) {
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "coupon code is expired!",
        success: false,
      });
    }

    const offerAlreadyUsed = await offerService.offerAlreadyUsed(res, {
      offer_id: offer[0].id,
      used_by: userId,
    });

    if (offerAlreadyUsed.length > 0)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "coupon code's limit exceed!",
        success: false,
      });

    if (offer[0].created_by && offer[0].created_by != restaurant_id)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "coupon is not applicable on this restaurant's time",
        success: false,
      });

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "offer fetched successfully",
      data: offer,
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

module.exports = { createOffer, updateOffer, getOffers, applyOffer };
