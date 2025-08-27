import React, { useState } from 'react';
import { FaRupeeSign,  FaBoxOpen, FaStar } from 'react-icons/fa';
import img1 from '../../../../assets/trial1.jpg';

const OrderedProds = ({ 
  product = {
    name: "H&M White Hoodie",
    price: 1599,
    size: "M",
    quantity: 3,
    image: img1,
    rating: 4,
    color: "#FFFFFF"
  }
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl 
      border border-white/30 overflow-hidden transition-all duration-500 
      hover:scale-[1.02] hover:-translate-y-1 relative">
      
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#D4A373]/5 
        opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <div className="flex flex-col lg:flex-row items-center lg:items-stretch relative z-10">
        {/* Premium Image Container */}
        <div className="w-full lg:w-2/5 relative">
          <div className="aspect-square lg:aspect-auto lg:h-80 relative overflow-hidden 
            bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8]">
            
            {/* Loading placeholder */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-[#EADBC8] animate-pulse flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#D4A373]/30 border-t-[#3A2E2E] rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Error fallback */}
            {imageError && (
              <div className="absolute inset-0 bg-[#EADBC8]/60 flex items-center justify-center">
                <div className="text-center">
                  {/* <FaShirt className="text-[#3A2E2E]/40 text-4xl mb-2 mx-auto" /> */}
                  <p className="text-[#3A2E2E]/60 text-sm">Image unavailable</p>
                </div>
              </div>
            )}
            
            {/* Main product image */}
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-700 
                ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'} 
                group-hover:scale-110`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            
            {/* Premium overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#3A2E2E]/20 via-transparent to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Decorative badge */}
            <div className="absolute top-4 left-4 bg-[#3A2E2E]/80 backdrop-blur-sm text-[#D4A373] 
              px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
              Premium
            </div>
          </div>
        </div>

        {/* Premium Product Information */}
        <div className="w-full lg:w-3/5 p-8 lg:p-10 flex flex-col justify-center space-y-6">
          {/* Product header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3 className="font-headings text-[#3A2E2E] text-2xl lg:text-3xl font-semibold leading-tight 
                group-hover:text-[#D4A373] transition-colors duration-300">
                {product.name}
              </h3>
              
              {/* Rating */}
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-sm ${i < product.rating ? 'text-[#D4A373]' : 'text-[#3A2E2E]/20'}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Price with premium styling */}
            <div className="inline-flex items-center bg-gradient-to-r from-[#3A2E2E] to-[#2C2C2C] 
              text-[#D4A373] px-6 py-3 rounded-full shadow-lg">
              <FaRupeeSign className="text-lg mr-1" />
              <span className="text-2xl lg:text-3xl font-bold">{product.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Product details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Size */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[#D4A373]/20 
              shadow-sm hover:shadow-md transition-all duration-300 group-hover:bg-[#F8F5F2]/80">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#D4A373]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#3A2E2E] font-bold">{product.size}</span>
                </div>
                <div>
                  <p className="text-[#3A2E2E]/60 text-sm font-medium uppercase tracking-wide">Size</p>
                  <p className="text-[#3A2E2E] font-semibold">{product.size}</p>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[#D4A373]/20 
              shadow-sm hover:shadow-md transition-all duration-300 group-hover:bg-[#F8F5F2]/80">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#D4A373]/20 rounded-full flex items-center justify-center">
                  <FaBoxOpen className="text-[#3A2E2E] text-sm" />
                </div>
                <div>
                  <p className="text-[#3A2E2E]/60 text-sm font-medium uppercase tracking-wide">Quantity</p>
                  <p className="text-[#3A2E2E] font-semibold">{product.quantity}</p>
                </div>
              </div>
            </div>
            
            {/* Color (if available) */}
            {product.color && (
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[#D4A373]/20 
                shadow-sm hover:shadow-md transition-all duration-300 group-hover:bg-[#F8F5F2]/80 sm:col-span-2">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm" 
                      style={{ backgroundColor: product.color }}></div>
                    <div className="absolute inset-0 rounded-full border border-[#3A2E2E]/20"></div>
                  </div>
                  <div>
                    <p className="text-[#3A2E2E]/60 text-sm font-medium uppercase tracking-wide">Color</p>
                    <p className="text-[#3A2E2E] font-semibold">
                      {product.color === "#FFFFFF" ? "White" : 
                       product.color === "#000000" ? "Black" : "Custom"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Total calculation */}
          <div className="mt-6 pt-6 border-t border-[#D4A373]/20">
            <div className="bg-gradient-to-r from-[#F8F5F2] to-[#EADBC8]/50 p-4 rounded-xl 
              border border-[#D4A373]/30 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#3A2E2E]/70 font-medium">Item Total</span>
                <div className="text-2xl font-bold text-[#3A2E2E] flex items-center">
                  <FaRupeeSign className="text-lg mr-1" />
                  {(product.price * product.quantity).toLocaleString()}
                </div>
              </div>
              <div className="text-right text-sm text-[#3A2E2E]/60 mt-1">
                {product.quantity} × ₹{product.price.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Action buttons (optional) */}
          <div className="flex space-x-4 pt-4">
            <button className="flex-1 bg-[#3A2E2E] text-[#EADBC8] py-3 px-6 rounded-full 
              font-semibold hover:bg-[#2C2C2C] transition-all duration-300 
              hover:shadow-lg hover:scale-105 transform">
              View Details
            </button>
            <button className="px-6 py-3 border-2 border-[#D4A373] text-[#3A2E2E] rounded-full 
              font-semibold hover:bg-[#D4A373] hover:text-white transition-all duration-300 
              hover:shadow-lg hover:scale-105 transform">
              Reorder
            </button>
          </div>
        </div>
      </div>

      {/* Premium shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent 
          skew-x-12 animate-shine"></div>
      </div>
      
      {/* CSS Animation */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(12deg); }
          100% { transform: translateX(200%) skewX(12deg); }
        }
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default OrderedProds;