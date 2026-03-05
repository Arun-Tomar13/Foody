const express = require('express')
const router = express.Router();
const {addCategory, updateCategory, deleteCategory,getCategoryById,getAllCategorybyRestaurantId, addCategoryInBulk} = require('../controllers/category.controller');
const { validate } = require('../middlewares/validate.middleware');
const { createCategorySchema, updateCategorySchema, categoryIdSchema } = require('../validation/category.validation');
const upload = require('../middlewares/multer.middleware');


router.post('/',validate(createCategorySchema),addCategory)
router.post('/bulk-upload',upload('category').single('categories'),addCategoryInBulk)
router.patch('/',validate(updateCategorySchema),updateCategory)
// router.post('/id',validate(categoryIdSchema),getAllCategory)
router.get('/:id',getCategoryById)
router.delete('/:id',deleteCategory)
router.get('/restaurant/:id',getAllCategorybyRestaurantId)

module.exports = router