import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import SingleProduct from './SingleProduct';
import { Link } from 'react-router-dom';

const FeaturedProds = () => {
  const axiosPrivate=useAxiosPrivate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProducts = await axiosPrivate.get("/product/allProducts");
        console.log(allProducts?.data.data);
        setProducts(allProducts?.data.data);
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
      <div className="flex justify-center items-center h-screen bg-[#E3C7A6]">
        <p className="font-headings text-2xl text-[#4A2C2A]">Loading Products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#E3C7A6]">
        <p className="font-headings text-2xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className='px-sectionPadding max-md:px-mobileScreenPadding text-[#4A2C2A] w-full'>
        <div className='flex flex-col justify-center items-center'>
          <p className='font-headings text-5xl text-[#4A2C2A]'>Featured Products</p>
          {/* Optional: Add a description or slogan here */}
        </div>

        {/* Grid for Featured Products */}
        <div className='grid sm:grid-cols-3 gap-x-6 my-10 max-sm:grid-cols-2 max-mobileL:grid-cols-1'>
          {products.map((prod) => (
            <SingleProduct key={prod._id} product={prod} />
          ))}
        </div>

        {/* View All Products Button */}
        <div className='w-full flex justify-center items-center'>
          <Link to="/shop">
            <button className='p-3 bg-[#A6896D] text-[#F4E1D2] mt-4 border border-[#8A5D3B] shadow-md hover:bg-[#8A5D3B] transition duration-300 ease-in-out rounded-sm font-headings font-semibold'>
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default FeaturedProds;
