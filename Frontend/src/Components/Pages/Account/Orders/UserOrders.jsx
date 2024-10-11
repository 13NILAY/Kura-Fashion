import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import useAuth from '../../../../hooks/useAuth';
import { FaBoxOpen, FaRupeeSign, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const UserOrders = () => {
  const { auth } = useAuth();
  const email = auth.email;
  const axiosPrivate = useAxiosPrivate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosPrivate.get(`/users/getOrdersList/${email}`);
        setOrders(response.data.user.order);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, [axiosPrivate, email]);

  return (
    <div className='w-full mt-10 p-6 bg-gray-100'>
      <h2 className='text-4xl font-bold mb-8 text-center text-gray-800'>My Orders</h2>
      <div className='flex flex-col gap-6'>
        {orders.map(order => (
          <div
            key={order._id}
            className='border border-gray-300 p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 ease-in-out'
          >
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-2xl font-semibold text-gray-700 flex items-center'>
                <FaBoxOpen className='mr-2 text-gray-500' />
                Order ID: {order._id}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.orderStatus === 'Delivered'
                    ? 'bg-green-100 text-green-600'
                    : order.orderStatus === 'Shipped'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <div>
                <p className='text-lg text-gray-600 flex items-center'>
                  <FaRupeeSign className='mr-2 text-gray-500' />
                  <span>Total Amount: ₹{order.totalAmount}</span>
                </p>
                <p className='text-lg text-gray-600 flex items-center mt-2'>
                  {order.paymentStatus === 'Paid' ? (
                    <FaCheckCircle className='mr-2 text-green-500' />
                  ) : (
                    <FaTimesCircle className='mr-2 text-red-500' />
                  )}
                  <span>Payment Status: {order.paymentStatus}</span>
                </p>
              </div>

              <div>
                <p className='text-lg text-gray-600 flex items-center'>
                  <FaTruck className='mr-2 text-gray-500' />
                  <span>Ordered At: {new Date(order.createdAt).toLocaleDateString()}</span>
                </p>
              </div>
            </div>

            <div className='mt-4'>
              <h4 className='text-lg font-semibold text-gray-700 mb-2'>Items:</h4>
              <ul className='list-disc list-inside'>
                {order.items.map(item => (
                  <li key={item.productId} className='text-gray-600 mb-4'>
                    <p>
                      <span className='font-medium'>Product ID:</span> {item.productId}
                    </p>
                    <p>
                      <span className='font-medium'>Quantity:</span> {item.quantity}
                    </p>
                    <p>
                      <span className='font-medium'>Price:</span> ₹{item.price}
                    </p>

                    {/* Display Size and Color */}
                    {item.size && (
                      <p>
                        <span className='font-medium'>Size:</span> {item.size}
                      </p>
                    )}
                    {item.color && (
                      <p>
                        <span className='font-medium'>Color:</span>
                        <span
                          className='inline-block ml-2 w-5 h-5 rounded-full'
                          style={{ backgroundColor: item.color }}
                        ></span>{' '}
                        {/* ({item.color}) */}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrders;
