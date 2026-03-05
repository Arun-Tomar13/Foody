const express = require("express");
// const {validate} = require('../middlewares/validate.middleware.js');
const { addAddress, getAddress, removeAddress } = require("../controllers/address.controller.js");

const router = express.Router();

router.post("/", addAddress);
router.get("/", getAddress);
router.delete("/:id", removeAddress);

module.exports = router;