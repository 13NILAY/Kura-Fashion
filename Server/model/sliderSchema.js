const mongoose=require('mongoose');

const sliderSchema =new mongoose.Schema({
    name:{
        type:String
    },
    description:{
        type:String
    },
    image:{
        type:String
    }
    
});

const Slider = mongoose.model("Slider", sliderSchema);

Slider.syncIndexes().then(() => {
    console.log('Indexes are synchronized');
}).catch(err => {
    console.error('Error synchronizing indexes', err);
});

module.exports = Slider;