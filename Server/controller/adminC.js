const user=require("../model/user");
const cloudinary=require("cloudinary").v2;
const CategorySchema =require("../model/categorySchema");
const ProductSchema= require("../model/productSchema");
const OrderSchema =require("../model/orderSchema");
const Slider=require("../model/sliderSchema");
const Banner=require("../model/bannerSchema");
const upload = require('../middleware/multer'); 

const mongoose=require("mongoose");
require("dotenv").config();
const fs= require("fs");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

//add Category
const addCategory =async(req,res) =>{
  try{
    console.log(req.body);
    const categoryData ={
      categoryName: req.body.categoryName
    }
    console.log(categoryData);
    const category =new CategorySchema(categoryData);
    console.log(category);
    const savedCategory = await category.save();
    console.log(savedCategory);
    res.status(201).json({
      success: true,
      message: 'New Category Created',
      category: savedCategory,
    });
  }catch(err){
    console.error( err);
    res.status(500).json({
      success: false,
      message: err.message,
    }); 
  }
}

const addProduct = async (req, res) => {
  try {
    // Ensure all required fields are provided and correctly named
    const productData = {
      name: req.body.name,
      description: req.body.description,
      categoryName: req.body.categoryName, // Corrected typo here
      size: req.body.sizes,  // Expecting an array of sizes
      cost: {
        currency: req.body.currency,
        value: req.body.value,
      },
      frontPicture: req.body.frontPicture,
      picture: req.body.picture,  // Expecting an array of pictures
      // Map colors to the required format
      color: req.body.colors.map(colorCode => ({ colorCode })),
    };

    // Log the incoming product data for debugging purposes
    console.log(productData);

    // Create a new product instance
    const product = new ProductSchema(productData);

    // Save the product to the database
    const savedProduct = await product.save();

    // Respond with the saved product data
    res.status(201).json({
      success: true,
      message: 'New Product added',
      product: savedProduct,
    });
  } catch (err) {
    // Log the error and respond with an error message
    console.error('Error adding product:', err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const addSlider =async(req,res)=>{
  try {
    console.log(req.body);
    const sliders = req.body.sliders; // Assuming sliders is an array of slider objects
    console.log(sliders);

    const savedSliders = await Slider.insertMany(sliders); // Save all sliders at once
    console.log(savedSliders);

    res.status(201).json({
        success: true,
        message: 'New Sliders Created',
        sliders: savedSliders,
    });
} catch (err) {
    console.error(err);
    res.status(500).json({
        success: false,
        message: err.message,
    });
}
}

// Configure Cloudinary - this should be in your environment variables or config

const deleteSlider=async (req, res) => {
  try {
    const { _id } = req.params;
    const { publicId } = req.body;  // Get the publicId from request body
    console.log(publicId);
    if (publicId) {
      const res1=await cloudinary.uploader.destroy(publicId);
      console.log(res1);
    }
    
    // First delete the slider from the database
    const deletedSlider = await Slider.findByIdAndDelete(_id);
    console.log(deletedSlider);
    if (!deletedSlider) {
      return res.status(404).json({ success: false, message: "Slider not found" });
    }

    // If a publicId was provided, delete the image from Cloudinary
    
    return res.status(200).json({ 
      success: true, 
      message: "Slider deleted successfully",
      data: deletedSlider
    });
  } catch (error) {
    console.error('Error deleting slider:', error);
    return res.status(500).json({ 
      success: false, 
      message: "Error deleting slider",
      error: error.message 
    });
  }
};

const addBanner =async(req,res)=>{
  try {
    console.log(req.body);
    const banners = req.body.banners; // Assuming sliders is an array of slider objects
    console.log(banners);

    const savedBanners = await Banner.insertMany(banners); // Save all sliders at once
    console.log(savedBanners);

    res.status(201).json({
        success: true,
        message: 'New Banners Created',
        sliders: savedBanners,
    });
} catch (err) {
    console.error(err);
    res.status(500).json({
        success: false,
        message: err.message,
    });
}
}
const deleteBanner= async(req,res)=>{
  const {_id}=req.params;
  const updatedBanner=await Banner.findByIdAndDelete(_id);
  res.status(200).json("Banner Deleted");
}

const addSingleImagesForProduct =(req,res)=>{
  upload.single('photo')(req, res, async (err) => {
    if (err) {
      console.error('Error during file upload:', err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }

    if (req.file) {
      // No need to upload again - multer-storage-cloudinary already did it
      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        fileUrl: req.file.path, // Use the path provided by multer-storage-cloudinary
      });
    } else {
      console.log('No file uploaded');
      res.status(500).json({ message: 'No file uploaded' });
    }
  });
}
const   addImagesForProduct = (req, res) => {
 
  upload.array('photos', 10)(req, res, async (err) => {
    
    if (err) {
      console.error('Error during file upload:', err);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
    if (req.files && req.files.length > 0) {
      // Extract URLs from the already uploaded files
      const fileUrls = req.files.map(file => file.path);
      
      res.status(200).json({
        success: true,
        message: 'Files uploaded successfully',
        fileUrls: fileUrls,
      });
    } else {
      console.error('No files uploaded');
      res.status(500).json({ message: 'No files uploaded' });
    }
  });
};

const updateOrder=async(req,res)=>{
  try {
      const {_id}=req.params;
      console.log(req.body);
      // const user=await User.findByIdAndUpdate(req.user._id,req.body,{ new: true })
      const newOrder=await OrderSchema.findOneAndUpdate({_id:_id},{orderStatus:req.body.status});
      console.log(newOrder);
      res.status(200).json(newOrder);
  } catch (error) {
      console.log(error)
      res.status(500).json("Upadation not done")
  }
}

module.exports = {
  addCategory,addProduct,addImagesForProduct,addSingleImagesForProduct,addSlider,deleteSlider,addBanner,deleteBanner,updateOrder
};
 
