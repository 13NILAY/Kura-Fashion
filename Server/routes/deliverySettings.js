const express = require('express');
const router = express.Router();
const deliverySettingsController = require('../controller/deliverySettingsController');

router.get('/', deliverySettingsController.getDeliverySettings);
router.post('/update', deliverySettingsController.updateDeliverySettings);

module.exports = router;
