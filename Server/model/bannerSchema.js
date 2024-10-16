const mongoose=require('mongoose');

const bannerSchema =new mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    image:{
        type:String
    }
    
});

const Banner = mongoose.model("Banner", bannerSchema);

Banner.syncIndexes().then(() => {
    console.log('Indexes are synchronized');
}).catch(err => {
    console.error('Error synchronizing indexes', err);
});

module.exports = Banner;