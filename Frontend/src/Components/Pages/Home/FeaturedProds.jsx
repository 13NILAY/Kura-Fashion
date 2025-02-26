import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import SingleProduct from './SingleProduct';

const FeaturedProds = () => {
  const axiosPrivate = useAxiosPrivate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProducts = await axiosPrivate.get("/product/allProducts");
        setProducts(allProducts?.data.data.slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-sectionPadding py-8 sm:py-12 bg-[#F4E1D2]">
        <div className="flex justify-center items-center h-40 sm:h-60">
          <div className="relative">
            <div className="w-12 sm:w-16 h-12 sm:h-16 border-4 border-[#5c4033] border-t-transparent rounded-full animate-spin">
              <div className="absolute top-1/2 left-1/2 w-6 sm:w-8 h-1 bg-[#5c4033] -translate-x-1/2"></div>
            </div>
            <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs sm:text-sm text-[#5c4033] font-medium whitespace-nowrap">
              Loading collection...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 sm:px-sectionPadding py-8 sm:py-12 bg-[#F4E1D2] text-center text-[#5B3A2A] text-sm sm:text-base">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-sectionPadding py-8 sm:py-12 bg-[#F4E1D2]">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
          <h2 className="font-headings text-[#5B3A2A] text-3xl sm:text-4xl md:text-5xl font-bold text-center sm:text-left">
            Featured Products
          </h2>
          <Link 
            to="/shop" 
            className="flex items-center text-[#5B3A2A] font-headings text-sm sm:text-base font-semibold hover:underline transition duration-150"
          >
            View All Products
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((prod) => (
            <SingleProduct 
              key={prod._id} 
              product={prod} 
              className="w-full transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProds;