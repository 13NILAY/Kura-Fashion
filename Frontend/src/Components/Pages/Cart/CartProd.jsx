import React, { useState } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const CartProd = ({ product, quantity, selectedSize, selectedColor, _id, onDelete, onUpdateQuantity }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(quantity || 1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete({ _id, size: selectedSize });
    }, 300);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setSelectedQuantity(newQuantity);
      if (onUpdateQuantity) {
        onUpdateQuantity({ _id, size: selectedSize, quantity: newQuantity });
      }
    }
  };

  const handleMoveToWishlist = () => {
    // Wishlist functionality can be added here
    console.log('Move to wishlist:', product.name);
  };

  return (
    <div className={`group relative bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg 
      hover:shadow-2xl border border-white/30 transition-all duration-500 
      ${isDeleting ? 'transform scale-95 opacity-50' : 'hover:scale-[1.02]'}
      before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent 
      before:to-[#D4A373]/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
      before:rounded-2xl overflow-hidden`}>
      
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none rounded-2xl"></div>
      
      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-[#3A2E2E]/80 backdrop-blur-sm rounded-2xl z-30 
          flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 text-center shadow-2xl">
            <h3 className="text-lg font-semibold text-[#3A2E2E] mb-3">
              Remove from Cart?
            </h3>
            <p className="text-[#3A2E2E]/70 mb-6 text-sm">
              This item will be removed from your shopping bag.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 px-4 py-2 border-2 border-[#D4A373] text-[#3A2E2E] 
                  rounded-lg font-medium transition-all duration-300 hover:bg-[#D4A373]/10"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg 
                  font-medium transition-all duration-300 hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 relative">
        {/* Product Image */}
        <div className="lg:w-48 lg:h-48 w-full h-64 relative group/image overflow-hidden rounded-xl 
          bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] flex-shrink-0">
          
          {/* Image container with premium styling */}
          <div className="relative h-full">
            <img
              src={product.frontPicture}
              className="w-full h-full object-cover transition-all duration-700 
                group-hover/image:scale-110 rounded-xl"
              alt={product.name}
              loading="lazy"
            />
            
            {/* Image overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#3A2E2E]/20 via-transparent to-transparent 
              opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 rounded-xl"></div>
          </div>

          {/* Product badge if on sale */}
          {product.onSale && (
            <div className="absolute top-3 left-3 bg-[#D4A373] text-[#3A2E2E] 
              px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Sale
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-4 relative">
          {/* Product Name & Price */}
          <div>
            <h3 className="font-headings text-[#3A2E2E] text-xl lg:text-2xl font-semibold 
              leading-tight mb-2 group-hover:text-[#D4A373] transition-colors duration-300">
              {product.name}
            </h3>
            <p className="font-texts text-[#3A2E2E] text-xl lg:text-2xl font-bold">
              ₹ {product.cost.value.toLocaleString()}
            </p>
          </div>

          {/* Product Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Size */}
            <div className="flex items-center space-x-3">
              <span className="text-[#3A2E2E]/60 text-sm font-medium uppercase tracking-wider">
                Size:
              </span>
              <div className="bg-[#D4A373]/20 text-[#3A2E2E] px-3 py-1 rounded-lg font-semibold text-sm">
                {selectedSize}
              </div>
            </div>

            {/* Color */}
            <div className="flex items-center space-x-3">
              <span className="text-[#3A2E2E]/60 text-sm font-medium uppercase tracking-wider">
                Color:
              </span>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: selectedColor }}
                ></div>
                <span className="text-[#3A2E2E] text-sm font-medium capitalize">
                  {selectedColor}
                </span>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <span className="text-[#3A2E2E]/60 text-sm font-medium uppercase tracking-wider">
              Quantity:
            </span>
            <div className="flex items-center bg-[#F8F5F2] rounded-xl border-2 border-[#D4A373]/20 
              overflow-hidden shadow-inner">
              <button
                onClick={() => handleQuantityChange(selectedQuantity - 1)}
                disabled={selectedQuantity <= 1}
                className="w-10 h-10 flex items-center justify-center text-[#3A2E2E] 
                  hover:bg-[#D4A373]/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RemoveIcon className="text-lg" />
              </button>
              
              <div className="w-12 h-10 flex items-center justify-center bg-white font-semibold text-[#3A2E2E]">
                {selectedQuantity}
              </div>
              
              <button
                onClick={() => handleQuantityChange(selectedQuantity + 1)}
                disabled={selectedQuantity >= 10}
                className="w-10 h-10 flex items-center justify-center text-[#3A2E2E] 
                  hover:bg-[#D4A373]/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <AddIcon className="text-lg" />
              </button>
            </div>
            <span className="text-[#3A2E2E]/60 text-sm">
              (Max: 10)
            </span>
          </div>

          {/* Item Total */}
          <div className="flex items-center justify-between pt-4 border-t border-[#D4A373]/20">
            <span className="font-headings text-[#3A2E2E] text-lg font-semibold">
              Item Total:
            </span>
            <span className="font-headings text-[#3A2E2E] text-xl font-bold">
              ₹ {(product.cost.value * selectedQuantity).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 
        transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        
        {/* Move to Wishlist */}
        <button
          onClick={handleMoveToWishlist}
          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full 
            flex items-center justify-center text-[#3A2E2E] 
            hover:bg-[#D4A373] hover:text-white shadow-lg hover:shadow-xl
            transition-all duration-300 transform hover:scale-110"
          title="Move to Wishlist"
        >
          <FavoriteBorderIcon className="text-lg" />
        </button>

        {/* Delete Button */}
        <button
          onClick={() => setShowConfirmDelete(true)}
          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full 
            flex items-center justify-center text-red-500 
            hover:bg-red-500 hover:text-white shadow-lg hover:shadow-xl 
            transition-all duration-300 transform hover:scale-110"
          title="Remove from Cart"
        >
          <DeleteOutlineOutlinedIcon className="text-lg" />
        </button>
      </div>

      {/* Premium shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent 
          skew-x-12 animate-shine rounded-2xl"></div>
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
    </div>
  );
};

export default CartProd;