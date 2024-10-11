import React, { useState, useEffect } from 'react';
import ScrollToTop from '../../../ScrollToTop';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CartProd from './CartProd';
import { deleteProductFromCart, fetchCart } from '../../../features/cart/cartSlice';
import { useSelector, useDispatch } from 'react-redux';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import useAuth from '../../../hooks/useAuth';

const Cart = () => {
  const { auth } = useAuth();
  const [order, setOrder] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [cartDetails, setCartDetails] = useState(null);
  const cart = useSelector((state) => state.cart);
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  const [totalProductCost, setTotalProductCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [user, setUser] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const email = auth.email;

  const deliveryCost = (1 * totalProductCost) / 100;
  const discount = 300;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axiosPrivate.get(`/users/${email}`);
        setUser(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [auth.email]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const result = await axiosPrivate.get(`/users/viewMyCart/${email}`);
        setCartDetails(result.data.cart);
        if (result.data.cart && result.data.cart.length > 0) {
          dispatch(fetchCart(result.data.cart));
          setIsCartEmpty(false);
        } else {
          setIsCartEmpty(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchCartItems();
  }, [dispatch, axiosPrivate, email]);

  useEffect(() => {
    let totalProduct = 0;
    cart.forEach((prod) => {
      totalProduct += prod.product.cost.value * prod.quantity;
    });
    setTotalProductCost(totalProduct);
  }, [cart]);

  useEffect(() => {
    let total = totalProductCost + deliveryCost - discount;
    if (appliedCoupon) {
      total -= appliedCoupon.discount;
    }
    setTotalCost(total);
  }, [totalProductCost, appliedCoupon]);

  const handleDelete = ({ _id, size }) => {
    dispatch(deleteProductFromCart({ _id, size }, axiosPrivate, email));
  };

  const handleConfirmAddress = () => {
    navigate('/account/address', { state: { from: location }, replace: true });
  };

  const handleChechOut= async()=>{
    try {
      const orderUrl = "/order/create-payment-gateway";
      // console.log(orderUrl);
      const orderData = await axiosPrivate.post(orderUrl, {
          amount: totalCost,
          currency: "INR",
          // cart:cart,
          // user:user,
      });
      setOrder(orderData.data);
      console.log(orderData);
      const options = {
          key: 'rzp_live_BlDvyLU3aPQcwT', // Replace with your Razorpay key ID
          amount: orderData.data.amount,
          currency: orderData.data.currency,
          name: "Kura Fashion",
          description: "Test Transaction",
          order_id: orderData.data.id,
          handler: (response) => {
              alert("Payment successful!");
              setPaymentStatus(true);
              setPaymentDetails({
                razorpay_order_id:response.razorpay_order_id,
                razorpay_payment_id:response.razorpay_payment_id,
                razorpay_signature:response.razorpay_signature
              });
              console.log(response);
              createOrder();
          },
          prefill: {
              name: `${user.first_name}`,
              email: email,
              contact: `${user.mobileno}`,
          },
          notes: {
              address:" Shanti Garden",
          },
          theme: {
              color: "#F37254",
          },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
  } catch (error) {
      console.error("Payment error", error);
  }
  }
  const applyCoupon = async () => {
    try {
      const response = await axiosPrivate.post('/coupon/apply', {
        code: couponCode,
        totalOrderValue: totalProductCost
      });
      console.log(response);
      if (response.data.valid) {
        setAppliedCoupon(response.data);
        setCouponError("");
      } else {
        setCouponError(response.data.message);
      }
    } catch (error) {
      setCouponError("Error applying coupon. Please try again.");
    }
  };

  return (
    <>
      <ScrollToTop />
      <div className="mt-20 px-sectionPadding max-md:px-mobileScreenPadding pt-10 bg-[#f5ebe0]">
        <div className="flex items-center justify-center text-5xl font-headings mb-10 text-[#5c4033]">Shopping Bag</div>
        {isCartEmpty ? (
          <div className="text-4xl font-semibold font-texts text-[#5c4033] flex flex-col justify-center items-center w-full h-full my-12">
            <p>Your Shopping Bag is Empty.</p>
            <p className="text-xl font-texts">Any items added to the bag will be visible here</p>
            <Link to="/shop" className="flex justify-center items-center mt-3">
              <button className="bg-[#5c4033] h-12 text-[#fff7ec] text-2xl px-8 py-2 rounded-sm border border-[#5c4033] my-3 hover:bg-[#40322e] transition">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start max-md:flex-col">
              <div className="w-3/5 max-[940px]:w-1/2 max-md:w-4/5 max-sm:w-full">
                {cart.map((prod) => (
                  <CartProd
                    key={prod._id}
                    _id={prod._id}
                    product={prod.product}
                    selectedSize={prod.selectedSize}
                    selectedColor={prod.selectedColor}
                    quantity={prod.quantity}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Order Summary */}
              <div className="w-1/2 max-md:w-4/5 max-sm:w-full my-3 md:ml-6 border border-[#5c4033] p-6 rounded-sm bg-[#fff7ec] shadow-lg">
                <div className="border-b-[1px] border-[#5c4033] pb-2">
                  <div className="flex items-center">
                    <p className="text-base font-semibold font-headings mr-2 text-[#5c4033]">Coupon: </p>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="outline-none border border-[#5c4033] p-2 rounded-sm w-full bg-[#f9f4f1] text-[#40322e]"
                      placeholder="Enter coupon code"
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    className="w-full p-2 text-base font-semibold font-texts bg-[#5c4033] my-3 rounded-sm text-[#fff7ec] border border-[#5c4033] hover:bg-[#40322e] transition"
                  >
                    Apply Coupon
                  </button>
                  {couponError && <p className="text-red-500 text-sm">{couponError}</p>}
                </div>

                <div className="text-base font-texts text-[#5c4033] my-4 border-b-[1px] border-[#5c4033] pb-3">
                  <div className="flex justify-between items-center">
                    <p>Product Total:</p>
                    <p className="text-black font-semibold">₹ {totalProductCost}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p>Delivery Charge:</p>
                    <p className="text-black font-semibold">₹ {deliveryCost}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p>Discount:</p>
                    <p className="text-red-600 font-semibold">-₹ {discount}</p>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between items-center">
                      <p>Coupon Discount:</p>
                      <p className="text-green-600 font-semibold">-₹ {appliedCoupon.discount}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center font-bold text-lg font-texts text-[#5c4033]">
                  <p>Total:</p>
                  <p>₹ {totalCost}</p>
                </div>

                <button
                  onClick={handleConfirmAddress}
                  className="text-lg font-texts font-semibold w-full p-2 bg-[#5c4033] text-[#fff7ec] mt-4 rounded-sm border border-[#5c4033] shadow hover:bg-[#40322e]"
                >
                  Confirm Your Address
                </button>
                <button
                  onClick={handleChechOut}
                  className="text-lg font-texts font-semibold w-full p-2 bg-[#5c4033] text-[#fff7ec] mt-4 rounded-sm border border-[#5c4033] shadow hover:bg-[#40322e]"
                >
                  Proceed to Pay
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
