const express = require('express')
const router = express.Router();
const { validate } = require('../middlewares/validate.middleware');
const { addActionSchema, removeActionSchema } = require('../validation/action.validation');
const { addAction, removeAction } = require('../controllers/action.controller');

router.post('/',validate(addActionSchema),addAction)
router.delete('/',validate(removeActionSchema),removeAction)

module.exports = router