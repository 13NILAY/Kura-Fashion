const Category=require("../model/categorySchema");

const allCategory =async (req,res)=>{
    try{
        const list= await Category.find({});
            console.log(list);
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

module.exports ={allCategory};
