import React, { useState, useEffect } from 'react';
import { Users, ShoppingCart, CreditCard, Package, Calendar, Eye, ChevronDown, ChevronUp, 
         CheckCircle, XCircle, Clock, Truck, AlertTriangle } from 'lucide-react';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import OrderDetails from './OrderDetails';

const TrackOrder = () => {
  const axiosPrivate = useAxiosPrivate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  const [groupedOrders, setGroupedOrders] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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

  // Get status configuration
  const getStatusConfig = (status) => {
    const configs = {
      'Pending': { 
        icon: Clock, 
        color: 'bg-orange-100 text-orange-700 border-orange-200',
        iconColor: 'text-orange-600' 
      },
      'Processing': { 
        icon: Package, 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        iconColor: 'text-blue-600' 
      },
      'Shipped': { 
        icon: Truck, 
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        iconColor: 'text-purple-600' 
      },
      'Delivered': { 
        icon: CheckCircle, 
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        iconColor: 'text-emerald-600' 
      },
      'Cancelled': { 
        icon: XCircle, 
        color: 'bg-red-100 text-red-700 border-red-200',
        iconColor: 'text-red-600' 
      }
    };
    return configs[status] || configs['Pending'];
  };

  // Stats Card Component
  const StatCard = ({ title, value, icon: Icon, gradient, bgColor }) => (
    <div className={`relative overflow-hidden rounded-3xl p-8 transition-all duration-500 
      hover:scale-105 hover:-translate-y-1 group cursor-pointer ${gradient}`}>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 
        transition-transform duration-700 group-hover:scale-150 group-hover:rotate-45"></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-2 tracking-wide uppercase">{title}</p>
          <p className="text-3xl font-headings font-bold text-white">{value}</p>
        </div>
        <div className={`w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center 
          transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg`}>
          <Icon className="w-8 h-8 text-[#3A2E2E]" />
        </div>
      </div>
    </div>
  );

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] relative overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#D4A373]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#3A2E2E]/5 rounded-full blur-3xl animate-pulse" 
          style={{animationDelay: '2s'}}></div>
        
        <div className="relative pt-24 px-4 sm:px-8">
          <div className="container mx-auto text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-[#D4A373]/30 border-t-[#3A2E2E] rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-[#D4A373] rounded-full animate-spin mx-auto" 
                style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
            <h2 className="text-2xl font-headings text-[#3A2E2E] mb-4">Loading Order Dashboard...</h2>
            <p className="text-[#3A2E2E]/70">Fetching your premium order data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-[#D4A373]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#3A2E2E]/5 rounded-full blur-3xl animate-pulse" 
        style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#D4A373]/5 rounded-full blur-2xl animate-pulse" 
        style={{animationDelay: '4s'}}></div>

      <div className="relative pt-24 px-4 sm:px-8 pb-16">
        <div className="container mx-auto max-w-7xl">
          
          {/* Dashboard Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-0.5 bg-[#D4A373]"></div>
              <span className="mx-4 text-[#3A2E2E]/60 text-sm font-medium tracking-widest uppercase">
                Admin Dashboard
              </span>
              <div className="w-16 h-0.5 bg-[#D4A373]"></div>
            </div>
            
            <h1 className="font-headings text-[#3A2E2E] text-4xl lg:text-6xl font-light mb-6 leading-tight">
              Order Management
              <span className="block text-[#D4A373] font-normal">Dashboard</span>
            </h1>
            
            <p className="text-lg text-[#3A2E2E]/70 max-w-2xl mx-auto leading-relaxed">
              Monitor and manage your premium fashion orders with sophisticated analytics and controls
            </p>
          </div>

          {/* Premium Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
            <StatCard 
              title="Active Customers"
              value={stats.totalUsers}
              icon={Users}
              gradient="bg-gradient-to-br from-[#3A2E2E] to-[#2C2C2C]"
              bgColor="bg-[#D4A373]/20"
            />
            <StatCard 
              title="Total Revenue"
              value={`₹${stats.totalPayments.toLocaleString()}`}
              icon={CreditCard}
              gradient="bg-gradient-to-br from-[#D4A373] to-[#C19B6B]"
              bgColor="bg-white/30"
            />
            <StatCard 
              title="Today's Sales"
              value={`₹${stats.todayPayments.toLocaleString()}`}
              icon={Calendar}
              gradient="bg-gradient-to-br from-[#B8860B] to-[#D4A373]"
              bgColor="bg-white/30"
            />
            <StatCard 
              title="Items Sold"
              value={stats.totalItems}
              icon={Package}
              gradient="bg-gradient-to-br from-[#8B4513] to-[#3A2E2E]"
              bgColor="bg-[#EADBC8]/40"
            />
          </div>

          {/* Orders Section */}
          <div className="space-y-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-headings text-[#3A2E2E] font-semibold mb-4">
                Customer Orders
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#D4A373] to-[#3A2E2E] rounded-full mx-auto"></div>
            </div>

            {Object.entries(groupedOrders)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([username, userOrders]) => {
                const isExpanded = expandedUsers.has(username);
                const userStats = {
                  totalOrders: userOrders.length,
                  totalSpent: userOrders.reduce((sum, order) => sum + order.totalAmount, 0),
                  lastOrder: new Date(Math.max(...userOrders.map(o => new Date(o.createdAt)))).toLocaleDateString()
                };

                return (
                  <div key={username} 
                    className="bg-white/70 backdrop-blur-md rounded-3xl overflow-hidden 
                      shadow-xl border border-white/40 transition-all duration-500 
                      hover:shadow-2xl hover:scale-[1.01]">
                    
                    {/* User Header */}
                    <div 
                      onClick={() => toggleUserExpand(username)}
                      className="bg-gradient-to-r from-[#3A2E2E] to-[#2C2C2C] text-[#EADBC8] 
                        p-6 flex justify-between items-center cursor-pointer 
                        hover:from-[#2C2C2C] hover:to-[#3A2E2E] transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-6">
                        {/* User Avatar */}
                        <div className="w-12 h-12 bg-[#D4A373] rounded-full flex items-center justify-center 
                          shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Users className="w-6 h-6 text-[#3A2E2E]" />
                        </div>
                        
                        {/* User Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-2 sm:space-y-0">
                          <h3 className="text-xl font-headings font-semibold">{username}</h3>
                          
                          {/* User Stats */}
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center bg-[#D4A373]/20 text-[#D4A373] 
                              px-3 py-1 rounded-full font-medium">
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              {userStats.totalOrders} orders
                            </span>
                            <span className="flex items-center bg-[#EADBC8]/20 text-[#EADBC8] 
                              px-3 py-1 rounded-full font-medium">
                              ₹{userStats.totalSpent.toLocaleString()}
                            </span>
                            <span className="flex items-center bg-[#EADBC8]/20 text-[#EADBC8] 
                              px-3 py-1 rounded-full font-medium">
                              <Calendar className="w-4 h-4 mr-1" />
                              {userStats.lastOrder}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Expand Icon */}
                      <div className="transform transition-transform duration-300 group-hover:scale-110">
                        {isExpanded ? 
                          <ChevronUp className="w-6 h-6" /> : 
                          <ChevronDown className="w-6 h-6" />
                        }
                      </div>
                    </div>

                    {/* Orders Table */}
                    {isExpanded && (
                      <div className="p-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden 
                          shadow-lg border border-white/50">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-gradient-to-r from-[#3A2E2E]/5 to-[#D4A373]/5">
                                  <th className="px-6 py-4 text-left text-[#3A2E2E] font-headings font-semibold">
                                    Order ID
                                  </th>
                                  <th className="px-6 py-4 text-left text-[#3A2E2E] font-headings font-semibold">
                                    Amount
                                  </th>
                                  <th className="px-6 py-4 text-left text-[#3A2E2E] font-headings font-semibold">
                                    Payment
                                  </th>
                                  <th className="px-6 py-4 text-left text-[#3A2E2E] font-headings font-semibold">
                                    Date
                                  </th>
                                  <th className="px-6 py-4 text-left text-[#3A2E2E] font-headings font-semibold">
                                    Status
                                  </th>
                                  <th className="px-6 py-4 text-left text-[#3A2E2E] font-headings font-semibold">
                                    Update
                                  </th>
                                  <th className="px-6 py-4 text-left text-[#3A2E2E] font-headings font-semibold">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {userOrders.map((order, index) => {
                                  const statusConfig = getStatusConfig(order.orderStatus);
                                  const StatusIcon = statusConfig.icon;
                                  
                                  return (
                                    <tr key={order._id} 
                                      className="border-b border-[#D4A373]/10 hover:bg-[#D4A373]/5 
                                        transition-colors duration-200"
                                      style={{
                                        animationDelay: `${index * 50}ms`,
                                        animation: 'fadeInUp 0.5s ease-out forwards'
                                      }}>
                                      
                                      {/* Order ID */}
                                      <td className="px-6 py-4">
                                        <span className="text-[#3A2E2E] font-mono text-sm bg-[#D4A373]/10 
                                          px-3 py-1 rounded-lg">
                                          {order._id.slice(-8)}
                                        </span>
                                      </td>
                                      
                                      {/* Amount */}
                                      <td className="px-6 py-4">
                                        <span className="text-[#3A2E2E] font-semibold text-lg">
                                          ₹{order.totalAmount.toLocaleString()}
                                        </span>
                                      </td>
                                      
                                      {/* Payment Status */}
                                      <td className="px-6 py-4">
                                        {order.paymentStatus === 'Paid' ? (
                                          <div className="flex items-center text-emerald-600">
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            <span className="font-medium">Paid</span>
                                          </div>
                                        ) : (
                                          <div className="flex items-center text-red-600">
                                            <XCircle className="w-5 h-5 mr-2" />
                                            <span className="font-medium">Pending</span>
                                          </div>
                                        )}
                                      </td>
                                      
                                      {/* Date */}
                                      <td className="px-6 py-4 text-[#3A2E2E]/70">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric'
                                        })}
                                      </td>
                                      
                                      {/* Status Badge */}
                                      <td className="px-6 py-4">
                                        <div className={`inline-flex items-center px-4 py-2 rounded-xl 
                                          text-sm font-medium border ${statusConfig.color}`}>
                                          <StatusIcon className={`w-4 h-4 mr-2 ${statusConfig.iconColor}`} />
                                          {order.orderStatus}
                                        </div>
                                      </td>
                                      
                                      {/* Status Update */}
                                      <td className="px-6 py-4">
                                        <select
                                          value={order.orderStatus}
                                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                          className="px-4 py-2 bg-white/80 border-2 border-[#D4A373]/30 
                                            rounded-xl text-[#3A2E2E] focus:border-[#D4A373] 
                                            focus:outline-none focus:ring-4 focus:ring-[#D4A373]/20
                                            transition-all duration-300"
                                        >
                                          <option value="Pending">Pending</option>
                                          <option value="Processing">Processing</option>
                                          <option value="Shipped">Shipped</option>
                                          <option value="Delivered">Delivered</option>
                                          <option value="Cancelled">Cancelled</option>
                                        </select>
                                      </td>
                                      
                                      {/* Actions */}
                                      <td className="px-6 py-4">
                                        <button
                                          onClick={() => handleViewDetails(order)}
                                          className="group flex items-center bg-[#3A2E2E] text-[#EADBC8] 
                                            px-4 py-2 rounded-xl hover:bg-[#2C2C2C] 
                                            transition-all duration-300 transform hover:scale-105 
                                            shadow-md hover:shadow-lg font-medium"
                                        >
                                          <Eye className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                                          View Details
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            
            {/* Empty State */}
            {Object.keys(groupedOrders).length === 0 && (
              <div className="text-center py-20">
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-16 max-w-lg mx-auto 
                  shadow-xl border border-white/30">
                  <ShoppingCart className="w-20 h-20 text-[#D4A373] mx-auto mb-6" />
                  <h3 className="text-2xl font-headings text-[#3A2E2E] mb-4">No Orders Yet</h3>
                  <p className="text-[#3A2E2E]/70 leading-relaxed">
                    Your premium fashion orders will appear here once customers start shopping
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={handleCloseDetails}
        />
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TrackOrder;