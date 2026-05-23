const { StatusCodes } = require("http-status-codes");
const sendResponse = require("../utils/response");
const transactionService = require("../services/transaction.service");

// top up
const topUpInTrasaction = async (req, res) => {
  try {
    const userId = req.user
    const {amount} = req.body

    if (!userId)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "user does not exists",
        success: false,
      });
      
      const createtransaction = await transactionService.createTransaction(res,{user_id:userId,credit:amount,transaction_type:'top-up',transaction_id:`${Math.floor(Math.random()*10)}${userId}${Date.now()}`})
      
      if (createtransaction.length == 0)
        return sendResponse({
          res,
          statusCode: StatusCodes.BAD_REQUEST,
          message: "error while topup",
          success: false,
        });

      const transaction = await transactionService.getTransaction(res,{id:createtransaction[0]})
      
      if (transaction.length == 0)
        return sendResponse({
          res,
          statusCode: StatusCodes.BAD_REQUEST,
          message: "error while geting transaction in topup",
          success: false,
        });
    
    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: `topup of ₹${amount} is successfully`,
      data: transaction,
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

// add cart
const getAllTransaction = async (req, res) => {
  try {
    const userId = req.user

    if (!userId)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "user does not exists",
        success: false,
      });

    const transactions = await transactionService.getTransaction(res,{user_id:userId})

    const total = await transactionService.getTotal(res,userId)
    
    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "transaction fetched successfully",
      data: {transactions,total},
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

const crypto = require("crypto");
const razorpayInstance = require("../config/razorpay.config.js");

const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user;
    const { amount } = req.body;

    if (!userId) {
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "User does not exist",
        success: false,
      });
    }

    if (!amount || amount <= 0) {
       return sendResponse({
         res,
         statusCode: StatusCodes.BAD_REQUEST,
         message: "Invalid amount",
         success: false,
       });
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpayInstance.orders.create(options);

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
      success: false,
    });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const userId = req.user;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

    if (!userId) {
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "User does not exist",
        success: false,
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const createtransaction = await transactionService.createTransaction(res, {
        user_id: userId,
        credit: amount, // amount received from frontend or we could store it
        transaction_type: "top-up",
        transaction_id: razorpay_payment_id, // Store razorpay payment id
      });

      if (createtransaction.length == 0) {
        return sendResponse({
          res,
          statusCode: StatusCodes.BAD_REQUEST,
          message: "Error while updating transaction",
          success: false,
        });
      }

      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        message: "Payment verified successfully",
        data: { success: true },
      });
    } else {
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Invalid signature sent!",
        success: false,
      });
    }
  } catch (error) {
    return sendResponse({
      res,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
      success: false,
    });
  }
};

module.exports = { topUpInTrasaction, getAllTransaction, createRazorpayOrder, verifyRazorpayPayment };