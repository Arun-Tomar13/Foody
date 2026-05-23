const express = require("express");
const { topUpInTrasaction, getAllTransaction, createRazorpayOrder, verifyRazorpayPayment } = require("../controllers/transaction.controller.js");
const { validate } = require('../middlewares/validate.middleware');
const {TransactionAmountSchema } = require('../validation/transaction.validation.js');
const  checkPermission  = require("../middlewares/role.middleware.js");
const { moduleConstant, actionConstant } = require("../utils/constant.js");

const router = express.Router();

router.post("/",checkPermission(moduleConstant.transaction,actionConstant.create),validate(TransactionAmountSchema),topUpInTrasaction);
router.get("/",checkPermission(moduleConstant.transaction,actionConstant.read), getAllTransaction);
router.post("/create-razorpay-order", checkPermission(moduleConstant.transaction, actionConstant.create), createRazorpayOrder);
router.post("/verify-razorpay-payment", checkPermission(moduleConstant.transaction, actionConstant.create), verifyRazorpayPayment);

module.exports = router;        