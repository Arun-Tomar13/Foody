const express = require('express')
const router = express.Router();
const {createRestaurant, updateRestaurant, removeRestaurant,getRestaurantInfoById, getAllRestaurant, removeRestaurantById, getMenuCountPerRestaurant, OrderCountPerRestaurant, revenuePerRestaurantByDates} = require('../controllers/restaurant.controller');
const { validate } = require('../middlewares/validate.middleware');
const { RestaurantSchema, restaurantIdSchema } = require('../validation/restaurant.validation');
const checkPermission = require('../middlewares/role.middleware');
const { moduleConstant, actionConstant } = require('../utils/constant');

router.post('/',checkPermission(moduleConstant.restaurant,actionConstant.create),validate(RestaurantSchema),createRestaurant)
router.patch('/:id',checkPermission(moduleConstant.restaurant,actionConstant.update),validate(RestaurantSchema),updateRestaurant)
router.delete('/:id',checkPermission(moduleConstant.restaurant,actionConstant.delete),removeRestaurantById)
router.get('/order-revenue',checkPermission(moduleConstant.restaurant,actionConstant.admin_only),OrderCountPerRestaurant)
router.get('/menu-count',checkPermission(moduleConstant.restaurant,actionConstant.admin_only),getMenuCountPerRestaurant)
router.get('/revenue',checkPermission(moduleConstant.restaurant,actionConstant.admin_only),revenuePerRestaurantByDates)
router.get('/',checkPermission(moduleConstant.restaurant,actionConstant.read_all),getAllRestaurant)
router.get('/:id',checkPermission(moduleConstant.restaurant,actionConstant.read),getRestaurantInfoById)
module.exports = router