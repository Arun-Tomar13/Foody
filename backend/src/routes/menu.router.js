const express = require('express')
const router = express.Router();
const { validate } = require('../middlewares/validate.middleware');
const { addItemToMenu, getMenuItem, removeMenuItem,updateMenuItem,getMenuItemById, bulkUploadItemToMenu} = require('../controllers/menu.controller');
const { createMenuSchema, updateMenuSchema } = require('../validation/menu.validation');
const upload = require('../middlewares/multer.middleware');

router.post('/restaurant/:restaurant_id',validate(createMenuSchema),upload('menu').single('image'),addItemToMenu)
router.post('/bulk',upload('category').single('menu'),bulkUploadItemToMenu)
router.get('/:id',getMenuItemById)
router.get('/',getMenuItem)
router.delete('/:id',removeMenuItem)
router.patch('/',validate(updateMenuSchema),upload('menu').single('image'),updateMenuItem)

module.exports = router