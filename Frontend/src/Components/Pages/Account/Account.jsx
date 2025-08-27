import React, { useState, useEffect } from 'react';
import ScrollToTop from '../../../ScrollToTop';
import { Link } from 'react-router-dom';
import Login from '../../SignIn/Login';
import useLogout from '../../../hooks/useLogout';
import useAuth from '../../../hooks/useAuth';

// Import Material UI icons for better consistency
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';

const Account = () => {
  const logout = useLogout();
  const { auth } = useAuth();
  const [loggedin, setLoggedin] = useState(false);
  const [adminLogin, setAdminLogin] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (auth && auth.isAuthenticated) {
      setLoggedin(true);
    }
    if (auth && auth.roles && auth.roles.includes(5150)) {
      setAdminLogin(true);
    }
  }, [auth]);

  const handleClick = async () => {
    setIsLoggingOut(true);
    await logout();
    setLoggedin(false);
    setIsLoggingOut(false);
  };

  // Account menu items
  const accountItems = [
    {
      id: 'orders',
      title: 'Your Orders',
      description: 'Track packages, view order history & manage returns',
      icon: ShoppingBagOutlinedIcon,
      link: '/account/my-orders',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'profile',
      title: 'Profile & Security',
      description: 'Manage your personal information & security settings',
      icon: PersonOutlineOutlinedIcon,
      link: '/account/profile',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      id: 'address',
      title: 'Address Book',
      description: 'Manage delivery addresses for orders & gifts',
      icon: LocationOnOutlinedIcon,
      link: '/account/address',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      id: 'wishlist',
      title: 'Wishlist',
      description: 'View your saved items & favorites',
      icon: FavoriteBorderOutlinedIcon,
      link: '/account/wishlist',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600'
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      description: 'Manage cards, wallets & payment preferences',
      icon: PaymentOutlinedIcon,
      link: '/account/payment-methods',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure alerts, emails & promotional updates',
      icon: NotificationsOutlinedIcon,
      link: '/account/notifications',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    }
  ];

  return (
    <>
      <ScrollToTop />
      {!loggedin && <Login />}

      {loggedin && (
        <div className="mt-20 px-4 sm:px-8 pt-8 sm:pt-12 pb-16 bg-gradient-to-br from-[#F8F5F2] via-[#EADBC8] to-[#D4A373]/20 relative overflow-hidden min-h-screen">
          {/* Decorative background elements */}
          <div className="absolute top-20 left-10 w-40 h-40 bg-[#D4A373]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#3A2E2E]/5 rounded-full blur-3xl animate-pulse" 
            style={{animationDelay: '2s'}}></div>
          
          <div className="max-w-6xl mx-auto relative">
            {/* Header Section */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-0.5 bg-[#D4A373]"></div>
                <span className="mx-4 text-[#3A2E2E]/60 text-sm font-medium tracking-widest uppercase">
                  Welcome Back
                </span>
                <div className="w-16 h-0.5 bg-[#D4A373]"></div>
              </div>
              
              <h1 className="font-headings text-[#3A2E2E] text-4xl sm:text-5xl lg:text-6xl font-light mb-4">
                Your
                <span className="block text-[#D4A373] font-normal">Account</span>
              </h1>
              
              {/* User greeting */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto shadow-lg border border-white/30">
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4A373] to-[#3A2E2E] rounded-full flex items-center justify-center">
                    <PersonOutlineOutlinedIcon className="text-white text-xl" />
                  </div>
                  <div className="text-left">
                    <p className="text-[#3A2E2E] font-semibold text-lg">
                      Hello, {auth.user?.firstName || 'Valued Customer'}!
                    </p>
                    <p className="text-[#3A2E2E]/60 text-sm">
                      Manage your premium fashion experience
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg border border-white/30 
                hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 
                  group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBagOutlinedIcon className="text-blue-600" />
                </div>
                <h3 className="font-headings text-[#3A2E2E] text-xl font-semibold mb-2">Total Orders</h3>
                <p className="text-2xl font-bold text-blue-600">12</p>
              </div>

              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg border border-white/30 
                hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 
                  group-hover:scale-110 transition-transform duration-300">
                  <FavoriteBorderOutlinedIcon className="text-emerald-600" />
                </div>
                <h3 className="font-headings text-[#3A2E2E] text-xl font-semibold mb-2">Wishlist Items</h3>
                <p className="text-2xl font-bold text-emerald-600">8</p>
              </div>

              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg border border-white/30 
                hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 
                  group-hover:scale-110 transition-transform duration-300">
                  <SecurityOutlinedIcon className="text-orange-600" />
                </div>
                <h3 className="font-headings text-[#3A2E2E] text-xl font-semibold mb-2">Member Since</h3>
                <p className="text-lg font-bold text-orange-600">2024</p>
              </div>
            </div>

            {/* Account Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {accountItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="group block transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.8s ease-out forwards'
                    }}
                  >
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl 
                      border border-white/30 transition-all duration-500 h-full relative overflow-hidden
                      before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent 
                      before:to-[#D4A373]/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500">
                      
                      {/* Premium gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none"></div>
                      
                      <div className="relative">
                        {/* Icon */}
                        <div className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center mb-6 
                          group-hover:scale-110 transition-all duration-300 shadow-md group-hover:shadow-lg`}>
                          <IconComponent className={`text-2xl ${item.iconColor}`} />
                        </div>

                        {/* Content */}
                        <h3 className="font-headings text-[#3A2E2E] text-xl font-semibold mb-3 
                          group-hover:text-[#D4A373] transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-[#3A2E2E]/70 font-texts text-sm leading-relaxed mb-4">
                          {item.description}
                        </p>

                        {/* Arrow indicator */}
                        <div className="flex items-center text-[#D4A373] opacity-0 group-hover:opacity-100 
                          transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                          <span className="text-sm font-medium mr-2">Access</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Premium shine effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                          skew-x-12 animate-shine"></div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Admin & Logout Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Admin Panel */}
              {adminLogin && (
                <Link
                  to="/account/admin"
                  className="group block transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2"
                >
                  <div className="bg-gradient-to-br from-[#3A2E2E] to-[#2C2C2C] text-white rounded-2xl p-6 
                    shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                    
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-[#D4A373]/10 rounded-full blur-2xl"></div>
                    
                    <div className="relative">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-[#D4A373]/20 rounded-xl flex items-center justify-center mr-4 
                          group-hover:scale-110 transition-transform duration-300">
                          <AdminPanelSettingsOutlinedIcon className="text-[#D4A373] text-xl" />
                        </div>
                        <div>
                          <h3 className="font-headings text-xl font-semibold mb-1">Admin Dashboard</h3>
                          <p className="text-[#EADBC8]/80 text-sm">Manage store, orders & analytics</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-[#D4A373] opacity-0 group-hover:opacity-100 
                        transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                        <span className="text-sm font-medium mr-2">Access Panel</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Logout Button */}
              <button
                onClick={handleClick}
                disabled={isLoggingOut}
                className="group block w-full transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl 
                  border-2 border-red-200 hover:border-red-300 transition-all duration-500 
                  hover:bg-red-50/80 relative overflow-hidden">
                  
                  <div className="relative">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4 
                        group-hover:scale-110 transition-transform duration-300">
                        <LogoutOutlinedIcon className={`text-xl ${isLoggingOut ? 'animate-spin' : ''} text-red-600`} />
                      </div>
                      <div>
                        <h3 className="font-headings text-[#3A2E2E] text-xl font-semibold mb-1 group-hover:text-red-700">
                          {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                        </h3>
                        <p className="text-[#3A2E2E]/70 text-sm">Secure logout from your account</p>
                      </div>
                    </div>
                    
                    {!isLoggingOut && (
                      <div className="flex items-center text-red-600 opacity-0 group-hover:opacity-100 
                        transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                        <span className="text-sm font-medium mr-2">Sign Out</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>

            {/* Support Section */}
            <div className="mt-16 text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto shadow-lg border border-white/30">
                <h3 className="font-headings text-[#3A2E2E] text-2xl font-semibold mb-4">
                  Need Help?
                </h3>
                <p className="text-[#3A2E2E]/70 font-texts mb-6 leading-relaxed">
                  Our premium customer service team is here to assist you with any questions 
                  about your orders, account, or our collections.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/support"
                    className="px-6 py-3 bg-[#3A2E2E] text-[#EADBC8] rounded-xl font-medium 
                      hover:bg-[#2C2C2C] transition-all duration-300 transform hover:scale-105"
                  >
                    Contact Support
                  </Link>
                  <Link
                    to="/faq"
                    className="px-6 py-3 border-2 border-[#D4A373] text-[#3A2E2E] rounded-xl font-medium 
                      hover:bg-[#D4A373] hover:text-white transition-all duration-300 transform hover:scale-105"
                  >
                    View FAQ
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* CSS Animation styles */}
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
            @keyframes shine {
              0% { transform: translateX(-100%) skewX(12deg); }
              100% { transform: translateX(200%) skewX(12deg); }
            }
            .animate-shine {
              animation: shine 2s ease-in-out infinite;
              animation-delay: 1s;
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default Account;