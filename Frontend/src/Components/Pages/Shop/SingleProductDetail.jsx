import React, { useEffect, useState } from 'react';
import ScrollToTop from '../../../ScrollToTop.jsx';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate.jsx';
import { useDispatch } from 'react-redux';
import useAuth from '../../../hooks/useAuth.jsx';
import { addProductToCart } from '../../../features/cart/cartSlice.jsx';
// import { CheckCircleIcon } from '@heroicons/react/solid'; // Icon for success

const SingleProductDetail = () => {
  const dispatch = useDispatch();
  const { _id } = useParams();
  const { auth } = useAuth();
  const email = auth?.email;
  const axiosPrivate = useAxiosPrivate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosPrivate.get(`product/viewProduct/${_id}`);
        setProduct(response.data.data);
      } catch (err) {
        setError("Error fetching product details. Please try again later.");
        console.error("Error fetching Product:", err);
      }
    };
    fetchProduct();
  }, [_id]);

  const sizes = product?.size || [];
  const colors = product?.color || [];

  const increment = () => {
    if (quantity < 15) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAdd = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select a size and color before adding to cart.");
      return;
    }

    dispatch(addProductToCart({ product, quantity, selectedSize, selectedColor }, axiosPrivate, email));

    // Set success message
    setSuccessMessage("Product added to cart successfully!");

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <ScrollToTop />

      {/* Success message */}
      {successMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-4 px-6 rounded-lg shadow-xl flex items-center space-x-3 animate-fadeIn">
          {/* <CheckCircleIcon className="w-8 h-8 text-white" /> */}
          <span className="text-lg font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Outer Container */}
      <div className="w-full flex justify-center mt-32 mb-8 px-2 sm:px-4">

        {/* Wrapper Box */}
        <div className="w-full max-w-4xl p-6 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl">

          {/* MAIN IMAGE SECTION */}
          <div className="w-full flex flex-col items-center mb-8">
            <div className="w-full bg-gray-100 border border-gray-300 shadow-sm rounded-lg overflow-hidden">
              <img
                src={product.frontPicture || '/default-image.jpg'}
                alt={product.name || 'Product Image'}
                className="w-full h-auto object-cover rounded-lg transition-transform duration-500 ease-in-out hover:opacity-90"
              />
            </div>
          </div>

          {/* ADDITIONAL IMAGES */}
          {product.picture?.length > 0 && (
            <div className="w-full grid grid-cols-3 gap-4 mb-6">
              {product.picture.map((pic, index) => (
                <div className="bg-white border border-gray-300 shadow-sm rounded-md overflow-hidden transition-all hover:shadow-lg" key={index}>
                  <img
                    src={pic || '/default-image.jpg'}
                    alt={`Additional view ${index + 1}`}
                    className="w-full h-auto object-cover rounded-md transition-opacity duration-500 ease-in-out hover:opacity-80"
                  />
                </div>
              ))}
            </div>
          )}

          {/* PRODUCT DETAILS SECTION */}
          <div className="w-full flex flex-col items-start space-y-6">

            {/* Product Name */}
            <p className="text-3xl font-bold text-gray-800">{product.name || 'Unnamed Product'}</p>

            {/* Product Price */}
            <p className="text-2xl font-semibold text-[#8A5D3B]">₹ {product.cost?.value || 'N/A'}</p>

            {/* Product Description */}
            <p className="text-base leading-relaxed text-gray-600">{product.description || 'No description available'}</p>

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="w-full">
                <p className="font-semibold text-lg text-gray-800">Sizes:</p>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  {sizes.map((size, index) => (
                    <div
                      key={index}
                      className={`flex justify-center items-center border-2 p-2 cursor-pointer rounded-md shadow-sm hover:shadow-md transition-all duration-300 ease-in-out ${
                        selectedSize === size ? 'border-[#8A5D3B] bg-[#8A5D3B] text-white' : 'border-gray-300 bg-white text-gray-700'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      <p className="font-medium">{size}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="w-full">
                <p className="font-semibold text-lg text-gray-800">Colors:</p>
                <div className="flex flex-wrap gap-3 mt-3">
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-all duration-300 ease-in-out ${
                        selectedColor === color.colorCode ? 'border-[#8A5D3B] border-4 shadow-md' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.colorCode }}
                      onClick={() => setSelectedColor(color.colorCode)}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="w-full flex items-center">
              <p className="text-lg font-semibold text-gray-800 mr-4">Quantity:</p>
              <div className="flex items-center border border-gray-300 rounded-lg shadow-sm overflow-hidden">
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition" onClick={decrement}>-</button>
                <p className="px-5 py-2 border-l border-r border-gray-300">{quantity}</p>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition" onClick={increment}>+</button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="w-full mt-6">
              <button
                className="w-full py-3 text-lg font-semibold bg-[#8A5D3B] text-white rounded-lg shadow-md hover:bg-[#6B4F3A] transition-all duration-300 ease-in-out"
                onClick={handleAdd}
              >
                Add to Cart
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProductDetail;
