import { createSlice } from '@reduxjs/toolkit'
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';

// import useAxiosPrivate from '../../hooks/useAxiosPrivate';
const initialState={
    cart:[],
}
export const cartSlice=createSlice({
    name:"cart",
    initialState,
    reducers:{
        addToCart:(state,action)=>{
            const newProduct={
                id:action.payload.product._id,
                product:action.payload.product,
                quantity:action.payload.quantity,
                selectedSize:action.payload.selectedSize,
                selectedColor:action.payload.selectedColor

            };
             state.cart.push(newProduct);//direct mutation 
        },
        // updateQuantity:(state,action)=>{
        //   const index =state.cart.findIndex((item) => item.id === action.payload._id);
        //   if(index !== -1){
        //     state.cart[index].quantity=action.payload.quantity;
        //   }
        // },
        deleteFromCart:(state,action)=>{
            state.cart=state.cart.filter((products)=>products._id !=action.payload);
        },
        fetchCart: (state, action) => {
          state.cart = action.payload;
        }
    }
})

export const {addToCart,deleteFromCart,updateQuantity,fetchCart}=cartSlice.actions;

export const addProductToCart = ({product, quantity,selectedSize,selectedColor},axiosPrivate,email) => async (dispatch) => {
  
    try {
      console.log(product);
      const newProduct = {
        id: product._id,
        product,
        quantity,
        selectedSize,
        selectedColor
      };
      const response=await axiosPrivate.post(
        `/users/addCart/${product._id}`,
        JSON.stringify({ 
            email:email, product: newProduct.product,selectedSize,selectedColor,quantity }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      console.log(response);
      if(response.status==200){
        dispatch(addToCart(newProduct));
        // alert("Product Added to cart Successfully");
        // navigate('/shop');
      }
      // Dispatch the action with the new product details
      
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  export const deleteProductFromCart =({_id,size},axiosPrivate,email) => async (dispatch) =>{
    // const data=new FormData();
    
    try{
      console.log(_id);
      const response = await axiosPrivate.delete(`/users/removeCart/${_id}`, {
        data: {
          productId: _id,
          size,
          email: email,
        },
        headers: { 'Content-Type': 'application/json' },
      });
      // const result=await response.json();
      console.log(response);
        dispatch(deleteFromCart(_id));

        // navigate('/shop');
    }catch (error) {
      console.error('Error adding product to cart:', error);
    }
  }
  export default cartSlice.reducer