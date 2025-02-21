const express =require("express");
const router=express.Router();
const adminC=require("../controller/adminC");

// routes
//AddCategory
router.post("/addCategory",adminC.addCategory);


//AddProductDetails
router.post("/addProduct",adminC.addProduct);
//AddProductImage
router.post("/addProductImages",adminC.addImagesForProduct);
//AddSingleImage
router.post("/addSingleImage",adminC.addSingleImagesForProduct);
//AddSlider
router.post("/addSlider",adminC.addSlider);
//Delete Slider
router.delete("/deleteSlider/:_id",adminC.deleteSlider);
//AddBanner
router.post("/addBanner",adminC.addBanner);
//Delete Banner
router.delete("/deleteBanner/:_id",adminC.deleteBanner);
//UpdateOrder
router.put("/updateOrderStatus/:_id",adminC.updateOrder)
module.exports =router;
