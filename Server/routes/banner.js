const express=require("express");
const router=express.Router();

const bannerC =require("../controller/bannerC");

router.get("/all",bannerC.allBanner);

module.exports =router;