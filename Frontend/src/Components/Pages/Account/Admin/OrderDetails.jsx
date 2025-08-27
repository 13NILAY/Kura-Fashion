import React, { useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmailIcon from '@mui/icons-material/Email';

const OrderDetails = ({ order, onClose }) => {
  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!order) return null;

  const getOrderStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusIcon = (status) => {
    return status === 'Paid' ? (
      <CheckCircleIcon className="text-green-500" />
    ) : (
      <CancelIcon className="text-red-500" />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3A2E2E]/80 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl 
        w-full max-w-4xl max-h-[90vh] overflow-hidden border border-[#D4A373]/20
        animate-modal-enter">
        
        {/* Decorative Header Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-[#3A2E2E] via-[#D4A373] to-[#3A2E2E] opacity-10"></div>
        
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-[#D4A373]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#D4A373]/20 rounded-full flex items-center justify-center">
                <ShoppingBagIcon className="text-[#3A2E2E] text-xl" />
              </div>
              <div>
                <h2 className="font-headings text-[#3A2E2E] text-2xl sm:text-3xl font-light">
                  Order Details
                </h2>
                <p className="text-[#3A2E2E]/60 text-sm">
                  Complete order information and status
                </p>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 bg-[#3A2E2E]/10 hover:bg-[#3A2E2E]/20 rounded-full 
                flex items-center justify-center transition-all duration-300 
                hover:scale-110 group"
            >
              <CloseIcon className="text-[#3A2E2E] group-hover:text-[#D4A373] transition-colors" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] px-8 py-6">
          <div className="space-y-8">
            
            {/* Order Status Banner */}
            <div className="bg-gradient-to-r from-[#F8F5F2] to-[#EADBC8] rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-[#3A2E2E]/10 rounded-full flex items-center justify-center">
                    <LocalShippingIcon className="text-[#3A2E2E] text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-headings text-[#3A2E2E] text-xl font-semibold">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <CalendarTodayIcon className="text-[#D4A373] text-sm" />
                      <span className="text-[#3A2E2E]/70 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className={`px-4 py-2 rounded-full border font-medium text-sm ${getOrderStatusColor(order.orderStatus)}`}>
                  {order.orderStatus.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Customer Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#D4A373]/10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-[#D4A373]/20 rounded-full flex items-center justify-center">
                    <PersonIcon className="text-[#3A2E2E]" />
                  </div>
                  <h3 className="font-headings text-[#3A2E2E] text-lg font-semibold">
                    Customer Information
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-[#D4A373]/10">
                    <span className="text-[#3A2E2E]/70 font-medium">Customer Name</span>
                    <span className="text-[#3A2E2E] font-semibold">
                      {order.userId.username}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <span className="text-[#3A2E2E]/70 font-medium flex items-center">
                      <EmailIcon className="mr-2 text-sm" />
                      Email Address
                    </span>
                    <span className="text-[#3A2E2E] font-semibold text-sm">
                      {order.userId.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#D4A373]/10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-[#D4A373]/20 rounded-full flex items-center justify-center">
                    <PaymentIcon className="text-[#3A2E2E]" />
                  </div>
                  <h3 className="font-headings text-[#3A2E2E] text-lg font-semibold">
                    Payment Details
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-[#D4A373]/10">
                    <span className="text-[#3A2E2E]/70 font-medium">Total Amount</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-[#3A2E2E] text-lg font-bold">
                        ₹{order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <span className="text-[#3A2E2E]/70 font-medium">Payment Status</span>
                    <div className="flex items-center space-x-2">
                      {getPaymentStatusIcon(order.paymentStatus)}
                      <span className={`font-semibold ${
                        order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#D4A373]/10 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-[#3A2E2E] to-[#2C2C2C] text-[#EADBC8]">
                <h3 className="font-headings text-lg font-semibold flex items-center">
                  <ShoppingBagIcon className="mr-3" />
                  Order Items ({order.items.length})
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F8F5F2]">
                    <tr>
                      <th className="px-6 py-4 text-left text-[#3A2E2E] font-semibold">Product</th>
                      <th className="px-6 py-4 text-center text-[#3A2E2E] font-semibold">Quantity</th>
                      <th className="px-6 py-4 text-right text-[#3A2E2E] font-semibold">Unit Price</th>
                      <th className="px-6 py-4 text-right text-[#3A2E2E] font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={item._id} className={`border-b border-[#D4A373]/10 hover:bg-[#F8F5F2]/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white/50' : 'bg-[#F8F5F2]/30'
                      }`}>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-[#3A2E2E]">
                            {item.productId.name}
                          </div>
                          {item.size && (
                            <div className="text-sm text-[#3A2E2E]/60 mt-1">
                              Size: {item.size}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-[#D4A373]/20 text-[#3A2E2E] rounded-full font-semibold">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-[#3A2E2E] font-semibold">
                          ₹{item.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right text-[#3A2E2E] font-bold">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#3A2E2E]/5">
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-right font-bold text-[#3A2E2E] text-lg">
                        Order Total:
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-[#3A2E2E] text-xl">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-[#D4A373]/20 bg-[#F8F5F2]/50">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="group inline-flex items-center px-8 py-3 
                bg-[#3A2E2E] text-[#EADBC8] font-semibold rounded-full 
                transition-all duration-300 hover:bg-[#2C2C2C] hover:shadow-lg 
                transform hover:scale-105"
            >
              <span className="mr-2">Close Details</span>
              <CloseIcon className="text-lg transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop - click to close */}
      <div 
        className="absolute inset-0 -z-10"
        onClick={onClose}
      ></div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes modal-enter {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-enter {
          animation: modal-enter 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default OrderDetails;