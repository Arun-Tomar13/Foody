const express = require('express')
const { createOrder, getOrder,getOrderItemsByOrderId, getOrderCSV } = require('../controllers/order.controller')

const router = express.Router()

router.post('/',createOrder)
// router.delete('/',removeAllCartItem)
// router.delete('/:id',removeCartItemById)
router.get('/',getOrder)
router.get('/csv',getOrderCSV)
router.get('/:id',getOrderItemsByOrderId)

module.exports= router