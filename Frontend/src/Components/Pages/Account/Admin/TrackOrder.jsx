import React, { useState, useEffect } from 'react';
import { FaRupeeSign, FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp, 
         FaUsers, FaShoppingCart, FaCreditCard, FaBoxes, FaCalendarAlt, FaEye } from 'react-icons/fa';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import OrderDetails from './OrderDetails';

const TrackOrder = () => {
  const axiosPrivate = useAxiosPrivate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  const [groupedOrders, setGroupedOrders] = useState({});

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  // Calculate dashboard stats
  const stats = {
    totalUsers: Object.keys(groupedOrders).length,
    totalPayments: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    todayPayments: orders
      .filter(order => new Date(order.createdAt).toDateString() === new Date().toDateString())
      .reduce((sum, order) => sum + order.totalAmount, 0),
    totalItems: orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    )
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosPrivate.get('/order/allOrders');
        setOrders(response.data.data);
        
        const grouped = response.data.data.reduce((acc, order) => {
          const username = order.userId.username;
          if (!acc[username]) acc[username] = [];
          acc[username].push(order);
          return acc;
        }, {});
        
        setGroupedOrders(grouped);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosPrivate.put(`/admin/updateOrderStatus/${orderId}`, { status: newStatus });
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      
      const updatedGrouped = { ...groupedOrders };
      Object.keys(updatedGrouped).forEach(username => {
        updatedGrouped[username] = updatedGrouped[username].map(order =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        );
      });
      setGroupedOrders(updatedGrouped);
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const toggleUserExpand = (username) => {
    setExpandedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(username)) {
        newSet.delete(username);
      } else {
        newSet.add(username);
      }
      return newSet;
    });
  };

  // Stats Card Component
  const StatCard = ({ title, value, icon: Icon, bgColor }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center">
        <div className={`rounded-full p-4 ${bgColor} mr-4`}>
          <Icon className="h-6 w-6 text-[#4a2c20]" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-[#4a2c20]">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#f5e3d1]">
      {/* Dashboard Header */}
      <div className="p-8 pb-4">
        <h1 className="text-4xl font-bold text-[#4a2c20] text-center mb-8">
          Order Management Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Users"
            value={stats.totalUsers}
            icon={FaUsers}
            bgColor="bg-orange-100"
          />
          <StatCard 
            title="Total Payments"
            value={`₹${stats.totalPayments.toLocaleString()}`}
            icon={FaCreditCard}
            bgColor="bg-green-100"
          />
          <StatCard 
            title="Today's Payments"
            value={`₹${stats.todayPayments.toLocaleString()}`}
            icon={FaCalendarAlt}
            bgColor="bg-blue-100"
          />
          <StatCard 
            title="Total Items Sold"
            value={stats.totalItems}
            icon={FaBoxes}
            bgColor="bg-purple-100"
          />
        </div>

        {/* Orders Section */}
        <div className="space-y-4">
        {Object.entries(groupedOrders)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([username, userOrders]) => {
            const isExpanded = expandedUsers.has(username);
            const stats = {
              totalOrders: userOrders.length,
              totalSpent: userOrders.reduce((sum, order) => sum + order.totalAmount, 0),
              lastOrder: new Date(Math.max(...userOrders.map(o => new Date(o.createdAt)))).toLocaleDateString()
            };

              return (
                <div key={username} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div 
                    onClick={() => toggleUserExpand(username)}
                    className="bg-[#4a2c20] text-white p-4 flex justify-between items-center cursor-pointer hover:bg-[#5d382a] transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <h3 className="text-xl font-semibold">{username}</h3>
                      <span className="text-sm bg-[#f5e3d1] text-[#4a2c20] px-3 py-1 rounded-full">
                        {stats.totalOrders} orders
                      </span>
                      <span className="text-sm flex items-center">
                        <FaRupeeSign className="mr-1" />
                        {stats.totalSpent.toLocaleString()}
                      </span>
                      <span className="text-sm">
                        Last Order: {stats.lastOrder}
                      </span>
                    </div>
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </div>

                 {isExpanded && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-[#f5e3d1] text-[#4a2c20]">
                        <tr>
                          <th className="px-6 py-4 text-left">Order ID</th>
                          <th className="px-6 py-4 text-left">Amount</th>
                          <th className="px-6 py-4 text-left">Payment</th>
                          <th className="px-6 py-4 text-left">Date</th>
                          <th className="px-6 py-4 text-left">Status</th>
                          <th className="px-6 py-4 text-left">Update</th>
                          <th className="px-6 py-4 text-left">Actions</th>
                        </tr>
                      </thead>
                        <tbody>
                          {userOrders.map(order => (
                            <tr key={order._id} className="border-b hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-6 py-4 text-[#4a2c20]">{order._id}</td>
                              <td className="px-6 py-4 text-[#4a2c20] flex items-center">
                                <FaRupeeSign className="mr-1" />{order.totalAmount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4">
                                {order.paymentStatus === 'Paid' ? (
                                  <span className="flex items-center text-green-600">
                                    <FaCheckCircle className="mr-2" />
                                    Paid
                                  </span>
                                ) : (
                                  <span className="flex items-center text-red-600">
                                    <FaTimesCircle className="mr-2" />
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-[#4a2c20]">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-600' :
                                  order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                                  order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-600' :
                                  order.orderStatus === 'Pending' ? 'bg-orange-100 text-orange-600' :
                                  'bg-red-100 text-red-600'
                                }`}>
                                  {order.orderStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <select
                                  value={order.orderStatus}
                                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                  className="border rounded px-3 py-2 text-[#4a2c20] focus:outline-none focus:ring-2 focus:ring-[#4a2c20] focus:border-transparent"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="px-6 py-4">
                              <button
                                onClick={() => handleViewDetails(order)}
                                className="flex items-center bg-[#4a2c20] text-white px-4 py-2 rounded hover:bg-[#5d382a] transition-colors duration-200"
                              >
                                <FaEye className="mr-2" />
                                View Details
                              </button>
                            </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default TrackOrder;