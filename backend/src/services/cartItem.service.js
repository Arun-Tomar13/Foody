const { tableConstant } = require("../utils/constant");
const db = require("../config/db.config");
const sendResponse = require("../utils/response");
const { StatusCodes } = require("http-status-codes");

const createCartItem = async (res,item_id,price,cart_id)=>{
   
   try {
      const result = await db(tableConstant.cartItem).insert({item_id,price,cart_id})
      return result
   } catch (error) {
      return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
   }
}

const CartItemExists = async (res,item_id,cart_id)=>{
    try {
      const result = await db(tableConstant.cartItem).where({item_id,cart_id})
     return result
    } catch (error) {
      return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
    }
}



const getAllCartItem = async (res,cart_id)=>{
  
    try {
      const result = await db(tableConstant.cartItem).where({cart_id}).select("*").from(tableConstant.menu).join('cart_items','menu.id','cart_items.item_id')
     return result
    } catch (error) {
      return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
    }
}

const getItemByCartId = async (res,item_id,cart_id)=>{
    try {
      const result = await db(tableConstant.cartItem).where({item_id,cart_id}).select("*").from(tableConstant.menu).join('cart_items','menu.id','cart_items.item_id')
     return result
    } catch (error) {
      return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
    }
}
const getCartItemById = async (res,id)=>{
    try {
      const result = await db(tableConstant.cartItem).where({id})
     return result
    } catch (error) {
      return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
    }
}

const IncrementInCartItem = async (res,id)=>{
    try {
      const result = await db(tableConstant.cartItem).where({id}).increment('quantity',1)
     return result
    } catch (error) {
      return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
    }
}

const DecrementInCartItem = async (res,id)=>{
    try {
        const cartItemQuantity = await getCartItemById(res,id);
        
        let result;
        if(cartItemQuantity[0].quantity > 1){
            result = await db(tableConstant.cartItem).where({id}).decrement('quantity',1)
            return {result,del:0}
        }
        else{
            result = await db(tableConstant.cartItem).where({id}).del()
            return {result,del:1}
        }
    } catch (error) {
      return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
    }
}

const deleteAllCartItem = async (res,cart_id)=>{
    try {
      const result = await db(tableConstant.cartItem).where({cart_id}).del()
     return result
    } catch (error) {
      return sendResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: error.message,
      success: false,
    });
    }
}

module.exports = {createCartItem,CartItemExists,IncrementInCartItem,DecrementInCartItem,getAllCartItem,deleteAllCartItem,getCartItemById,getItemByCartId}