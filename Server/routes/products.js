const express =require("express");
const router =express.Router();

const productC =require("../controller/productC");

//routes

// get all products
router.get("/allProducts",productC.allProducts);

// view products category wise
router.get("/categoryWise/:category",productC.categoryWise);

//view specific product
router.get("/viewProduct/:productID",productC.viewSpecificProduct);

router.delete('/deleteProduct/:id',productC.deleteProduct);

router.put('/updateProduct/:id', productC.updateProduct);

module.exports =router