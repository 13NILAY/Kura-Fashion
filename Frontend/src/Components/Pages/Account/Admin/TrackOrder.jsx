import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import { FaRupeeSign, FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import OrderDetails from './OrderDetails';

const TrackOrder = () => {
  const axiosPrivate = useAxiosPrivate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  const [groupedOrders, setGroupedOrders] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosPrivate.get('/order/allOrders');
        setOrders(response.data.data);
        
        // Group orders by username
        const grouped = response.data.data.reduce((acc, order) => {
          const username = order.userId.username;
          if (!acc[username]) {
            acc[username] = [];
          }
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
      
      // Update groupedOrders as well
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

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const toggleUserExpand = (username) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(username)) {
      newExpanded.delete(username);
    } else {
      newExpanded.add(username);
    }
    setExpandedUsers(newExpanded);
  };

  const calculateUserStats = (orders) => {
    return {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      lastOrder: new Date(Math.max(...orders.map(o => new Date(o.createdAt)))).toLocaleDateString()
    };
  };

  return (
    <div className='w-full mt-10 p-10 bg-[#f5e3d1] pt-20'>
      <h2 className='text-4xl font-bold mb-8 text-center text-[#4a2c20]'>
        Admin Order Tracking
      </h2>

      <div className='space-y-4'>
        {Object.entries(groupedOrders)
          .sort(([a], [b]) => a.localeCompare(b)) // Sort by username
          .map(([username, userOrders]) => {
            const stats = calculateUserStats(userOrders);
            const isExpanded = expandedUsers.has(username);

            return (
              <div key={username} className='bg-white rounded-lg shadow-lg overflow-hidden'>
                {/* User Summary Header */}
                <div 
                  onClick={() => toggleUserExpand(username)}
                  className='bg-[#4a2c20] text-white p-4 flex justify-between items-center cursor-pointer hover:bg-[#5d382a]'
                >
                  <div className='flex items-center space-x-4'>
                    <h3 className='text-xl font-semibold'>{username}</h3>
                    <span className='text-sm bg-[#f5e3d1] text-[#4a2c20] px-2 py-1 rounded'>
                      {stats.totalOrders} orders
                    </span>
                    <span className='text-sm'>
                      Total Spent: ₹{stats.totalSpent}
                    </span>
                    <span className='text-sm'>
                      Last Order: {stats.lastOrder}
                    </span>
                  </div>
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </div>

                {/* Orders Table */}
                {isExpanded && (
                  <div className='overflow-x-auto'>
                    <table className='min-w-full'>
                      <thead className='bg-[#f5e3d1] text-[#4a2c20]'>
                        <tr>
                          <th className='px-6 py-4 text-left'>Order ID</th>
                          <th className='px-6 py-4 text-left'>Total Amount</th>
                          <th className='px-6 py-4 text-left'>Payment Status</th>
                          <th className='px-6 py-4 text-left'>Order Date</th>
                          <th className='px-6 py-4 text-left'>Order Status</th>
                          <th className='px-6 py-4 text-left'>Update Status</th>
                          <th className='px-6 py-4 text-left'>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userOrders.map(order => (
                          <tr key={order._id} className='border-b hover:bg-gray-50'>
                            <td className='px-6 py-4 text-[#4a2c20]'>{order._id}</td>
                            <td className='px-6 py-4 text-[#4a2c20] flex items-center'>
                              <FaRupeeSign className='mr-1' />{order.totalAmount}
                            </td>
                            <td className='px-6 py-4'>
                              {order.paymentStatus === 'Paid' ? (
                                <FaCheckCircle className='text-green-500 inline mr-2' />
                              ) : (
                                <FaTimesCircle className='text-red-500 inline mr-2' />
                              )}
                              <span className='text-[#4a2c20]'>{order.paymentStatus}</span>
                            </td>
                            <td className='px-6 py-4 text-[#4a2c20]'>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className='px-6 py-4'>
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
                            <td className='px-6 py-4'>
                              <select
                                value={order.orderStatus}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                className='border rounded px-3 py-2 text-[#4a2c20]'
                              >
                                <option value='Pending'>Pending</option>
                                <option value='Processing'>Processing</option>
                                <option value='Shipped'>Shipped</option>
                                <option value='Delivered'>Delivered</option>
                                <option value='Cancelled'>Cancelled</option>
                              </select>
                            </td>
                            <td className='px-6 py-4'>
                              <button
                                onClick={() => handleViewDetails(order)}
                                className='bg-blue-500 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-600'
                              >
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

      {isModalOpen && selectedOrder && (
        <OrderDetails order={selectedOrder} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default TrackOrder;