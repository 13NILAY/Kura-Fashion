const express =require('express');
const router= express.Router();

const categoryC =require("../controller/categoryC");

router.get("/all",categoryC.allCategory);

module.exports =router;