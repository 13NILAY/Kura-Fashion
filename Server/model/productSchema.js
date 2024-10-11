const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    categoryName: {
      type: String,
      required: true,
    },
    size: [
      {type:String}
    ],
    cost: {
      currency: {
        type: String,
        enum: ["USD", "INR", "EUR", "AUD"],
      },
      value: {
        type: Number,
      },
    },
    frontPicture: {
      type:String
    },
    picture: [
      //secure_url of images
      {
        type: String,
      }
    ],
     
    color: [
      {
        colorCode: {
          type: String
        }
      }
    ],
    
    
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

Product.syncIndexes().then(() => {
  console.log('Indexes are synchronized');
}).catch(err => {
  console.error('Error synchronizing indexes', err);
});
module.exports = Product;