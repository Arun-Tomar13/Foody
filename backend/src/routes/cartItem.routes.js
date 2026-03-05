const express = require('express')
const { addCartItem, getAllCartItem, removeAllCartItem,removeCartItemById,getCartItemById } = require('../controllers/cartItem.controller')

const router = express.Router()

router.post('/',addCartItem)
router.delete('/',removeAllCartItem)
router.delete('/:id',removeCartItemById)
router.get('/',getAllCartItem)
router.get('/:id',getCartItemById)

module.exports= router