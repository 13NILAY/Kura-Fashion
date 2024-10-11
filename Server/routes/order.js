const express=require('express');
const router =express.Router();

const orderC =require("../controller/orderC");

router.post('/create-payment-gateway',orderC.createPaymentGateway);
router.post('/create-order',orderC.createOrder);
router.get('/allOrders',orderC.allOrders);
module.exports= router;