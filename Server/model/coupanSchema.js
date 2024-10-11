// models/Coupon.js
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase:true
  },
  discount: {
    type: Number,
    required: true
  },
  minOrderValue: {
    type: Number, // Minimum order value required to apply the coupon
    required: true,
    default: 0
  },
  maxDiscountValue: {
    type: Number, // Max discount that can be applied
    required: true
  },
  expirationDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableTo: {
    type: [String], // Array of categories, product IDs, or any other conditions
    default: []
  }
});

module.exports = mongoose.model('Coupon', couponSchema);
