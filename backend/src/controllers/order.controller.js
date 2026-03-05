const { StatusCodes } = require("http-status-codes");
const orderService = require("../services/order.service");
const sendResponse = require("../utils/response");
const cartItemService = require("../services/cartItem.service");
const userService = require("../services/user.service");
const menuService = require("../services/menu.service");
const transactionService = require("../services/transaction.service");
let converter = require("json-2-csv");
const { writeFileSync } = require("fs");
// const { readFile, writeFile } = require('fs').promises;
const path = require("path");
const  {sendEmail, orderConfirmationTemplate}  = require("../utils/sendEmail");

// add cart
const createOrder = async (req, res) => {
  try {
    const cart_id = req.cart;
    const userId = req.user;
    const { address } = req.body;

    if (!cart_id)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "user does not have cart",
        success: false,
      });

    const cartItems = await cartItemService.getAllCartItem(res, cart_id);

    const total = cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const order = await orderService.addOrder(res, userId, total, address);

    if (order.length == 0) {
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "error while creating order",
        success: false,
      });
    }

    const transaction = await transactionService.createTransaction(res, {
      user_id: userId,
      order_id: order[0],
      debit: total,
      transaction_type: "order",
      transaction_id: `${Math.floor(Math.random() * 10)}${userId}${Date.now()}`,
    });

    await Promise.all(
      cartItems.map(async (item) => {
        await orderService.addOrderItem(
          res,
          order[0],
          item.quantity,
          item.price,
          item.item_id,
          userId,
        );
      }),
    );

    // const items = await orderService.getItemByOrderId(res,order[0])

    const user = await userService.getUserById(res, userId);

    if (user.length == 0) {
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "error while fetching user details",
        success: false,
      });
    }

    // await sendEmail(res,
    //   {sendToEmail:user[0].email,
    //     subject:'Order Created SucessFully',
    //     message:`wooh! /n ${user.name} your order of good created successfully`,
    //     data: orderConfirmationTemplate(order[0],total,cartItems)
    //   })
      // console.log("email",emailresult);

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "order created successfully",
      data: order[0],
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

const getOrder = async (req, res) => {
  try {
    const userId = req.user;

    const order = await orderService.getAllOrder(res, userId);

    if (order.length == 0) {
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "order does not exists",
        success: false,
      });
    }

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "successfully get the user profile",
      data: order,
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

const getOrderItemsByOrderId = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    const order = await orderService.getItemByOrderId(res, id);

    if (order.length == 0) {
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "order does have items",
        success: false,
      });
    }

    const orderList = await orderService.getItemByOrderId(res, id);

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "order items get successfully",
      data: orderList,
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

const getOrderCSV = async (req, res) => {
  try {
    const userId = req.user;

    const orderList = await orderService.getAllOrder(res, userId);

    if (orderList.length == 0) {
      return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "order does not exists",
        success: false,
      });
    }

    const csv = await converter.json2csv(orderList);

    const destination = path.join("public/exports");
    const fileName = `order-${Date.now()}.csv`;

    const filepath = path.join(destination, fileName);

    writeFileSync(filepath, csv);

    const downloadLink = `${req.protocol}://${req.get("host")}/public/exports/${fileName}`;

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "csv generated succesfully",
      data: downloadLink,
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

module.exports = { createOrder, getOrder, getOrderItemsByOrderId, getOrderCSV };
