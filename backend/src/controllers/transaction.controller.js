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
      message: `topup of $${amount} is successfully`,
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

module.exports = {topUpInTrasaction,getAllTransaction}