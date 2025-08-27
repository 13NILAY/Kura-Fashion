import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import useAuth from '../../../../hooks/useAuth';
import { FaBoxOpen, FaRupeeSign, FaTruck, FaCheckCircle, FaTimesCircle, FaShoppingBag, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const UserOrders = () => {
  const { auth } = useAuth();
  const email = auth.email;
  const axiosPrivate = useAxiosPrivate();
  const [orders, setOrders] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get(`/users/getOrdersList/${email}`);
        setOrders(response.data.user.order);
        
        const productIds = response.data.user.order.flatMap(order => 
          order.items.map(item => item.productId)
        );
        
        const uniqueProductIds = [...new Set(productIds)];
        const productPromises = uniqueProductIds.map(async (productId) => {
          const productResponse = await axiosPrivate.get(`product/viewProduct/${productId}`);
          return [productId, productResponse.data];
        });
        
        const productResults = await Promise.all(productPromises);
        const productDetailsMap = Object.fromEntries(productResults);
        setProductDetails(productDetailsMap);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Unable to load your orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [axiosPrivate, email]);

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Processing':
        return 'bg-[#D4A373]/20 text-[#3A2E2E] border border-[#D4A373]/40';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-[#EADBC8]/40 text-[#3A2E2E] border border-[#EADBC8]';
    }
  };

  // Premium loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Loading Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 border-4 border-[#D4A373]/30 border-t-[#3A2E2E] rounded-full animate-spin"></div>
            </div>
            <div className="w-64 h-12 bg-[#3A2E2E]/20 rounded-lg mx-auto animate-pulse mb-4"></div>
            <div className="w-48 h-6 bg-[#3A2E2E]/15 rounded-lg mx-auto animate-pulse"></div>
          </div>
          
          {/* Loading Orders */}
          <div className="space-y-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30 animate-pulse">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#D4A373]/30 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-[#3A2E2E]/20 rounded"></div>
                      <div className="w-48 h-6 bg-[#3A2E2E]/30 rounded"></div>
                    </div>
                  </div>
                  <div className="w-24 h-8 bg-[#D4A373]/30 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-[#EADBC8]/60 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="w-48 h-6 bg-[#3A2E2E]/20 rounded"></div>
                      <div className="w-32 h-4 bg-[#3A2E2E]/15 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-xl border border-white/30 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimesCircle className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-xl font-headings text-[#3A2E2E] mb-4">Unable to Load Orders</h3>
            <p className="text-[#3A2E2E]/70 font-texts mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#3A2E2E] text-[#EADBC8] rounded-full hover:bg-[#2C2C2C] transition-all duration-300 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-[#D4A373]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#3A2E2E]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Elegant Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
            <span className="mx-4 text-[#3A2E2E]/60 text-sm font-medium tracking-widest uppercase">
              Order History
            </span>
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
          </div>
          
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#D4A373]/20 to-[#3A2E2E]/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-[#3A2E2E] p-4 rounded-2xl">
              <FaShoppingBag className="text-[#D4A373] text-4xl" />
            </div>
          </div>
          
          <h2 className="font-headings text-[#3A2E2E] text-4xl sm:text-5xl lg:text-6xl font-light mb-6 leading-tight">
            Your
            <span className="block text-[#D4A373] font-normal">Orders</span>
          </h2>
          
          <p className="text-lg text-[#3A2E2E]/70 max-w-2xl mx-auto leading-relaxed">
            Track and manage your KURA Fashion purchases. Each order reflects our commitment to premium quality and exceptional service.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-16 text-center">
            <div className="relative inline-block mb-8">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#D4A373]/20 to-[#3A2E2E]/10 rounded-full blur-xl"></div>
              <div className="relative bg-[#EADBC8]/40 p-8 rounded-full">
                <FaBoxOpen className="text-6xl text-[#3A2E2E]/40" />
              </div>
            </div>
            <h3 className="text-2xl font-headings text-[#3A2E2E] mb-4">No Orders Yet</h3>
            <p className="text-lg text-[#3A2E2E]/60 mb-8">Start your premium fashion journey with KURA</p>
            <button className="px-8 py-4 bg-[#3A2E2E] text-[#EADBC8] rounded-full font-semibold hover:bg-[#2C2C2C] transition-all duration-300 hover:scale-105 transform">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, orderIndex) => (
              <div
                key={order._id}
                className="group bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-white/30 overflow-hidden transition-all duration-500 hover:scale-[1.01] hover:-translate-y-1"
                style={{
                  animationDelay: `${orderIndex * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Premium Order Header */}
                <div className="bg-gradient-to-r from-[#3A2E2E]/5 to-[#D4A373]/5 p-8 border-b border-[#D4A373]/20">
                  <div className="flex flex-wrap justify-between items-center gap-6">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-[#D4A373]/20 to-[#3A2E2E]/20 rounded-full blur-lg"></div>
                        <div className="relative bg-[#3A2E2E] p-4 rounded-full">
                          <FaBoxOpen className="text-xl text-[#D4A373]" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-[#3A2E2E]/60 font-medium uppercase tracking-wide mb-1">Order ID</p>
                        <p className="text-lg font-headings font-semibold text-[#3A2E2E]">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-8">
                      <div className="text-right flex items-center">
                        <div className="bg-[#D4A373]/20 p-2 rounded-full mr-3">
                          <FaCalendarAlt className="text-[#3A2E2E] text-sm" />
                        </div>
                        <div>
                          <p className="text-sm text-[#3A2E2E]/60 font-medium uppercase tracking-wide">Ordered On</p>
                          <p className="text-md font-headings font-semibold text-[#3A2E2E]">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <span className={`px-6 py-3 rounded-full text-sm font-semibold ${getOrderStatusColor(order.orderStatus)} shadow-sm`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Premium Order Items */}
                <div className="p-8">
                  <div className="space-y-8">
                    {order.items.map((item, itemIndex) => {
                      const product = productDetails[item.productId] || {};
                      return (
                        <div key={item.productId} 
                             className="group/item flex flex-col lg:flex-row items-start lg:items-center gap-8 p-6 
                               hover:bg-[#F8F5F2]/50 transition-all duration-300 rounded-xl 
                               border border-transparent hover:border-[#D4A373]/20"
                             style={{
                               animationDelay: `${itemIndex * 50}ms`,
                               animation: 'slideIn 0.5s ease-out forwards'
                             }}>
                          
                          {/* Premium Product Image */}
                          <div className="relative group/image flex-shrink-0">
                            <div className="absolute -inset-2 bg-gradient-to-r from-[#D4A373]/20 to-[#3A2E2E]/10 rounded-2xl blur-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative w-32 h-32 bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] rounded-xl overflow-hidden shadow-lg border border-white/50">
                              {product.data?.frontPicture ? (
                                <img
                                  src={product.data.frontPicture}
                                  alt={product.data?.name || "Product"}
                                  className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full bg-[#EADBC8]/60 animate-pulse flex items-center justify-center">
                                  <FaBoxOpen className="text-[#3A2E2E]/40 text-2xl" />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Premium Product Details */}
                          <div className="flex-grow space-y-4">
                            <h4 className="font-headings text-2xl font-semibold text-[#3A2E2E] group-hover/item:text-[#D4A373] transition-colors duration-300">
                              {product.data?.name || "Loading..."}
                            </h4>
                            
                            <div className="flex items-center space-x-2 text-[#3A2E2E]/70">
                              <FaMapMarkerAlt className="text-[#D4A373]" />
                              <span className="font-medium">
                                {product.data?.categoryName || "Loading..."}
                              </span>
                            </div>
                            
                            {/* Premium Product Attributes */}
                            <div className="flex flex-wrap gap-3">
                              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#D4A373]/20 shadow-sm">
                                <span className="text-[#3A2E2E]/70 font-medium text-sm">Qty: </span>
                                <span className="font-semibold text-[#3A2E2E]">{item.quantity}</span>
                              </div>
                              
                              {item.size && (
                                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#D4A373]/20 shadow-sm">
                                  <span className="text-[#3A2E2E]/70 font-medium text-sm">Size: </span>
                                  <span className="font-semibold text-[#3A2E2E]">{item.size}</span>
                                </div>
                              )}
                              
                              {item.color && (
                                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#D4A373]/20 shadow-sm flex items-center">
                                  <span className="text-[#3A2E2E]/70 font-medium text-sm mr-2">Color: </span>
                                  <span
                                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                    style={{ backgroundColor: item.color }}
                                  ></span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Premium Price Display */}
                          <div className="flex flex-col items-end">
                            <div className="bg-gradient-to-r from-[#3A2E2E] to-[#2C2C2C] text-[#D4A373] px-6 py-3 rounded-full shadow-lg flex items-center">
                              <FaRupeeSign className="text-lg mr-1" />
                              <span className="text-2xl font-bold">{item.price?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Premium Order Summary */}
                  <div className="mt-8 pt-8 border-t border-dashed border-[#D4A373]/30">
                    <div className="bg-gradient-to-r from-[#F8F5F2] to-[#EADBC8]/50 p-6 rounded-xl border border-[#D4A373]/20">
                      <div className="flex flex-wrap justify-between items-center gap-6">
                        <div className="flex items-center">
                          {order.paymentStatus === 'Paid' ? (
                            <div className="bg-emerald-100 p-3 rounded-full mr-4 shadow-sm">
                              <FaCheckCircle className="text-emerald-600 text-xl" />
                            </div>
                          ) : (
                            <div className="bg-red-100 p-3 rounded-full mr-4 shadow-sm">
                              <FaTimesCircle className="text-red-600 text-xl" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-[#3A2E2E]/60 font-medium uppercase tracking-wide">Payment Status</p>
                            <p className="text-lg font-headings font-semibold text-[#3A2E2E]">{order.paymentStatus}</p>
                          </div>
                        </div>
                        
                        <div className="bg-white/80 backdrop-blur-sm px-8 py-4 rounded-full shadow-lg border border-[#D4A373]/30">
                          <div className="text-center">
                            <p className="text-sm text-[#3A2E2E]/60 font-medium uppercase tracking-wide mb-1">Total Amount</p>
                            <div className="text-3xl font-bold text-[#3A2E2E] flex items-center">
                              <FaRupeeSign className="text-xl mr-1" />
                              {order.totalAmount?.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium hover shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                  <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shine"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CSS Animations */}
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
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(12deg); }
          100% { transform: translateX(200%) skewX(12deg); }
        }
        
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default UserOrders;