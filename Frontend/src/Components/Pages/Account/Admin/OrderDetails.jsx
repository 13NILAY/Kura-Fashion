import React from 'react';
import { FaRupeeSign, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const OrderDetails = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 pt-24 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 lg:w-1/2 max-h-[80vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#4a2c20]">Order Details</h2>

        {/* Order Info Section */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-[#4a2c20]">Order Information</h3>
          <p className="mt-2 text-[#4a2c20]"><strong>Order ID:</strong> {order._id}</p>
          <p className="text-[#4a2c20]"><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p className="text-[#4a2c20]"><strong>Order Status:</strong> {order.orderStatus}</p>
        </div>

        {/* User Info Section */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-[#4a2c20]">User Information</h3>
          <p className="mt-2 text-[#4a2c20]"><strong>Username:</strong> {order.userId.username}</p>
          <p className="text-[#4a2c20]"><strong>Email:</strong> {order.userId.email}</p>
        </div>

        {/* Payment Info Section */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-[#4a2c20]">Payment Information</h3>
          <p className="mt-2 text-[#4a2c20] flex items-center">
            <strong>Total Amount:</strong>
            <FaRupeeSign className="ml-2 mr-1" />
            {order.totalAmount}
          </p>
          <p className="text-[#4a2c20] flex items-center">
            <strong>Payment Status:</strong>
            {order.paymentStatus === 'Paid' ? (
              <FaCheckCircle className="text-green-500 ml-2" />
            ) : (
              <FaTimesCircle className="text-red-500 ml-2" />
            )}
            <span className="ml-2">{order.paymentStatus}</span>
          </p>
        </div>

        {/* Item List Section */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-[#4a2c20]">Items in this Order</h3>
          <table className="min-w-full bg-white">
            <thead className="bg-[#4a2c20] text-white">
              <tr>
                <th className="px-6 py-4 text-left">Item</th>
                <th className="px-6 py-4 text-left">Quantity</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="px-6 py-4 text-[#4a2c20]">{item.productId.name}</td>
                  <td className="px-6 py-4 text-[#4a2c20]">{item.quantity}</td>
                  <td className="px-6 py-4 text-[#4a2c20] ">
                    <FaRupeeSign className="mr-1" />
                    {item.price}
                  </td>
                  <td className="px-6 py-4 text-[#4a2c20] ">
                    <FaRupeeSign className="mr-1" />
                    {item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Close Button */}
        <div className="text-center mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
