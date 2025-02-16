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
      <div className="w-full px-sectionPadding py-12 bg-[#F4E1D2]">
        <div className="flex justify-center items-center h-40">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-[#5c4033] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-[#5c4033] font-medium">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-sectionPadding py-12 bg-[#F4E1D2] text-center text-[#5B3A2A]">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full px-sectionPadding py-12 bg-[#F4E1D2]">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className='font-headings text-[#5B3A2A] text-5xl max-md:text-4xl max-mobileL:text-3xl my-4 font-bold'>
            Featured Products
          </h2>
          <Link 
            to="/shop" 
            className="flex items-center text-[#5B3A2A] font-headings font-semibold hover:underline transition duration-150"
          >
            View All Products
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 ml-2" 
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
        
        <div className="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6">
          {products.map((prod) => (
            <SingleProduct 
              key={prod._id} 
              product={prod} 
              className="transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProds;