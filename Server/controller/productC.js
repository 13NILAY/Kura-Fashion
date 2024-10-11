const ProductSchema =require('../model/productSchema');
require("dotenv").config();

const allProducts =async (req,res)=>{
    try{
        console.log("sonu")
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

  module.exports ={categoryWise,allProducts,viewSpecificProduct}