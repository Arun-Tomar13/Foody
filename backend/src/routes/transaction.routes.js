const express = require("express");
const { topUpInTrasaction, getAllTransaction } = require("../controllers/transaction.controller.js");
const { validate } = require('../middlewares/validate.middleware');
const {TransactionAmountSchema } = require('../validation/transaction.validation.js');

const router = express.Router();

router.post("/",validate(TransactionAmountSchema),topUpInTrasaction);
router.get("/", getAllTransaction);
// router.delete("/:id", removeAddress);
// router.get("/:id", logoutUser);

module.exports = router;        