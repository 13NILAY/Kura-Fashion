const ProductSchema =require('../model/productSchema');
require("dotenv").config();
const cloudinary = require('cloudinary').v2;

const allProducts =async (req,res)=>{
    try{
        // console.log("sonu")
        const list= await ProductSchema.find();
            res.status(200).json({
                success:true,
                data:list
            });
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message,
          });
    }
}

const viewSpecificProduct =async(req,res)=>{
    try{
        const ProductID=req.params.productID;
        const product =await ProductSchema.findById({_id: ProductID})

        res.status(200).json({
            success: true,
            data: product,
          });
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message,
          });
    }
}

const categoryWise = async (req, res) => {
    try {
      const category = req.params.category;
  
      const list = await ProductSchema.find({ category: category });
  
      res.status(200).json({
        success: true,
        data: list,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

    const getPublicIdFromUrl = (url) => {
      try {
        // Extract the public ID from URL
        // URL format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/public-id.jpg
        const regex = /\/v\d+\/(.+)$/;
        const match = url.match(regex);
        
        if (match && match[1]) {
          // Get everything after the version number
          let publicId = match[1];
          // Remove file extension
          publicId = publicId.replace(/\.[^.]+$/, '');
          // Decode URL encoded characters
          publicId = decodeURIComponent(publicId);
          return publicId;
        }
        return null;
      } catch (error) {
        // console.error('Error extracting public ID:', error);
        return null;
      }
    };
  const deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the product first to get image URLs
      const product = await ProductSchema.findById(id);
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
  
      // Collect all image URLs (front picture and additional pictures)
      const allImageUrls = [
        product.frontPicture,
        ...(product.picture || [])
      ].filter(Boolean); // Remove any null/undefined values
  
      // Delete images from Cloudinary
      const deletePromises = allImageUrls.map(async (url) => {
        try {
          const publicId = getPublicIdFromUrl(url);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (error) {
          // console.error(`Error deleting image from Cloudinary: ${url}`, error);
          // Continue with deletion even if some images fail to delete
        }
      });
  
      // Wait for all Cloudinary deletions to complete
      await Promise.all(deletePromises);
  
      // Delete the product from database
      await ProductSchema.findByIdAndDelete(id);
  
      res.status(200).json({
        success: true,
        message: 'Product and associated images deleted successfully'
      });
  
    } catch (error) {
      // console.error('Error in deleteProduct:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting product',
        error: error.message
      });
    }
  };

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find and update the product
    const updatedProduct = await ProductSchema.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true } // This option returns the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    // console.error('Error in updateProduct:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};
  
  module.exports ={categoryWise,allProducts,viewSpecificProduct,deleteProduct,updateProduct}