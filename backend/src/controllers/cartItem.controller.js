const { StatusCodes } = require("http-status-codes");
const cartItemService = require('../services/cartItem.service')
const sendResponse = require("../utils/response");
const menuService = require("../services/menu.service");

// add cart
const addCartItem = async (req, res) => {
  try {
    const cart_id = req.cart;
    const {item_id} = req.body;

    if (!cart_id)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "user does not have cart",
        success: false,
      });

    const isCartItemExists = await cartItemService.CartItemExists(
      res,
      item_id,
      cart_id,
    );
    
    let cartItem = null,updated=0;

    if (isCartItemExists.length > 0) {
      cartItem = await cartItemService.IncrementInCartItem(
        res,
        isCartItemExists[0].id
      );
      updated=1;
    } else {
      const menu = await menuService.getMenuItemById(res, item_id);
      if (menu.length == 0) {
        return sendResponse({
          res,
          statusCode: StatusCodes.BAD_REQUEST,
          message: "menu does not exists",
          success: false,
        });
      }
      cartItem = await cartItemService.createCartItem(res, item_id,menu[0].price, cart_id);
    }

    const newCartItem = await cartItemService.getItemByCartId(res,item_id,cart_id)
console.log(newCartItem);

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "successfully get the user profile",
      data: {newCartItem,updated}
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

// get all cart item
const getAllCartItem = async (req, res) => {
  try {
    const cart_id = req.cart;

    if (!cart_id)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "user does not have cart",
        success: false,
      });

    const AllCardItem = await cartItemService.getAllCartItem(
      res,
      cart_id,
    );

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "successfully get the cart items",
      data: AllCardItem,
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

const removeAllCartItem = async (req, res) => {
  try {
    const cart_id = req.cart;

    if (!cart_id)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "user does not have cart",
        success: false,
      });

    const AllCardItem = await cartItemService.deleteAllCartItem(
      res,
      cart_id,
    );

    if(!AllCardItem) {
        return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "error while deleting cart item",
        success: false,
      });
    }

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "successfully removed all cart item",
      data: cart_id,
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

const removeCartItemById = async (req, res) => {
  try {
    const {id} = req.params;

    if (!id)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "user does not have cart",
        success: false,
      });
      
      const {result,del} = await cartItemService.DecrementInCartItem(
          res,
          id
        );

    if(!result) {
        return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "error while deleting cart item",
        success: false,
      });
    }

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "successfully removed a cart item",
      data: {id,del},
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

const getCartItemById = async (req, res) => {
  try {
    const {id} = req.params;

    if (!id)
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "user does not have cart",
        success: false,
      });
      
      const cartItem = await cartItemService.getCartItemById(
          res,
          id
        ); 

    if(cartItem.length==0) {
        return sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "cartItem does not exists",
        success: false,
      });
    }

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "successfully get the cart item",
      data: cartItem,
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





module.exports = {addCartItem,getAllCartItem,removeAllCartItem,removeCartItemById,getCartItemById}