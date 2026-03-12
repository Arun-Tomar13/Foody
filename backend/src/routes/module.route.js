const express = require('express')
const router = express.Router();
const {addModule,removeModule} = require('../controllers/module.controller')
const { validate } = require('../middlewares/validate.middleware');
const { addModuleSchema, removeModuleSchema } = require('../validation/module.validation');

router.post('/',validate(addModuleSchema),addModule)
router.delete('/',validate(removeModuleSchema),removeModule)

module.exports = router