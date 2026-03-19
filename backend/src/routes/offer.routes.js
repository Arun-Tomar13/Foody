const express = require('express')
const router = express.Router();
const {createOffer, updateOffer, getOffers} = require('../controllers/offer.controller')
const { validate } = require('../middlewares/validate.middleware');
const { createOfferSchema } = require('../validation/offer.validation');

router.post('/',validate(createOfferSchema),createOffer)
router.patch('/:id',updateOffer)
router.get('/',getOffers)
// router.delete('/',validate(removeModuleSchema),removeModule)

module.exports = router