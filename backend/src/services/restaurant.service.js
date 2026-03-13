const { tableConstant } = require("../utils/constant");
const db = require("../config/db.config");
const sendResponse = require("../utils/response");
const { StatusCodes } = require("http-status-codes");

const getAllRestaurant = async (res) => {
  try {
    const result = await db(tableConstant.restaurant);
    return result;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};
const getRestaurantbyOwnerId = async (res, userid) => {
  try {
    const result = await db(tableConstant.restaurant)
      .where({ owner_id: userid })
      .select(
        "id",
        "name",
        "type",
        "address",
        "openingTime",
        "closingTime",
        "rating",
        "isOpen"
      );
      
    return result;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const getRestaurantId = async (res, id) => {
  try {
    const result = await db(tableConstant.restaurant)
      .where({ id })
      .select(
        "id",
        "name",
        "isOpen",
        "type",
        "address",
        "openingTime",
        "closingTime",
        "rating",
        "isOpen"
      );
    return result;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};
const toggleAvailabity = async (res, id) => {
  try {
    const result = await db(tableConstant.restaurant)
      .where({ id })
      .update({isOpen : db.raw('NOT ??',['isOpen'])})
      
    return result;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const getRestaurantByName = async (res, name) => {
  try {
    const result = await db(tableConstant.restaurant)
      .where({ name })
      .select("id");
    return result;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const createRestaurant = async (res, data) => {
  try {
    const result = await db(tableConstant.restaurant).insert(data);
    return result;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const updateRestaurantInfoByOwnerId = async (
  res,
  { id, name, openingTime, closingTime, address, type },
) => {
  try {
    const result = await db(tableConstant.restaurant)
      .where({ owner_id: id })
      .update({
        name,
        openingTime,
        closingTime,
        address,
        type,
      });
    return result;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const updateRestaurantById = async (
  res,
  { id, name, openingTime, closingTime, address, type },
) => {
  try {
    const result = await db(tableConstant.restaurant).where({ id }).update({
      name,
      openingTime,
      closingTime,
      address,
      type,
    });
    return result;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const removeRestaurantByOwnerId = async (res, userid) => {
  try {
    const result = await db(tableConstant.restaurant)
      .where({ owner_id: userid })
      .del();
    return result;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const removeRestaurantById = async (res, id) => {
  try {
    const result = await db(tableConstant.restaurant).where({ id }).del();
    return result;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const MenuPerRestaurant = async (res, id) => {
  try {
    const result = await db(tableConstant.restaurant)
      .join(tableConstant.menu, "menu.restaurant_id", "=", "restaurants.id")
      .select("restaurants.name as name")
      .count("* as y")
      .groupBy("restaurants.id");
    return result;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const OrdersPerRestaurant = async (res) => {
  try {
    const result = await db(tableConstant.orderItem)
      .join(tableConstant.menu, "order_items.item_id", "=", "menu.id")
      .join(
        tableConstant.restaurant,
        "menu.restaurant_id",
        "=",
        "restaurants.id",
      )
      .select(
        "restaurants.name as name",
        db.raw("SUM((menu.price)*(order_items.quantity)) as total"),
      )
      .groupBy("order_items.order_id", "restaurants.id");
    return result;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

const revenueByDatesOfRestaurant = async (res) => {
  try {
    const result = await db(tableConstant.orderItem)
      .join(tableConstant.menu, "order_items.item_id", "=", "menu.id")
      .join(
        tableConstant.restaurant,
        "menu.restaurant_id",
        "=",
        "restaurants.id",
      )
      .select(
        db.raw("DATE(order_items.created_at) as date"),
        "restaurants.name as name",
        db.raw(
          "CAST(SUM((menu.price)*(order_items.quantity))AS SIGNED) as total",
        ),
      )
      .groupBy("order_items.created_at", "restaurants.name");
    return result;
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  getRestaurantbyOwnerId,
  createRestaurant,
  removeRestaurantById,
  getRestaurantId,
  updateRestaurantInfoByOwnerId,
  removeRestaurantByOwnerId,
  getAllRestaurant,
  updateRestaurantById,
  MenuPerRestaurant,
  OrdersPerRestaurant,
  revenueByDatesOfRestaurant,
  getRestaurantByName,
  toggleAvailabity
};
