const mongoose = require('mongoose');

const deliverySettingsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['FREE_ALL', 'FREE_ABOVE', 'FIXED'],
    required: true
  },
  minOrderForFreeDelivery: {
    type: Number,
    default: 0
  },
  standardDeliveryCharge: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DeliverySettings', deliverySettingsSchema);
