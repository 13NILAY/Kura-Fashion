import React, { useEffect, useState } from 'react';
import ScrollToTop from '../../../ScrollToTop.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate.jsx';
import { useDispatch } from 'react-redux';
import useAuth from '../../../hooks/useAuth.jsx';
import { addProductToCart } from '../../../features/cart/cartSlice.jsx';
import { Edit, Delete, Add, Remove, ShoppingBag, Close } from '@mui/icons-material';

const SingleProductDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useParams();
  const { auth } = useAuth();
  const email = auth?.email;
  const isAdmin = auth?.roles?.includes(5150);
  const axiosPrivate = useAxiosPrivate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [newSize, setNewSize] = useState("");
  const [newColorCode, setNewColorCode] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get(`product/viewProduct/${_id}`);
        setProduct(response.data.data);
        setSelectedImage(response.data.data.frontPicture);
      } catch (err) {
        setError("Error fetching product details. Please try again later.");
        console.error("Error fetching Product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [_id]);

  const sizes = product?.size || [];
  const colors = product?.color || [];
  const allImages = product ? [product.frontPicture, ...(product.picture || [])] : [];

  const increment = () => quantity < 15 && setQuantity(prev => prev + 1);
  const decrement = () => quantity > 1 && setQuantity(prev => prev - 1);

  const handleAdd = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select a size and color before adding to cart.");
      return;
    }

    dispatch(addProductToCart({ product, quantity, selectedSize, selectedColor }, axiosPrivate, email));
    setSuccessMessage("Product added to cart successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await axiosPrivate.delete(`product/deleteProduct/${_id}`);
        setSuccessMessage("Product deleted successfully!");
        setTimeout(() => {
          navigate('/shop');
        }, 2000);
      } catch (err) {
        setError("Error deleting product. Please try again later.");
        console.error("Error deleting Product:", err);
      }
    }
  };

  const handleDeleteSize = async (sizeToDelete) => {
    if (window.confirm(`Are you sure you want to remove size ${sizeToDelete}?`)) {
      try {
        await axiosPrivate.put(`product/updateProduct/${_id}`, {
          size: product.size.filter(size => size !== sizeToDelete)
        });
        setProduct(prev => ({
          ...prev,
          size: prev.size.filter(size => size !== sizeToDelete)
        }));
        setSuccessMessage("Size removed successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        setError("Error removing size. Please try again later.");
        console.error("Error removing size:", err);
      }
    }
  };

  const handleDeleteColor = async (colorCodeToDelete) => {
    if (window.confirm("Are you sure you want to remove this color?")) {
      try {
        await axiosPrivate.put(`product/updateProduct/${_id}`, {
          color: product.color.filter(color => color.colorCode !== colorCodeToDelete)
        });
        setProduct(prev => ({
          ...prev,
          color: prev.color.filter(color => color.colorCode !== colorCodeToDelete)
        }));
        setSuccessMessage("Color removed successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        setError("Error removing color. Please try again later.");
        console.error("Error removing color:", err);
      }
    }
  };

  const handleAddSize = async () => {
    if (!newSize.trim()) return;
    try {
      const updatedSizes = [...product.size, newSize.trim()];
      await axiosPrivate.put(`product/updateProduct/${_id}`, {
        size: updatedSizes
      });
      setProduct(prev => ({
        ...prev,
        size: updatedSizes
      }));
      setNewSize("");
      setSuccessMessage("Size added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Error adding size. Please try again later.");
      console.error("Error adding size:", err);
    }
  };

  const handleAddColor = async () => {
    if (!newColorCode.trim()) return;
    try {
      const updatedColors = [...product.color, { colorCode: newColorCode.trim() }];
      await axiosPrivate.put(`product/updateProduct/${_id}`, {
        color: updatedColors
      });
      setProduct(prev => ({
        ...prev,
        color: updatedColors
      }));
      setNewColorCode("");
      setSuccessMessage("Color added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Error adding color. Please try again later.");
      console.error("Error adding color:", err);
    }
  };

  const handleUpdatePrice = async () => {
    if (!newPrice || isNaN(newPrice)) return;
    try {
      await axiosPrivate.put(`product/updateProduct/${_id}`, {
        cost: { value: parseFloat(newPrice), currency: "INR" }
      });
      setProduct(prev => ({
        ...prev,
        cost: { ...prev.cost, value: parseFloat(newPrice) }
      }));
      setIsEditingPrice(false);
      setSuccessMessage("Price updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Error updating price. Please try again later.");
      console.error("Error updating price:", err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden animate-pulse">
            <div className="flex flex-col lg:flex-row">
              {/* Image Loading */}
              <div className="lg:w-3/5 p-6 bg-[#EADBC8]/20">
                <div className="aspect-square bg-[#D4A373]/20 rounded-xl mb-6"></div>
                <div className="grid grid-cols-4 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-[#D4A373]/15 rounded-lg"></div>
                  ))}
                </div>
              </div>
              
              {/* Content Loading */}
              <div className="lg:w-2/5 p-8 space-y-6">
                <div className="h-10 bg-[#3A2E2E]/20 rounded-lg w-3/4"></div>
                <div className="h-8 bg-[#3A2E2E]/15 rounded-lg w-1/2"></div>
                <div className="h-6 bg-[#3A2E2E]/10 rounded-lg w-full"></div>
                <div className="h-6 bg-[#3A2E2E]/10 rounded-lg w-5/6"></div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-12 h-10 bg-[#3A2E2E]/15 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] pt-24 pb-12 flex items-center justify-center">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-xl border border-white/30 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-headings text-[#3A2E2E] mb-4">Error Loading Product</h3>
          <p className="text-[#3A2E2E]/70 font-texts mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#3A2E2E] text-[#EADBC8] rounded-full hover:bg-[#2C2C2C] transition-all duration-300 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <>
      <ScrollToTop />

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#D4A373] to-[#3A2E2E] 
          text-[#EADBC8] py-4 px-8 rounded-2xl shadow-2xl z-50 animate-fadeIn backdrop-blur-sm border border-white/20">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] pt-24 pb-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 left-20 w-96 h-96 bg-[#D4A373]/5 rounded-full blur-3xl animate-pulse" 
            style={{animationDuration: '4s'}}></div>
          <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#3A2E2E]/3 rounded-full blur-3xl animate-pulse" 
            style={{animationDuration: '6s', animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto bg-white/60 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden 
            border border-white/30">
            <div className="flex flex-col lg:flex-row">
              
              {/* Image Gallery Section */}
              <div className="lg:w-3/5 p-6 sm:p-8 bg-gradient-to-br from-[#EADBC8]/20 to-[#D4A373]/10">
                {/* Main Image */}
                <div className="mb-6 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg">
                  <div className="relative pt-[100%] group">
                    <img
                      src={selectedImage || product.frontPicture}
                      alt={product.name}
                      className="absolute top-0 left-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Image overlay for zoom effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3A2E2E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Thumbnail Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`relative rounded-xl overflow-hidden aspect-square transition-all duration-300 group
                        ${selectedImage === img 
                          ? 'ring-3 ring-[#3A2E2E] ring-offset-2 shadow-lg scale-105' 
                          : 'hover:ring-2 hover:ring-[#D4A373] hover:ring-offset-1 hover:scale-105'}`}
                    >
                      <div className="w-full h-full bg-white/80 backdrop-blur-sm">
                        <img
                          src={img}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      {selectedImage === img && (
                        <div className="absolute inset-0 bg-[#3A2E2E]/10"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Details Section */}
              <div className="lg:w-2/5 p-8 bg-white/80 backdrop-blur-sm">
                {/* Product Name */}
                <h1 className="text-4xl sm:text-5xl font-headings font-light text-[#3A2E2E] mb-6 leading-tight">
                  {product.name}
                </h1>
                
                {/* Price Section */}
                <div className="flex items-center gap-4 mb-8">
                  {isEditingPrice ? (
                    <div className="flex items-center gap-3 p-4 bg-[#F8F5F2] rounded-2xl border border-[#D4A373]/30">
                      <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-32 px-4 py-2 border-2 border-[#D4A373]/30 rounded-lg focus:outline-none focus:border-[#3A2E2E] focus:ring-2 focus:ring-[#3A2E2E]/20 transition-all duration-300 bg-white"
                        placeholder="New price"
                      />
                      <button
                        onClick={handleUpdatePrice}
                        className="px-4 py-2 bg-[#3A2E2E] text-[#EADBC8] rounded-lg hover:bg-[#2C2C2C] transition-all duration-300 font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingPrice(false)}
                        className="px-4 py-2 bg-[#D4A373]/20 text-[#3A2E2E] rounded-lg hover:bg-[#D4A373]/30 transition-all duration-300 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <p className="text-4xl font-headings font-semibold text-[#D4A373]">
                          ₹ {product.cost?.value?.toLocaleString('en-IN')}
                        </p>
                        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#D4A373] to-transparent"></div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setNewPrice(product.cost?.value?.toString());
                            setIsEditingPrice(true);
                          }}
                          className="p-2 text-[#3A2E2E] hover:text-[#D4A373] hover:bg-[#D4A373]/10 rounded-lg transition-all duration-300"
                          title="Edit price"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4A373]/50 to-transparent mb-8"></div>

                {/* Description */}
                <p className="text-lg text-[#3A2E2E]/80 mb-10 leading-relaxed font-texts">
                  {product.description}
                </p>

                {/* Sizes Section */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <h3 className="font-headings text-xl font-semibold text-[#3A2E2E] mr-3">Select Size</h3>
                      <div className="w-8 h-0.5 bg-[#D4A373]"></div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSize}
                          onChange={(e) => setNewSize(e.target.value)}
                          className="w-20 px-3 py-2 border-2 border-[#D4A373]/30 rounded-lg focus:outline-none focus:border-[#3A2E2E] focus:ring-2 focus:ring-[#3A2E2E]/20 transition-all duration-300 text-sm"
                          placeholder="Size"
                        />
                        <button
                          onClick={handleAddSize}
                          className="px-3 py-2 bg-[#3A2E2E] text-[#EADBC8] rounded-lg hover:bg-[#2C2C2C] transition-all duration-300 text-sm font-medium"
                        >
                          <Add className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  {sizes.length > 0 && (
                    <div className="grid grid-cols-4 gap-3">
                      {sizes.map((size, index) => (
                        <div key={index} className="relative group">
                          <button
                            onClick={() => setSelectedSize(size)}
                            className={`w-full py-3 rounded-xl font-medium transition-all duration-300 border-2
                              ${selectedSize === size 
                                ? 'bg-[#3A2E2E] text-[#EADBC8] border-[#3A2E2E] transform scale-105 shadow-lg' 
                                : 'bg-white border-[#D4A373]/30 text-[#3A2E2E] hover:border-[#3A2E2E] hover:bg-[#3A2E2E]/5 hover:scale-105'
                              }`}
                          >
                            {size}
                          </button>
                          {isAdmin && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSize(size);
                              }}
                              className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-all duration-300 hover:bg-red-600 hover:scale-110"
                              title="Remove size"
                            >
                              <Close className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Colors Section */}
                <div className="mb-10">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <h3 className="font-headings text-xl font-semibold text-[#3A2E2E] mr-3">Select Color</h3>
                      <div className="w-8 h-0.5 bg-[#D4A373]"></div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={newColorCode}
                          onChange={(e) => setNewColorCode(e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-[#D4A373]/30"
                        />
                        <button
                          onClick={handleAddColor}
                          className="px-3 py-2 bg-[#3A2E2E] text-[#EADBC8] rounded-lg hover:bg-[#2C2C2C] transition-all duration-300 text-sm font-medium"
                        >
                          <Add className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  {colors.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                      {colors.map((color, index) => (
                        <div key={index} className="relative group">
                          <button
                            onClick={() => setSelectedColor(color.colorCode)}
                            className={`w-14 h-14 rounded-full transition-all duration-300 border-4 hover:scale-110
                              ${selectedColor === color.colorCode 
                                ? 'border-[#3A2E2E] ring-4 ring-[#3A2E2E]/20 transform scale-110 shadow-lg' 
                                : 'border-white hover:border-[#D4A373] shadow-md'}`}
                            style={{ backgroundColor: color.colorCode }}
                            title={color.colorName || color.colorCode}
                          />
                          {isAdmin && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteColor(color.colorCode);
                              }}
                              className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-all duration-300 hover:bg-red-600 hover:scale-110"
                              title="Remove color"
                            >
                              <Close className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quantity Section */}
                <div className="mb-10">
                  <div className="flex items-center mb-4">
                    <h3 className="font-headings text-xl font-semibold text-[#3A2E2E] mr-3">Quantity</h3>
                    <div className="w-8 h-0.5 bg-[#D4A373]"></div>
                  </div>
                  <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm w-fit rounded-2xl p-3 border border-[#D4A373]/30">
                    <button
                      onClick={decrement}
                      className="w-12 h-12 rounded-xl bg-[#EADBC8] text-[#3A2E2E] hover:bg-[#D4A373] hover:text-white transition-all duration-300 shadow-sm hover:scale-105 flex items-center justify-center"
                    >
                      <Remove className="w-5 h-5" />
                    </button>
                    <span className="text-2xl font-headings font-medium text-[#3A2E2E] w-12 text-center">{quantity}</span>
                    <button
                      onClick={increment}
                      className="w-12 h-12 rounded-xl bg-[#EADBC8] text-[#3A2E2E] hover:bg-[#D4A373] hover:text-white transition-all duration-300 shadow-sm hover:scale-105 flex items-center justify-center"
                    >
                      <Add className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4A373]/50 to-transparent mb-8"></div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAdd}
                    className="w-full py-4 bg-[#3A2E2E] text-[#EADBC8] rounded-2xl font-headings font-semibold text-lg
                      transition-all duration-300 hover:bg-[#2C2C2C] transform hover:scale-[1.02]
                      focus:outline-none focus:ring-4 focus:ring-[#3A2E2E]/20 shadow-xl hover:shadow-2xl
                      flex items-center justify-center space-x-3 group"
                  >
                    <ShoppingBag className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                    <span>Add to Cart</span>
                  </button>

                  {/* Delete Button - Only visible to admin */}
                  {isAdmin && (
                    <button
                      onClick={handleDelete}
                      className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-headings font-semibold text-lg
                        transition-all duration-300 hover:from-red-600 hover:to-red-700 transform hover:scale-[1.02]
                        focus:outline-none focus:ring-4 focus:ring-red-500/20 shadow-xl hover:shadow-2xl
                        flex items-center justify-center space-x-3 group"
                    >
                      <Delete className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                      <span>Delete Product</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default SingleProductDetail;