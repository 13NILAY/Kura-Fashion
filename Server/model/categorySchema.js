const mongoose=require('mongoose');

const categorySchema =new mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    }
    // products:[
    //     {
    //         type:mongoose.Schema.Types.ObjectId,
    //         ref:'product'
    //     }
    // ]
});

const Category = mongoose.model("Category", categorySchema);

// Category.syncIndexes().then(() => {
//     console.log('Indexes are synchronized');
// }).catch(err => {
//     console.error('Error synchronizing indexes', err);
// });

module.exports = Category;