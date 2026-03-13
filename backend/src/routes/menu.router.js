const express = require('express')
const router = express.Router();
const { validate } = require('../middlewares/validate.middleware');
const { addItemToMenu, getMenuItem, removeMenuItem,updateMenuItem,getMenuItemById, bulkUploadItemToMenu} = require('../controllers/menu.controller');
const { createMenuSchema, updateMenuSchema } = require('../validation/menu.validation');
const upload = require('../middlewares/multer.middleware');
const checkPermission = require('../middlewares/role.middleware');
const { moduleConstant, actionConstant } = require('../utils/constant');

router.post('/bulk',checkPermission(moduleConstant.menu,actionConstant.create),upload('category').single('menu'),bulkUploadItemToMenu)
router.post('/',checkPermission(moduleConstant.menu,actionConstant.create),validate(createMenuSchema),upload('menu').single('image'),addItemToMenu)
router.get('/:id',checkPermission(moduleConstant.menu,actionConstant.read),getMenuItemById)
router.get('/',checkPermission(moduleConstant.menu,actionConstant.read_all),getMenuItem)
router.delete('/:id',checkPermission(moduleConstant.menu,actionConstant.delete),removeMenuItem)
router.patch('/',checkPermission(moduleConstant.menu,actionConstant.update),validate(updateMenuSchema),upload('menu').single('image'),updateMenuItem)

module.exports = router