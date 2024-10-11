const Slider=require("../model/sliderSchema");

const allSlider =async (req,res)=>{
    try{
        const list= await Slider.find({});
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

module.exports ={allSlider};
