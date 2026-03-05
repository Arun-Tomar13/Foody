const { getProfile,updateProfile,deleteProfile } = require('../controllers/user.controller');
const userService = require('../services/user.service')
const express = require("express");
const router = express.Router()
const upload = require('../middlewares/multer.middleware')

router.get('/',getProfile)
router.patch('/',upload('user').single('user_image'),updateProfile)
router.delete('/',deleteProfile)

module.exports = router