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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
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
      }
    };

    fetchOrders();
  }, [axiosPrivate, email]);

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-50 text-green-700 border border-green-300';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border border-blue-300';
      case 'Processing':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-300';
      case 'Pending':
        return 'bg-orange-50 text-orange-700 border border-orange-300';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border border-red-300';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5c4033]/5 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-12">
          <FaShoppingBag className="text-[#5c4033] text-4xl mr-4" />
          <h2 className="text-4xl font-bold text-[#5c4033]">Your Orders</h2>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <FaBoxOpen className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-lg border-t-4 border-t-[#5c4033] overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                {/* Order Header */}
                <div className="bg-[#5c4033]/5 p-6">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-[#5c4033] p-3 rounded-full">
                        <FaBoxOpen className="text-xl text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="text-md font-medium text-[#5c4033]">{order._id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right flex items-center">
                        <FaCalendarAlt className="text-[#5c4033] mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Ordered On</p>
                          <p className="text-md font-medium text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getOrderStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-6">
                    {order.items.map(item => {
                      const product = productDetails[item.productId] || {};
                      return (
                        <div key={item.productId} 
                             className="flex flex-col md:flex-row items-start md:items-center gap-6 py-4 border-b border-gray-100 last:border-0 hover:bg-[#5c4033]/5 transition-colors duration-200 rounded-lg p-4">
                          <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                            <img
                              src={product.data?.frontPicture || "/api/placeholder/96/96"}
                              alt={product.data?.name || "Product"}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          
                          <div className="flex-grow">
                            <h4 className="text-xl font-semibold text-[#5c4033] mb-2">
                              {product.data?.name || "Loading..."}
                            </h4>
                            <div className="flex items-center mb-3">
                              <FaMapMarkerAlt className="text-gray-400 mr-2" />
                              <p className="text-sm text-gray-600">
                                {product.data?.categoryName || "Loading..."}
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                              <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                                <span className="font-medium mr-2">Qty:</span>
                                {item.quantity}
                              </div>
                              
                              {item.size && (
                                <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                                  <span className="font-medium mr-2">Size:</span>
                                  {item.size}
                                </div>
                              )}
                              
                              {item.color && (
                                <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                                  <span className="font-medium mr-2">Color:</span>
                                  <span
                                    className="w-4 h-4 rounded-full border border-gray-200"
                                    style={{ backgroundColor: item.color }}
                                  ></span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-xl font-semibold text-[#5c4033] flex items-center bg-[#5c4033]/5 px-4 py-2 rounded-full">
                              <FaRupeeSign className="text-sm" />
                              {item.price}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t border-dashed border-[#5c4033]/30">
                    <div className="flex flex-wrap justify-between items-center gap-4 bg-[#5c4033]/5 p-4 rounded-lg">
                      <div className="flex items-center">
                        {order.paymentStatus === 'Paid' ? (
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <FaCheckCircle className="text-green-600 text-xl" />
                          </div>
                        ) : (
                          <div className="bg-red-100 p-2 rounded-full mr-3">
                            <FaTimesCircle className="text-red-600 text-xl" />
                          </div>
                        )}
                        <span className="text-gray-700">
                          Payment Status: <span className="font-semibold">{order.paymentStatus}</span>
                        </span>
                      </div>
                      
                      <div className="text-2xl font-bold text-[#5c4033] flex items-center bg-white px-6 py-3 rounded-full shadow-sm">
                        Total: <FaRupeeSign className="ml-2 mr-1" />{order.totalAmount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;