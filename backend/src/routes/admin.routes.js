const express = require('express')
const { addPermissions, removePermission, readPermission } = require('../controllers/admin.controller')

const router = express.Router()

router.post('/add-permission',addPermissions)
router.post('/remove-permission',removePermission)
router.get('/read-permission',readPermission)

module.exports= router