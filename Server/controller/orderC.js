const OrderSchema =require("../model/orderSchema");
const UserSchema=require("../model/user");
require("dotenv").config();
const axios=require('axios');

const allOrders =async (req,res)=>{
    try{
        const list= await OrderSchema.find().populate('userId')  .populate({
            path: 'items.productId', // Populating productId inside items array
            model: 'Product' // Ensure this matches the name of your Product model
          });
        console.log(list);
            res.status(200).json({
                success:true,
                data:list
            });
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message,
          });
    }
}

const viewSpecificUserOrder =async(req,res)=>{
    try{
        const UserID=req.params.userID;
        const user =await ProductSchema.findById({_id: UserID})

        res.status(200).json({
            success: true,
            data: product,
          });
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message,
          });
    }
}

const createPaymentGateway= async(req,res)=>{
    const { amount, currency } = req.body;
    console.log(req.body);
    const options = {
        amount: amount*100 , // amount in the smallest currency unit
        currency,
    };

    try {
        const order = await axios.post('https://api.razorpay.com/v1/orders', options, {
            auth: {
                username: process.env.KeyId,
                password: process.env.KeySecret,
            },
        });
       
        console.log(order);
        const timestamp=order.data.created_at;
        const date = new Date(timestamp * 1000);

        res.json({
            id: order.data.id,
            currency: order.data.currency,
            amount: order.data.amount,
            created_at:date.toLocaleString()
        });
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message);
    }
}
const createOrder = async (req, res) => {
    try {
        console.log(req.body);

        // Map the items from the frontend to include productId, quantity, price, color, and size
        const formattedItems = req.body.items.map((item) => {
            return {
                productId: item.product._id,           // Assuming item.product._id is the productId
                quantity: item.quantity,               // The quantity sent from the frontend
                price: item.product.cost.value,        // Assuming the cost is stored in item.product.cost.value
                color: item.selectedColor,             // Assuming the frontend sends the selected color
                size: item.selectedSize                // Assuming the frontend sends the selected size
            };
        });

        // Create the order data object to store in the database
        const orderData = {
            userId: req.body.user._id,               
            items: formattedItems,                   
            totalAmount: req.body.totalCost,        
            currency: "INR",
            deliveryCost:req.body.deliveryCost,
            discount:req.body.discount,     
            paymentStatus: req.body.paymentStatus,                   
            razorpay_payment_id: req.body.paymentDetails.razorpay_payment_id, 
            razorpay_order_id: req.body.paymentDetails.razorpay_order_id,     
            razorpay_signature: req.body.paymentDetails.razorpay_signature,   
        };

        // Save the order to the database
        const newOrder = new OrderSchema(orderData);
        await newOrder.save();
        // Save the new order and get the saved order document

        // Find the user by userId and update their orders array
        const userId = req.body.user._id;  // Extract userId from request body
        const user = await UserSchema.findById(userId);  // Find user in the database

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Add the new orderId to the user's orders array
        user.order.push(newOrder._id);  // Push the newly created order's _id to the user's orders array
          // Clear the user's cart after the order is created
          user.cart = []; 
        // Save the updated user document
        await user.save();
        // Send a success response to the frontend
        res.status(200).json({
            message: "Order created successfully",
            orderId: newOrder._id,
        });
    } catch (error) {
        console.error("Error creating order: ", error);
        res.status(500).json({
            message: "Error creating order",
            error: error.message,
        });
    }
};


module.exports ={createPaymentGateway,createOrder,allOrders};