const { registerUser,loginUser, logoutUser } = require("../controllers/auth.controller.js");
const express = require("express");
const  {addUserSchema,loginUserSchema, }  = require("../validation/user.validation");
const {validate} = require('../middlewares/validate.middleware.js');
const { auth } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/register",validate(addUserSchema), registerUser);
router.post("/login",validate(loginUserSchema), loginUser);
router.post("/logout",auth(), logoutUser);

module.exports = router;
