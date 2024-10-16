const Banner=require("../model/bannerSchema");

const allBanner =async (req,res)=>{
    try{
        const list= await Banner.find({});
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

module.exports ={allBanner};
