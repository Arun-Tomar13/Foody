const express = require('express')
const { createOrder, getOrder,getOrderItemsByOrderId, getOrderCSV } = require('../controllers/order.controller')
const checkPermission = require('../middlewares/role.middleware')
const { moduleConstant, actionConstant } = require('../utils/constant')

const router = express.Router()

router.post('/',checkPermission(moduleConstant.order,actionConstant.create),createOrder)
// router.delete('/',removeAllCartItem)
// router.delete('/:id',removeCartItemById)
router.get('/',checkPermission(moduleConstant.order,actionConstant.read_all),getOrder)
router.get('/csv',checkPermission(moduleConstant.order,actionConstant.read),getOrderCSV)
router.get('/:id',checkPermission(moduleConstant.order,actionConstant.read),getOrderItemsByOrderId)

module.exports= router