import React, { useEffect, useState } from 'react';
import ScrollToTop from '../../../ScrollToTop.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate.jsx';
import { useDispatch } from 'react-redux';
import useAuth from '../../../hooks/useAuth.jsx';
import { addProductToCart } from '../../../features/cart/cartSlice.jsx';

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosPrivate.get(`product/viewProduct/${_id}`);
        setProduct(response.data.data);
        setSelectedImage(response.data.data.frontPicture);
      } catch (err) {
        setError("Error fetching product details. Please try again later.");
        console.error("Error fetching Product:", err);
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
          navigate('/shop'); // Redirect to products page after deletion
        }, 2000);
      } catch (err) {
        setError("Error deleting product. Please try again later.");
        console.error("Error deleting Product:", err);
      }
    }
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return <div className="flex items-center justify-center min-h-screen bg-[#F4E1D2]"><p className="text-[#5B3A2A] text-xl">Loading...</p></div>;

  return (
    <>
      <ScrollToTop />

      {successMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-4 px-6 rounded-lg shadow-xl z-50 animate-fadeIn">
          <span className="text-lg font-semibold">{successMessage}</span>
        </div>
      )}

      <div className="w-full min-h-screen bg-[#F4E1D2] pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image Gallery Section */}
            <div className="lg:w-3/5 p-6 bg-[#EFE5D5]">
              {/* Main Image */}
              <div className="mb-6 rounded-xl overflow-hidden bg-white shadow-lg">
                <div className="relative pt-[100%]">
                  <img
                    src={selectedImage || product.frontPicture}
                    alt={product.name}
                    className="absolute top-0 left-0 w-full h-full object-contain p-4"
                  />
                </div>
              </div>

              {/* Thumbnail Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all duration-300
                      ${selectedImage === img ? 'border-[#5B3A2A] shadow-lg scale-105' : 'border-transparent hover:border-[#A6896D]'}`}
                  >
                    <div className="w-full h-full bg-white">
                      <img
                        src={img}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="lg:w-2/5 p-8 bg-white">
              <h1 className="text-4xl font-headings font-bold text-[#5B3A2A] mb-4">
                {product.name}
              </h1>
              
              <p className="text-3xl font-semibold text-[#A6896D] mb-6">
                ₹ {product.cost?.value?.toLocaleString('en-IN')}
              </p>

              <div className="h-0.5 w-full bg-[#EFE5D5] mb-6"></div>

              <p className="text-[#5B3A2A]/80 mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Sizes */}
              {sizes.length > 0 && (
                <div className="mb-6">
                  <p className="font-semibold text-lg text-[#5B3A2A] mb-3">Select Size</p>
                  <div className="grid grid-cols-4 gap-3">
                    {sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 rounded-lg font-medium transition-all duration-300
                          ${selectedSize === size 
                            ? 'bg-[#5B3A2A] text-white transform scale-105 shadow-md' 
                            : 'bg-[#EFE5D5] text-[#5B3A2A] hover:bg-[#A6896D] hover:text-white'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {colors.length > 0 && (
                <div className="mb-8">
                  <p className="font-semibold text-lg text-[#5B3A2A] mb-3">Select Color</p>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color.colorCode)}
                        className={`w-12 h-12 rounded-full transition-transform duration-300 hover:scale-110
                          ${selectedColor === color.colorCode ? 'ring-4 ring-[#5B3A2A] ring-offset-2 transform scale-110' : ''}`}
                        style={{ backgroundColor: color.colorCode }}
                        title={color.colorName || color.colorCode}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <p className="font-semibold text-lg text-[#5B3A2A] mb-3">Quantity</p>
                <div className="flex items-center space-x-4 bg-[#EFE5D5] w-fit rounded-lg p-2">
                  <button
                    onClick={decrement}
                    className="w-10 h-10 rounded-lg bg-white text-[#5B3A2A] hover:bg-[#A6896D] hover:text-white transition-colors duration-300 shadow-sm"
                  >
                    -
                  </button>
                  <span className="text-xl font-medium text-[#5B3A2A] w-10 text-center">{quantity}</span>
                  <button
                    onClick={increment}
                    className="w-10 h-10 rounded-lg bg-white text-[#5B3A2A] hover:bg-[#A6896D] hover:text-white transition-colors duration-300 shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="h-0.5 w-full bg-[#EFE5D5] mb-6"></div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAdd}
                className="w-full py-4 bg-[#5B3A2A] text-white rounded-lg font-semibold text-lg
                  transition-all duration-300 hover:bg-[#A6896D] transform hover:scale-[1.02]
                  focus:outline-none focus:ring-2 focus:ring-[#5B3A2A] focus:ring-offset-2 shadow-lg"
              >
                Add to Cart
              </button>

              {/* Delete Button - Only visible to admin */}
              {isAdmin && (
                <button
                  onClick={handleDelete}
                  className="w-full mt-4 py-4 bg-red-600 text-white rounded-lg font-semibold text-lg
                    transition-all duration-300 hover:bg-red-700 transform hover:scale-[1.02]
                    focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 shadow-lg"
                >
                  Delete Product
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProductDetail;