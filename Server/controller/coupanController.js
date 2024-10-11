// controllers/couponController.js
const Coupon = require('../model/coupanSchema');
// const User=require('../model/user');

const applyCoupon = async (req, res) => {

  
  const { code, totalOrderValue } = req.body;

  try {
    // Find the coupon by code
    const coupon = await Coupon.findOne({ code });

    // Check if the coupon exists
    if (!coupon) {
      return res.status(400).json({ valid: false, message: 'Invalid coupon code' });
    }

    // Check if the coupon is still active and hasn't expired
    if (!coupon.isActive || new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ valid: false, message: 'Coupon has expired or is inactive' });
    }

    // Check if the minimum order value requirement is met
    if (totalOrderValue < coupon.minOrderValue) {
      return res.status(400).json({
        valid: false,
        message: `Order value must be at least ₹${coupon.minOrderValue} to apply this coupon`
      });
    }

    // Calculate discount based on the coupon discount percentage
    const discountValue = (coupon.discount / 100) * totalOrderValue;

    // Make sure discount doesn't exceed the maximum discount value
    const finalDiscount = discountValue > coupon.maxDiscountValue ? coupon.maxDiscountValue : discountValue;

    // If everything is fine, return the discount and success response
    return res.status(200).json({
      valid: true,
      message: 'Coupon applied successfully',
      discount: finalDiscount
    });
  } catch (error) {
    console.error('Error applying coupon:', error);
    res.status(500).json({ valid: false, message: 'Server error' });
  }
};


// Add new coupon

const addCoupon = async (req, res) => {
  // Destructure all the required fields from the request body
  const {
    code,
    discount,
    minOrderValue,
    maxDiscountValue,
    expirationDate,
    isActive,
    // applicableTo,
  } = req.body;
  console.log(req.body);
  try {
    // Create a new coupon instance with all the fields
    const newCoupon = new Coupon({
      code,
      discount,
      minOrderValue,
      maxDiscountValue,
      expirationDate,
      isActive, // should be passed from the frontend, not hardcoded
      // applicableTo, // array of categories or product IDs
    });

    // Save the new coupon in the database
    await newCoupon.save();

    // Send a success response with the newly created coupon
    res.status(201).json({
      message: 'Coupon created successfully',
      coupon: newCoupon,
    });
  } catch (err) {
    // Handle errors and send a failure response
    console.log(err);
    res.status(500).json({
      message: 'Error creating coupon',
      error: err.message || err,
    });
  }
};


// Get all coupons
const getCoupons = async (req, res) => {
  console.log("Sonu");
  try {
    const coupons = await Coupon.find();
    console.log(coupons);
    res.status(200).json(coupons);
  } catch (err) {
  console.log(err);
    res.status(500).json({ message: 'Error fetching coupons', error: err });
  }
};

// Delete a coupon by ID
const deleteCoupon = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting coupon', error: err });
  }
};

module.exports = {
  applyCoupon,
  addCoupon,
  getCoupons,
  deleteCoupon,
};
