import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layouts = () => {
  // Add smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <main className='bg-gradient-to-b from-[#F4E1D2] to-[#fff7ec] w-full flex flex-col min-h-screen'>
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-[#5c4033] via-[#8B4513] to-[#5c4033]"></div>
      
      <Header />

      {/* Content wrapper with subtle shadow and padding */}
      <div className="flex-grow flex flex-col relative">
        {/* Decorative side elements */}
        <div className="hidden lg:block fixed left-0 top-1/2 -translate-y-1/2 w-24 h-96 opacity-10 bg-[url('/path/to/decorative-pattern.png')] bg-repeat-y"></div>
        <div className="hidden lg:block fixed right-0 top-1/2 -translate-y-1/2 w-24 h-96 opacity-10 bg-[url('/path/to/decorative-pattern.png')] bg-repeat-y"></div>
        
        {/* Main content */}
        <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Outlet />
        </div>
      </div>

      <Footer />
      
      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-[#5c4033] via-[#8B4513] to-[#5c4033]"></div>
    </main>
  );
};

export default Layouts;
