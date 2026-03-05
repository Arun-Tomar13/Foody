const express = require('express')
const router = express.Router();
const {createRestaurant, updateRestaurant, removeRestaurant,getRestaurantInfoById, getAllRestaurant, removeRestaurantById, getMenuCountPerRestaurant, OrderCountPerRestaurant, revenuePerRestaurantByDates} = require('../controllers/restaurant.controller');
const { validate } = require('../middlewares/validate.middleware');
const { RestaurantSchema, restaurantIdSchema } = require('../validation/restaurant.validation');

router.post('/',validate(RestaurantSchema),createRestaurant)
router.patch('/:id',validate(RestaurantSchema),updateRestaurant)
router.delete('/:id',removeRestaurantById)
router.get('/order-revenue',OrderCountPerRestaurant)
router.get('/menu-count',getMenuCountPerRestaurant)
router.get('/revenue',revenuePerRestaurantByDates)
router.get('/',getAllRestaurant)
router.get('/:id',getRestaurantInfoById)
// router.get('/get-info',getRestaurantInfo)
// router.post('/createbyany',validate(RestaurantSchema),createRestaurantByAnyOne)
// router.get('/delete',removeRestaurant)
module.exports = router