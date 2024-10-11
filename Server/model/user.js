const mongoose=require('mongoose')
const validator=require('validator')
const Schema=mongoose.Schema

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    first_name:{
        type:String,
        // required:true
    },
    last_name:{
        type:String,
        // required:true
    },
    // addressList: [
    //     {
          addressOf: {
            //home, office, relatives, etc
            type: String,
          },
          flatNumber: {
            type: String,
          },
          building : {
            type : String,
          },
          street:{
            type : String,
          },
          city : {
            type : String
          },
          state : {
            type : String
          },
          pinCode:{
            type:Number
          },
          country : {
            type : String,
            default :'India'
          },
    //     },
    // ],
    gender:{
        type:String,
        // required:true
    },
    profilePic:{
        type:String
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new error("Invalid e-mail id")
            }
        }
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Admin: Number
    },
    mobileno:{
        type:Number,
    },
    cart: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product", // Referencing the Product collection
          required: true,
        },
        selectedSize: {
          type: String,
          required: true,
        },
        selectedColor:{
          type:String,
          required:true 
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    
    order: [
        {
          type: Schema.Types.ObjectId,
          ref: "Order",
        },
    ],

    refreshToken:[String]      
});

const User = mongoose.model('User', userSchema);

// Ensure indexes are synchronized
User.syncIndexes().then(() => {
    console.log('Indexes are synchronized');
}).catch(err => {
    console.error('Error synchronizing indexes', err);
});

module.exports=User;