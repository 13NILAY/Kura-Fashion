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
  const [totalCost, setTotalCost] = useState(1);
  const [user, setUser] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const email = auth.email;
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [deliverySettings, setDeliverySettings] = useState(null);
  const [deliveryCost, setDeliveryCost] = useState(0);

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
  }, [auth.email, axiosPrivate, email]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const result = await axiosPrivate.get(`/users/viewMyCart/${email}`);
        // console.log(result);
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
  // console.log(cart);
  useEffect(() => {
    let totalProduct = 0;
    cart.forEach((prod) => {
      // console.log(prod)
      totalProduct += prod.product.cost.value * prod.quantity;
    });
    setTotalProductCost(totalProduct);
  }, [cart]);

  useEffect(() => {
    const fetchDeliverySettings = async () => {
      try {
        const response = await axiosPrivate.get('/delivery');
        setDeliverySettings(response.data);
      } catch (err) {
        console.error('Error fetching delivery settings:', err);
      }
    };
    fetchDeliverySettings();
  }, []);

  useEffect(() => {
    if (deliverySettings && totalProductCost > 0) {
      let cost = 0;
      switch (deliverySettings.type) {
        case 'FREE_ALL':
          cost = 0;
          break;
        case 'FREE_ABOVE':
          cost = totalProductCost >= deliverySettings.minOrderForFreeDelivery 
            ? 0 
            : deliverySettings.standardDeliveryCharge;
          break;
        case 'FIXED':
          cost = deliverySettings.standardDeliveryCharge;
          break;
        default:
          cost = 0;
      }
      setDeliveryCost(cost);
    }
  }, [deliverySettings, totalProductCost]);

  useEffect(() => {
    let total = totalProductCost + deliveryCost;
    if (appliedCoupon) {
      total -= appliedCoupon.discount;
    }
    setTotalCost(total);
  }, [totalProductCost, deliveryCost, appliedCoupon]);

  const handleDelete = ({ _id, size }) => {
    dispatch(deleteProductFromCart({ _id, size }, axiosPrivate, email));
  };

  const handleConfirmAddress = () => {
    navigate('/account/address', { state: { from: location }, replace: true });
  };

  const createOrder = async ({PaymentInfo},PStatus) => {
    try {
      // console.log(PaymentInfo);
      // Get the discount amount from applied coupon or 0 if no coupon
      const discount = appliedCoupon ? appliedCoupon.discount : 0;
      
      // Prepare the order data according to the backend expectations
      const orderData = {
        user: user,
        items: cart,
        totalCost: totalCost,
        deliveryCost: deliveryCost,
        discount: discount,
        paymentStatus: PStatus,
        paymentDetails: PaymentInfo
      };
      
      // Send the order data to the backend
      const response = await axiosPrivate.post('/order/create-order', orderData);
      
      if (response.status === 200) {
        alert("Order created successfully!");
        // Clear cart in Redux store
        dispatch(fetchCart([]));
        navigate('/account/my-orders', { replace: true });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };
  
  const handleCheckOut = async () => {
    try {
      const keyID=import.meta.env.KeyId;
      const orderUrl = "/order/create-payment-gateway";
      const orderData = await axiosPrivate.post(orderUrl, {
        amount: totalCost , // Convert to paise for Razorpay
        currency: "INR",
      });
      setOrder(orderData.data);
      let PStatus="Failed";
      const options = {
        key: keyID, // Replace with your Razorpay key ID
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: "Kura Fashion",
        description: "Transaction",
        order_id: orderData.data.id,
        handler: (response) => {
          PStatus="Paid";
          setPaymentStatus(true);
          setPaymentDetails({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
          const PaymentInfo={
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          }
          // Call createOrder after payment is successful
          setTimeout(() => {
            createOrder({PaymentInfo},PStatus);
          }, 1000);
        },
        prefill: {
          name: user ? `${user.first_name}` : '',
          email: email,
          contact: user ? `${user.mobileno}` : '',
        },
        notes: {
          address: "Shanti Garden",
        },
        theme: {
          color: "#5c4033",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment error", error);
    }
  };

  const applyCoupon = async () => {
    try {
      const response = await axiosPrivate.post('/coupon/apply', {
        code: couponCode,
        totalOrderValue: totalProductCost
      });
      
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
      <div className="mt-20 px-4 sm:px-sectionPadding pt-6 sm:pt-10 bg-[#f5ebe0]">
        <div className="flex items-center justify-center text-3xl sm:text-5xl font-headings mb-6 sm:mb-10 text-[#5c4033]">
          Shopping Bag
        </div>
        
        {isCartEmpty ? (
          <div className="text-2xl sm:text-4xl font-semibold font-texts text-[#5c4033] flex flex-col justify-center items-center w-full h-full my-8 sm:my-12 text-center">
            <p>Your Shopping Bag is Empty.</p>
            <p className="text-lg sm:text-xl font-texts mt-2">Any items added to the bag will be visible here</p>
            <Link to="/shop" className="flex justify-center items-center mt-3">
              <button className="bg-[#5c4033] h-10 sm:h-12 text-[#fff7ec] text-xl sm:text-2xl px-6 sm:px-8 py-1 sm:py-2 rounded-sm border border-[#5c4033] my-3 hover:bg-[#40322e] transition">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="w-full lg:w-3/5">
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
            <div className="w-full lg:w-2/5 my-3 border border-[#5c4033] p-4 sm:p-6 rounded-sm bg-[#fff7ec] shadow-lg">
              <div className="border-b-[1px] border-[#5c4033] pb-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm sm:text-base font-semibold font-headings text-[#5c4033]">Coupon: </p>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="outline-none border border-[#5c4033] p-2 rounded-sm w-full bg-[#f9f4f1] text-[#40322e] text-sm sm:text-base"
                    placeholder="Enter coupon code"
                  />
                </div>
                <button
                  onClick={applyCoupon}
                  className="w-full p-2 text-sm sm:text-base font-semibold font-texts bg-[#5c4033] my-3 rounded-sm text-[#fff7ec] border border-[#5c4033] hover:bg-[#40322e] transition"
                >
                  Apply Coupon
                </button>
                {couponError && <p className="text-red-500 text-xs sm:text-sm">{couponError}</p>}
              </div>

              <div className="text-sm sm:text-base font-texts text-[#5c4033] my-4 border-b-[1px] border-[#5c4033] pb-3 space-y-2">
                <div className="flex justify-between items-center">
                  <p>Product Total:</p>
                  <p className="text-black font-semibold">₹ {totalProductCost}</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <p>Delivery Charge:</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <p className="text-black font-semibold">
                      {deliverySettings?.type === 'FREE_ALL' ? (
                        'Free'
                      ) : deliverySettings?.type === 'FREE_ABOVE' && totalProductCost >= deliverySettings.minOrderForFreeDelivery ? (
                        'Free'
                      ) : (
                        `₹ ${deliveryCost}`
                      )}
                    </p>
                    {deliverySettings?.type === 'FREE_ABOVE' && totalProductCost < deliverySettings.minOrderForFreeDelivery && (
                      <p className="text-xs sm:text-sm text-red-600 italic">
                        Free delivery on orders above ₹{deliverySettings.minOrderForFreeDelivery}!
                      </p>
                    )}
                  </div>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center">
                    <p>Coupon Discount:</p>
                    <p className="text-green-600 font-semibold">-₹ {appliedCoupon.discount}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center font-bold text-base sm:text-lg font-texts text-[#5c4033]">
                <p>Total:</p>
                <p>₹ {totalCost}</p>
              </div>

              <button
                onClick={handleConfirmAddress}
                className="text-base sm:text-lg font-texts font-semibold w-full p-2 bg-[#5c4033] text-[#fff7ec] mt-4 rounded-sm border border-[#5c4033] shadow hover:bg-[#40322e]"
              >
                Confirm Your Address
              </button>
              <button
                onClick={handleCheckOut}
                className="text-base sm:text-lg font-texts font-semibold w-full p-2 bg-[#5c4033] text-[#fff7ec] mt-4 rounded-sm border border-[#5c4033] shadow hover:bg-[#40322e]"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;