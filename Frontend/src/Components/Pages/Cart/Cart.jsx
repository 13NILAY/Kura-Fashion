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
      const discount = appliedCoupon ? appliedCoupon.discount : 0;
      
      const orderData = {
        user: user,
        items: cart,
        totalCost: totalCost,
        deliveryCost: deliveryCost,
        discount: discount,
        paymentStatus: PStatus,
        paymentDetails: PaymentInfo
      };
      
      const response = await axiosPrivate.post('/order/create-order', orderData);
      
      if (response.status === 200) {
        alert("Order created successfully!");
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
        amount: totalCost,
        currency: "INR",
      });
      setOrder(orderData.data);
      let PStatus="Failed";
      const options = {
        key: keyID,
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
          color: "#3A2E2E",
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
      <div className="mt-20 px-4 sm:px-8 pt-8 sm:pt-12 pb-16 bg-gradient-to-br from-[#F8F5F2] via-[#EADBC8] to-[#D4A373]/20 relative overflow-hidden min-h-screen">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#D4A373]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#3A2E2E]/5 rounded-full blur-3xl animate-pulse" 
          style={{animationDelay: '2s'}}></div>

        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
            <span className="mx-4 text-[#3A2E2E]/60 text-sm font-medium tracking-widest uppercase">
              Your Selection
            </span>
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
          </div>
          <h1 className="font-headings text-[#3A2E2E] text-4xl sm:text-5xl lg:text-6xl font-light mb-4">
            Shopping
            <span className="block text-[#D4A373] font-normal">Bag</span>
          </h1>
          <p className="text-[#3A2E2E]/70 font-texts text-lg max-w-2xl mx-auto">
            Review your carefully curated selection of premium fashion pieces
          </p>
        </div>
        
        {isCartEmpty ? (
          /* Empty Cart State */
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/30 relative overflow-hidden">
              {/* Premium gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none"></div>
              
              <div className="relative">
                {/* Empty bag icon */}
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-[#D4A373]/20 to-[#3A2E2E]/10 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-[#3A2E2E]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                  </svg>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-headings text-[#3A2E2E] mb-4 font-light">
                  Your Shopping Bag is Empty
                </h2>
                <p className="text-lg text-[#3A2E2E]/70 font-texts mb-8 leading-relaxed">
                  Discover our curated collection of premium fashion pieces. 
                  Any items you add will appear here for easy checkout.
                </p>
                
                <Link to="/shop" className="group inline-block">
                  <button className="bg-[#3A2E2E] text-[#EADBC8] px-8 py-4 rounded-xl font-semibold font-headings text-lg 
                    shadow-lg hover:bg-[#2C2C2C] hover:shadow-2xl hover:shadow-[#3A2E2E]/30 
                    transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 
                    border border-[#3A2E2E] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4A373]/20 via-transparent to-[#D4A373]/20 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Explore Collection</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col xl:flex-row gap-8 items-start">
              {/* Cart Items Section */}
              <div className="w-full xl:w-2/3">
                <div className="space-y-6">
                  {cart.map((prod, index) => (
                    <div 
                      key={prod._id}
                      className="transform transition-all duration-500 hover:scale-[1.02]"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.8s ease-out forwards'
                      }}
                    >
                      <CartProd
                        _id={prod._id}
                        product={prod.product}
                        selectedSize={prod.selectedSize}
                        selectedColor={prod.selectedColor}
                        quantity={prod.quantity}
                        onDelete={handleDelete}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary Section */}
              <div className="w-full xl:w-1/3 xl:sticky xl:top-28">
                <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 
                  p-6 sm:p-8 relative overflow-hidden">
                  
                  {/* Premium gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none"></div>
                  
                  <div className="relative">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <h3 className="font-headings text-[#3A2E2E] text-2xl font-light mb-2">
                        Order Summary
                      </h3>
                      <div className="w-16 h-0.5 bg-[#D4A373] mx-auto"></div>
                    </div>

                    {/* Coupon Section */}
                    <div className="mb-8 pb-6 border-b border-[#D4A373]/30">
                      <div className="space-y-4">
                        <label className="block text-[#3A2E2E] text-sm font-semibold">
                          Coupon Code
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-xl border-2 border-[#D4A373]/30 
                              bg-white/80 backdrop-blur-sm focus:border-[#3A2E2E] 
                              focus:ring-4 focus:ring-[#D4A373]/20 transition-all duration-300 
                              outline-none font-texts text-[#3A2E2E]"
                            placeholder="Enter code"
                          />
                          <button
                            onClick={applyCoupon}
                            className="px-6 py-3 bg-[#D4A373] text-[#3A2E2E] rounded-xl font-semibold 
                              hover:bg-[#C49363] transition-all duration-300 transform hover:scale-105 
                              shadow-md hover:shadow-lg border-2 border-[#D4A373] hover:border-[#C49363]"
                          >
                            Apply
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                            {couponError}
                          </p>
                        )}
                        {appliedCoupon && (
                          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                            <p className="text-emerald-800 font-semibold text-sm">
                              ✓ Coupon "{appliedCoupon.code}" applied successfully!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-4 mb-8 pb-6 border-b border-[#D4A373]/30">
                      <div className="flex justify-between items-center font-texts text-[#3A2E2E]">
                        <span>Product Total:</span>
                        <span className="font-semibold">₹ {totalProductCost.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-start font-texts text-[#3A2E2E]">
                        <span>Delivery:</span>
                        <div className="text-right">
                          <span className="font-semibold">
                            {deliverySettings?.type === 'FREE_ALL' ? (
                              <span className="text-emerald-600">Free</span>
                            ) : deliverySettings?.type === 'FREE_ABOVE' && totalProductCost >= deliverySettings.minOrderForFreeDelivery ? (
                              <span className="text-emerald-600">Free</span>
                            ) : (
                              `₹ ${deliveryCost.toLocaleString()}`
                            )}
                          </span>
                          {deliverySettings?.type === 'FREE_ABOVE' && totalProductCost < deliverySettings.minOrderForFreeDelivery && (
                            <p className="text-xs text-amber-600 mt-1 bg-amber-50 px-2 py-1 rounded">
                              Free delivery on orders above ₹{deliverySettings.minOrderForFreeDelivery.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {appliedCoupon && (
                        <div className="flex justify-between items-center font-texts text-emerald-600">
                          <span>Coupon Discount:</span>
                          <span className="font-semibold">-₹ {appliedCoupon.discount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center mb-8 py-4 bg-[#D4A373]/10 rounded-xl px-4">
                      <span className="font-headings text-[#3A2E2E] text-xl font-semibold">Total:</span>
                      <span className="font-headings text-[#3A2E2E] text-2xl font-bold">
                        ₹ {totalCost.toLocaleString()}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                      <button
                        onClick={handleConfirmAddress}
                        className="w-full py-4 px-6 border-2 border-[#3A2E2E] text-[#3A2E2E] 
                          rounded-xl font-semibold font-headings text-lg transition-all duration-300 
                          hover:bg-[#3A2E2E] hover:text-[#EADBC8] hover:shadow-lg 
                          transform hover:scale-[1.02] relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-[#3A2E2E] transform scale-x-0 origin-left 
                          transition-transform duration-300 group-hover:scale-x-100"></div>
                        <span className="relative z-10">Confirm Address</span>
                      </button>
                      
                      <button
                        onClick={handleCheckOut}
                        className="w-full py-4 px-6 bg-[#3A2E2E] text-[#EADBC8] rounded-xl 
                          font-semibold font-headings text-lg shadow-lg hover:bg-[#2C2C2C] 
                          hover:shadow-2xl hover:shadow-[#3A2E2E]/30 transition-all duration-300 
                          transform hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#D4A373]/20 via-transparent to-[#D4A373]/20 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Proceed to Payment
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animation for fade-in effect */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Cart;