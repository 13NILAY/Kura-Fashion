import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const SingleProduct = ({ product, className = '' }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view functionality can be added here
    console.log('Quick view for:', product.name);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart functionality can be added here
    console.log('Add to cart:', product.name);
  };

  return (
    <Link 
      to={`/shop/${product._id}`}
      className={`group block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden 
        shadow-lg hover:shadow-2xl border border-white/30 
        transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent 
        before:to-[#D4A373]/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500">
        
        {/* Product Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8]">
          {/* Image Loading Placeholder */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-[#EADBC8] animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-[#D4A373]/30 border-t-[#3A2E2E] rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Main Product Image */}
          <img 
            src={product.frontPicture} 
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 
              ${isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'} 
              group-hover:scale-110`}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#3A2E2E]/20 via-transparent to-transparent 
            opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Action Buttons Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center gap-3 
            transition-all duration-500 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            
            {/* Quick View Button */}
            <button
              onClick={handleQuickView}
              className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full 
                flex items-center justify-center text-[#3A2E2E] 
                hover:bg-[#3A2E2E] hover:text-[#EADBC8] 
                transition-all duration-300 transform hover:scale-110 
                shadow-lg hover:shadow-xl"
            >
              <VisibilityOutlinedIcon className="text-xl" />
            </button>
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-12 h-12 bg-[#D4A373]/90 backdrop-blur-sm rounded-full 
                flex items-center justify-center text-[#3A2E2E] 
                hover:bg-[#3A2E2E] hover:text-[#EADBC8] 
                transition-all duration-300 transform hover:scale-110 
                shadow-lg hover:shadow-xl"
            >
              <ShoppingBagOutlinedIcon className="text-xl" />
            </button>
          </div>
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full 
              flex items-center justify-center transition-all duration-300 
              hover:bg-white hover:scale-110 shadow-md hover:shadow-lg z-10"
          >
            {isWishlisted ? (
              <FavoriteIcon className="text-red-500 text-xl" />
            ) : (
              <FavoriteBorderIcon className="text-[#3A2E2E] text-xl hover:text-red-500" />
            )}
          </button>
          
          {/* Sale Badge (if applicable) */}
          {product.onSale && (
            <div className="absolute top-4 left-4 bg-[#3A2E2E] text-[#EADBC8] 
              px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Sale
            </div>
          )}
          
          {/* New Badge (if applicable) */}
          {product.isNew && (
            <div className="absolute top-4 left-4 bg-[#D4A373] text-[#3A2E2E] 
              px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              New
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="p-6 space-y-4">
          {/* Product Category */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#3A2E2E]/60 font-medium uppercase tracking-widest">
              {product.category || 'Fashion'}
            </span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon 
                  key={i}
                  className={`text-lg transition-colors duration-200 ${
                    i < (product.rating || 5) 
                      ? 'text-[#D4A373]' 
                      : 'text-[#3A2E2E]/20'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Product Name */}
          <h3 className="font-headings text-[#3A2E2E] text-xl font-semibold leading-tight 
            line-clamp-2 group-hover:text-[#D4A373] transition-colors duration-300">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-texts text-[#3A2E2E] text-xl font-bold">
                ₹{product.cost.value.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.cost.value && (
                <span className="text-[#3A2E2E]/50 text-sm line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            {/* Discount Percentage */}
            {product.originalPrice && product.originalPrice > product.cost.value && (
              <span className="bg-[#D4A373]/20 text-[#3A2E2E] px-2 py-1 rounded-full text-xs font-bold">
                {Math.round(((product.originalPrice - product.cost.value) / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Product Description Preview */}
          {product.description && (
            <p className="text-[#3A2E2E]/70 text-sm line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Size/Color Options Preview */}
          <div className="flex items-center justify-between pt-2">
            {/* Size indicators */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-xs text-[#3A2E2E]/60">Sizes:</span>
                {product.sizes.slice(0, 3).map((size, index) => (
                  <span key={index} className="w-6 h-6 border border-[#3A2E2E]/20 rounded text-xs 
                    flex items-center justify-center text-[#3A2E2E]/70">
                    {size}
                  </span>
                ))}
                {product.sizes.length > 3 && (
                  <span className="text-xs text-[#3A2E2E]/60">+{product.sizes.length - 3}</span>
                )}
              </div>
            )}
            
            {/* Color indicators */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center space-x-1">
                {product.colors.slice(0, 3).map((color, index) => (
                  <div key={index} 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{backgroundColor: color}}
                  ></div>
                ))}
                {product.colors.length > 3 && (
                  <span className="text-xs text-[#3A2E2E]/60">+{product.colors.length - 3}</span>
                )}
              </div>
            )}
          </div>

          {/* Quick Action Button */}
          <div className={`pt-4 transition-all duration-500 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <button 
              onClick={handleAddToCart}
              className="w-full bg-[#3A2E2E] text-[#EADBC8] py-3 rounded-xl 
                font-medium transition-all duration-300 
                hover:bg-[#2C2C2C] hover:shadow-lg transform hover:scale-[1.02]
                focus:outline-none focus:ring-2 focus:ring-[#D4A373]/50"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Premium shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
          <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent 
            skew-x-12 animate-shine"></div>
        </div>
      </div>
      
      {/* CSS for shine animation */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(12deg); }
          100% { transform: translateX(200%) skewX(12deg); }
        }
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </Link>
  );
};

export default SingleProduct;