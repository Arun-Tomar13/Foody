const express = require('express')
const router = express.Router();
const {addCategory, updateCategory, deleteCategory,getCategoryById,getAllCategorybyRestaurantId, addCategoryInBulk} = require('../controllers/category.controller');
const { validate } = require('../middlewares/validate.middleware');
const { createCategorySchema, updateCategorySchema, categoryIdSchema } = require('../validation/category.validation');
const upload = require('../middlewares/multer.middleware');
const checkPermission = require('../middlewares/role.middleware');
const { moduleConstant, actionConstant } = require('../utils/constant');


router.post('/',checkPermission(moduleConstant.category,actionConstant.create),validate(createCategorySchema),addCategory)
router.post('/bulk-upload',checkPermission(moduleConstant.category,actionConstant.create),upload('category').single('categories'),addCategoryInBulk)
router.patch('/',checkPermission(moduleConstant.category,actionConstant.update),validate(updateCategorySchema),updateCategory)
// router.post('/id',validate(categoryIdSchema),getAllCategory)
router.get('/:id',checkPermission(moduleConstant.category,actionConstant.read),getCategoryById)
router.delete('/:id',checkPermission(moduleConstant.category,actionConstant.delete),deleteCategory)
router.get('/restaurant/:id',checkPermission(moduleConstant.category,actionConstant.read_all),getAllCategorybyRestaurantId)

module.exports = router