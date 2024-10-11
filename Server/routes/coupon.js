// routes/couponRoutes.js
const express = require('express');
const couponC = require('../controller/coupanController');
const router = express.Router();

router.post('/apply',couponC.applyCoupon);

router.post('/', couponC.addCoupon);

router.get('/', couponC.getCoupons);

router.delete('/:id', couponC.deleteCoupon);

module.exports = router;
