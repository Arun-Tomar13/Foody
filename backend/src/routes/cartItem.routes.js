const express = require('express')
const { addCartItem, getAllCartItem, removeAllCartItem,removeCartItemById,getCartItemById } = require('../controllers/cartItem.controller')
const checkPermission = require('../middlewares/role.middleware')
const { moduleConstant, actionConstant } = require('../utils/constant')

const router = express.Router()

router.post('/',checkPermission(moduleConstant.cart,actionConstant.create),addCartItem)
router.delete('/',checkPermission(moduleConstant.cart,actionConstant.delete),removeAllCartItem)
router.delete('/:id',checkPermission(moduleConstant.cart,actionConstant.delete),removeCartItemById)
router.get('/',checkPermission(moduleConstant.cart,actionConstant.read_all),getAllCartItem)
router.get('/:id',checkPermission(moduleConstant.cart,actionConstant.read),getCartItemById)

module.exports= router