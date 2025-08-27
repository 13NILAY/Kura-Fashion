import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from '../../../api/axios';

const Banners = () => {
  const BANNER_DATA_API = '/banner/all';
  const [bannerData, setBannerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bannerRef = useRef(null);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(BANNER_DATA_API);
        setBannerData(response.data.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching banner data:', error);
        setError('Failed to load banner content');
      } finally {
        setLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  // Enhanced loading state
  if (loading) {
    return (
      <section className="w-full px-4 sm:px-8 py-12 sm:py-16 bg-white">
        <div className="container mx-auto">
          {/* Loading header */}
          <div className="text-center mb-12">
            <div className="w-48 h-8 bg-[#3A2E2E]/10 rounded-lg mx-auto mb-4 animate-pulse"></div>
            <div className="w-32 h-4 bg-[#3A2E2E]/5 rounded mx-auto animate-pulse"></div>
          </div>
          
          {/* Loading banners */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(2)].map((_, index) => (
              <div 
                key={index}
                className="relative h-80 bg-[#D4A373]/10 rounded-2xl animate-pulse overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#3A2E2E]/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="w-3/4 h-8 bg-white/30 rounded-lg mb-4"></div>
                  <div className="w-1/2 h-4 bg-white/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="w-full px-4 sm:px-8 py-12 sm:py-16 bg-white">
        <div className="container mx-auto text-center">
          <div className="max-w-md mx-auto bg-[#F8F5F2] rounded-2xl p-8 border border-[#D4A373]/20">
            <div className="w-16 h-16 bg-[#D4A373]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-headings text-[#3A2E2E] mb-2">Unable to Load Banners</h3>
            <p className="text-[#3A2E2E]/70 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#3A2E2E] text-[#EADBC8] rounded-full hover:bg-[#2C2C2C] transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!bannerData.length) {
    return null;
  }

  return (
    <section className="w-full px-4 sm:px-8 py-12 sm:py-16 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 border border-[#D4A373] rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-[#3A2E2E] rounded-full"></div>
      </div>
      
      <div className="container mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-[#D4A373]"></div>
            <span className="mx-4 text-[#3A2E2E]/60 text-sm font-medium tracking-widest uppercase">
              Exclusive
            </span>
            <div className="w-12 h-0.5 bg-[#D4A373]"></div>
          </div>
          <h2 className="font-headings text-[#3A2E2E] text-3xl sm:text-4xl lg:text-5xl font-light">
            Special Collections
          </h2>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bannerData.map((banner, index) => (
            <div
              key={index}
              ref={bannerRef}
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden 
                shadow-lg hover:shadow-2xl transition-all duration-500 
                transform hover:scale-[1.02] cursor-pointer"
              style={{
                animation: `fadeInUp 0.8s ease-out ${index * 200}ms forwards`,
                opacity: 0
              }}
            >
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ 
                  backgroundImage: `url(${banner.image})`,
                  backgroundColor: '#3A2E2E' 
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#3A2E2E]/60 via-[#3A2E2E]/40 to-transparent 
                  group-hover:from-[#3A2E2E]/70 group-hover:via-[#3A2E2E]/50 transition-all duration-500"></div>
                
                {/* Decorative Elements */}
                <div className="absolute top-6 right-6 w-16 h-16 border-2 border-[#D4A373]/30 rounded-full 
                  group-hover:border-[#D4A373]/60 group-hover:scale-110 transition-all duration-300"></div>
                <div className="absolute bottom-6 left-6 w-8 h-8 bg-[#D4A373]/20 rounded-full 
                  group-hover:bg-[#D4A373]/40 transition-all duration-300"></div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="transform transition-all duration-500 group-hover:translate-y-[-8px]">
                  {/* Banner Number */}
                  <div className="flex items-center mb-4">
                    <span className="text-[#D4A373] text-sm font-medium tracking-widest uppercase">
                      Collection {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="ml-3 w-8 h-0.5 bg-[#D4A373] group-hover:w-12 transition-all duration-300"></div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-headings font-light text-[#EADBC8] 
                    mb-4 leading-tight">
                    {banner.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-[#EADBC8]/90 text-lg font-texts leading-relaxed mb-6 
                    max-w-md group-hover:text-[#EADBC8] transition-colors duration-300">
                    {banner.description}
                  </p>
                  
                  {/* CTA Button */}
                  <div className="flex items-center">
                    <Link 
                      to="/shop" 
                      className="group/btn inline-flex items-center px-6 py-3 
                        bg-[#D4A373] hover:bg-[#EADBC8] text-[#3A2E2E] 
                        font-semibold rounded-full transition-all duration-300 
                        shadow-lg hover:shadow-xl hover:shadow-[#D4A373]/30
                        transform hover:scale-105"
                    >
                      <span className="mr-2">Explore Now</span>
                      <ArrowForwardIcon className="text-xl transition-transform duration-300 
                        group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D4A373]/30 
                rounded-2xl transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4">
            <Link 
              to="/shop" 
              className="text-[#3A2E2E] font-medium hover:text-[#D4A373] 
                transition-colors duration-300 border-b-2 border-transparent 
                hover:border-[#D4A373] pb-1"
            >
              View All Collections
            </Link>
            <span className="w-1 h-1 bg-[#D4A373] rounded-full"></span>
            <Link 
              to="/about" 
              className="text-[#3A2E2E] font-medium hover:text-[#D4A373] 
                transition-colors duration-300 border-b-2 border-transparent 
                hover:border-[#D4A373] pb-1"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
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

export default Banners;