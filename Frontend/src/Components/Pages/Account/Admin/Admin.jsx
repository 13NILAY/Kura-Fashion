import React from 'react';
import { Link } from 'react-router-dom';
import orders from '../../../../assets/Orders.jpg';
import addProd from '../../../../assets/addProduct.png';
import addCategory from '../../../../assets/addCategory.png';

const Admin = () => {
  const adminCards = [
    {
      to: '/account/admin/addCategory',
      image: addCategory,
      title: 'Add New Category',
      description: 'Create categories for new product collections',
      icon: '🏷️',
      gradient: 'from-[#D4A373]/20 to-[#3A2E2E]/10'
    },
    {
      to: '/account/admin/addProducts',
      image: addProd,
      title: 'Add Products',
      description: 'Add premium products to your collection',
      icon: '✨',
      gradient: 'from-[#3A2E2E]/20 to-[#D4A373]/10'
    },
    {
      to: '/account/admin/trackOrders',
      image: orders,
      title: 'Manage Orders',
      description: 'Track and manage all customer orders',
      icon: '📦',
      gradient: 'from-[#EADBC8]/30 to-[#D4A373]/20'
    },
    {
      to: '/account/admin/addSlider',
      image: orders,
      title: 'Homepage Sliders',
      description: 'Update featured collections and banners',
      icon: '🎨',
      gradient: 'from-[#D4A373]/30 to-[#3A2E2E]/15'
    },
    {
      to: '/account/admin/addCoupon',
      image: orders,
      title: 'Coupon Management',
      description: 'Create discount codes and manage delivery charges',
      icon: '🎫',
      gradient: 'from-[#3A2E2E]/25 to-[#EADBC8]/20'
    },
    {
      to: '/account/admin/addBanner',
      image: orders,
      title: 'Banner Management',
      description: 'Update promotional banners and campaigns',
      icon: '🖼️',
      gradient: 'from-[#EADBC8]/25 to-[#D4A373]/15'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] via-[#EADBC8] to-[#D4A373]/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-[#D4A373]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#3A2E2E]/5 rounded-full blur-3xl animate-pulse" 
        style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#D4A373]/5 rounded-full blur-2xl animate-bounce" 
        style={{animationDuration: '4s', animationDelay: '1s'}}></div>
      
      <div className="pt-32 pb-16 px-4 sm:px-8 relative">
        <div className="container mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-[#D4A373]"></div>
              <span className="mx-4 text-[#3A2E2E]/60 text-sm font-semibold tracking-[0.2em] uppercase">
                Admin Dashboard
              </span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-[#D4A373]"></div>
            </div>
            
            <h1 className="font-headings text-[#3A2E2E] text-5xl sm:text-6xl lg:text-7xl font-light mb-6 leading-tight">
              KURA
              <span className="block text-[#D4A373] font-normal">Management</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-[#3A2E2E]/70 max-w-3xl mx-auto leading-relaxed">
              Manage your premium fashion empire with sophisticated tools designed for excellence. 
              Control every aspect of your luxury brand from this central hub.
            </p>
          </div>

          {/* Admin Cards Grid */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 lg:gap-10">
            {adminCards.map((card, index) => (
              <Link 
                key={index}
                to={card.to} 
                className="group block relative"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 
                  shadow-xl hover:shadow-2xl border border-white/40 
                  transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2 
                  overflow-hidden group-hover:bg-white/90">
                  
                  {/* Card gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
                  
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#D4A373]/20 to-transparent 
                    rounded-tr-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    {/* Icon and Image Section */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="relative">
                        <img 
                          src={card.image} 
                          className="h-20 w-20 sm:h-24 sm:w-24 object-contain p-2 rounded-2xl 
                            bg-gradient-to-br from-[#EADBC8]/30 to-[#D4A373]/20 
                            shadow-lg group-hover:shadow-xl transition-all duration-300 
                            group-hover:scale-110 group-hover:rotate-2" 
                          alt={card.title}
                        />
                        <div className="absolute -inset-1 bg-gradient-to-br from-[#D4A373]/20 to-transparent 
                          rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      
                      <div className="text-4xl group-hover:scale-125 transition-transform duration-300">
                        {card.icon}
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="space-y-4">
                      <h3 className="font-headings text-[#3A2E2E] text-2xl font-bold leading-tight 
                        group-hover:text-[#D4A373] transition-colors duration-300">
                        {card.title}
                      </h3>
                      
                      <p className="text-[#3A2E2E]/70 font-texts text-base leading-relaxed 
                        group-hover:text-[#3A2E2E]/90 transition-colors duration-300">
                        {card.description}
                      </p>
                    </div>
                    
                    {/* Action Arrow */}
                    <div className="flex items-center justify-end mt-8">
                      <div className="w-12 h-12 bg-[#3A2E2E] text-[#EADBC8] rounded-full 
                        flex items-center justify-center transition-all duration-300 
                        group-hover:bg-[#D4A373] group-hover:scale-110 group-hover:shadow-lg">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Premium shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent 
                    via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000 
                    skew-x-12 rounded-3xl"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Statistics Section */}
          <div className="mt-20 p-8 bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl border border-white/40">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="group">
                <div className="text-4xl font-headings font-bold text-[#3A2E2E] mb-2">
                  <span className="bg-gradient-to-r from-[#3A2E2E] to-[#D4A373] bg-clip-text text-transparent">
                    24/7
                  </span>
                </div>
                <p className="text-[#3A2E2E]/70 font-texts">System Monitoring</p>
              </div>
              
              <div className="group">
                <div className="text-4xl font-headings font-bold text-[#3A2E2E] mb-2">
                  <span className="bg-gradient-to-r from-[#D4A373] to-[#3A2E2E] bg-clip-text text-transparent">
                    100%
                  </span>
                </div>
                <p className="text-[#3A2E2E]/70 font-texts">Secure Management</p>
              </div>
              
              <div className="group">
                <div className="text-4xl font-headings font-bold text-[#3A2E2E] mb-2">
                  <span className="bg-gradient-to-r from-[#3A2E2E] to-[#D4A373] bg-clip-text text-transparent">
                    ∞
                  </span>
                </div>
                <p className="text-[#3A2E2E]/70 font-texts">Possibilities</p>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mt-16 text-center">
            <h3 className="font-headings text-[#3A2E2E] text-3xl font-light mb-8">
              Need Help?
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="mailto:admin@kurafashion.com" 
                className="inline-flex items-center px-8 py-4 bg-[#3A2E2E] text-[#EADBC8] 
                  font-semibold font-headings rounded-full transition-all duration-300 
                  hover:bg-[#2C2C2C] hover:shadow-xl hover:shadow-[#3A2E2E]/30 
                  transform hover:scale-105"
              >
                <span className="mr-3">📧</span>
                Contact Support
              </a>
              
              <Link 
                to="/admin/documentation" 
                className="text-[#3A2E2E] font-medium hover:text-[#D4A373] 
                  transition-colors duration-300 border-b-2 border-transparent 
                  hover:border-[#D4A373] pb-1"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
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
      `}</style>
    </div>
  );
};

export default Admin;