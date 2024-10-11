import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import { FaRupeeSign, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import OrderDetails from './OrderDetails'; // Import the new OrderDetails component

const TrackOrder = () => {
  const axiosPrivate = useAxiosPrivate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State for the selected order
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosPrivate.get('/order/allOrders');
        console.log(response);
        setOrders(response.data.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  // Handler for updating order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axiosPrivate.patch(`/admin/updateOrderStatus/${orderId}`, { status: newStatus });
      console.log(response);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  // Handler to open the modal with order details
  const handleViewDetails = (order) => {
    setSelectedOrder(order); // Set the selected order
    setIsModalOpen(true);    // Open the modal
  };

  // Handler to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className='w-full mt-10 p-10 bg-[#f5e3d1] pt-20'> {/* Added pt-20 for padding-top */}
  <h2 className='text-4xl font-bold mb-8 text-center text-[#4a2c20]'> {/* Dark brown text */}
    Admin Order Tracking
  </h2>

      <div className='overflow-x-auto shadow-lg rounded-lg'>
        <table className='min-w-full bg-white'>
          <thead className='bg-[#4a2c20] text-white'> {/* Brown header background with white text */}
            <tr>
              <th className='px-6 py-4 border text-left'>Username</th>
              <th className='px-6 py-4 border text-left'>Order ID</th>
              <th className='px-6 py-4 border text-left'>Total Amount</th>
              <th className='px-6 py-4 border text-left'>Payment Status</th>
              <th className='px-6 py-4 border text-left'>Order Date</th>
              <th className='px-6 py-4 border text-left'>Order Status</th>
              <th className='px-6 py-4 border text-left'>Update Status</th>
              <th className='px-6 py-4 border text-left'>Actions</th> {/* Added for View Details */}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-[#4a2c20]"> {/* Dark brown text */}
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order._id} className='border-b'>
                  <td className='px-6 py-4 text-[#4a2c20]'>{order.userId.username}</td>
                  <td className='px-6 py-4 text-[#4a2c20]'>{order._id}</td>
                  <td className='px-6 py-4 text-[#4a2c20] flex items-center'>
                    <FaRupeeSign className='mr-1' />
                    {order.totalAmount}
                  </td>
                  <td className='px-6 py-4'>
                    {order.paymentStatus === 'Paid' ? (
                      <FaCheckCircle className='text-green-500' />
                    ) : (
                      <FaTimesCircle className='text-red-500' />
                    )}
                    <span className='ml-2 text-[#4a2c20]'>{order.paymentStatus}</span>
                  </td>
                  <td className='px-6 py-4 text-[#4a2c20]'>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className='px-6 py-4'>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-green-100 text-green-600'
                          : order.orderStatus === 'Shipped'
                          ? 'bg-blue-100 text-blue-600'
                          : order.orderStatus === 'Processing'
                          ? 'bg-yellow-100 text-yellow-600'
                          : order.orderStatus === 'Pending'
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
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
                      onClick={() => handleViewDetails(order)} // Trigger modal with order details
                      className='bg-blue-500 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-600'>
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Render OrderDetails Component */}
      {isModalOpen && selectedOrder && (
        <OrderDetails order={selectedOrder} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default TrackOrder;
