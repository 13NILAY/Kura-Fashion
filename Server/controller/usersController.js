const User=require("../model/user")
const mongoose=require('mongoose')
const Product=require('../model/productSchema')

const getUser = async (req, res) => {
    try {
        const {email} =req.params;
        const user = await User.findOne({email:email});
        if (user === null) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getAllUser=async(req,res)=>{
    try {
        const user=await User.find();
        res.json(user)
    } catch (error) {
        res.send("Error while fetching users")
    }
}
const delUser=async(req,res)=>{
    try {
        console.log(req.body.email);
        const user=await User.findOne({email:email});
        await user.deleteOne()
        res.send("User deleted successfully")
    } catch (error) {
        res.status(500).send(error)
    }
}
const updateUser=async(req,res)=>{
    try {
        const {email}=req.params;
        // const user=await User.findByIdAndUpdate(req.user._id,req.body,{ new: true })
        const user=await User.findOneAndUpdate({email:email},req.body.formData,{new:true});
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json("Upadation not done")
    }
}

// const User = require('../models/User'); // Adjust the path to your User model
// const Product = require('../models/Product'); // Adjust the path to your Product model

const addCart = async (req, res) => {
  try {
    console.log("ghftghvhhgb");
    const { product, selectedSize, quantity,selectedColor } = req.body;
    const productId=product._id;
    console.log(req.body);
    // Validate input
    if (!productId || !selectedSize || !quantity || !selectedColor) {
      return res.status(400).json({ message: 'Product ID, size,color and quantity are required' });
    }

    // Fetch the user from the database (assuming req.user.id is available via authentication middleware)
    const user = await User.findOne({email:req.body.email});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the product exists
    // const product = await Product.findById(productId);
    // if (!product) {
      // return res.status(404).json({ message: 'Product not found' });
    // }

    // Check if the product is already in the cart
    const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId && item.selectedSize === selectedSize);

    if (cartItemIndex > -1) {
      // If product with the same size already exists in the cart, update the quantity
      user.cart[cartItemIndex].quantity = quantity;
    } else {
      // Otherwise, add the new product to the cart
      user.cart.push({ product: productId, selectedSize,selectedColor, quantity });
    }

    // Save the updated user document
    await user.save();
    console.log('yes');
    res.status(200).json({ message: 'Product added to cart successfully', cart: user.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// module.exports = { addToCart };

//remove From Cart
const removeFromCart = async (req, res) => {
  try {
  console.log(req.body);
    const { productId, size ,email } = req.body;

    // Validate input
    if (!productId || !size) {
      return res.status(400).json({ message: 'Product ID and size are required' });
    }

    // Fetch the user from the database (assuming req.user.id is available via authentication middleware)
    const user = await User.findOne({email:email});
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the index of the product in the cart
    const cartItemIndex = user.cart.findIndex(item => item._id.toString() === productId && item.selectedSize === size);

    if (cartItemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Remove the product from the cart
    user.cart.splice(cartItemIndex, 1);

    // Save the updated user document
    const savedUser =await user.save();
    // console.log(savedUser);
    
    res.status(200).json({ message: 'Product removed from cart successfully', cart: user.cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

   const getOrdersList =async(req,res) =>{
  try{
    const { email } = req.params;

    // Fetch the user by email and populate the cart with product details
    const user = await User.findOne({ email }).populate('order');
  
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  }catch(error){
    res.status(500).json({message:error});
  }
}


//view my cart
const getUserCart = async (req, res) => {
  try {
    const { email } = req.params;

    // Fetch the user by email and populate the cart with product details
    const user = await User.findOne({ email }).populate('cart.product').exec();
    console.log(user);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, cart: user.cart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

module.exports={
    getAllUser,delUser,updateUser,getUser,getUserCart,removeFromCart,addCart,getOrdersList
}