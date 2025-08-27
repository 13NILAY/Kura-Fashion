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

  // Premium loading component
  if (loading) {
    return (
      <div className="w-full px-4 sm:px-8 py-16 sm:py-20 bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8]">
        <div className="container mx-auto">
          {/* Loading Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-0.5 bg-[#D4A373]/30 animate-pulse"></div>
              <div className="mx-4 w-32 h-8 bg-[#3A2E2E]/20 rounded-lg animate-pulse"></div>
              <div className="w-16 h-0.5 bg-[#D4A373]/30 animate-pulse"></div>
            </div>
            <div className="w-96 max-w-full h-12 bg-[#3A2E2E]/15 rounded-lg mx-auto animate-pulse"></div>
          </div>
          
          {/* Loading Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="group">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg 
                  border border-white/30 animate-pulse">
                  {/* Image placeholder */}
                  <div className="aspect-square bg-[#D4A373]/20 rounded-xl mb-6"></div>
                  
                  {/* Content placeholders */}
                  <div className="space-y-4">
                    <div className="h-6 bg-[#3A2E2E]/20 rounded-lg w-full"></div>
                    <div className="h-5 bg-[#3A2E2E]/15 rounded-lg w-2/3"></div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-5 h-5 bg-[#D4A373]/30 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Loading spinner */}
          <div className="flex justify-center items-center mt-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#D4A373]/30 border-t-[#3A2E2E] rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-[#D4A373] rounded-full animate-spin" 
                style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
            <p className="ml-4 text-[#3A2E2E] font-medium">
              Curating premium collection...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state with premium styling
  if (error) {
    return (
      <div className="w-full px-4 sm:px-8 py-16 sm:py-20 bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8]">
        <div className="container mx-auto text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto 
            shadow-xl border border-white/30">
            <div className="w-16 h-16 bg-[#D4A373]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-headings text-[#3A2E2E] mb-4">
              Unable to Load Collection
            </h3>
            <p className="text-[#3A2E2E]/70 font-texts mb-6">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#3A2E2E] text-[#EADBC8] rounded-full 
                hover:bg-[#2C2C2C] transition-all duration-300 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full px-4 sm:px-8 py-16 sm:py-20 bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-[#D4A373]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#3A2E2E]/5 rounded-full blur-3xl animate-pulse" 
        style={{animationDelay: '2s'}}></div>
      
      <div className="container mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Decorative line and subtitle */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
            <span className="mx-4 text-[#3A2E2E]/60 text-sm font-medium tracking-widest uppercase">
              Curated Selection
            </span>
            <div className="w-16 h-0.5 bg-[#D4A373]"></div>
          </div>
          
          {/* Main heading */}
          <h2 className="font-headings text-[#3A2E2E] text-4xl sm:text-5xl lg:text-6xl font-light mb-6 leading-tight">
            Featured
            <span className="block text-[#D4A373] font-normal">Collection</span>
          </h2>
          
          {/* Description */}
          <p className="text-lg text-[#3A2E2E]/70 max-w-2xl mx-auto leading-relaxed">
            Discover our handpicked selection of premium pieces, carefully curated to embody 
            the essence of modern elegance and timeless sophistication.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((prod, index) => (
            <div 
              key={prod._id}
              className="group transform transition-all duration-500 hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.8s ease-out forwards'
              }}
            >
              <SingleProduct 
                product={prod} 
                className="h-full"
              />
            </div>
          ))}
        </div>

        {/* View All Products Section */}
        <div className="text-center">
          <div className="relative inline-block">
            {/* Decorative background for CTA */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#D4A373]/20 to-[#3A2E2E]/10 
              rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            
            <Link 
              to="/shop" 
              className="group relative inline-flex items-center px-12 py-4 
                bg-[#3A2E2E] text-[#EADBC8] font-semibold font-headings rounded-full 
                transition-all duration-300 hover:bg-[#2C2C2C] hover:shadow-2xl 
                hover:shadow-[#3A2E2E]/30 transform hover:scale-105"
            >
              <span className="mr-3 text-lg">Explore Full Collection</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" 
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
          
          {/* Secondary CTA */}
          <div className="mt-8">
            <Link 
              to="/about" 
              className="text-[#3A2E2E] font-medium hover:text-[#D4A373] 
                transition-colors duration-300 border-b-2 border-transparent 
                hover:border-[#D4A373] pb-1"
            >
              Learn About Our Craftsmanship
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Animation for fade-in effect */}
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
    </section>
  );
};

export default FeaturedProds;