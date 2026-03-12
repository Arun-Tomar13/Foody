const express = require('express')
const authRoutes = require("./auth.routes.js");
const userRoutes = require('./user.routes.js')
const permissionRoutes = require('./permission.routes.js')
const restaurantRoute = require('../routes/restaurant.route');
const menuRoute = require('../routes/menu.router.js');
const categoryRoute = require('../routes/category.routes.js');
const cartItemRoute = require('./cartItem.routes.js');
const moduleRoute = require('./module.route.js');
const actionRoute = require('./action.route..js');
const orderRoute = require('./order.routes.js');
const addressRoute = require('./address.routes.js');
const transactionRoute = require('./transaction.routes.js');
const { auth } = require("../middlewares/auth.middleware.js");
const getRoles = require('../controllers/role.controller.js');

const router = express.Router()

router.use("/auth", authRoutes);
router.use("/user",auth(), userRoutes);
router.use("/admin", permissionRoutes);
router.use("/getroles", getRoles);
router.use('/restaurant',auth(),restaurantRoute)
router.use('/menu',auth(),menuRoute)
router.use('/category',auth(),categoryRoute)
router.use('/cart-item',auth(),cartItemRoute)
router.use('/order',auth(),orderRoute)
router.use('/address',auth(),addressRoute)
router.use('/transaction',auth(),transactionRoute)
router.use('/module',auth(),moduleRoute)
router.use('/action',auth(),actionRoute)

module.exports= router