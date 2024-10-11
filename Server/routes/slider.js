const express=require("express");
const router=express.Router();

const sliderC =require("../controller/sliderC");

router.get("/all",sliderC.allSlider);

module.exports =router;