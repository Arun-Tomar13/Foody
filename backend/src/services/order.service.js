const { tableConstant } = require("../utils/constant");
const db = require("../config/db.config");
const sendResponse = require("../utils/response");
const { StatusCodes } = require("http-status-codes");

const addOrder = async (res,placed_by,total,address,)=>{
   
   try {
      const result = await db(tableConstant.order).insert({placed_by,total,address})
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
const addOrderItem = async (res,order_id,quantity,price,item_id,user_id)=>{
   
   try {
      const result = await db(tableConstant.orderItem).insert({order_id,quantity,price,item_id,user_id})
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
const getAllOrder = async (res,placed_by)=>{
   
   try {
      const result = await db(tableConstant.order)
      .where({placed_by})
      .join(tableConstant.user,'users.id','=','orders.placed_by')
      .distinct('orders.id')
      .select('users.name as name','status','total','orders.address as address','orders.created_at as date')
      
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

const getOrderById = async (res,id)=>{
   
   try {
      const result = await db(tableConstant.order).where({id})
      
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

const getItemByOrderId = async (res,order_id)=>{
   
   try {
      // const result = await db(tableConstant.orderItem).where({order_id}).select("*").from(tableConstant.menu).leftJoin('order_items','menu.id','order_items.item_id')
      const result = await db(tableConstant.orderItem).where({order_id})
      .join('menu','menu.id','=','order_items.item_id')
      .join('restaurants','menu.restaurant_id','=','restaurants.id')
      .distinct('menu.id')
      .select('restaurants.name as restaurant_name','image','menu.name as name','menu.type','menu.price','quantity')
      
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

const getAllOrdersForAdmin = async (res)=>{
   try {
      const result = await db(tableConstant.order)
      .join(tableConstant.user,'users.id','=','orders.placed_by')
      .distinct('orders.id')
      .select('orders.id','users.name as name','status','total','orders.address as address','orders.created_at as date')
      
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

const getOrdersForRestaurantOwner = async (res, owner_id)=>{
   try {
      // Find orders that contain items from the restaurant owned by owner_id
      const result = await db(tableConstant.order)
      .join('order_items', 'orders.id', '=', 'order_items.order_id')
      .join('menu', 'order_items.item_id', '=', 'menu.id')
      .join('restaurants', 'menu.restaurant_id', '=', 'restaurants.id')
      .join('users', 'orders.placed_by', '=', 'users.id')
      .where('restaurants.owner_id', owner_id)
      .distinct('orders.id')
      .select('orders.id','users.name as name','status','total','orders.address as address','orders.created_at as date')
      
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

module.exports = {
    addOrder,
    addOrderItem,
    getAllOrder,
    getOrderById,
    getItemByOrderId,
    getAllOrdersForAdmin,
    getOrdersForRestaurantOwner
}